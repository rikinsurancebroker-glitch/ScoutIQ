import { RestaurantSitePage } from '@/components/RestaurantSitePage'

interface Props {
  params: { businessId: string }
}

export default function Page({ params }: Props) {
  return <RestaurantSitePage businessId={params.businessId} />
}
