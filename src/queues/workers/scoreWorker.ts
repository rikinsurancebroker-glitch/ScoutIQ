import { Worker, Job } from 'bullmq'
import { getBullMQConnection } from '../../lib/redis'
import { prisma } from '../../lib/prisma'
import { scoreBusiness } from '../../services/scoringService'
import { websiteGenQueue } from '../queues'
import type { ScoreJobData, WebsiteGenJobData } from '../queues'

const SCORE_THRESHOLD = parseInt(process.env.SCORE_THRESHOLD ?? '50')

async function processScoreJob(job: Job<ScoreJobData>): Promise<void> {
  const { businessId, uploadId } = job.data

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  })

  if (!business) {
    throw new Error(`Business ${businessId} not found`)
  }

  const breakdown = scoreBusiness(business)

  await prisma.presenceScore.upsert({
    where: { businessId },
    create: {
      businessId,
      total: breakdown.total,
      contactScore: breakdown.contactScore,
      websiteScore: breakdown.websiteScore,
      googleScore: breakdown.googleScore,
      socialScore: breakdown.socialScore,
      reviewScore: breakdown.reviewScore,
      hoursScore: breakdown.hoursScore,
      geoScore: breakdown.geoScore,
      flags: breakdown.flags,
      opportunities: breakdown.opportunities,
    },
    update: {
      total: breakdown.total,
      contactScore: breakdown.contactScore,
      websiteScore: breakdown.websiteScore,
      googleScore: breakdown.googleScore,
      socialScore: breakdown.socialScore,
      reviewScore: breakdown.reviewScore,
      hoursScore: breakdown.hoursScore,
      geoScore: breakdown.geoScore,
      flags: breakdown.flags,
      opportunities: breakdown.opportunities,
      scoredAt: new Date(),
    },
  })

  if (breakdown.total < SCORE_THRESHOLD) {
    await websiteGenQueue.add(
      `website-gen-${businessId}`,
      { businessId } satisfies WebsiteGenJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      }
    )
  } else {
    await prisma.business.update({
      where: { id: businessId },
      data: { crmStatus: 'SKIPPED' },
    })
  }

  const scoredCount = await prisma.presenceScore.count({
    where: { business: { uploadId } },
  })

  const totalCount = await prisma.business.count({
    where: { uploadId },
  })

  if (scoredCount >= totalCount) {
    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'DONE' },
    })
  }
}

const scoreWorker = new Worker<ScoreJobData>('scoring', processScoreJob, {
  connection: getBullMQConnection(),
  concurrency: 10,
})

scoreWorker.on('failed', (job, err) => {
  if (!job) return
  console.error(`[ScoreWorker] Job ${job.id} failed:`, err.message)
})

scoreWorker.on('completed', (job) => {
  console.log(`[ScoreWorker] Job ${job.id} completed`)
})

console.log('[ScoreWorker] Started — concurrency 10')

export default scoreWorker
