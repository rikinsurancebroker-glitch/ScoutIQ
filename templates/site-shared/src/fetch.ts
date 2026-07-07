import type { SiteContent } from './types'

export async function fetchSiteContent(businessId: string): Promise<SiteContent | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

  try {
    const res = await fetch(`${apiUrl}/sites/${businessId}/content`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null
    return (await res.json()) as SiteContent
  } catch {
    // Backend unreachable (local dev without API, network hiccup) —
    // render the expired/unavailable page instead of crashing with a 500.
    return null
  }
}
