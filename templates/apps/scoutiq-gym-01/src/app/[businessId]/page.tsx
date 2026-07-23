import { GymSitePage } from '@/components/GymSitePage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { businessId: string }
}

export default function Page({ params }: Props) {
  return <GymSitePage businessId={params.businessId} />
}
