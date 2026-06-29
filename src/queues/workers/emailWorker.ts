import { Worker, Job } from 'bullmq'
import { getBullMQConnection } from '../../lib/redis'
import { prisma } from '../../lib/prisma'
import { supabase } from '../../lib/supabase'
import { openai } from '../../lib/openai'
import { createTransporter, isEmailEnabled } from '../../lib/email'
import type { EmailJobData } from '../queues'

async function generateEmailContent(
  businessName: string,
  category: string | null,
  address: string | null,
  opportunities: string[],
  siteUrl: string
): Promise<{ subject: string; html: string }> {
  const prompt = `Write a cold outreach email for a digital agency reaching out to a local business.

Business Name: ${businessName}
Category: ${category ?? 'Local Business'}
Address: ${address ?? 'not provided'}
Key weaknesses we identified: ${opportunities.slice(0, 3).join('; ')}
Free site preview URL: ${siteUrl}

Return JSON with exactly these fields:
- subject: catchy email subject line
- html: complete email body as HTML with inline styles. Mention their weaknesses kindly, mention we built them a free site preview, include the siteUrl as a link, and end with a clear CTA.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copywriter writing cold outreach emails for a digital agency. Return only JSON with fields: subject (string) and html (string with basic HTML). Be friendly, specific, mention their weaknesses, mention we built them a free site preview.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const raw = response.choices[0]?.message?.content
    if (!raw) throw new Error('Empty OpenAI response')

    const parsed = JSON.parse(raw) as { subject: string; html: string }
    return parsed
  } catch (err) {
    console.error('[EmailWorker] OpenAI email generation failed:', err instanceof Error ? err.message : err)
    return {
      subject: `We built a free website preview for ${businessName}`,
      html: `<p>Hi ${businessName} team,</p>
<p>We noticed your business could benefit from a stronger online presence. We've taken the liberty of building a free website preview for you.</p>
<p><a href="${siteUrl}">View your free site preview</a></p>
<p>This preview is available for a limited time. We'd love to chat about how we can help grow your business online.</p>
<p>Best regards,<br>The ScoutIQ Team</p>`,
    }
  }
}

async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  if (!isEmailEnabled()) {
    console.log(`[EmailWorker] Email disabled — skipping job ${job.id}`)
    return
  }

  const { businessId, type } = job.data

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      presenceScore: true,
      websiteGen: true,
    },
  })

  if (!business) {
    throw new Error(`Business ${businessId} not found`)
  }

  if (!business.email) {
    console.log(`[EmailWorker] Business ${businessId} has no email, skipping`)
    return
  }

  if (!business.websiteGen) {
    throw new Error(`No generated website for business ${businessId}`)
  }

  const transporter = createTransporter()
  const fromAddress = process.env.SMTP_FROM ?? 'ScoutIQ <hello@scoutiq.com>'

  if (type === 'REMINDER') {
    const subject = `Your free website preview expires soon — ${business.name}`
    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Your free site preview expires in 2 days</h2>
  <p>Hi ${business.name} team,</p>
  <p>We wanted to remind you that your free website preview will expire soon.</p>
  <p style="margin: 24px 0;">
    <a href="${business.websiteGen.siteUrl}" 
       style="background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
      View Your Free Site Preview
    </a>
  </p>
  <p>Don't let this opportunity slip by. Claim your site today to keep it live permanently.</p>
  <img src="cid:qr-code" alt="Scan to preview" style="width:200px;height:200px;display:block;margin:16px 0;" />
  <p>Best regards,<br>The ScoutIQ Team</p>
</div>`

    let qrBuffer: Buffer | undefined

    try {
      const { data: qrData, error: qrError } = await supabase.storage
        .from('generated-sites')
        .download(`qr/${businessId}/qr.png`)

      if (qrError) throw qrError

      const arrayBuffer = await qrData.arrayBuffer()
      qrBuffer = Buffer.from(arrayBuffer)
    } catch (err) {
      console.error(`[EmailWorker] Failed to fetch QR for reminder email ${businessId}:`, err)
    }

    const attachments = qrBuffer
      ? [
          {
            filename: 'preview-qr.png',
            content: qrBuffer,
            cid: 'qr-code',
            contentType: 'image/png',
          },
        ]
      : []

    await transporter.sendMail({
      from: fromAddress,
      to: business.email,
      subject,
      html,
      attachments,
    })

    await prisma.emailLog.upsert({
      where: { businessId },
      create: {
        businessId,
        toEmail: business.email,
        subject,
        bodyHtml: html,
        status: 'SENT',
        sentAt: new Date(),
      },
      update: {
        status: 'SENT',
        sentAt: new Date(),
      },
    })

    return
  }

  const opportunities = business.presenceScore?.opportunities ?? []
  const { subject, html: generatedHtml } = await generateEmailContent(
    business.name,
    business.category,
    business.address,
    opportunities,
    business.websiteGen.siteUrl
  )

  let qrBuffer: Buffer | undefined

  try {
    const { data: qrData, error: qrError } = await supabase.storage
      .from('generated-sites')
      .download(`qr/${businessId}/qr.png`)

    if (qrError) throw qrError

    const arrayBuffer = await qrData.arrayBuffer()
    qrBuffer = Buffer.from(arrayBuffer)
  } catch (err) {
    console.error(`[EmailWorker] Failed to fetch QR for business ${businessId}:`, err)
  }

  const qrImageTag = `<div style="text-align:center;margin:24px 0;">
  <p style="font-size:14px;color:#666;margin-bottom:8px;">Scan to see your free preview</p>
  <img src="cid:qr-code" alt="Scan to preview your site" style="width:200px;height:200px;" />
</div>`

  const finalHtml = generatedHtml.replace('</body>', `${qrImageTag}</body>`)
    || `${generatedHtml}${qrImageTag}`

  const attachments = qrBuffer
    ? [
        {
          filename: 'preview-qr.png',
          content: qrBuffer,
          cid: 'qr-code',
          contentType: 'image/png',
        },
      ]
    : []

  await transporter.sendMail({
    from: fromAddress,
    to: business.email,
    subject,
    html: finalHtml,
    attachments,
  })

  await prisma.emailLog.upsert({
    where: { businessId },
    create: {
      businessId,
      toEmail: business.email,
      subject,
      bodyHtml: finalHtml,
      status: 'SENT',
      sentAt: new Date(),
    },
    update: {
      subject,
      bodyHtml: finalHtml,
      status: 'SENT',
      sentAt: new Date(),
    },
  })

  await prisma.business.update({
    where: { id: businessId },
    data: { crmStatus: 'EMAIL_SENT' },
  })
}

const emailWorker = new Worker<EmailJobData>('email', processEmailJob, {
  connection: getBullMQConnection(),
  concurrency: 2,
})

emailWorker.on('failed', async (job, err) => {
  if (!job) return
  console.error(`[EmailWorker] Job ${job.id} failed:`, err.message)

  const { businessId } = job.data
  await prisma.emailLog.updateMany({
    where: { businessId, status: 'PENDING' },
    data: { status: 'FAILED' },
  })
})

emailWorker.on('completed', (job) => {
  console.log(`[EmailWorker] Job ${job.id} completed`)
})

console.log('[EmailWorker] Started — concurrency 2')

export default emailWorker
