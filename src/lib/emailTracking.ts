import { env } from '../config/env'

/** Standard 1×1 transparent GIF — returned by the open-tracking pixel route. */
export const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export function buildEmailOpenTrackingUrl(businessId: string): string {
  return `${env.API_URL.replace(/\/$/, '')}/t/email/${businessId}/open.gif`
}

/** Records a site view via /s/:businessId before redirecting to the Vercel preview. */
export function buildSiteClickTrackingUrl(businessId: string): string {
  return `${env.API_URL.replace(/\/$/, '')}/s/${businessId}`
}
