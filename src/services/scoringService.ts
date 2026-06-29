export interface BusinessInput {
  name: string
  phone?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
  linkedin?: string | null
  yelp?: string | null
  youtube?: string | null
  placeId?: string | null
  reviewCount?: number | null
  averageRating?: number | null
  latitude?: number | null
  longitude?: number | null
  hoursMonday?: string | null
  hoursTuesday?: string | null
  hoursWednesday?: string | null
  hoursThursday?: string | null
  hoursFriday?: string | null
  hoursSaturday?: string | null
  hoursSunday?: string | null
}

export interface ScoreBreakdown {
  total: number
  contactScore: number
  websiteScore: number
  googleScore: number
  socialScore: number
  reviewScore: number
  hoursScore: number
  geoScore: number
  flags: string[]
  opportunities: string[]
}

const FAKE_WEBSITE_DOMAINS = [
  'facebook.com',
  'linktree.com',
  'linktr.ee',
  'bio.link',
  'beacons.ai',
  'instagram.com',
]

function isFakeWebsite(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return FAKE_WEBSITE_DOMAINS.some((domain) => parsed.hostname.includes(domain))
  } catch {
    return false
  }
}

function isPresent(value?: string | null): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonZeroNumber(value?: number | null): boolean {
  return typeof value === 'number' && value !== 0 && !isNaN(value)
}

export function scoreBusiness(business: BusinessInput): ScoreBreakdown {
  const flags: string[] = []
  const opportunities: string[] = []

  // --- Contact completeness: 15 pts ---
  let contactScore = 0
  if (isPresent(business.phone)) {
    contactScore += 6
  } else {
    flags.push('no_phone')
    opportunities.push('Add a phone number so customers can reach you instantly')
  }
  if (isPresent(business.email)) {
    contactScore += 5
  } else {
    flags.push('no_email')
    opportunities.push('Add a business email to capture online enquiries')
  }
  if (isPresent(business.address)) {
    contactScore += 4
  } else {
    flags.push('no_address')
    opportunities.push('List your full address to appear in local search results')
  }

  // --- Website: 20 pts ---
  let websiteScore = 0
  const hasWebsite = isPresent(business.website)
  if (hasWebsite) {
    const url = business.website as string
    const fake = isFakeWebsite(url)
    if (fake) {
      websiteScore += 2
      flags.push('fake_website')
      opportunities.push(
        'Build a dedicated website — using a social profile as a website costs you credibility'
      )
    } else {
      websiteScore += 10
      if (url.startsWith('https://')) {
        websiteScore += 5
      } else {
        opportunities.push('Upgrade your website to HTTPS for security and SEO ranking boost')
      }
      websiteScore += 5
    }
  } else {
    flags.push('no_website')
    opportunities.push(
      'Build a dedicated website — highest impact improvement for online discoverability'
    )
  }

  // --- Google presence: 20 pts ---
  let googleScore = 0
  if (isPresent(business.placeId)) {
    googleScore += 5
  } else {
    flags.push('no_google_listing')
    opportunities.push('Claim and verify your Google Business Profile to appear in Maps')
  }

  const rating = business.averageRating ?? 0
  if (rating >= 4.5) {
    googleScore += 10
  } else if (rating >= 3.5) {
    googleScore += 6
  } else if (rating >= 1.0) {
    googleScore += 3
    opportunities.push('Improve your Google rating by following up with happy customers for reviews')
  } else {
    flags.push('no_google_rating')
    opportunities.push('Start collecting Google reviews to improve discoverability and trust')
  }

  const reviewCount = business.reviewCount ?? 0
  if (reviewCount >= 100) {
    googleScore += 5
  } else if (reviewCount >= 20) {
    googleScore += 3
  } else if (reviewCount >= 1) {
    googleScore += 1
    opportunities.push('Grow your review count past 20 to build stronger social proof')
  } else {
    flags.push('no_reviews')
    opportunities.push('Get your first Google reviews — even 5 reviews dramatically improves ranking')
  }

  // --- Social media: 20 pts ---
  let socialScore = 0
  const socialFlags: string[] = []

  if (isPresent(business.instagram)) {
    socialScore += 6
  } else {
    socialFlags.push('instagram')
  }
  if (isPresent(business.facebook)) {
    socialScore += 5
  } else {
    socialFlags.push('facebook')
  }
  if (isPresent(business.youtube)) {
    socialScore += 4
  } else {
    socialFlags.push('youtube')
  }
  if (isPresent(business.linkedin)) {
    socialScore += 3
  } else {
    socialFlags.push('linkedin')
  }
  if (isPresent(business.twitter)) {
    socialScore += 2
  } else {
    socialFlags.push('twitter')
  }

  if (socialFlags.length >= 4) {
    flags.push('no_social')
    opportunities.push(
      'Create social media profiles — Instagram and Facebook are free and reach thousands'
    )
  } else if (socialFlags.length > 0) {
    opportunities.push(
      `Expand social presence by setting up ${socialFlags.slice(0, 2).join(' and ')} profiles`
    )
  }

  // --- External reviews: 5 pts ---
  let reviewScore = 0
  if (isPresent(business.yelp)) {
    reviewScore += 5
  } else {
    opportunities.push('List your business on Yelp to capture an additional review audience')
  }

  // --- Business hours: 10 pts ---
  let hoursScore = 0
  const dayFields = [
    business.hoursMonday,
    business.hoursTuesday,
    business.hoursWednesday,
    business.hoursThursday,
    business.hoursFriday,
    business.hoursSaturday,
    business.hoursSunday,
  ]
  const filledDays = dayFields.filter(isPresent).length
  hoursScore += filledDays
  if (filledDays === 7) {
    hoursScore += 3
  } else if (filledDays === 0) {
    flags.push('no_hours')
    opportunities.push(
      'Add business hours — customers are 2× more likely to visit when hours are listed'
    )
  } else {
    opportunities.push('Complete your business hours for all 7 days to maximise customer confidence')
  }

  // --- Geo accuracy: 5 pts ---
  let geoScore = 0
  if (isNonZeroNumber(business.latitude) && isNonZeroNumber(business.longitude)) {
    geoScore += 5
  } else {
    flags.push('no_geo')
    opportunities.push('Add GPS coordinates to improve accuracy in map-based searches')
  }

  const rawTotal =
    contactScore + websiteScore + googleScore + socialScore + reviewScore + hoursScore + geoScore
  const total = Math.min(100, rawTotal)

  return {
    total,
    contactScore,
    websiteScore,
    googleScore,
    socialScore,
    reviewScore,
    hoursScore,
    geoScore,
    flags,
    opportunities,
  }
}
