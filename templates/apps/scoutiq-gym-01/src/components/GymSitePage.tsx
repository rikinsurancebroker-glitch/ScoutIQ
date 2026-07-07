import { fetchSiteContent, ExpiredPage } from '@scoutiq/site-shared'
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
  const content = await fetchSiteContent(businessId)

  if (!content) {
    return <ExpiredPage />
  }

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
