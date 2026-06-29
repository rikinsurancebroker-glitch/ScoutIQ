'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

interface CategoryChartProps {
  data: { category: string; count: number }[]
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#818cf8', '#4f46e5', '#7c3aed', '#9333ea',
  '#a855f7', '#c026d3',
]

export function CategoryChart({ data }: CategoryChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-slate-900">Top Categories</h3>
        <p className="text-xs text-slate-500 mt-0.5">Business distribution by type</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sorted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: 'none',
                borderRadius: 8,
                color: '#f8fafc',
                fontSize: 12,
              }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="count" name="Businesses" radius={[4, 4, 0, 0]}>
              {sorted.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
