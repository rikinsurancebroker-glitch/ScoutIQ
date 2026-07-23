import type { SiteContent } from './types'

export type SiteContentResult =
  | { status: 'ok'; content: SiteContent }
  | { status: 'expired' }
  | { status: 'unavailable' }

const MAX_ATTEMPTS = 3
const ATTEMPT_TIMEOUT_MS = 15_000
const RETRY_BASE_DELAY_MS = 1_500

/** Production ScoutIQ API — must match backend `API_URL` on Render. */
export const PRODUCTION_API_URL = 'https://scoutiq-api.onrender.com'

/**
 * Resolves the API base URL for template fetches.
 *
 * Vercel deployments often ship without `NEXT_PUBLIC_API_URL`, or with it set to
 * the template's own `.vercel.app` URL. Both cases hit `/sites/.../content` on
 * the wrong host (404 HTML) and incorrectly show "Preview Expired".
 */
export function resolveApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')

  if (process.env.NODE_ENV === 'production') {
    if (!configured || /localhost|127\.0\.0\.1/.test(configured)) {
      return PRODUCTION_API_URL
    }
    // Template app URL was set instead of the API host.
    if (configured.includes('.vercel.app') && !configured.includes('scoutiq-api')) {
      return PRODUCTION_API_URL
    }
    return configured
  }

  return configured ?? 'http://localhost:4000'
}

/**
 * Fetches a preview's content from the API.
 *
 * Returns a tri-state so the UI can distinguish a genuinely expired preview
 * (API responds 404 JSON `{ error: 'expired' }`) from a backend that's merely
 * unreachable/cold-starting (network error, timeout, or 5xx). The latter is
 * retried a few times — Render free instances can take 15s+ to wake — and, if
 * still unresolved, reported as `unavailable` rather than `expired`, so a
 * sleeping backend doesn't make a live preview look dead.
 */
export async function fetchSiteContent(businessId: string): Promise<SiteContentResult> {
  const apiUrl = resolveApiUrl()

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${apiUrl}/sites/${businessId}/content`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      })

      if (res.ok) {
        return { status: 'ok', content: (await res.json()) as SiteContent }
      }

      // Only the ScoutIQ API returns JSON `{ error: 'expired' }` for real expiry.
      // A 404 HTML page (wrong host / misconfigured NEXT_PUBLIC_API_URL) is not expiry.
      if (res.status === 404) {
        try {
          const body = (await res.json()) as { error?: string }
          if (body.error === 'expired') {
            return { status: 'expired' }
          }
        } catch {
          // Non-JSON 404 — fall through to retry as transient misconfiguration.
        }
      }
      // Any other status (5xx, 502/503 from a cold-starting backend) is transient.
    } catch {
      // Network error or timeout (backend likely cold-starting) — fall through to retry.
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt))
    }
  }

  return { status: 'unavailable' }
}
