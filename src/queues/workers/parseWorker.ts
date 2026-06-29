import { Worker, Job } from 'bullmq'
import Papa from 'papaparse'
import { getBullMQConnection } from '../../lib/redis'
import { prisma } from '../../lib/prisma'
import { supabase } from '../../lib/supabase'
import { scoringQueue } from '../queues'
import type { ParseJobData, ScoreJobData } from '../queues'

const COLUMN_ALIASES: Record<string, string> = {
  name: 'name',
  'business name': 'name',
  company: 'name',
  business: 'name',
  phone: 'phone',
  'phone number': 'phone',
  tel: 'phone',
  telephone: 'phone',
  mobile: 'phone',
  email: 'email',
  'email address': 'email',
  'e-mail': 'email',
  website: 'website',
  web: 'website',
  url: 'website',
  site: 'website',
  'website url': 'website',
  address: 'address',
  'full address': 'address',
  'street address': 'address',
  location: 'address',
  instagram: 'instagram',
  ig: 'instagram',
  'instagram url': 'instagram',
  facebook: 'facebook',
  fb: 'facebook',
  'facebook url': 'facebook',
  twitter: 'twitter',
  x: 'twitter',
  'twitter url': 'twitter',
  linkedin: 'linkedin',
  'linkedin url': 'linkedin',
  yelp: 'yelp',
  'yelp url': 'yelp',
  youtube: 'youtube',
  yt: 'youtube',
  'youtube url': 'youtube',
  placeid: 'placeId',
  place_id: 'placeId',
  'place id': 'placeId',
  cid: 'cid',
  category: 'category',
  type: 'category',
  industry: 'category',
  'business type': 'category',
  reviewcount: 'reviewCount',
  review_count: 'reviewCount',
  reviews: 'reviewCount',
  'review count': 'reviewCount',
  'number of reviews': 'reviewCount',
  averagerating: 'averageRating',
  average_rating: 'averageRating',
  rating: 'averageRating',
  'average rating': 'averageRating',
  'google rating': 'averageRating',
  latitude: 'latitude',
  lat: 'latitude',
  longitude: 'longitude',
  lng: 'longitude',
  lon: 'longitude',
  long: 'longitude',
  '1_monday': 'hoursMonday',
  monday: 'hoursMonday',
  mon: 'hoursMonday',
  '2_tuesday': 'hoursTuesday',
  tuesday: 'hoursTuesday',
  tue: 'hoursTuesday',
  '3_wednesday': 'hoursWednesday',
  wednesday: 'hoursWednesday',
  wed: 'hoursWednesday',
  '4_thursday': 'hoursThursday',
  thursday: 'hoursThursday',
  thu: 'hoursThursday',
  '5_friday': 'hoursFriday',
  friday: 'hoursFriday',
  fri: 'hoursFriday',
  '6_saturday': 'hoursSaturday',
  saturday: 'hoursSaturday',
  sat: 'hoursSaturday',
  '7_sunday': 'hoursSunday',
  sunday: 'hoursSunday',
  sun: 'hoursSunday',
}

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^\uFEFF/, '')
}

interface MappedRow {
  name: string
  phone?: string
  email?: string
  website?: string
  address?: string
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  yelp?: string
  youtube?: string
  placeId?: string
  cid?: string
  category?: string
  reviewCount?: number
  averageRating?: number
  latitude?: number
  longitude?: number
  hoursMonday?: string
  hoursTuesday?: string
  hoursWednesday?: string
  hoursThursday?: string
  hoursFriday?: string
  hoursSaturday?: string
  hoursSunday?: string
}

function mapRow(raw: Record<string, string>): MappedRow | null {
  const mapped: Record<string, unknown> = {}

  for (const [rawKey, rawValue] of Object.entries(raw)) {
    const normalizedKey = normalizeKey(rawKey)
    const fieldName = COLUMN_ALIASES[normalizedKey]
    if (!fieldName || rawValue === undefined || rawValue === null) continue

    const value = String(rawValue).trim()

    if (fieldName === 'reviewCount') {
      mapped[fieldName] = parseInt(value) || 0
    } else if (fieldName === 'averageRating') {
      mapped[fieldName] = parseFloat(value) || 0
    } else if (fieldName === 'latitude' || fieldName === 'longitude') {
      mapped[fieldName] = parseFloat(value) || 0
    } else {
      mapped[fieldName] = value
    }
  }

  if (!mapped['name'] || (mapped['name'] as string).trim() === '') {
    return null
  }

  return mapped as unknown as MappedRow
}

