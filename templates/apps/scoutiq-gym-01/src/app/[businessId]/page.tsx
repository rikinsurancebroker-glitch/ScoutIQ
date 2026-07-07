import { GymSitePage } from '@/components/GymSitePage'

interface Props {
  params: { businessId: string }
}

export default function Page({ params }: Props) {
  return <GymSitePage businessId={params.businessId} />
}
