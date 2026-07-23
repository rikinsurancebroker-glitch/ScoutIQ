import PgBoss from 'pg-boss'

const QUEUE_CONFIG: PgBoss.Queue[] = [
  // Dead-letter queues must be created before any queue references them
  // (pg-boss enforces a foreign key from queue.dead_letter -> queue.name).
  { name: 'csv-parse-dead' },
  { name: 'csv-parse', retryLimit: 3, retryDelay: 1, retryBackoff: true, deadLetter: 'csv-parse-dead' },
  { name: 'scoring', retryLimit: 3, retryDelay: 2, retryBackoff: true },
  { name: 'website-gen', retryLimit: 3, retryDelay: 3, retryBackoff: true },
  { name: 'email', retryLimit: 3, retryDelay: 5, retryBackoff: true },
]

let boss: PgBoss | null = null

function getConnectionString(): string {
  // pg-boss needs a session-capable Postgres URL (not the transaction pooler on :6543).
  const url = process.env.PG_BOSS_URL ?? process.env.DIRECT_URL
  if (!url) {
    throw new Error('DATABASE_URL is required for the job queue')
  }
  // pg v8 treats sslmode=require as verify-full; Supabase's cert chain fails that check.
  // Prisma is fine with sslmode=require, but pg-boss (node-pg) needs libpq semantics.
  if (url.includes('sslmode=require') && !url.includes('uselibpqcompat=true')) {
    return url.replace('sslmode=require', 'uselibpqcompat=true&sslmode=require')
  }
  return url
}

async function ensureQueues(instance: PgBoss): Promise<void> {
  for (const queue of QUEUE_CONFIG) {
    const existing = await instance.getQueue(queue.name)
    if (existing) {
      await instance.updateQueue(queue.name, queue)
    } else {
      await instance.createQueue(queue.name, queue)
    }
  }
}

export async function getBoss(): Promise<PgBoss> {
  if (boss) return boss

  const instance = new PgBoss({
    connectionString: getConnectionString(),
    schema: 'pgboss',
    pollingIntervalSeconds: 2,
    application_name: 'scoutiq-jobs',
    // Supabase's session-mode pooler caps total clients at 15. The API and the
    // worker each run their own pg-boss instance (and local dev shares that same
    // budget with the deployed services), so keep each pool small — otherwise
    // they collectively exhaust the cap and pg-boss.start() throws EMAXCONNSESSION.
    max: process.env.NODE_ENV === 'development' ? 2 : 3,
  })

  instance.on('error', (err) => {
    console.error('[pg-boss] Error:', err.message)
  })

  await instance.start()
  await ensureQueues(instance)

  boss = instance
  console.log('[pg-boss] Job queue started (Postgres)')
  return boss
}

export async function stopBoss(): Promise<void> {
  if (!boss) return
  await boss.stop({ graceful: true, timeout: 30_000 })
  boss = null
}