async function processParseJob(job: Job<ParseJobData>): Promise<void> {
  const { uploadId, storagePath } = job.data
  const startedAt = new Date()

  await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'PROCESSING' },
  })

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('csv-uploads')
    .createSignedUrl(storagePath, 3600)

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${signedUrlError?.message ?? 'unknown error'}`)
  }

  const response = await fetch(signedUrlData.signedUrl)
  if (!response.ok) {
    throw new Error(`Failed to download CSV: HTTP ${response.status}`)
  }
  const csvText = await response.text()

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header,
  })

  const rows = parsed.data
  const mappedRows: MappedRow[] = []

  for (const row of rows) {
    const mapped = mapRow(row)
    if (mapped) {
      mappedRows.push(mapped)
    }
  }

  await prisma.upload.update({
    where: { id: uploadId },
    data: { totalRows: mappedRows.length },
  })

  const CHUNK_SIZE = 50
  const insertedIds: string[] = []

  for (let i = 0; i < mappedRows.length; i += CHUNK_SIZE) {
    const chunk = mappedRows.slice(i, i + CHUNK_SIZE)

    const chunkWithUploadId = chunk.map((row) => ({
      uploadId,
      name: row.name,
      phone: row.phone ?? null,
      email: row.email ?? null,
      website: row.website ?? null,
      address: row.address ?? null,
      instagram: row.instagram ?? null,
      facebook: row.facebook ?? null,
      twitter: row.twitter ?? null,
      linkedin: row.linkedin ?? null,
      yelp: row.yelp ?? null,
      youtube: row.youtube ?? null,
      placeId: row.placeId ?? null,
      cid: row.cid ?? null,
      category: row.category ?? null,
      reviewCount: row.reviewCount ?? null,
      averageRating: row.averageRating ?? null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      hoursMonday: row.hoursMonday ?? null,
      hoursTuesday: row.hoursTuesday ?? null,
      hoursWednesday: row.hoursWednesday ?? null,
      hoursThursday: row.hoursThursday ?? null,
      hoursFriday: row.hoursFriday ?? null,
      hoursSaturday: row.hoursSaturday ?? null,
      hoursSunday: row.hoursSunday ?? null,
    }))

    await prisma.business.createMany({
      data: chunkWithUploadId,
      skipDuplicates: true,
    })

    await prisma.upload.update({
      where: { id: uploadId },
      data: { processedRows: { increment: chunk.length } },
    })
  }

  const businesses = await prisma.business.findMany({
    where: { uploadId },
    select: { id: true },
  })

  const scoreJobs = businesses.map((b) => ({
    name: `score-${b.id}`,
    data: { businessId: b.id, uploadId } satisfies ScoreJobData,
    opts: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  }))

  if (scoreJobs.length > 0) {
    await scoringQueue.addBulk(scoreJobs)
  }

  await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'SCORING' },
  })

  await prisma.jobLog.create({
    data: {
      uploadId,
      jobType: 'csv-parse',
      status: 'completed',
      startedAt,
      finishedAt: new Date(),
    },
  })
}

const parseWorker = new Worker<ParseJobData>('csv-parse', processParseJob, {
  connection: getBullMQConnection(),
  concurrency: 2,
})

parseWorker.on('failed', async (job, err) => {
  if (!job) return
  console.error(`[ParseWorker] Job ${job.id} failed permanently:`, err.message)

  const { uploadId } = job.data
  await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'FAILED' },
  })

  await prisma.jobLog.create({
    data: {
      uploadId,
      jobType: 'csv-parse',
      status: 'failed',
      errorMsg: err.message,
    },
  })
})

parseWorker.on('completed', (job) => {
  console.log(`[ParseWorker] Job ${job.id} completed`)
})

console.log('[ParseWorker] Started — concurrency 2')

export default parseWorker
