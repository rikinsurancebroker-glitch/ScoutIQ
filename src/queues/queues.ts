import { getBoss } from '../lib/jobQueue'

export const QUEUE_NAMES = {
  CSV_PARSE: 'csv-parse',
  SCORING: 'scoring',
  WEBSITE_GEN: 'website-gen',
  EMAIL: 'email',
} as const

export interface ParseJobData {
  uploadId: string
  userId: string
  storagePath: string
}

export interface ScoreJobData {
  businessId: string
  uploadId: string
}

export interface WebsiteGenJobData {
  businessId: string
}

export interface EmailJobData {
  businessId: string
  type: 'EMAIL' | 'REMINDER'
}

const SEND_OPTS = {
  parse: { retryLimit: 3, retryDelay: 1, retryBackoff: true },
  score: { retryLimit: 3, retryDelay: 2, retryBackoff: true },
  website: { retryLimit: 3, retryDelay: 3, retryBackoff: true },
  email: { retryLimit: 3, retryDelay: 5, retryBackoff: true },
} as const

export async function enqueueCsvParse(data: ParseJobData): Promise<void> {
  const boss = await getBoss()
  await boss.send(QUEUE_NAMES.CSV_PARSE, data, {
    ...SEND_OPTS.parse,
    singletonKey: `parse-${data.uploadId}`,
  })
}

export async function enqueueScoringJobs(jobs: ScoreJobData[]): Promise<void> {
  if (!jobs.length) return
  const boss = await getBoss()
  await boss.insert(
    jobs.map((data) => ({
      name: QUEUE_NAMES.SCORING,
      data,
      singletonKey: data.businessId,
      ...SEND_OPTS.score,
    }))
  )
}

export async function enqueueWebsiteGen(data: WebsiteGenJobData): Promise<void> {
  const boss = await getBoss()
  await boss.send(QUEUE_NAMES.WEBSITE_GEN, data, {
    ...SEND_OPTS.website,
    singletonKey: data.businessId,
  })
}

export async function enqueueEmail(data: EmailJobData): Promise<void> {
  const boss = await getBoss()
  await boss.send(QUEUE_NAMES.EMAIL, data, {
    ...SEND_OPTS.email,
    singletonKey: `${data.type}-${data.businessId}`,
  })
}

export async function enqueueEmailBulk(jobs: EmailJobData[]): Promise<void> {
  if (!jobs.length) return
  const boss = await getBoss()
  await boss.insert(
    jobs.map((data, i) => ({
      name: QUEUE_NAMES.EMAIL,
      data,
      singletonKey: `${data.type}-${data.businessId}-${i}`,
      ...SEND_OPTS.email,
    }))
  )
}
