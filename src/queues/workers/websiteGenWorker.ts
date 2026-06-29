import { Worker, Job } from 'bullmq'
import QRCode from 'qrcode'
import { addDays } from 'date-fns'
import { getBullMQConnection } from '../../lib/redis'
import { prisma } from '../../lib/prisma'
import { supabase } from '../../lib/supabase'
import { pickTemplate, generateSiteContent } from '../../services/websiteGeneratorService'
import { emailQueue } from '../queues'
import type { WebsiteGenJobData, EmailJobData } from '../queues'

const TEMPLATES: Record<string, string> = {
  'restaurant-01': 'https://scoutiq-restaurant-01.vercel.app',
  'restaurant-02': 'https://scoutiq-restaurant-02.vercel.app',
  'clinic-01': 'https://scoutiq-clinic-01.vercel.app',
  'salon-01': 'https://scoutiq-salon-01.vercel.app',
  'gym-01': 'https://scoutiq-gym-01.vercel.app',
  'retail-01': 'https://scoutiq-retail-01.vercel.app',
  'law-01': 'https://scoutiq-law-01.vercel.app',
  'cafe-01': 'https://scoutiq-cafe-01.vercel.app',
  'education-01': 'https://scoutiq-education-01.vercel.app',
  'default-01': 'https://scoutiq-default-01.vercel.app',
}

async function processWebsiteGenJob(job: Job<WebsiteGenJobData>): Promise<void> {
  const { businessId } = job.data

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { presenceScore: true },
  })

  if (!business) {
    throw new Error(`Business ${businessId} not found`)
  }

  if (!business.presenceScore) {
    throw new Error(`No presence score found for business ${businessId}`)
  }

  const templateId = pickTemplate(business.category)
  const templateUrl = TEMPLATES[templateId] ?? TEMPLATES['default-01']

  const content = await generateSiteContent(business, business.presenceScore)

  const apiUrl = process.env.API_URL ?? 'http://localhost:4000'
  const trackingUrl = `${apiUrl}/s/${businessId}`

  const qrBuffer = await QRCode.toBuffer(trackingUrl, {
    type: 'png',
    width: 300,
    margin: 2,
  })

  const qrPath = `qr/${businessId}/qr.png`
  const { error: uploadError } = await supabase.storage
    .from('generated-sites')
    .upload(qrPath, qrBuffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Supabase QR upload failed: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('generated-sites')
    .getPublicUrl(qrPath)

  const qrUrl = publicUrlData.publicUrl
  const siteUrl = `${templateUrl}/${businessId}`
  const expiryDays = parseInt(process.env.SITE_EXPIRY_DAYS ?? '7')
  const expiresAt = addDays(new Date(), expiryDays)

  await prisma.generatedWebsite.upsert({
    where: { businessId },
    create: {
      businessId,
      siteUrl,
      qrUrl,
      contentJson: content as object,
      templateId,
      templateUrl,
      expiresAt,
    },
    update: {
      siteUrl,
      qrUrl,
      contentJson: content as object,
      templateId,
      templateUrl,
      expiresAt,
      status: 'LIVE',
      deletedAt: null,
    },
  })

  if (business.email) {
    await emailQueue.add(
      `email-${businessId}`,
      { businessId, type: 'EMAIL' } satisfies EmailJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      }
    )
  }
}

const websiteGenWorker = new Worker<WebsiteGenJobData>('website-gen', processWebsiteGenJob, {
  connection: getBullMQConnection(),
  concurrency: 3,
})

websiteGenWorker.on('failed', (job, err) => {
  if (!job) return
  console.error(`[WebsiteGenWorker] Job ${job.id} failed:`, err.message)
})

websiteGenWorker.on('completed', (job) => {
  console.log(`[WebsiteGenWorker] Job ${job.id} completed`)
})

console.log('[WebsiteGenWorker] Started — concurrency 3')

export default websiteGenWorker
