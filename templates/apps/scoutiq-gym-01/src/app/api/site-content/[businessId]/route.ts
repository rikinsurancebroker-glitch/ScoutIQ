import { PRODUCTION_API_URL } from '@scoutiq/site-shared'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { businessId: string } }
): Promise<Response> {
  const res = await fetch(`${PRODUCTION_API_URL}/sites/${params.businessId}/content`, {
    cache: 'no-store',
  })
  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
