import type { PresenceScore } from '@/lib/api'
import { scoreBarColor, cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { AlertTriangle, Lightbulb } from 'lucide-react'

interface ScoreBreakdownProps {
  score: PresenceScore
}

const SCORE_DIMENSIONS = [
  { key: 'websiteScore' as const, label: 'Website', max: 20 },
  { key: 'googleScore' as const, label: 'Google', max: 20 },
  { key: 'socialScore' as const, label: 'Social Media', max: 20 },
  { key: 'contactScore' as const, label: 'Contact Info', max: 15 },
  { key: 'hoursScore' as const, label: 'Business Hours', max: 10 },
  { key: 'reviewScore' as const, label: 'External Reviews', max: 5 },
  { key: 'geoScore' as const, label: 'Geo Accuracy', max: 5 },
]

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-slate-700">
          {value}
          <span className="text-slate-300 font-normal">/{max}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all', scoreBarColor(Math.round(pct)))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      {/* Total score ring */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke={score.total >= 70 ? '#22c55e' : score.total >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  strokeDasharray={`${(score.total / 100) * 201} 201`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-900">{score.total}</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">
                {score.total >= 70 ? 'Strong presence' : score.total >= 40 ? 'Moderate presence' : 'Weak presence'}
              </p>
              <p className="text-slate-500 text-sm">
                Scored {score.total}/100 · {score.opportunities.length} improvement{score.opportunities.length !== 1 ? 's' : ''} identified
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension breakdown */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">Score Breakdown</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {SCORE_DIMENSIONS.map((d) => (
            <ScoreBar key={d.key} label={d.label} value={score[d.key]} max={d.max} />
          ))}
        </CardContent>
      </Card>

      {/* Flags */}
      {score.flags.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-slate-900">Issues detected</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {score.flags.map((f) => (
                <span
                  key={f}
                  className="bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-medium"
                >
                  {f.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {score.opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold text-slate-900">Sales opportunities</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {score.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
