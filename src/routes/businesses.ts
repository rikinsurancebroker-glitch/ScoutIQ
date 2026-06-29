import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import type { Prisma } from '@prisma/client'

const router = Router()

router.use(requireAuth)

function qstr(val: unknown): string | undefined {
  if (typeof val === 'string') return val
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0]
  return undefined
}

const listQuerySchema = z.object({
  uploadId: z.string().optional(),
  category: z.string().optional(),
  crmStatus: z
    .enum(['NOT_CONTACTED', 'EMAIL_SENT', 'REPLIED', 'INTERESTED', 'NEGOTIATING', 'WON', 'LOST', 'SKIPPED'])
    .optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  maxScore: z.coerce.number().int().min(0).max(100).optional(),
  sort: z.enum(['score_asc', 'score_desc', 'created_desc']).optional().default('created_desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
})

const updateCrmSchema = z.object({
  crmStatus: z.enum([
    'NOT_CONTACTED',
    'EMAIL_SENT',
    'REPLIED',
    'INTERESTED',
    'NEGOTIATING',
    'WON',
    'LOST',
    'SKIPPED',
  ]),
})

router.get('/', async (req: Request, res: Response) => {
  const rawQuery = {
    uploadId: qstr(req.query['uploadId']),
    category: qstr(req.query['category']),
    crmStatus: qstr(req.query['crmStatus']),
    minScore: qstr(req.query['minScore']),
    maxScore: qstr(req.query['maxScore']),
    sort: qstr(req.query['sort']),
    page: qstr(req.query['page']),
    limit: qstr(req.query['limit']),
  }

  const parsed = listQuerySchema.safeParse(rawQuery)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation error' })
    return
  }

  const { uploadId, category, crmStatus, minScore, maxScore, sort, page, limit } = parsed.data
  const userId = req.user!.userId
  const skip = (page - 1) * limit

  const uploadFilter: Prisma.BusinessWhereInput = uploadId
    ? { upload: { id: uploadId, userId } }
    : { upload: { userId } }

  const where: Prisma.BusinessWhereInput = {
    ...uploadFilter,
    ...(category ? { category: { contains: category, mode: 'insensitive' } } : {}),
    ...(crmStatus ? { crmStatus } : {}),
    ...(minScore !== undefined || maxScore !== undefined
      ? {
          presenceScore: {
            ...(minScore !== undefined ? { total: { gte: minScore } } : {}),
            ...(maxScore !== undefined ? { total: { lte: maxScore } } : {}),
          },
        }
      : {}),
  }

  let orderBy: Prisma.BusinessOrderByWithRelationInput

  if (sort === 'score_asc') {
    orderBy = { presenceScore: { total: 'asc' } }
  } else if (sort === 'score_desc') {
    orderBy = { presenceScore: { total: 'desc' } }
  } else {
    orderBy = { createdAt: 'desc' }
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        presenceScore: true,
        websiteGen: {
          select: {
            siteUrl: true,
            qrUrl: true,
            status: true,
            expiresAt: true,
            viewCount: true,
          },
        },
        emailLog: {
          select: {
            status: true,
            sentAt: true,
          },
        },
      },
    }),
    prisma.business.count({ where }),
  ])

  res.json({
    data: businesses,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
})

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const userId = req.user!.userId

  const business = await prisma.business.findFirst({
    where: { id, upload: { userId } },
    include: {
      presenceScore: true,
      websiteGen: true,
      emailLog: true,
      upload: {
        select: { id: true, fileName: true, status: true },
      },
    },
  })

  if (!business) {
    res.status(404).json({ error: 'Business not found' })
    return
  }

  res.json(business)
})

router.patch('/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const userId = req.user!.userId

  const parsed = updateCrmSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation error' })
    return
  }

  const existing = await prisma.business.findFirst({
    where: { id, upload: { userId } },
  })

  if (!existing) {
    res.status(404).json({ error: 'Business not found' })
    return
  }

  const updated = await prisma.business.update({
    where: { id },
    data: { crmStatus: parsed.data.crmStatus },
    include: { presenceScore: true },
  })

  res.json(updated)
})

export default router
