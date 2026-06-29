'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import type { ExpiryStats } from '@/lib/api'
import { Eye } from 'lucide-react'

interface ExpiryStatsPanelProps {
  data: ExpiryStats | undefined
}

const SLICE_CONFIG = [
  { key: 'live' as const, label: 'Live', color: '#22c55e' },
  { key: 'extended' as const, label: 'Extended', color: '#3b82f6' },
  { key: 'claimed' as const, label: 'Claimed', color: '#8b5cf6' },
  { key: 'expired' as const, label: 'Expired', color: '#e2e8f0' },
]

export function ExpiryStatsPanel({ data }: ExpiryStatsPanelProps) {
  if (!data) return null

  const chartData = SLICE_CONFIG.map((s) => ({
    name: s.label,
    value: data[s.key],
    color: s.color,
  })).filter((d) => d.value > 0)

  const total = SLICE_CONFIG.reduce((sum, s) => sum + data[s.key], 0)

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-slate-900">Site Preview Status</h3>
        <p className="text-xs text-slate-500 mt-0.5">{total} total generated sites</p>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No sites generated yet</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: 'none',
                    borderRadius: 8,
                    color: '#f8fafc',
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-slate-600 text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {data.viewedNotClaimed > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Eye className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-amber-700 text-xs font-medium">
                  {data.viewedNotClaimed} site{data.viewedNotClaimed !== 1 ? 's' : ''} viewed but not yet claimed — follow up now
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
