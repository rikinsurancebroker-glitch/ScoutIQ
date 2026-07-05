import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { enqueueWebsiteGen, enqueueEmailBulk } from '../queues/queues'
import type { EmailJobData } from '../queues/queues'

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
 * POST /api/admin/schedule-emails
 * Body: { businessIds: string[], scheduledFor?: string (ISO date) }
 * Schedules outreach emails for given businesses. If scheduledFor is omitted, sends immediately.
 */
router.post('/schedule-emails', async (req: Request, res: Response) => {
  const { businessIds, scheduledFor } = req.body as {
    businessIds: string[]
    scheduledFor?: string
  }

  if (!Array.isArray(businessIds) || businessIds.length === 0) {
    res.status(400).json({ error: 'businessIds must be a non-empty array' })
    return
  }

  const jobs: EmailJobData[] = businessIds.map((id) => ({
    businessId: id,
    type: 'EMAIL',
    ...(scheduledFor ? { scheduledFor } : {}),
  }))

  await enqueueEmailBulk(jobs)

  res.json({
    scheduled: jobs.length,
    scheduledFor: scheduledFor ?? 'immediate',
    message: scheduledFor
      ? `${jobs.length} email(s) scheduled for ${new Date(scheduledFor).toISOString()}`
      : `${jobs.length} email(s) queued for immediate delivery`,
  })
})

export default router
