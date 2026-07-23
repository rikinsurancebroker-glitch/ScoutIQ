import { fetchSiteContent, ExpiredPage, UnavailablePage } from '@scoutiq/site-shared'
import { getGymColors } from '@/lib/theme'
import { GymNavbar } from './GymNavbar'
import { GymHero } from './GymHero'
import { ProgramsSection } from './ProgramsSection'
import { ShapeSection } from './ShapeSection'
import { ScheduleSection } from './ScheduleSection'
import { TrainersSection } from './TrainersSection'
import { PricingSection } from './PricingSection'
import { GymContact } from './GymContact'
import { GymFooter } from './GymFooter'

interface Props {
  businessId: string
}

export async function GymSitePage({ businessId }: Props) {
  const result = await fetchSiteContent(businessId)

  if (result.status === 'unavailable') {
    return <UnavailablePage businessId={businessId} />
  }
  if (result.status === 'expired') {
    return <ExpiredPage />
  }

  const content = result.content
  const colors = getGymColors(content)

  return (
    <div className="font-body antialiased" style={{ color: colors.text, background: colors.background }}>
      <GymNavbar content={content} colors={colors} />
      <GymHero content={content} colors={colors} />
      <ProgramsSection content={content} colors={colors} />
      <ShapeSection content={content} colors={colors} />
      <ScheduleSection content={content} colors={colors} />
      <TrainersSection content={content} colors={colors} />
      <PricingSection content={content} colors={colors} />
      <GymContact content={content} colors={colors} />
      <GymFooter content={content} colors={colors} />
    </div>
  )
}
