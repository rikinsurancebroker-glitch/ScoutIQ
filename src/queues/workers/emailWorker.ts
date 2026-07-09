import { prisma } from '../../lib/prisma'
import { supabase } from '../../lib/supabase'
import { openai } from '../../lib/openai'
import { createTransporter, isEmailEnabled } from '../../lib/email'
import { buildEmailHtml, type EmailContent } from '../../lib/emailTemplates'
import type { EmailJobData } from '../queues'

async function generateEmailContent(
  businessName: string,
  category: string | null,
  address: string | null,
  opportunities: string[],
  siteUrl: string
): Promise<EmailContent> {
  const prompt = `Write a cold outreach email for a digital agency reaching out to a local business.

Business Name: ${businessName}
Category: ${category ?? 'Local Business'}
Address: ${address ?? 'not provided'}
Key weaknesses identified: ${opportunities.slice(0, 3).join('; ')}
Free site preview URL: ${siteUrl}

Return JSON with exactly these fields:
- subject: catchy, personalised email subject line (under 60 chars)
- bodyHtml: the email body as HTML paragraphs with inline styles. Use <p> tags. Mention their specific weaknesses kindly, say we built them a free preview site, and make it feel personal. Do NOT include a CTA button — that is handled separately.
- ctaText: short CTA button label (e.g. "View My Free Website", "See Your Preview", "Claim Your Site")`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copywriter writing personalised cold outreach emails for a digital agency. Return only JSON with fields: subject (string), bodyHtml (HTML string with <p> tags and inline styles, no CTA button), ctaText (short string).',
        },
        { role: 'user', content: prompt },
      ],
    })

    const raw = response.choices[0]?.message?.content
    if (!raw) throw new Error('Empty OpenAI response')
    return JSON.parse(raw) as EmailContent
  } catch (err) {
    console.error('[EmailWorker] OpenAI generation failed:', err instanceof Error ? err.message : err)
    return {
      subject: `We built a free website preview for ${businessName}`,
      bodyHtml: `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${businessName} team,</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">We noticed your business could benefit from a stronger online presence, so we took the liberty of building a <strong>free website preview</strong> just for you.</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">This is a no-strings-attached gift — view it, share it, and if you like it, claim it permanently at zero cost.</p>`,
      ctaText: 'View Your Free Site Preview',
    }
  }
}

async function fetchQrBuffer(businessId: string): Promise<Buffer | undefined> {
  try {
    const { data, error } = await supabase.storage
      .from('generated-sites')
      .download(`qr/${businessId}/qr.png`)
    if (error) throw error
    return Buffer.from(await data.arrayBuffer())
  } catch (err) {
    console.error(`[EmailWorker] Failed to fetch QR for ${businessId}:`, err)
    return undefined
  }
}

export async function processEmailJob(data: EmailJobData): Promise<void> {
  if (!isEmailEnabled()) {
    console.log(`[EmailWorker] Email disabled — skipping job for ${data.businessId}`)
    return
  }

  const { businessId, type, testEmailOverride } = data

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { presenceScore: true, websiteGen: true },
  })

  if (!business) throw new Error(`Business ${businessId} not found`)
  // In test mode we deliver to the override address regardless of the business's own email.
  const recipient = testEmailOverride ?? business.email
  if (!recipient) {
    console.log(`[EmailWorker] Business ${businessId} has no email, skipping`)
    return
  }
  if (testEmailOverride) {
    console.log(`[EmailWorker] TEST MODE — routing ${businessId} email to ${testEmailOverride}`)
  }
  if (!business.websiteGen) throw new Error(`No generated website for business ${businessId}`)

  const transporter = createTransporter()
  const fromAddress = process.env.SMTP_FROM ?? 'The Human Collective <contact@thehumancollective.ca>'
  const qrBuffer = await fetchQrBuffer(businessId)
  const attachments = qrBuffer
    ? [{ filename: 'preview-qr.png', content: qrBuffer, cid: 'qr-code', contentType: 'image/png' }]
    : []

  if (type === 'REMINDER') {
    const subject = `⏰ Your free website preview expires soon — ${business.name}`
    const reminderContent: EmailContent = {
      subject,
      bodyHtml: `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${business.name} team,</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Just a quick reminder — your <strong>free website preview</strong> is expiring in the next 48 hours.</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Don't let it slip away! Click below to view it and claim it permanently at <strong>no cost</strong>.</p>`,
      ctaText: 'View My Site Before It Expires',
    }

    const html = buildEmailHtml(business.category, {
      businessName: business.name,
      siteUrl: business.websiteGen.siteUrl,
      content: reminderContent,
      qrEmbedded: !!qrBuffer,
    })

    await transporter.sendMail({ from: fromAddress, to: recipient, subject, html, attachments })

    // Skip DB writes in test mode so we don't mark real businesses as emailed.
    if (!testEmailOverride) {
      await prisma.emailLog.upsert({
        where: { businessId },
        create: { businessId, toEmail: recipient, subject, bodyHtml: html, status: 'SENT', sentAt: new Date() },
        update: { status: 'SENT', sentAt: new Date() },
      })
    }
    return
  }

  // Initial outreach email
  const opportunities = business.presenceScore?.opportunities ?? []
  const content = await generateEmailContent(
    business.name,
    business.category,
    business.address,
    opportunities,
    business.websiteGen.siteUrl
  )

  const html = buildEmailHtml(business.category, {
    businessName: business.name,
    siteUrl: business.websiteGen.siteUrl,
    content,
    qrEmbedded: !!qrBuffer,
  })

  await transporter.sendMail({
    from: fromAddress,
    to: recipient,
    subject: content.subject,
    html,
    attachments,
  })

  // Skip DB writes in test mode so we don't mark real businesses as emailed.
  if (testEmailOverride) return

  await prisma.emailLog.upsert({
    where: { businessId },
    create: { businessId, toEmail: recipient, subject: content.subject, bodyHtml: html, status: 'SENT', sentAt: new Date() },
    update: { subject: content.subject, bodyHtml: html, status: 'SENT', sentAt: new Date() },
  })

  await prisma.business.update({
    where: { id: businessId },
    data: { crmStatus: 'EMAIL_SENT' },
  })
}

export async function handleEmailFailure(businessId: string, errorMsg: string): Promise<void> {
  console.error(`[EmailWorker] Job failed for ${businessId}:`, errorMsg)
  await prisma.emailLog.updateMany({
    where: { businessId, status: 'PENDING' },
    data: { status: 'FAILED' },
  })
}
