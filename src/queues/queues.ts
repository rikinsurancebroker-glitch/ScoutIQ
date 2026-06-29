import { Queue } from 'bullmq'
import { getBullMQConnection } from '../lib/redis'

const connection = getBullMQConnection()

export const csvParseQueue = new Queue('csv-parse', { connection })

export const scoringQueue = new Queue('scoring', { connection })

export const websiteGenQueue = new Queue('website-gen', { connection })

export const emailQueue = new Queue('email', { connection })

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
