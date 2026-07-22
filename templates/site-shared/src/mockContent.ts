import type { SiteContent, SiteTheme } from './types'

const SAMPLE_NAMES: Record<string, { name: string; category: string; tagline: string }> = {
  'restaurant-01': { name: 'Ember & Oak Bistro', category: 'Restaurant', tagline: 'Seasonal plates · Warm hospitality' },
  'restaurant-02': { name: 'Noir Kitchen', category: 'Fine Dining', tagline: 'Modern cuisine after dark' },
  'clinic-01': { name: 'Harbor Health Clinic', category: 'Medical Clinic', tagline: 'Compassionate care, close to home' },
  'salon-01': { name: 'Lumière Salon', category: 'Hair Salon', tagline: 'Look and feel your best' },
  'gym-01': { name: 'IronForge Fitness', category: 'Fitness Club', tagline: 'Strength · Conditioning · Community' },
  'retail-01': { name: 'Urban Nest Home', category: 'Retail Store', tagline: 'Curated goods for modern living' },
  'law-01': { name: 'Whitfield Legal Group', category: 'Law Firm', tagline: 'Trusted counsel when it matters' },
  'cafe-01': { name: 'Morning Brew Café', category: 'Coffee Shop', tagline: 'Fresh roasts · Homemade pastries' },
  'education-01': { name: 'BrightPath Academy', category: 'Education', tagline: 'Learning that opens doors' },
  'default-01': { name: 'Summit Local Co.', category: 'Local Business', tagline: 'Professional service you can trust' },
}

/** Sample content for local template design preview — no API or business ID required. */
export function buildMockSiteContent(theme: SiteTheme): SiteContent {
  const sample = SAMPLE_NAMES[theme.id] ?? {
    name: 'Sample Business',
    category: 'Local Business',
    tagline: 'Your tagline here',
  }

  return {
    businessName: sample.name,
    tagline: sample.tagline,
    category: sample.category,
    description: `${sample.name} is a ${sample.category.toLowerCase()} serving the local community with professional service and a welcoming experience.`,
    colors: {
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      accent: theme.palette.accent,
      background: theme.palette.background,
    },
    hero: {
      headline: `Welcome to ${sample.name}`,
      subheadline: sample.tagline,
      ctaText: 'Get in Touch',
      ctaSecondary: 'Learn More',
    },
    services: [
      { icon: '✨', title: 'Core Service', description: 'Our most popular offering, tailored to your needs.' },
      { icon: '🎯', title: 'Specialty Care', description: 'Focused expertise delivered with attention to detail.' },
      { icon: '🤝', title: 'Consultation', description: 'Friendly guidance to help you choose the right option.' },
      { icon: '⭐', title: 'Premium Package', description: 'Everything you need in one complete experience.' },
    ],
    about: {
      headline: `About ${sample.name}`,
      body: `We built ${sample.name} for people who expect quality. Visit us to see why locals recommend our ${sample.category.toLowerCase()} — this is demo copy for template preview only.`,
      highlights: ['Experienced team', 'Local & trusted', 'Flexible hours', 'Walk-ins welcome'],
    },
    meta: { title: sample.name, description: `${sample.name} — ${sample.tagline}` },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'hello@example.com',
      address: '123 Main Street, Your City',
    },
    hours: [
      { day: 'Mon – Fri', hours: '9:00 AM – 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' },
    ],
    social: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    },
    templateId: theme.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  }
}
