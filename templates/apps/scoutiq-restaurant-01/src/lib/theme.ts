import type { SiteContent } from '@scoutiq/site-shared'
import { resolveColors } from '@scoutiq/site-shared'
import { restaurant01 } from '@scoutiq/site-shared/themes'

export type SiteColors = ReturnType<typeof resolveColors>

export function getRestaurantColors(content: SiteContent) {
  return resolveColors(content, restaurant01)
}

export const RESTAURANT_THEME = restaurant01
