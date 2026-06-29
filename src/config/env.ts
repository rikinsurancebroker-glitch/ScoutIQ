import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY is required'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  API_URL: z.string().url('API_URL must be a valid URL'),
  EMAIL_ENABLED: z.enum(['true', 'false']).default('false'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  PORT: z.string().default('4000'),
  SCORE_THRESHOLD: z.string().default('50'),
  SITE_EXPIRY_DAYS: z.string().default('7'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  USE_LOCAL_TEMPLATES: z.enum(['true', 'false']).optional(),
})

const parsed = envSchema.safeParse(process.env)

const emailEnabled = parsed.success && parsed.data.EMAIL_ENABLED === 'true'
if (emailEnabled) {
  const missing: string[] = []
  const d = parsed.data!
  if (!d.SMTP_HOST) missing.push('SMTP_HOST')
  if (!d.SMTP_PORT || !/^\d+$/.test(d.SMTP_PORT)) missing.push('SMTP_PORT')
  if (!d.SMTP_USER) missing.push('SMTP_USER')
  if (!d.SMTP_PASS) missing.push('SMTP_PASS')
  if (!d.SMTP_FROM) missing.push('SMTP_FROM')
  if (missing.length > 0) {
    console.error('[Config] EMAIL_ENABLED=true but missing SMTP configuration:')
    missing.forEach((key) => console.error(`  - ${key}`))
    process.exit(1)
  }
}

if (!parsed.success) {
  console.error('[Config] Missing or invalid environment variables:')
  parsed.error.errors.forEach((err) => {
    console.error(`  - ${err.path.join('.')}: ${err.message}`)
  })
  process.exit(1)
}

export const env = parsed.data

export type Env = typeof env
