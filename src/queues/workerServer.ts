import 'dotenv/config'
import '../config/env'
import { registerWorkers } from './registerWorkers'
import { stopBoss } from '../lib/jobQueue'

registerWorkers().catch((err) => {
  console.error('[Workers] Failed to start:', err)
  process.exit(1)
})

process.on('SIGTERM', async () => {
  console.log('[Workers] Shutting down gracefully...')
  await stopBoss()
  process.exit(0)
})

process.on('uncaughtException', (err) => {
  console.error('[Workers] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('[Workers] Unhandled rejection:', reason)
})
