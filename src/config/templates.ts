/**
 * Vercel template base URLs for generated site previews.
 * Set USE_LOCAL_TEMPLATES=true to use localhost ports during development.
 */

const LOCAL_PORTS: Record<string, number> = {
  'restaurant-01': 3011,
  'restaurant-02': 3012,
  'clinic-01': 3013,
  'salon-01': 3014,
  'gym-01': 3015,
  'retail-01': 3016,
  'law-01': 3017,
  'cafe-01': 3018,
  'education-01': 3019,
  'default-01': 3020,
}

const PRODUCTION_URLS: Record<string, string> = {
  'restaurant-01': 'https://scoutiq-restaurant-01.vercel.app',
  'restaurant-02': 'https://scoutiq-restaurant-02.vercel.app',
  'clinic-01': 'https://scoutiq-clinic-01.vercel.app',
  'salon-01': 'https://scoutiq-salon-01.vercel.app',
  'gym-01': 'https://scoutiq-gym-01.vercel.app',
  'retail-01': 'https://scoutiq-retail-01.vercel.app',
  'law-01': 'https://scoutiq-law-01.vercel.app',
  'cafe-01': 'https://scoutiq-cafe-01.vercel.app',
  'education-01': 'https://scoutiq-education-01.vercel.app',
  'default-01': 'https://scoutiq-default-01.vercel.app',
}

export function getTemplateUrl(templateId: string): string {
  if (process.env.USE_LOCAL_TEMPLATES === 'true') {
    const port = LOCAL_PORTS[templateId] ?? 3020
    return `http://localhost:${port}`
  }
  return PRODUCTION_URLS[templateId] ?? PRODUCTION_URLS['default-01']
}

export { LOCAL_PORTS, PRODUCTION_URLS }
