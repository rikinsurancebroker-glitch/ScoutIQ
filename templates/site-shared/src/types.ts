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
  hours: Array<{ day: string; hours: string }>
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

export type HeroLayout = 'centered' | 'split' | 'fullscreen'
export type CardStyle = 'rounded' | 'sharp' | 'pill' | 'clay'

export type ThemeVariant =
  | 'aurora'
  | 'emerald-minimal'
  | 'golden-editorial'
  | 'neo-dark'
  | 'clay-ui'
  | 'scandinavian'
  | 'liquid-motion'
  | 'swiss-grid'
  | 'mono-brutalist'
  | 'cinematic'

export interface SiteTheme {
  id: string
  name: string
  variant: ThemeVariant
  heroLayout: HeroLayout
  cardStyle: CardStyle
  dark: boolean
  fontHeading: string
  fontBody: string
  heroGradient: string
  pattern: 'dots' | 'grid' | 'waves' | 'aurora' | 'none'
  palette: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
  }
}
