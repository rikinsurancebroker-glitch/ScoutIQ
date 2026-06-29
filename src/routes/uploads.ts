import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { supabase } from '../lib/supabase'
import { csvParseQueue } from '../queues/queues'
import { requireAuth } from '../middleware/auth'
import type { ParseJobData } from '../queues/queues'

const router = Router()

router.use(requireAuth)

const createUploadSchema = z.object({
  fileName: z.string().min(1, 'fileName is required').endsWith('.csv', 'File must be a CSV'),
})

router.post('/', async (req: Request, res: Response) => {
  const parsed = createUploadSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation error' })
    return
  }

  const { fileName } = parsed.data
  const userId = req.user!.userId

  const upload = await prisma.upload.create({
    data: {
      userId,
      fileName,
      storagePath: `${userId}/${Date.now()}-${fileName}`,
    },
  })

  const { data, error } = await supabase.storage
    .from('csv-uploads')
    .createSignedUploadUrl(upload.storagePath)

  if (error || !data) {
    await prisma.upload.delete({ where: { id: upload.id } })
    res.status(500).json({ error: `Failed to create signed upload URL: ${error?.message ?? 'unknown'}` })
    return
  }

  res.status(201).json({
    uploadId: upload.id,
    signedUrl: data.signedUrl,
    token: data.token,
    storagePath: upload.storagePath,
  })
})

router.post('/:id/confirm', async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const userId = req.user!.userId

  const upload = await prisma.upload.findFirst({
    where: { id, userId },
  })

  if (!upload) {
    res.status(404).json({ error: 'Upload not found' })
    return
  }

  if (upload.status !== 'PENDING') {
    res.status(409).json({ error: `Upload is already in status: ${upload.status}` })
    return
  }

  await csvParseQueue.add(
    `parse-${upload.id}`,
    {
      uploadId: upload.id,
      userId,
      storagePath: upload.storagePath,
    } satisfies ParseJobData,
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    }
  )

  res.status(202).json({ message: 'Processing started', uploadId: upload.id })
})

router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.userId

  const uploads = await prisma.upload.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { businesses: true },
      },
    },
  })

  res.json(uploads)
})

router.get('/:id/status', async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const userId = req.user!.userId

  const upload = await prisma.upload.findFirst({
    where: { id, userId },
  })

  if (!upload) {
    res.status(404).json({ error: 'Upload not found' })
    return
  }

  const scoreThreshold = parseInt(process.env.SCORE_THRESHOLD ?? '50')

  const [businessCount, scored, opportunities] = await Promise.all([
    prisma.business.count({ where: { uploadId: id } }),
    prisma.presenceScore.count({
      where: { business: { uploadId: id } },
    }),
    prisma.presenceScore.count({
      where: {
        business: { uploadId: id },
        total: { lt: scoreThreshold },
      },
    }),
  ])

  res.json({
    status: upload.status,
    totalRows: upload.totalRows,
    processedRows: upload.processedRows,
    totalBusinesses: businessCount,
    scored,
    opportunities,
  })
})

router.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const userId = req.user!.userId

  const upload = await prisma.upload.findFirst({
    where: { id, userId },
  })

  if (!upload) {
    res.status(404).json({ error: 'Upload not found' })
    return
  }

  await supabase.storage.from('csv-uploads').remove([upload.storagePath])

  await prisma.upload.delete({ where: { id } })

  res.json({ message: 'Upload deleted successfully' })
})

export default router
