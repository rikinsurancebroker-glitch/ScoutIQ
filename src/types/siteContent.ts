export interface SiteContent {
  businessName: string
  tagline: string
  category: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    ctaSecondary: string
  }
  services: Array<{
    icon: string
    title: string
    description: string
  }>
  about: {
    headline: string
    body: string
    highlights: string[]
  }
  meta: {
    title: string
    description: string
  }
  contact: {
    phone?: string
    email?: string
    address?: string
    whatsapp?: string
    mapEmbed?: string
  }
  hours: Array<{
    day: string
    hours: string
  }>
  social: {
    instagram?: string
    facebook?: string
    youtube?: string
    twitter?: string
    yelp?: string
  }
  templateId: string
  expiresAt: string
}
