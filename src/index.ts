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
import { errorHandler } from './middleware/errorHandler'
import { startExpiryCleanup } from './jobs/expiryCleanup'
import { startReminderJob } from './jobs/reminderEmails'

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
app.use('/', siteRoutes)

app.use(errorHandler)

const PORT = parseInt(process.env.PORT ?? '4000')

app.listen(PORT, () => {
  console.log(`ScoutIQ API running on port ${PORT}`)
  startExpiryCleanup()
  startReminderJob()
})

export default app
