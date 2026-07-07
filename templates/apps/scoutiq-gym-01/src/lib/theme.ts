import type { SiteContent } from '@scoutiq/site-shared'

// High-energy dark fitness palette — near-black, blazing orange, steel grays.
// This template's identity IS this palette, so AI-provided colors are ignored.
export interface GymColors {
  primary: string
  primaryHover: string
  background: string
  surface: string
  card: string
  border: string
  text: string
  textMuted: string
}

const GYM: GymColors = {
  primary: '#FF6B1A',
  primaryHover: '#FF8B3D',
  background: '#0A0A0A',
  surface: '#121212',
  card: '#161616',
  border: '#262626',
  text: '#F5F5F5',
  textMuted: '#9A9A9A',
}

export function getGymColors(_content: SiteContent): GymColors {
  return GYM
}
