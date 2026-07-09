import { addDays } from 'date-fns'
import { openai } from '../lib/openai'
import type { SiteContent } from '../types/siteContent'
import type { ScoreBreakdown } from './scoringService'

interface BusinessForGeneration {
  id: string
  name: string
  category?: string | null
  address?: string | null
  averageRating?: number | null
  reviewCount?: number | null
  phone?: string | null
  email?: string | null
  instagram?: string | null
  facebook?: string | null
  youtube?: string | null
  twitter?: string | null
  yelp?: string | null
  hoursMonday?: string | null
  hoursTuesday?: string | null
  hoursWednesday?: string | null
  hoursThursday?: string | null
  hoursFriday?: string | null
  hoursSaturday?: string | null
  hoursSunday?: string | null
}

interface TemplateDefinition {
  url: string
  description: string
  categories: string[]
}

const TEMPLATES: Record<string, TemplateDefinition> = {
  'restaurant-01': {
    url: 'https://scoutiq-restaurant-01.vercel.app',
    description: 'Warm food-focused, large hero, menu highlights',
    categories: [
      'restaurant',
      'food',
      'takeaway',
      'biryani',
      'pizza',
      'dhaba',
      'fine dining',
      'steakhouse',
      'sushi',
      'bar',
      'grill',
    ],
  },
  'restaurant-02': {
    url: 'https://scoutiq-restaurant-02.vercel.app',
    description: 'Dark moody, fine dining, premium feel',
    // Not auto-selected — all restaurant/dining businesses use restaurant-01.
    categories: [],
  },
  'clinic-01': {
    url: 'https://scoutiq-clinic-01.vercel.app',
    description: 'Clean minimal, trust signals, appointment CTA',
    categories: ['clinic', 'doctor', 'dental', 'hospital', 'pharmacy', 'physiotherapy', 'medical'],
  },
  'salon-01': {
    url: 'https://scoutiq-salon-01.vercel.app',
    description: 'Soft elegant, service menu, booking CTA',
    categories: ['salon', 'spa', 'beauty', 'hair', 'nails', 'barber', 'grooming'],
  },
  'gym-01': {
    url: 'https://scoutiq-gym-01.vercel.app',
    description: 'Bold dark, membership plans, class schedule',
    categories: ['gym', 'fitness', 'crossfit', 'yoga', 'martial arts', 'sports'],
  },
  'retail-01': {
    url: 'https://scoutiq-retail-01.vercel.app',
    description: 'Bright product categories, WhatsApp order button',
    categories: ['retail', 'shop', 'store', 'clothing', 'electronics', 'grocery', 'fashion'],
  },
  'law-01': {
    url: 'https://scoutiq-law-01.vercel.app',
    description: 'Formal credibility-first, practice areas, consultation CTA',
    categories: ['law', 'lawyer', 'attorney', 'legal', 'advocate', 'solicitor'],
  },
  'cafe-01': {
    url: 'https://scoutiq-cafe-01.vercel.app',
    description: 'Cozy lifestyle, menu sections, Instagram-first',
    categories: ['cafe', 'coffee', 'bakery', 'dessert', 'tea', 'patisserie'],
  },
  'education-01': {
    url: 'https://scoutiq-education-01.vercel.app',
    description: 'Structured courses list, enrolment CTA',
    categories: ['school', 'academy', 'tuition', 'coaching', 'training', 'institute', 'college'],
  },
  'default-01': {
    url: 'https://scoutiq-default-01.vercel.app',
    description: 'Neutral professional, works for any business',
    categories: [],
  },
}

export function pickTemplate(category?: string | null): string {
  if (!category) return 'default-01'

  const normalized = category.toLowerCase().trim()

  for (const [templateId, template] of Object.entries(TEMPLATES)) {
    if (templateId === 'default-01') continue
    if (template.categories.some((cat) => normalized.includes(cat))) {
      return templateId
    }
  }

  return 'default-01'
}

