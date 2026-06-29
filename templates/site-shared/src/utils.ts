import type { SiteContent, SiteTheme } from './types'

export function resolveColors(content: SiteContent, theme: SiteTheme) {
  const c = content.colors
  const hasAiColors = c.primary && c.primary.startsWith('#') && c.primary !== '#2563EB'
  if (hasAiColors) {
    return {
      primary: c.primary,
      secondary: c.secondary || theme.palette.secondary,
      accent: c.accent || theme.palette.accent,
      background: c.background || theme.palette.background,
      surface: theme.dark ? theme.palette.surface : '#ffffff',
      text: theme.dark ? theme.palette.text : '#0f172a',
      textMuted: theme.palette.textMuted,
    }
  }
  return theme.palette
}

export function cardRadius(style: SiteTheme['cardStyle']) {
  if (style === 'pill') return '1.5rem'
  if (style === 'sharp') return '0.25rem'
  return '1rem'
}
