import 'dotenv/config'
import '../config/env'
import './workers/parseWorker'
import './workers/scoreWorker'
import './workers/websiteGenWorker'
import './workers/emailWorker'

console.log('[Workers] All 4 workers started')

process.on('SIGTERM', async () => {
  console.log('[Workers] Shutting down gracefully...')
  process.exit(0)
})

process.on('uncaughtException', (err) => {
  console.error('[Workers] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('[Workers] Unhandled rejection:', reason)
})