function buildFallbackContent(
  business: BusinessForGeneration,
  templateId: string
): SiteContent {
  const expiryDays = parseInt(process.env.SITE_EXPIRY_DAYS ?? '7')

  return {
    businessName: business.name,
    tagline: `Welcome to ${business.name}`,
    category: business.category ?? 'Local Business',
    description: `${business.name} is a trusted local business serving the community with quality products and services.`,
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#F8FAFC',
    },
    hero: {
      headline: `Welcome to ${business.name}`,
      subheadline: 'Serving the community with excellence',
      ctaText: 'Contact Us',
      ctaSecondary: 'Learn More',
    },
    services: [
      { icon: '⭐', title: 'Quality Service', description: 'We deliver excellence every time.' },
      { icon: '🤝', title: 'Customer Focus', description: 'Your satisfaction is our priority.' },
      { icon: '📍', title: 'Local Presence', description: 'Serving our community with pride.' },
      { icon: '💬', title: 'Get In Touch', description: 'We are always here to help you.' },
    ],
    about: {
      headline: `About ${business.name}`,
      body: `${business.name} has been a valued part of the local community. We are committed to providing outstanding service and building lasting relationships with our customers.`,
      highlights: ['Community trusted', 'Quality guaranteed', 'Always available'],
    },
    meta: {
      title: business.name,
      description: `${business.name} — trusted local business offering quality services in your area.`,
    },
    contact: {
      phone: business.phone ?? undefined,
      email: business.email ?? undefined,
      address: business.address ?? undefined,
      whatsapp: business.phone
        ? `https://wa.me/${business.phone.replace(/\D/g, '')}`
        : undefined,
      mapEmbed: business.address
        ? `https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`
        : undefined,
    },
    hours: [
      { day: 'Monday', hours: business.hoursMonday ?? '' },
      { day: 'Tuesday', hours: business.hoursTuesday ?? '' },
      { day: 'Wednesday', hours: business.hoursWednesday ?? '' },
      { day: 'Thursday', hours: business.hoursThursday ?? '' },
      { day: 'Friday', hours: business.hoursFriday ?? '' },
      { day: 'Saturday', hours: business.hoursSaturday ?? '' },
      { day: 'Sunday', hours: business.hoursSunday ?? '' },
    ].filter((h) => h.hours !== ''),
    social: {
      instagram: business.instagram ?? undefined,
      facebook: business.facebook ?? undefined,
      youtube: business.youtube ?? undefined,
      twitter: business.twitter ?? undefined,
      yelp: business.yelp ?? undefined,
    },
    templateId,
    expiresAt: addDays(new Date(), expiryDays).toISOString(),
  }
}

export async function generateSiteContent(
  business: BusinessForGeneration,
  score: ScoreBreakdown
): Promise<SiteContent> {
  const templateId = pickTemplate(business.category)
  const expiryDays = parseInt(process.env.SITE_EXPIRY_DAYS ?? '7')

  const userPrompt = `Generate website content JSON for this business:

Name: ${business.name}
Category: ${business.category ?? 'Local Business'}
Address: ${business.address ?? 'not provided'}
Rating: ${business.averageRating ?? 'none'} (${business.reviewCount ?? 0} reviews)
Key improvements needed: ${score.opportunities.slice(0, 3).join('; ')}

Return JSON matching exactly this structure:
{
  "businessName": string,
  "tagline": string (max 8 words),
  "category": string,
  "description": string (2-3 sentences),
  "colors": {
    "primary": string (hex),
    "secondary": string (hex),
    "accent": string (hex),
    "background": string (hex, near-white)
  },
  "hero": {
    "headline": string (compelling, specific to this business),
    "subheadline": string,
    "ctaText": string,
    "ctaSecondary": string
  },
  "services": [
    { "icon": string (emoji), "title": string, "description": string }
  ] (4-6 items based on category),
  "about": {
    "headline": string,
    "body": string (3-4 sentences),
    "highlights": string[] (3 short phrases)
  },
  "meta": {
    "title": string,
    "description": string (max 150 chars for SEO)
  }
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      max_tokens: 1200,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copywriter generating website content for local businesses. Return ONLY a valid JSON object — no explanation, no markdown, no code fences. All text must be specific to this exact business. No generic filler. Infer realistic services from the business category.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const rawContent = response.choices[0]?.message?.content
    if (!rawContent) {
      throw new Error('Empty response from OpenAI')
    }

    const aiContent = JSON.parse(rawContent) as Omit<
      SiteContent,
      'contact' | 'hours' | 'social' | 'templateId' | 'expiresAt'
    >

    const fullContent: SiteContent = {
      ...aiContent,
      contact: {
        phone: business.phone ?? undefined,
        email: business.email ?? undefined,
        address: business.address ?? undefined,
        whatsapp: business.phone
          ? `https://wa.me/${business.phone.replace(/\D/g, '')}`
          : undefined,
        mapEmbed: business.address
          ? `https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`
          : undefined,
      },
      hours: [
        { day: 'Monday', hours: business.hoursMonday ?? '' },
        { day: 'Tuesday', hours: business.hoursTuesday ?? '' },
        { day: 'Wednesday', hours: business.hoursWednesday ?? '' },
        { day: 'Thursday', hours: business.hoursThursday ?? '' },
        { day: 'Friday', hours: business.hoursFriday ?? '' },
        { day: 'Saturday', hours: business.hoursSaturday ?? '' },
        { day: 'Sunday', hours: business.hoursSunday ?? '' },
      ].filter((h) => h.hours !== ''),
      social: {
        instagram: business.instagram ?? undefined,
        facebook: business.facebook ?? undefined,
        youtube: business.youtube ?? undefined,
        twitter: business.twitter ?? undefined,
        yelp: business.yelp ?? undefined,
      },
      templateId,
      expiresAt: addDays(new Date(), expiryDays).toISOString(),
    }

    return fullContent
  } catch (err) {
    console.error(
      `[WebsiteGenerator] OpenAI failed for business ${business.id}:`,
      err instanceof Error ? err.message : err
    )
    return buildFallbackContent(business, templateId)
  }
}
