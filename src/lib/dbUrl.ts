/**
 * Prisma pool settings for Supabase direct connections.
 *
 * Local dev runs API + workers as separate processes, each with its own Prisma
 * pool. Dashboard routes fire many parallel counts; with connection_limit=5 a
 * single page load can exhaust the API pool (P2024) and crash the server if the
 * rejection is unhandled.
 */
export function buildPrismaDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL
  if (!raw) {
    throw new Error('DATABASE_URL is required')
  }

  const isWorker = process.argv.some((arg) => arg.includes('workerServer'))
  // Direct Supabase has a hard cap on concurrent sessions. dev:full runs API + workers +
  // two pg-boss pools — keep Prisma pools small so we don't hit ENOTFOUND/ETIMEDOUT blips.
  const connectionLimit = isWorker ? 3 : 5
  const poolTimeoutSec = 20

  let url = raw
    .replace(/([?&])connection_limit=\d+(&|$)/, '$1')
    .replace(/([?&])pool_timeout=\d+(&|$)/, '$1')
    .replace(/\?&/, '?')
    .replace(/[?&]$/, '')

  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}connection_limit=${connectionLimit}&pool_timeout=${poolTimeoutSec}`
}
