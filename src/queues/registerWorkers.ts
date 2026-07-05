import type PgBoss from 'pg-boss'
import { getBoss } from '../lib/jobQueue'
import { isEmailEnabled } from '../lib/email'
import { QUEUE_NAMES } from './queues'
import type { EmailJobData, ParseJobData, ScoreJobData, WebsiteGenJobData } from './queues'
import {
  processParseJob,
  handleParsePermanentFailure,
} from './workers/parseWorker'
import { processScoreJob } from './workers/scoreWorker'
import { processWebsiteGenJob } from './workers/websiteGenWorker'
import { processEmailJob, handleEmailFailure } from './workers/emailWorker'

async function runJobs<T>(jobs: PgBoss.Job<T>[], handler: (data: T) => Promise<void>) {
  for (const job of jobs) {
    await handler(job.data)
  }
}

async function registerWorkerPool<T>(
  boss: PgBoss,
  queue: string,
  concurrency: number,
  handler: (data: T) => Promise<void>
): Promise<void> {
  const workHandler = async (jobs: PgBoss.Job<T>[]) => {
    await runJobs(jobs, handler)
  }

  for (let i = 0; i < concurrency; i++) {
    await boss.work(queue, { pollingIntervalSeconds: 2 }, workHandler)
  }
}

export async function registerWorkers(): Promise<void> {
  const boss = await getBoss()

  await registerWorkerPool<ParseJobData>(boss, QUEUE_NAMES.CSV_PARSE, 2, async (data) => {
    console.log(`[ParseWorker] Processing upload ${data.uploadId}`)
    await processParseJob(data)
    console.log(`[ParseWorker] Completed upload ${data.uploadId}`)
  })

  await boss.work(QUEUE_NAMES.CSV_PARSE + '-dead', async (jobs) => {
    for (const job of jobs) {
      const data = job.data as ParseJobData
      const output = (job as { output?: { message?: string } }).output
      const errorMsg = output?.message ?? 'CSV parse failed after retries'
      console.error(`[ParseWorker] Permanent failure for upload ${data.uploadId}:`, errorMsg)
      await handleParsePermanentFailure(data, errorMsg)
    }
  })

  await registerWorkerPool<ScoreJobData>(boss, QUEUE_NAMES.SCORING, 10, async (data) => {
    await processScoreJob(data)
  })

  await registerWorkerPool<WebsiteGenJobData>(boss, QUEUE_NAMES.WEBSITE_GEN, 3, async (data) => {
    console.log(`[WebsiteGenWorker] Processing business ${data.businessId}`)
    await processWebsiteGenJob(data)
    console.log(`[WebsiteGenWorker] Completed business ${data.businessId}`)
  })

  if (isEmailEnabled()) {
    await registerWorkerPool<EmailJobData>(boss, QUEUE_NAMES.EMAIL, 2, async (data) => {
      try {
        await processEmailJob(data)
        console.log(`[EmailWorker] Completed ${data.type} for ${data.businessId}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        await handleEmailFailure(data.businessId, msg)
        throw err
      }
    })
    console.log('[EmailWorker] Started — concurrency 2')
  } else {
    console.log('[EmailWorker] Skipped — EMAIL_ENABLED=false')
  }

  console.log('[ParseWorker] Started — concurrency 2')
  console.log('[ScoreWorker] Started — concurrency 10')
  console.log('[WebsiteGenWorker] Started — concurrency 3')
  console.log('[Workers] All job workers registered (pg-boss / Postgres)')
}
