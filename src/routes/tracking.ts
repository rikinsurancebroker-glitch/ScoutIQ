import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { TRANSPARENT_GIF } from '../lib/emailTracking'

const router = Router()

const PIXEL_HEADERS = {
  'Content-Type': 'image/gif',
  'Content-Length': String(TRANSPARENT_GIF.length),
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  Pragma: 'no-cache',
} as const

/**
 * GET /t/email/:businessId/open.gif
 * Invisible tracking pixel — mail clients load this when images are enabled.
 * Records first open (openedAt) and increments openCount on each load.
 */
router.get('/t/email/:businessId/open.gif', async (req: Request, res: Response) => {
  const businessId = req.params['businessId'] as string

  try {
    const log = await prisma.emailLog.findUnique({
      where: { businessId },
      select: { status: true, openedAt: true },
    })

    if (log?.status === 'SENT') {
      await prisma.emailLog.update({
        where: { businessId },
        data: {
          openCount: { increment: 1 },
          ...(log.openedAt ? {} : { openedAt: new Date() }),
        },
      })
    }
  } catch (err) {
    // Never fail the pixel response — a broken tracker must not break email rendering.
    console.error(`[EmailTracking] Failed to record open for ${businessId}:`, err)
  }

  res.writeHead(200, PIXEL_HEADERS)
  res.end(TRANSPARENT_GIF)
})

export default router
