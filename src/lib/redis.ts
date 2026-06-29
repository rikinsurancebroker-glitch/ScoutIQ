import IORedis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis?: IORedis }

export const redis =
  globalForRedis.redis ??
  new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message)
})

redis.on('connect', () => {
  console.log('[Redis] Connected')
})

/**
 * BullMQ bundles its own ioredis internally. Passing a Redis instance from the
 * outer ioredis package causes a type conflict because both packages ship their
 * own copy of the class. Instead, BullMQ should receive plain connection options
 * (URL string + flags), which it uses to create its own internal client.
 */
export function getBullMQConnection() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  return {
    url,
    maxRetriesPerRequest: null as null,
    enableReadyCheck: false,
  }
}
