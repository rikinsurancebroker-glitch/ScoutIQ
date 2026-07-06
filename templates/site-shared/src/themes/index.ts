import type { SiteTheme } from '../types'

// Theme 10 — Cinematic Gradient (restaurant-01 uses custom components, this is for restaurant-02 fallback)
export const restaurant01: SiteTheme = {
  id: 'restaurant-01',
  name: 'Cinematic Restaurant',
  variant: 'cinematic',
  heroLayout: 'fullscreen',
  cardStyle: 'rounded',
  dark: true,
  fontHeading: "'Cormorant Garamond', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(160deg, #0D1B2A 0%, #1a2f45 50%, #0D1B2A 100%)',
  pattern: 'none',
  palette: {
    primary: '#F4A261',
    secondary: '#E76F51',
    accent: '#F4A261',
    background: '#0D1B2A',
    surface: '#142233',
    text: '#FFF8F2',
    textMuted: '#94A3B8',
    border: '#1e3449',
  },
}

// Theme 9 — Mono Brutalist (restaurant-02)
export const restaurant02: SiteTheme = {
  id: 'restaurant-02',
  name: 'Mono Brutalist',
  variant: 'mono-brutalist',
  heroLayout: 'fullscreen',
  cardStyle: 'sharp',
  dark: true,
  fontHeading: "'Space Grotesk', system-ui, sans-serif",
  fontBody: "'Space Grotesk', system-ui, sans-serif",
  heroGradient: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
  pattern: 'grid',
  palette: {
    primary: '#FF3333',
    secondary: '#ffffff',
    accent: '#FF3333',
    background: '#0a0a0a',
    surface: '#111111',
    text: '#ffffff',
    textMuted: '#888888',
    border: '#222222',
  },
}

// Theme 2 — Emerald Minimal (clinic-01)
export const clinic01: SiteTheme = {
  id: 'clinic-01',
  name: 'Emerald Minimal',
  variant: 'emerald-minimal',
  heroLayout: 'split',
  cardStyle: 'rounded',
  dark: false,
  fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #F8FFF8 0%, #E8F8EF 50%, #D4F1E0 100%)',
  pattern: 'none',
  palette: {
    primary: '#3BB273',
    secondary: '#164B2F',
    accent: '#3BB273',
    background: '#F8FFF8',
    surface: '#ffffff',
    text: '#164B2F',
    textMuted: '#4A7B5E',
    border: '#B6F4CF',
  },
}

// Theme 7 — Liquid Motion (salon-01)
export const salon01: SiteTheme = {
  id: 'salon-01',
  name: 'Liquid Motion',
  variant: 'liquid-motion',
  heroLayout: 'centered',
  cardStyle: 'pill',
  dark: false,
  fontHeading: "'Syne', system-ui, sans-serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #fdf4ff 0%, #f5d0fe 40%, #e879f9 100%)',
  pattern: 'none',
  palette: {
    primary: '#C026D3',
    secondary: '#7C3AED',
    accent: '#E879F9',
    background: '#fdf4ff',
    surface: '#ffffff',
    text: '#1a0027',
    textMuted: '#7E22CE',
    border: '#F5D0FE',
  },
}

// Theme 4 — Neo Dark (gym-01)
export const gym01: SiteTheme = {
  id: 'gym-01',
  name: 'Neo Dark',
  variant: 'neo-dark',
  heroLayout: 'fullscreen',
  cardStyle: 'sharp',
  dark: true,
  fontHeading: "'Space Grotesk', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)',
  pattern: 'grid',
  palette: {
    primary: '#00F5FF',
    secondary: '#7C4DFF',
    accent: '#00F5FF',
    background: '#050505',
    surface: '#0d0d0d',
    text: '#F8F8F8',
    textMuted: '#666666',
    border: '#1a1a1a',
  },
}

// Theme 1 — Aurora Intelligence (retail-01)
export const retail01: SiteTheme = {
  id: 'retail-01',
  name: 'Aurora Intelligence',
  variant: 'aurora',
  heroLayout: 'centered',
  cardStyle: 'rounded',
  dark: false,
  fontHeading: "'Satoshi', 'Inter', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #FAFCFF 0%, #EFF6FF 50%, #F0F9FF 100%)',
  pattern: 'aurora',
  palette: {
    primary: '#246BFD',
    secondary: '#1A56DB',
    accent: '#7CC8FF',
    background: '#FAFCFF',
    surface: '#ffffff',
    text: '#0E1117',
    textMuted: '#64748B',
    border: '#E2EEFF',
  },
}

// Theme 3 — Golden Editorial (law-01)
export const law01: SiteTheme = {
  id: 'law-01',
  name: 'Golden Editorial',
  variant: 'golden-editorial',
  heroLayout: 'split',
  cardStyle: 'sharp',
  dark: false,
  fontHeading: "'Cormorant Garamond', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
  pattern: 'none',
  palette: {
    primary: '#C99A2E',
    secondary: '#111111',
    accent: '#C99A2E',
    background: '#FFF9EF',
    surface: '#ffffff',
    text: '#111111',
    textMuted: '#6B6B6B',
    border: '#E8D5A3',
  },
}

// Theme 5 — Clay UI Modern (cafe-01)
export const cafe01: SiteTheme = {
  id: 'cafe-01',
  name: 'Clay UI Modern',
  variant: 'clay-ui',
  heroLayout: 'centered',
  cardStyle: 'clay',
  dark: false,
  fontHeading: "'Fraunces', Georgia, serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #FFF6ED 0%, #FFE8D0 50%, #FFD4A8 100%)',
  pattern: 'none',
  palette: {
    primary: '#FF7A18',
    secondary: '#E86A0A',
    accent: '#FF7A18',
    background: '#FFF6ED',
    surface: '#ffffff',
    text: '#1A0A00',
    textMuted: '#8B5E3C',
    border: '#FFD4A8',
  },
}

// Theme 6 — Scandinavian Minimal (education-01)
export const education01: SiteTheme = {
  id: 'education-01',
  name: 'Scandinavian Minimal',
  variant: 'scandinavian',
  heroLayout: 'split',
  cardStyle: 'rounded',
  dark: false,
  fontHeading: "'DM Serif Display', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #FAFAFA 0%, #F2F2F2 100%)',
  pattern: 'none',
  palette: {
    primary: '#444B5A',
    secondary: '#2D3342',
    accent: '#444B5A',
    background: '#FAFAFA',
    surface: '#ffffff',
    text: '#1A1A2E',
    textMuted: '#8892A4',
    border: '#E4E6EB',
  },
}

// Theme 1 — Aurora Intelligence (default-01)
export const default01: SiteTheme = {
  id: 'default-01',
  name: 'Aurora Intelligence',
  variant: 'aurora',
  heroLayout: 'centered',
  cardStyle: 'rounded',
  dark: false,
  fontHeading: "'Inter', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  heroGradient: 'linear-gradient(135deg, #FAFCFF 0%, #EFF6FF 50%, #F0F9FF 100%)',
  pattern: 'aurora',
  palette: {
    primary: '#246BFD',
    secondary: '#1A56DB',
    accent: '#7CC8FF',
    background: '#FAFCFF',
    surface: '#ffffff',
    text: '#0E1117',
    textMuted: '#64748B',
    border: '#E2EEFF',
  },
}

export const themes = {
  'restaurant-01': restaurant01,
  'restaurant-02': restaurant02,
  'clinic-01': clinic01,
  'salon-01': salon01,
  'gym-01': gym01,
  'retail-01': retail01,
  'law-01': law01,
  'cafe-01': cafe01,
  'education-01': education01,
  'default-01': default01,
}
