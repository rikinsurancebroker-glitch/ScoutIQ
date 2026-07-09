import 'dotenv/config'
import '../config/env'
import http from 'http'
import { registerWorkers } from './registerWorkers'
import { stopBoss } from '../lib/jobQueue'

// Render Web Service requires an open port — this satisfies that check
// while the actual worker logic runs via registerWorkers().
// Use a dedicated WORKER_PORT so it never collides with the API's PORT
// when both run together (e.g. `npm run dev:full`).
const PORT = parseInt(process.env.WORKER_PORT ?? '4001')
const server = http.createServer((_req, res) => {
  res.writeHead(200)
  res.end('workers ok')
})
server.listen(PORT, () => {
  console.log(`[Workers] Health server listening on port ${PORT}`)
})

registerWorkers().catch((err) => {
  console.error('[Workers] Failed to start:', err)
  process.exit(1)
})

process.on('SIGTERM', async () => {
  console.log('[Workers] Shutting down gracefully...')
  server.close()
  await stopBoss()
  process.exit(0)
})

process.on('uncaughtException', (err) => {
  console.error('[Workers] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('[Workers] Unhandled rejection:', reason)
})

