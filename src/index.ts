import 'dotenv/config'
import './config/env'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import authRoutes from './routes/auth'
import uploadRoutes from './routes/uploads'
import businessRoutes from './routes/businesses'
import dashboardRoutes from './routes/dashboard'
import siteRoutes from './routes/sites'
import trackingRoutes from './routes/tracking'
import adminRoutes from './routes/admin'
import { errorHandler } from './middleware/errorHandler'
import { startExpiryCleanup } from './jobs/expiryCleanup'
import { startReminderJob } from './jobs/reminderEmails'
import { stopBoss } from './lib/jobQueue'

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

import { PRODUCTION_URLS } from './config/templates'

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...Object.values(PRODUCTION_URLS),
].filter(Boolean).map((o) => o!.replace(/\/$/, ''))

function isAllowedPreviewOrigin(origin: string): boolean {
  const normalized = origin.replace(/\/$/, '')
  if (allowedOrigins.includes(normalized)) return true
  // Vercel preview deployments for template apps (scoutiq-gym-01.vercel.app, etc.)
  return /^https:\/\/scoutiq-[a-z0-9-]+\.vercel\.app$/i.test(normalized)
}

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true)
      if (isAllowedPreviewOrigin(origin.replace(/\/$/, ''))) {
        return callback(null, true)
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/businesses', businessRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)
app.use('/', trackingRoutes)
app.use('/', siteRoutes)

app.use(errorHandler)

const PORT = parseInt(process.env.PORT ?? '4000')

const server = app.listen(PORT, () => {
  console.log(`The Human Collective API running on port ${PORT}`)
  startExpiryCleanup()
  startReminderJob()
})

// Release the pg-boss connection pool on shutdown/restart. Without this, every
// nodemon restart or Render redeploy leaks session-mode connections against
// Supabase's 15-client cap until they time out.
let shuttingDown = false
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[API] ${signal} received — shutting down gracefully...`)
  server.close()
  await stopBoss()
  process.exit(0)
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))

export default app
