import nodemailer from 'nodemailer'

export function isEmailEnabled(): boolean {
  return process.env.EMAIL_ENABLED === 'true'
}

export function createTransporter() {
  if (!isEmailEnabled()) {
    throw new Error('Email is disabled — set EMAIL_ENABLED=true and configure SMTP_* to send mail')
  }

  const port = parseInt(process.env.SMTP_PORT ?? '587')

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 uses implicit TLS; 587/50587 use STARTTLS (secure=false, upgraded via requireTLS).
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}
