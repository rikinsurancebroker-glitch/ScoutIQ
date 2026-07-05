import cron from 'node-cron'
import { prisma } from '../lib/prisma'
import { supabase } from '../lib/supabase'
import { tryAdvisoryLock, releaseAdvisoryLock } from '../lib/pgLock'

const LOCK_ID = 83_927_401

export async function runCleanup(): Promise<void> {
  const lockAcquired = await tryAdvisoryLock(LOCK_ID)

  if (!lockAcquired) {
    console.log('[ExpiryCleanup] Lock already held — skipping run')
    return
  }

  try {
    console.log('[ExpiryCleanup] Starting cleanup...')
    const now = new Date()

    const expiredSites = await prisma.generatedWebsite.findMany({
      where: {
        expiresAt: { lt: now },
        status: { in: ['LIVE', 'EXTENDED'] },
      },
      select: {
        id: true,
        businessId: true,
        firstViewAt: true,
      },
    })

    console.log(`[ExpiryCleanup] Found ${expiredSites.length} expired sites`)

    for (const site of expiredSites) {
      try {
        const filesToDelete = [
          `sites/${site.businessId}/index.html`,
          `qr/${site.businessId}/qr.png`,
        ]

        const { error: storageError } = await supabase.storage
          .from('generated-sites')
          .remove(filesToDelete)

        if (storageError) {
          console.error(
            `[ExpiryCleanup] Storage delete failed for ${site.businessId}:`,
            storageError.message
          )
        }

        await prisma.generatedWebsite.update({
          where: { id: site.id },
          data: {
            status: 'EXPIRED',
            deletedAt: now,
            htmlContent: '',
            siteUrl: '',
            qrUrl: '',
          },
        })

        if (site.firstViewAt === null) {
          await prisma.business.update({
            where: { id: site.businessId },
            data: { crmStatus: 'LOST' },
          })
        }

        console.log(`[ExpiryCleanup] Expired site for business ${site.businessId}`)
      } catch (err) {
        console.error(
          `[ExpiryCleanup] Failed to expire site ${site.id}:`,
          err instanceof Error ? err.message : err
        )
      }
    }

    console.log('[ExpiryCleanup] Cleanup complete')
  } finally {
    await releaseAdvisoryLock(LOCK_ID)
  }
}

export function startExpiryCleanup(): void {
  cron.schedule('0 2 * * *', async () => {
    console.log('[ExpiryCleanup] Cron triggered at 2:00 AM')
    await runCleanup()
  })

  console.log('[ExpiryCleanup] Scheduled daily at 02:00 AM')
}
