import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { enqueueWebsiteGen, enqueueEmailBulk } from '../queues/queues'
import type { EmailJobData } from '../queues/queues'
import { openai } from '../lib/openai'
import { buildEmailHtml } from '../lib/emailTemplates'
import type { EmailContent } from '../lib/emailTemplates'
import { createTransporter, isEmailEnabled } from '../lib/email'

const router = Router()

router.use(requireAuth)

/**
 * POST /api/admin/backfill-websites?threshold=60
 * Enqueues website generation for all businesses scored below `threshold`
 * that don't already have a GeneratedWebsite record.
 */
router.post('/backfill-websites', async (req: Request, res: Response) => {
  const threshold = parseInt((req.query['threshold'] as string) ?? '60')

  const targets = await prisma.business.findMany({
    where: {
      presenceScore: { total: { lt: threshold } },
      websiteGen: null,
    },
    select: { id: true, name: true },
  })

  if (targets.length === 0) {
    res.json({ enqueued: 0, message: 'No eligible businesses found.' })
    return
  }

  const results: { id: string; name: string; status: string }[] = []
  for (const biz of targets) {
    try {
      await enqueueWebsiteGen({ businessId: biz.id })
      results.push({ id: biz.id, name: biz.name, status: 'queued' })
    } catch (err) {
      results.push({ id: biz.id, name: biz.name, status: `failed: ${(err as Error).message}` })
    }
  }

  const queued = results.filter((r) => r.status === 'queued').length
  res.json({ enqueued: queued, total: targets.length, threshold, results })
})

/**
 * GET /api/admin/outreach-ready
 * Returns businesses that have a generated website + email but haven't been contacted yet.
 */
router.get('/outreach-ready', async (req: Request, res: Response) => {
  const userId = req.user!.userId

  const businesses = await prisma.business.findMany({
    where: {
      upload: { userId },
      email: { not: null },
      websiteGen: { isNot: null },
      crmStatus: { in: ['NOT_CONTACTED', 'SKIPPED'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      category: true,
      address: true,
      crmStatus: true,
      presenceScore: { select: { total: true } },
      websiteGen: { select: { siteUrl: true, status: true, expiresAt: true } },
      emailLog: { select: { status: true, sentAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(businesses)
})

/**
 * GET /api/admin/websites
 * Returns every generated website for the current user, with template info,
 * so they can be previewed and reviewed in a gallery.
 */
router.get('/websites', async (req: Request, res: Response) => {
  const userId = req.user!.userId

  const sites = await prisma.generatedWebsite.findMany({
    where: { business: { upload: { userId } } },
    orderBy: { generatedAt: 'desc' },
    select: {
      siteUrl: true,
      qrUrl: true,
      status: true,
      templateId: true,
      templateUrl: true,
      expiresAt: true,
      viewCount: true,
      generatedAt: true,
      business: {
        select: {
          id: true,
          name: true,
          category: true,
          presenceScore: { select: { total: true } },
        },
      },
    },
  })

  res.json(sites)
})

/**
 * POST /api/admin/schedule-emails
 * Body: { businessIds: string[], scheduledFor?: string (ISO date) }
 * Schedules outreach emails for given businesses. If scheduledFor is omitted, sends immediately.
 */
router.post('/schedule-emails', async (req: Request, res: Response) => {
  const { businessIds, scheduledFor, testEmail } = req.body as {
    businessIds: string[]
    scheduledFor?: string
    testEmail?: string
  }

  if (!Array.isArray(businessIds) || businessIds.length === 0) {
    res.status(400).json({ error: 'businessIds must be a non-empty array' })
    return
  }

  const trimmedTestEmail = testEmail?.trim()
  if (trimmedTestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedTestEmail)) {
    res.status(400).json({ error: 'testEmail is not a valid email address' })
    return
  }

  const jobs: EmailJobData[] = businessIds.map((id) => ({
    businessId: id,
    type: 'EMAIL',
    ...(scheduledFor ? { scheduledFor } : {}),
    ...(trimmedTestEmail ? { testEmailOverride: trimmedTestEmail } : {}),
  }))

  await enqueueEmailBulk(jobs)

  const testSuffix = trimmedTestEmail ? ` (TEST → all to ${trimmedTestEmail})` : ''
  res.json({
    scheduled: jobs.length,
    scheduledFor: scheduledFor ?? 'immediate',
    message: scheduledFor
      ? `${jobs.length} email(s) scheduled for ${new Date(scheduledFor).toISOString()}${testSuffix}`
      : `${jobs.length} email(s) queued for immediate delivery${testSuffix}`,
  })
})

/**
 * GET /api/admin/preview-email/:businessId
 * Returns a preview of the outreach email HTML for a given business.
 * Uses cached emailLog.bodyHtml if available, otherwise generates via OpenAI.
 */
router.get('/preview-email/:businessId', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { presenceScore: true, websiteGen: true, emailLog: true },
  })

  if (!business) {
    res.status(404).json({ error: 'Business not found' })
    return
  }

  if (!business.websiteGen) {
    res.status(400).json({ error: 'No generated website for this business' })
    return
  }

  // If email was already sent, return the cached HTML.
  // bodyHtml/ctaText pieces aren't stored separately, so editing regenerates from scratch.
  if (business.emailLog?.bodyHtml) {
    res.json({
      subject: business.emailLog.subject,
      html: business.emailLog.bodyHtml,
      bodyHtml: null,
      ctaText: null,
      defaultEmail: business.email,
      businessName: business.name,
      cached: true,
    })
    return
  }

  // Generate a fresh preview via OpenAI
  const opportunities = business.presenceScore?.opportunities ?? []
  const siteUrl = business.websiteGen.siteUrl
  const qrUrl = business.websiteGen.qrUrl

  let content: EmailContent
  try {
    const prompt = `Write a cold outreach email for a digital agency reaching out to a local business.
Business Name: ${business.name}
Category: ${business.category ?? 'Local Business'}
Address: ${business.address ?? 'not provided'}
Key weaknesses identified: ${opportunities.slice(0, 3).join('; ')}
Free site preview URL: ${siteUrl}
Return JSON: subject (string, <60 chars), bodyHtml (HTML <p> tags only, no CTA), ctaText (short string).`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter. Return JSON with: subject, bodyHtml (HTML paragraphs only), ctaText.',
        },
        { role: 'user', content: prompt },
      ],
    })
    content = JSON.parse(response.choices[0]?.message?.content ?? '{}') as EmailContent
  } catch {
    content = {
      subject: `We built a free website preview for ${business.name}`,
      bodyHtml: `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${business.name} team,</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">We built a free website preview just for you — check it out and claim it at no cost.</p>`,
      ctaText: 'View Your Free Site Preview',
    }
  }

  const html = buildEmailHtml(business.category, {
    businessName: business.name,
    siteUrl,
    content,
    qrUrl,
  })

  res.json({
    subject: content.subject,
    html,
    bodyHtml: content.bodyHtml,
    ctaText: content.ctaText,
    defaultEmail: business.email,
    businessName: business.name,
    cached: false,
  })
})

