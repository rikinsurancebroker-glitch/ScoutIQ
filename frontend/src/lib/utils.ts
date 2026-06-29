import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CrmStatus, SiteStatus, EmailStatus } from './api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

export function scoreBg(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-700'
  if (score >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export function scoreBarColor(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

export const CRM_LABELS: Record<CrmStatus, string> = {
  NOT_CONTACTED: 'Not contacted',
  EMAIL_SENT: 'Email sent',
  REPLIED: 'Replied',
  INTERESTED: 'Interested',
  NEGOTIATING: 'Negotiating',
  WON: 'Won',
  LOST: 'Lost',
  SKIPPED: 'Skipped',
}

export const CRM_COLORS: Record<CrmStatus, string> = {
  NOT_CONTACTED: 'bg-slate-100 text-slate-600',
  EMAIL_SENT: 'bg-blue-100 text-blue-700',
  REPLIED: 'bg-indigo-100 text-indigo-700',
  INTERESTED: 'bg-purple-100 text-purple-700',
  NEGOTIATING: 'bg-amber-100 text-amber-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
  SKIPPED: 'bg-slate-100 text-slate-400',
}

export const SITE_STATUS_LABELS: Record<SiteStatus, string> = {
  LIVE: 'Live',
  EXTENDED: 'Extended',
  CLAIMED: 'Claimed',
  EXPIRED: 'Expired',
  DELETED: 'Deleted',
}

export const SITE_STATUS_COLORS: Record<SiteStatus, string> = {
  LIVE: 'bg-green-100 text-green-700',
  EXTENDED: 'bg-blue-100 text-blue-700',
  CLAIMED: 'bg-purple-100 text-purple-700',
  EXPIRED: 'bg-slate-100 text-slate-500',
  DELETED: 'bg-red-100 text-red-600',
}

export const EMAIL_STATUS_COLORS: Record<EmailStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  SENT: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  BOUNCED: 'bg-orange-100 text-orange-700',
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString()
}
