'use client'

import { useEffect } from 'react'
import { PRODUCTION_API_URL } from '../fetch'

interface Props {
  businessId: string
}

function clientContentUrl(businessId: string): string {
  if (typeof window === 'undefined') {
    return `${PRODUCTION_API_URL}/sites/${businessId}/content`
  }
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    return `${api}/sites/${businessId}/content`
  }
  // Same-origin proxy on Vercel — no CORS, works even before Render CORS is updated.
  return `/api/site-content/${businessId}`
}

/**
 * Shown when SSR could not load preview content (API cold-start, cached miss, etc.).
 * Retries from the browser — which bypasses Vercel's SSR cache — then reloads once
 * content is reachable so the server can render the full page.
 */
export function UnavailablePage({ businessId }: Props) {
  useEffect(() => {
    let cancelled = false

    async function tryLoad(): Promise<void> {
      try {
        const res = await fetch(clientContentUrl(businessId), {
          cache: 'no-store',
        })
        if (!cancelled && res.ok) {
          window.location.reload()
        }
      } catch {
        // API still waking — Unavailable UI stays visible; meta refresh also retries SSR.
      }
    }

    void tryLoad()
    const interval = setInterval(() => void tryLoad(), 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [businessId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <meta httpEquiv="refresh" content="8" />
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">☕</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Just a moment…</h1>
        <p className="text-slate-400">
          We&apos;re loading this preview. This can take a few seconds the first time — the page
          will refresh automatically.
        </p>
      </div>
    </div>
  )
}
