'use client'

import { Select, SelectItem } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { BusinessListParams, CrmStatus } from '@/lib/api'

interface BusinessFiltersProps {
  params: BusinessListParams
  onChange: (p: Partial<BusinessListParams>) => void
  onReset: () => void
}

const CRM_OPTIONS: { value: CrmStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'NOT_CONTACTED', label: 'Not contacted' },
  { value: 'EMAIL_SENT', label: 'Email sent' },
  { value: 'REPLIED', label: 'Replied' },
  { value: 'INTERESTED', label: 'Interested' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
  { value: 'SKIPPED', label: 'Skipped' },
]

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Newest first' },
  { value: 'score_asc', label: 'Lowest score' },
  { value: 'score_desc', label: 'Highest score' },
]

const SCORE_RANGES = [
  { value: '', label: 'All scores' },
  { value: '0-39', label: 'Poor (0–39)' },
  { value: '40-69', label: 'Moderate (40–69)' },
  { value: '70-100', label: 'Good (70–100)' },
]

export function BusinessFilters({ params, onChange, onReset }: BusinessFiltersProps) {
  const scoreRangeValue =
    params.minScore != null && params.maxScore != null
      ? `${params.minScore}-${params.maxScore}`
      : ''

  function handleScoreRange(val: string) {
    if (!val) {
      onChange({ minScore: undefined, maxScore: undefined })
      return
    }
    const [min, max] = val.split('-').map(Number)
    onChange({ minScore: min, maxScore: max })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />

      <Select
        value={params.crmStatus ?? ''}
        onValueChange={(v) => onChange({ crmStatus: (v as CrmStatus) || undefined })}
        placeholder="CRM status"
        className="min-w-[160px]"
      >
        {CRM_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        value={scoreRangeValue}
        onValueChange={handleScoreRange}
        placeholder="Score range"
        className="min-w-[160px]"
      >
        {SCORE_RANGES.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        value={params.sort ?? 'created_desc'}
        onValueChange={(v) => onChange({ sort: v as BusinessListParams['sort'] })}
        className="min-w-[160px]"
      >
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </Select>

      <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto text-slate-400">
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </Button>
    </div>
  )
}
