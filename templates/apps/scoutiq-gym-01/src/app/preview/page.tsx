import type { SiteContent } from '@scoutiq/site-shared'
import { getGymColors } from '@/lib/theme'
import { GymNavbar } from '@/components/GymNavbar'
import { GymHero } from '@/components/GymHero'
import { ProgramsSection } from '@/components/ProgramsSection'
import { ShapeSection } from '@/components/ShapeSection'
import { ScheduleSection } from '@/components/ScheduleSection'
import { TrainersSection } from '@/components/TrainersSection'
import { PricingSection } from '@/components/PricingSection'
import { GymContact } from '@/components/GymContact'
import { GymFooter } from '@/components/GymFooter'

// Mock content for local design iteration — does NOT hit the backend.
const MOCK: SiteContent = {
  businessName: 'IronForge',
  tagline: 'Strength · Conditioning · Community',
  category: 'Fitness Club',
  description:
    'At IronForge we help you build strength, confidence, and lasting habits. With expert coaches and proven programs, we guide you toward your best shape — no shortcuts, no gimmicks.',
  colors: { primary: '#FF6B1A', secondary: '#0A0A0A', accent: '#FF6B1A', background: '#0A0A0A' },
  hero: {
    headline: 'Unleash Your Potential',
    subheadline:
      'Join a community where goals are crushed, strength is built, and potential becomes power.',
    ctaText: 'Get Started',
    ctaSecondary: 'Explore More',
  },
  services: [
    { icon: '🏋️', title: 'Personal Training', description: 'One-on-one coaching tailored to your goals, schedule, and starting point.' },
    { icon: '💪', title: 'Strength Training', description: 'Build muscle, increase power, and strengthen your physique with progressive overload.' },
    { icon: '🔥', title: 'HIIT Classes', description: 'High-intensity interval training that burns calories and builds endurance in record time.' },
    { icon: '🥊', title: 'Fitness Boxing', description: 'Gloves up. Full-body conditioning through pad work, bags, and footwork drills.' },
    { icon: '🧘', title: 'Mobility & Recovery', description: 'Guided stretching, foam rolling, and mobility work to keep you training pain-free.' },
    { icon: '🏃', title: 'Cardio Conditioning', description: 'Engine-building sessions across rowers, bikes, and sleds for total stamina.' },
  ],
  about: {
    headline: 'Give Shape to Your Body',
    body:
      'We built IronForge for people who want results. Our coaches write real programs, track your progress, and hold you accountable — whether you are stepping into a gym for the first time or chasing a new personal record.',
    highlights: ['Expert certified coaches', 'Personalized programming', '24/7 member access', 'Recovery & sauna zone'],
  },
  meta: { title: 'IronForge', description: 'Strength and conditioning gym' },
  contact: {
    phone: '+1 (415) 555-0187',
    email: 'team@ironforge.fit',
    address: '89 Foundry District, Austin, TX 78701',
  },
  hours: [
    { day: 'Mon – Fri', hours: '5:00 AM – 11:00 PM' },
    { day: 'Saturday', hours: '7:00 AM – 9:00 PM' },
    { day: 'Sunday', hours: '8:00 AM – 6:00 PM' },
  ],
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
  },
  templateId: 'gym-01',
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
}

export default function PreviewPage() {
  const content = MOCK
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
