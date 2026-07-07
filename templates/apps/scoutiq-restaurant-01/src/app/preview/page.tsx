import type { SiteContent } from '@scoutiq/site-shared'
import { getRestaurantColors } from '@/lib/theme'
import { RestaurantNavbar } from '@/components/RestaurantNavbar'
import { RestaurantHero } from '@/components/RestaurantHero'
import { RestaurantMarquee } from '@/components/RestaurantMarquee'
import { MenuShowcase } from '@/components/MenuShowcase'
import { StorySection } from '@/components/StorySection'
import { GallerySection } from '@/components/GallerySection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { ReservationCTA } from '@/components/ReservationCTA'
import { ContactSection } from '@/components/ContactSection'
import { RestaurantFooter } from '@/components/RestaurantFooter'

// Mock content for local design iteration — does NOT hit the backend.
const MOCK: SiteContent = {
  businessName: 'Osteria Lumière',
  tagline: 'Modern Italian · Wood-Fired Kitchen',
  category: 'Fine Dining',
  description:
    'A candlelit corner of the city where seasonal Italian cooking meets an ever-changing cellar of natural wines. Every plate is fire-kissed, every guest a regular in the making.',
  colors: {
    primary: '#F4A261',
    secondary: '#E76F51',
    accent: '#F4A261',
    background: '#0D1B2A',
  },
  hero: {
    headline: 'Where Fire Meets Flavour',
    subheadline:
      'Handmade pasta, wood-fired mains, and a cellar worth lingering over — served in a room built for slow evenings.',
    ctaText: 'Reserve a Table',
    ctaSecondary: 'View the Menu',
  },
  services: [
    { icon: '🍝', title: 'Handmade Pasta', description: 'Rolled fresh each morning, sauced to order with seasonal produce.' },
    { icon: '🔥', title: 'Wood-Fired Grill', description: 'Dry-aged cuts and market fish over glowing oak embers.' },
    { icon: '🍷', title: 'Natural Wine Cellar', description: 'Over 200 low-intervention bottles from small European growers.' },
    { icon: '🧀', title: 'Artisan Antipasti', description: 'House-cured meats and imported cheeses on a rotating board.' },
    { icon: '🍰', title: 'Dessert Trolley', description: 'Tableside tiramisu and a nightly rotation of pastry-chef specials.' },
    { icon: '🌿', title: 'Seasonal Tasting', description: 'A seven-course journey through the best of the week\'s market.' },
  ],
  about: {
    headline: 'A Kitchen With a Point of View',
    body:
      'Founded by chef Marco Rossi, Osteria Lumière blends the rustic soul of Emilia-Romagna with a restless, modern curiosity. We source within 100 miles, waste almost nothing, and treat every service like a dinner party for old friends.',
    highlights: ['Farm-to-table sourcing', 'Award-winning wine list', 'Private dining room', 'Vegetarian tasting menu'],
  },
  meta: { title: 'Osteria Lumière', description: 'Modern Italian fine dining' },
  contact: {
    phone: '+1 (415) 555-0123',
    email: 'reservations@osterialumiere.com',
    address: '742 Vineyard Lane, San Francisco, CA 94110',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0',
  },
  hours: [
    { day: 'Tuesday – Thursday', hours: '5:30 PM – 10:00 PM' },
    { day: 'Friday – Saturday', hours: '5:30 PM – 11:30 PM' },
    { day: 'Sunday', hours: '5:00 PM – 9:00 PM' },
    { day: 'Monday', hours: 'Closed' },
  ],
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    yelp: 'https://yelp.com',
  },
  templateId: 'restaurant-01',
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
}

export default function PreviewPage() {
  const content = MOCK
  const colors = getRestaurantColors(content)

  return (
    <div className="font-body antialiased" style={{ color: colors.text, background: colors.background }}>
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
