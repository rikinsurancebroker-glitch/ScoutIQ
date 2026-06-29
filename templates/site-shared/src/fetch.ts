import type { SiteContent } from './types'

export async function fetchSiteContent(businessId: string): Promise<SiteContent | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const res = await fetch(`${apiUrl}/sites/${businessId}/content`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) return null
  return res.json() as Promise<SiteContent>
}
