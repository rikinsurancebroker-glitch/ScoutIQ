import { Router, Request, Response } from 'express'
import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/s/:businessId', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string

  const site = await prisma.generatedWebsite.findUnique({
    where: { businessId },
  })

  if (!site) {
    res.status(404).send('<h1>Site not found</h1>')
    return
  }

  if (site.status === 'EXPIRED' || site.status === 'DELETED') {
    res.status(410).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Expired</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; }
    .container { text-align: center; padding: 40px; max-width: 480px; }
    h1 { color: #1e293b; font-size: 2rem; margin-bottom: 16px; }
    p { color: #64748b; line-height: 1.6; }
    .badge { display: inline-block; background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 9999px; font-size: 14px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Expired</div>
    <h1>This preview has expired</h1>
    <p>The free website preview you were looking for is no longer available. Contact the business directly or ask them to set up a new preview.</p>
  </div>
</body>
</html>`)
    return
  }

  const now = new Date()

  const updateData: Prisma.GeneratedWebsiteUpdateInput = {
    viewCount: { increment: 1 },
    lastViewAt: now,
    ...(site.firstViewAt === null ? { firstViewAt: now } : {}),
    ...(site.status === 'LIVE'
      ? {
          status: 'EXTENDED',
          expiresAt: new Date(site.expiresAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        }
      : {}),
  }

  await Promise.all([
    prisma.generatedWebsite.update({
      where: { businessId },
      data: updateData,
    }),
    prisma.business.update({
      where: { id: businessId },
      data: { crmStatus: 'INTERESTED' },
    }),
  ])

  res.redirect(302, `${site.templateUrl}/${businessId}`)
})

router.get('/sites/:businessId/content', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string

  const site = await prisma.generatedWebsite.findUnique({
    where: { businessId },
    select: {
      contentJson: true,
      status: true,
      expiresAt: true,
    },
  })

  if (!site) {
    res.status(404).json({ error: 'expired' })
    return
  }

  if (site.status === 'EXPIRED' || site.status === 'DELETED') {
    res.status(404).json({ error: 'expired' })
    return
  }

  res.json(site.contentJson)
})

export default router
