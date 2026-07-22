'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { businessesApi } from '@/lib/api'
import { ScoreBreakdown } from '@/components/businesses/ScoreBreakdown'
import { CrmStatusBadge } from '@/components/businesses/CrmStatusBadge'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  SITE_STATUS_COLORS, SITE_STATUS_LABELS, EMAIL_STATUS_COLORS,
  formatDate, formatDateTime, daysUntil, cn
} from '@/lib/utils'
import {
  ChevronRight, Phone, Mail, Globe, MapPin, Star, Clock,
  Instagram, Facebook, Youtube, Linkedin, Twitter, ExternalLink,
  QrCode, Loader2
} from 'lucide-react'

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide w-32 flex-shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-700 flex-1">{value || <span className="text-slate-300">—</span>}</span>
    </div>
  )
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => businessesApi.get(id),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Business not found.</p>
        <Link href="/dashboard/uploads" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
          Back to uploads
        </Link>
      </div>
    )
  }

  const site = business.websiteGen as (typeof business.websiteGen & {
    firstViewAt?: string | null
    lastViewAt?: string | null
    generatedAt?: string
  }) | null

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/uploads" className="hover:text-indigo-600">Uploads</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/dashboard/uploads/${business.uploadId}`}
          className="hover:text-indigo-600"
        >
          {business.upload.fileName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{business.name}</span>
      </div>

      {/* Title + CRM */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
          {business.category && (
            <p className="text-slate-500 text-sm mt-0.5">{business.category}</p>
          )}
        </div>
        <CrmStatusBadge
          businessId={business.id}
          status={business.crmStatus}
          queryKey={['business', id]}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Contact */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-900">Contact & Location</h2>
            </CardHeader>
            <CardContent>
              <InfoRow
                label="Phone"
                value={
                  business.phone ? (
                    <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      {business.phone}
                    </a>
                  ) : null
                }
              />
              <InfoRow
                label="Email"
                value={
                  business.email ? (
                    <a href={`mailto:${business.email}`} className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      {business.email}
                    </a>
                  ) : null
                }
              />
              <InfoRow
                label="Website"
                value={
                  business.website ? (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-indigo-600 hover:underline break-all"
                    >
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                      {business.website}
                    </a>
                  ) : null
                }
              />
              <InfoRow
                label="Address"
                value={
                  business.address ? (
                    <span className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                      {business.address}
                    </span>
                  ) : null
                }
              />
              {(business.averageRating ?? 0) > 0 && (
                <InfoRow
                  label="Google Rating"
                  value={
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {business.averageRating?.toFixed(1)} ({business.reviewCount?.toLocaleString()} reviews)
                    </span>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Social */}
          {(business.instagram || business.facebook || business.youtube || business.linkedin || business.twitter || business.yelp) && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-slate-900">Social Profiles</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Instagram, label: 'Instagram', url: business.instagram, color: 'text-pink-500' },
                    { icon: Facebook, label: 'Facebook', url: business.facebook, color: 'text-blue-600' },
                    { icon: Youtube, label: 'YouTube', url: business.youtube, color: 'text-red-500' },
                    { icon: Linkedin, label: 'LinkedIn', url: business.linkedin, color: 'text-blue-700' },
                    { icon: Twitter, label: 'X/Twitter', url: business.twitter, color: 'text-slate-900' },
                  ]
                    .filter((s) => s.url)
                    .map(({ icon: Icon, label, url, color }) => (
                      <a
                        key={label}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                      >
                        <Icon className={cn('w-4 h-4', color)} />
                        {label}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Site preview */}
          {site && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Generated Site Preview</h2>
                  <Badge className={SITE_STATUS_COLORS[site.status]}>
                    {SITE_STATUS_LABELS[site.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{site.viewCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Views</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{formatDate(site.expiresAt)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Expires in {daysUntil(site.expiresAt)}d
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{formatDateTime((site as typeof site & { firstViewAt?: string | null }).firstViewAt)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">First view</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{formatDateTime((site as typeof site & { lastViewAt?: string | null }).lastViewAt)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Last view</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {site.status !== 'EXPIRED' && site.siteUrl && (
                    <a
                      href={site.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      View site preview
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {site.qrUrl && (
                    <a
                      href={site.qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-100 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-200 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      Download QR code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email log */}
          {business.emailLog && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Email Outreach</h2>
                  <Badge className={EMAIL_STATUS_COLORS[business.emailLog.status]}>
                    {business.emailLog.status.charAt(0) + business.emailLog.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <InfoRow label="Sent to" value={business.emailLog.toEmail} />
                <InfoRow label="Subject" value={business.emailLog.subject} />
                <InfoRow label="Sent at" value={formatDateTime(business.emailLog.sentAt)} />
                {business.emailLog.isTest && (
                  <InfoRow label="Type" value="Test send (not counted in dashboard funnel)" />
                )}
                <InfoRow
                  label="Opened"
                  value={
                    business.emailLog.openedAt
                      ? `${formatDateTime(business.emailLog.openedAt)} (${business.emailLog.openCount}×)`
                      : 'Not yet'
                  }
                />
                <InfoRow
                  label="Site clicked"
                  value={
                    business.websiteGen?.firstViewAt
                      ? `${formatDateTime(business.websiteGen.firstViewAt)} · ${business.websiteGen.viewCount} view${business.websiteGen.viewCount === 1 ? '' : 's'}`
                      : 'Not yet'
                  }
                />
              </CardContent>
            </Card>
          )}

          {/* Hours */}
          {[
            { day: 'Monday', val: null },
          ].filter(() => false).length === 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h2 className="font-semibold text-slate-900">Business Hours</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {[
                    { day: 'Monday', key: 'hoursMonday' as const },
                    { day: 'Tuesday', key: 'hoursTuesday' as const },
                    { day: 'Wednesday', key: 'hoursWednesday' as const },
                    { day: 'Thursday', key: 'hoursThursday' as const },
                    { day: 'Friday', key: 'hoursFriday' as const },
                    { day: 'Saturday', key: 'hoursSaturday' as const },
                    { day: 'Sunday', key: 'hoursSunday' as const },
                  ].map(({ day, key }) => {
                    const hours = (business as unknown as Record<string, string | null>)[key]
                    return (
                      <div key={day} className="flex justify-between py-1 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-500">{day}</span>
                        <span className={cn('text-sm', hours ? 'text-slate-700 font-medium' : 'text-slate-300')}>
                          {hours || 'Not listed'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — Score */}
        <div>
          {business.presenceScore ? (
            <ScoreBreakdown score={business.presenceScore} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="w-6 h-6 text-indigo-300 animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-400">Scoring in progress…</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
