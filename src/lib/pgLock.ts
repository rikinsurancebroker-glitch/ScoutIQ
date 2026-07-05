import { prisma } from './prisma'

/** Postgres advisory lock — replaces Redis for cron deduplication. */
export async function tryAdvisoryLock(lockId: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ locked: boolean }[]>`
    SELECT pg_try_advisory_lock(${lockId}) AS locked
  `
  return rows[0]?.locked ?? false
}

export async function releaseAdvisoryLock(lockId: number): Promise<void> {
  await prisma.$queryRaw`SELECT pg_advisory_unlock(${lockId})`
}
