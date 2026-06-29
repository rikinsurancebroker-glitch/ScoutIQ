import cron from 'node-cron'
import { prisma } from '../lib/prisma'
import { emailQueue } from '../queues/queues'
import type { EmailJobData } from '../queues/queues'
import { addHours } from 'date-fns'

export async function runReminderEmails(): Promise<void> {
  console.log('[ReminderEmails] Checking for sites expiring within 24-48 hours...')

  const now = new Date()
  const in24h = addHours(now, 24)
  const in48h = addHours(now, 48)

  const expiringSites = await prisma.generatedWebsite.findMany({
    where: {
      expiresAt: {
        gte: in24h,
        lte: in48h,
      },
      status: { in: ['LIVE', 'EXTENDED'] },
      firstViewAt: null,
      business: {
        email: { not: null },
      },
    },
    select: {
      id: true,
      businessId: true,
      business: {
        select: { email: true, name: true },
      },
    },
  })

  console.log(`[ReminderEmails] Found ${expiringSites.length} sites to remind`)

  const jobs = expiringSites.map((site) => ({
    name: `reminder-${site.businessId}-${Date.now()}`,
    data: { businessId: site.businessId, type: 'REMINDER' } satisfies EmailJobData,
    opts: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  }))

  if (jobs.length > 0) {
    await emailQueue.addBulk(jobs)
    console.log(`[ReminderEmails] Enqueued ${jobs.length} reminder email jobs`)
  }
}

export function startReminderJob(): void {
  cron.schedule('0 10 * * *', async () => {
    console.log('[ReminderEmails] Cron triggered at 10:00 AM')
    await runReminderEmails()
  })

  console.log('[ReminderEmails] Scheduled daily at 10:00 AM')
}
