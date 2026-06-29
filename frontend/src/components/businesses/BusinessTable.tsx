'use client'

import Link from 'next/link'
import type { Business } from '@/lib/api'
import { CrmStatusBadge } from './CrmStatusBadge'
import { Badge } from '@/components/ui/Badge'
import { scoreBg, SITE_STATUS_COLORS, SITE_STATUS_LABELS, cn } from '@/lib/utils'
import { ExternalLink, Globe, Mail, Phone, ChevronRight } from 'lucide-react'

interface BusinessTableProps {
  businesses: Business[]
  queryKey?: unknown[]
}

function ScoreCell({ score }: { score: number | undefined }) {
  if (score == null) return <span className="text-slate-300 text-sm">—</span>
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-slate-100 rounded-full h-1.5 flex-shrink-0">
        <div
          className={cn('h-1.5 rounded-full', score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500')}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('text-xs font-semibold tabular-nums', scoreBg(score), 'px-1.5 py-0.5 rounded')}>
        {score}
      </span>
    </div>
  )
}

export function BusinessTable({ businesses, queryKey }: BusinessTableProps) {
  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-400 text-sm">No businesses match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Business
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Score
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Site preview
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Email
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                CRM
              </th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {businesses.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                {/* Business info */}
                <td className="px-4 py-3 max-w-xs">
                  <Link href={`/dashboard/businesses/${b.id}`}>
                    <p className="font-medium text-slate-900 truncate hover:text-indigo-600 transition-colors">
                      {b.name}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    {b.category && (
                      <span className="text-xs text-slate-400 truncate">{b.category}</span>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {b.phone && <Phone className="w-3 h-3 text-slate-300" />}
                      {b.email && <Mail className="w-3 h-3 text-slate-300" />}
                      {b.website && <Globe className="w-3 h-3 text-slate-300" />}
                    </div>
                  </div>
                </td>

                {/* Score */}
                <td className="px-4 py-3">
                  <ScoreCell score={b.presenceScore?.total} />
                </td>

                {/* Site */}
                <td className="px-4 py-3">
                  {b.websiteGen ? (
                    <div className="flex items-center gap-2">
                      <Badge className={SITE_STATUS_COLORS[b.websiteGen.status]}>
                        {SITE_STATUS_LABELS[b.websiteGen.status]}
                      </Badge>
                      {b.websiteGen.status !== 'EXPIRED' && b.websiteGen.siteUrl && (
                        <a
                          href={b.websiteGen.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  {b.emailLog ? (
                    <Badge
                      className={
                        b.emailLog.status === 'SENT'
                          ? 'bg-green-100 text-green-700'
                          : b.emailLog.status === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }
                    >
                      {b.emailLog.status.charAt(0) + b.emailLog.status.slice(1).toLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>

                {/* CRM */}
                <td className="px-4 py-3">
                  <CrmStatusBadge
                    businessId={b.id}
                    status={b.crmStatus}
                    queryKey={queryKey}
                  />
                </td>

                {/* Arrow */}
                <td className="px-4 py-3">
                  <Link href={`/dashboard/businesses/${b.id}`}>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