/**
 * POST /api/admin/preview-email/:businessId/render
 * Body: { subject, bodyHtml, ctaText }
 * Rebuilds the full email HTML from edited content so the modal can show a live preview.
 */
router.post('/preview-email/:businessId/render', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string
  const { subject, bodyHtml, ctaText } = req.body as {
    subject?: string
    bodyHtml?: string
    ctaText?: string
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { websiteGen: true },
  })

  if (!business) {
    res.status(404).json({ error: 'Business not found' })
    return
  }
  if (!business.websiteGen) {
    res.status(400).json({ error: 'No generated website for this business' })
    return
  }

  const html = buildEmailHtml(business.category, {
    businessName: business.name,
    siteUrl: business.websiteGen.siteUrl,
    content: {
      subject: subject ?? '',
      bodyHtml: bodyHtml ?? '',
      ctaText: ctaText ?? 'View Your Free Site Preview',
    },
    qrUrl: business.websiteGen.qrUrl,
  })

  res.json({ html })
})

/**
 * POST /api/admin/send-test-email/:businessId
 * Body: { to, subject, bodyHtml, ctaText }
 * Sends the edited email immediately to a custom recipient. Test-only: no DB writes,
 * the business is NOT marked as contacted.
 */
router.post('/send-test-email/:businessId', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string
  const { to, subject, bodyHtml, ctaText } = req.body as {
    to?: string
    subject?: string
    bodyHtml?: string
    ctaText?: string
  }

  if (!isEmailEnabled()) {
    res.status(400).json({ error: 'Email is disabled — set EMAIL_ENABLED=true and configure SMTP_* to send.' })
    return
  }

  const recipient = to?.trim()
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    res.status(400).json({ error: 'A valid recipient email is required' })
    return
  }
  if (!subject?.trim()) {
    res.status(400).json({ error: 'Subject is required' })
    return
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { websiteGen: true },
  })

  if (!business) {
    res.status(404).json({ error: 'Business not found' })
    return
  }
  if (!business.websiteGen) {
    res.status(400).json({ error: 'No generated website for this business' })
    return
  }

  const html = buildEmailHtml(business.category, {
    businessName: business.name,
    siteUrl: business.websiteGen.siteUrl,
    content: {
      subject: subject.trim(),
      bodyHtml: bodyHtml ?? '',
      ctaText: ctaText?.trim() || 'View Your Free Site Preview',
    },
    qrUrl: business.websiteGen.qrUrl,
  })

  try {
    const transporter = createTransporter()
    const fromAddress = process.env['SMTP_FROM'] ?? 'The Human Collective <contact@thehumancollective.ca>'
    const info = await transporter.sendMail({ from: fromAddress, to: recipient, subject: subject.trim(), html })
    res.json({ sent: true, to: recipient, messageId: info.messageId })
  } catch (err) {
    res.status(500).json({ error: `Failed to send: ${(err as Error).message}` })
  }
})

export default router
