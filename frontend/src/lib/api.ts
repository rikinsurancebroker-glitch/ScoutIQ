import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
})

// ─── Types ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  provider: string
  createdAt: string
}

export type UploadStatus = 'PENDING' | 'PROCESSING' | 'SCORING' | 'DONE' | 'FAILED'

export interface Upload {
  id: string
  userId: string
  fileName: string
  storagePath: string
  totalRows: number
  processedRows: number
  status: UploadStatus
  createdAt: string
  _count?: { businesses: number }
}

export interface UploadStatusDetail {
  status: UploadStatus
  totalRows: number
  processedRows: number
  totalBusinesses: number
  scored: number
  opportunities: number
  generated: number
}

export type CrmStatus =
  | 'NOT_CONTACTED'
  | 'EMAIL_SENT'
  | 'REPLIED'
  | 'INTERESTED'
  | 'NEGOTIATING'
  | 'WON'
  | 'LOST'
  | 'SKIPPED'

export type SiteStatus = 'LIVE' | 'EXTENDED' | 'CLAIMED' | 'EXPIRED' | 'DELETED'
export type EmailStatus = 'PENDING' | 'SENT' | 'FAILED' | 'BOUNCED'

export interface PresenceScore {
  id: string
  total: number
  contactScore: number
  websiteScore: number
  googleScore: number
  socialScore: number
  reviewScore: number
  hoursScore: number
  geoScore: number
  flags: string[]
  opportunities: string[]
  scoredAt: string
}

export interface WebsiteGenSummary {
  siteUrl: string
  qrUrl: string
  status: SiteStatus
  expiresAt: string
  viewCount: number
}

export interface EmailLogSummary {
  status: EmailStatus
  sentAt: string | null
  openedAt: string | null
  openCount: number
  isTest?: boolean
}

export interface Business {
  id: string
  uploadId: string
  name: string
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  linkedin: string | null
  yelp: string | null
  youtube: string | null
  category: string | null
  reviewCount: number | null
  averageRating: number | null
  crmStatus: CrmStatus
  createdAt: string
  presenceScore: PresenceScore | null
  websiteGen: WebsiteGenSummary | null
  emailLog: EmailLogSummary | null
}

export interface BusinessDetail extends Business {
  websiteGen: (WebsiteGenSummary & {
    templateId: string
    templateUrl: string
    contentJson: unknown
    generatedAt: string
    expiresAt: string
    firstViewAt: string | null
    lastViewAt: string | null
  }) | null
  emailLog: (EmailLogSummary & {
    subject: string
    toEmail: string
    isTest?: boolean
  }) | null
  upload: { id: string; fileName: string; status: UploadStatus }
}

export interface PaginatedBusinesses {
  data: Business[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface DashboardStats {
  totalBusinesses: number
  scored: number
  opportunities: number
  emailsSent: number
  emailsOpened: number
  sitesClicked: number
  won: number
  avgScore: number
  noWebsite: number
  categoryBreakdown: { category: string; count: number }[]
}

export interface ExpiryStats {
  live: number
  extended: number
  claimed: number
  expired: number
  viewedNotClaimed: number
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  me: () => api.get<User>('/api/auth/me').then((r) => r.data),
  logout: () => api.post('/api/auth/logout').then((r) => r.data),
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

export const uploadsApi = {
  list: () => api.get<Upload[]>('/api/uploads').then((r) => r.data),

  create: (fileName: string) =>
    api
      .post<{ uploadId: string; signedUrl: string; token: string; storagePath: string }>(
        '/api/uploads',
        { fileName }
      )
      .then((r) => r.data),

  confirm: (uploadId: string) =>
    api.post(`/api/uploads/${uploadId}/confirm`).then((r) => r.data),

  status: (uploadId: string) =>
    api.get<UploadStatusDetail>(`/api/uploads/${uploadId}/status`).then((r) => r.data),

  delete: (uploadId: string) =>
    api.delete(`/api/uploads/${uploadId}`).then((r) => r.data),
}

// ─── Businesses ───────────────────────────────────────────────────────────────

export interface BusinessListParams {
  uploadId?: string
  category?: string
  crmStatus?: CrmStatus
  minScore?: number
  maxScore?: number
  sort?: 'score_asc' | 'score_desc' | 'created_desc'
  page?: number
  limit?: number
}

export const businessesApi = {
  list: (params: BusinessListParams) =>
    api.get<PaginatedBusinesses>('/api/businesses', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<BusinessDetail>(`/api/businesses/${id}`).then((r) => r.data),

  updateCrm: (id: string, crmStatus: CrmStatus) =>
    api.patch<Business>(`/api/businesses/${id}`, { crmStatus }).then((r) => r.data),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: (uploadId?: string) =>
    api.get<DashboardStats>('/api/dashboard', { params: uploadId ? { uploadId } : {} }).then((r) => r.data),

  expiryStats: () =>
    api.get<ExpiryStats>('/api/dashboard/expiry-stats').then((r) => r.data),
}

// ─── Outreach / Admin ─────────────────────────────────────────────────────────

export interface OutreachBusiness {
  id: string
  name: string
  email: string | null
  category: string | null
  address: string | null
  crmStatus: CrmStatus
  presenceScore: { total: number } | null
  websiteGen: { siteUrl: string; status: SiteStatus; expiresAt: string } | null
  emailLog: { status: EmailStatus; sentAt: string | null; openedAt: string | null; openCount: number } | null
}

export const adminApi = {
  outreachReady: () =>
    api.get<OutreachBusiness[]>('/api/admin/outreach-ready').then((r) => r.data),

  scheduleEmails: (businessIds: string[], scheduledFor?: string, testEmail?: string) =>
    api
      .post<{ scheduled: number; scheduledFor: string; message: string }>(
        '/api/admin/schedule-emails',
        { businessIds, scheduledFor, testEmail }
      )
      .then((r) => r.data),

  backfillWebsites: (threshold = 60) =>
    api
      .post<{ enqueued: number; total: number }>(`/api/admin/backfill-websites?threshold=${threshold}`)
      .then((r) => r.data),

  previewEmail: (businessId: string) =>
    api
      .get<EmailPreview>(`/api/admin/preview-email/${businessId}`)
      .then((r) => r.data),

  renderEmail: (
    businessId: string,
    content: { subject: string; bodyHtml: string; ctaText: string }
  ) =>
    api
      .post<{ html: string }>(`/api/admin/preview-email/${businessId}/render`, content)
      .then((r) => r.data),

  sendTestEmail: (
    businessId: string,
    payload: { to: string; subject: string; bodyHtml: string; ctaText: string }
  ) =>
    api
      .post<{ sent: boolean; to: string; messageId: string }>(
        `/api/admin/send-test-email/${businessId}`,
        payload
      )
      .then((r) => r.data),

  websites: () =>
    api.get<GeneratedSite[]>('/api/admin/websites').then((r) => r.data),
}

export interface GeneratedSite {
  siteUrl: string
  qrUrl: string
  status: SiteStatus
  templateId: string
  templateUrl: string
  expiresAt: string
  viewCount: number
  generatedAt: string
  business: {
    id: string
    name: string
    category: string | null
    presenceScore: { total: number } | null
  }
}

export interface EmailPreview {
  subject: string
  html: string
  bodyHtml: string | null
  ctaText: string | null
  defaultEmail: string | null
  businessName: string
  cached: boolean
}
