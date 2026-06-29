import nodemailer from 'nodemailer'

export function isEmailEnabled(): boolean {
  return process.env.EMAIL_ENABLED === 'true'
}

export function createTransporter() {
  if (!isEmailEnabled()) {
    throw new Error('Email is disabled — set EMAIL_ENABLED=true and configure SMTP_* to send mail')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}
