import { fetchSiteContent, ExpiredPage, UnavailablePage } from '@scoutiq/site-shared'
import { getRestaurantColors } from '@/lib/theme'
import { RestaurantNavbar } from './RestaurantNavbar'
import { RestaurantHero } from './RestaurantHero'
import { RestaurantMarquee } from './RestaurantMarquee'
import { MenuShowcase } from './MenuShowcase'
import { StorySection } from './StorySection'
import { GallerySection } from './GallerySection'
import { TestimonialsSection } from './TestimonialsSection'
import { ReservationCTA } from './ReservationCTA'
import { ContactSection } from './ContactSection'
import { RestaurantFooter } from './RestaurantFooter'

interface Props {
  businessId: string
}

export async function RestaurantSitePage({ businessId }: Props) {
  const result = await fetchSiteContent(businessId)

  if (result.status === 'unavailable') {
    return <UnavailablePage businessId={businessId} />
  }
  if (result.status === 'expired') {
    return <ExpiredPage />
  }

  const content = result.content
  const colors = getRestaurantColors(content)

  return (
    <div
      className="font-body antialiased"
      style={{ color: colors.text, background: colors.background }}
    >
      <RestaurantNavbar content={content} colors={colors} />
      <RestaurantHero content={content} colors={colors} />
      <RestaurantMarquee content={content} colors={colors} />
      <StorySection content={content} colors={colors} />
      <MenuShowcase content={content} colors={colors} />
      <GallerySection content={content} colors={colors} />
      <TestimonialsSection content={content} colors={colors} />
      <ReservationCTA content={content} colors={colors} />
      <ContactSection content={content} colors={colors} />
      <RestaurantFooter content={content} colors={colors} />
    </div>
  )
}
