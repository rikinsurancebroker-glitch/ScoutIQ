import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

function qstr(val: unknown): string | undefined {
  if (typeof val === 'string') return val
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0]
  return undefined
}

router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const uploadId = qstr(req.query['uploadId'])

  const uploadFilter = uploadId
    ? { uploadId, upload: { userId } }
    : { upload: { userId } }

  const scoreThreshold = parseInt(process.env.SCORE_THRESHOLD ?? '50')

  const [
    totalBusinesses,
    scored,
    opportunities,
    emailsSent,
    won,
    avgScoreResult,
    noWebsite,
    categoryBreakdown,
  ] = await Promise.all([
    prisma.business.count({ where: uploadFilter }),

    prisma.presenceScore.count({
      where: { business: uploadFilter },
    }),

    prisma.presenceScore.count({
      where: {
        business: uploadFilter,
        total: { lt: scoreThreshold },
      },
    }),

    prisma.business.count({
      where: { ...uploadFilter, crmStatus: 'EMAIL_SENT' },
    }),

    prisma.business.count({
      where: { ...uploadFilter, crmStatus: 'WON' },
    }),

    prisma.presenceScore.aggregate({
      where: { business: uploadFilter },
      _avg: { total: true },
    }),

    prisma.presenceScore.count({
      where: {
        business: uploadFilter,
        flags: { has: 'no_website' },
      },
    }),

    prisma.business.groupBy({
      by: ['category'],
      where: uploadFilter,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
  ])

  res.json({
    totalBusinesses,
    scored,
    opportunities,
    emailsSent,
    won,
    avgScore: Math.round((avgScoreResult._avg.total ?? 0) * 10) / 10,
    noWebsite,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category ?? 'Unknown',
      count: c._count.id,
    })),
  })
})

router.get('/expiry-stats', async (req: Request, res: Response) => {
  const userId = req.user!.userId

  const [live, extended, claimed, expired, viewedNotClaimed] = await Promise.all([
    prisma.generatedWebsite.count({
      where: { status: 'LIVE', business: { upload: { userId } } },
    }),

    prisma.generatedWebsite.count({
      where: { status: 'EXTENDED', business: { upload: { userId } } },
    }),

    prisma.generatedWebsite.count({
      where: { status: 'CLAIMED', business: { upload: { userId } } },
    }),

    prisma.generatedWebsite.count({
      where: { status: 'EXPIRED', business: { upload: { userId } } },
    }),

    prisma.generatedWebsite.count({
      where: {
        business: { upload: { userId } },
        firstViewAt: { not: null },
        claimedAt: null,
        status: { in: ['LIVE', 'EXTENDED'] },
      },
    }),
  ])

  res.json({ live, extended, claimed, expired, viewedNotClaimed })
})

export default router
