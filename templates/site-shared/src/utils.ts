import type { SiteContent, SiteTheme } from './types'

export function resolveColors(content: SiteContent, theme: SiteTheme) {
  const c = content.colors
  const hasAiColors =
    c.primary &&
    c.primary.startsWith('#') &&
    c.primary !== '#2563EB' &&
    c.primary !== '#246BFD'

  if (hasAiColors) {
    return {
      primary: c.primary,
      secondary: c.secondary || theme.palette.secondary,
      accent: c.accent || theme.palette.accent,
      background: c.background || theme.palette.background,
      surface: theme.dark ? theme.palette.surface : '#ffffff',
      text: theme.dark ? theme.palette.text : '#0f172a',
      textMuted: theme.palette.textMuted,
      border: theme.palette.border,
    }
  }
  return theme.palette
}

export function cardRadius(style: SiteTheme['cardStyle']) {
  if (style === 'clay') return '1.75rem'
  if (style === 'pill') return '1.5rem'
  if (style === 'sharp') return '0.25rem'
  return '1rem'
}

export function getAnimationConfig(variant: SiteTheme['variant']) {
  switch (variant) {
    case 'neo-dark':
    case 'mono-brutalist':
      return { duration: 0.4, ease: [0.16, 1, 0.3, 1] as number[] }
    case 'liquid-motion':
    case 'clay-ui':
      return { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as number[] }
    case 'golden-editorial':
    case 'scandinavian':
      return { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] as number[] }
    default:
      return { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] }
  }
}
