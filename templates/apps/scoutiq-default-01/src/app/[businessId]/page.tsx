import { SitePage } from '@scoutiq/site-shared'
import { default01 } from '@scoutiq/site-shared/themes'

interface Props {
  params: { businessId: string }
}

export default function Page({ params }: Props) {
  return <SitePage businessId={params.businessId} theme={default01} />
}
