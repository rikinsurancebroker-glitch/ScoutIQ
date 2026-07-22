import { prisma } from '../../lib/prisma'
import { scoreBusiness } from '../../services/scoringService'
import { enqueueWebsiteGen } from '../queues'
import type { ScoreJobData } from '../queues'

const SCORE_THRESHOLD = parseInt(process.env.SCORE_THRESHOLD ?? '70')

export async function processScoreJob(data: ScoreJobData): Promise<void> {
  const { businessId, uploadId } = data

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
    await enqueueWebsiteGen({ businessId })
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
