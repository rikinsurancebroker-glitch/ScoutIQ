import { Building2, CheckCircle2, Target, Mail, Trophy, TrendingUp, Globe } from 'lucide-react'
import type { DashboardStats } from '@/lib/api'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  highlight?: boolean
}

function StatCard({ label, value, sub, icon: Icon, iconBg, iconColor, highlight }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-5 flex flex-col gap-3',
        highlight ? 'border-indigo-200 shadow-md shadow-indigo-100' : 'border-slate-200 shadow-sm'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-4.5 h-4.5', iconColor)} />
        </div>
      </div>
      <div>
        <p className={cn('text-3xl font-bold', highlight ? 'text-indigo-600' : 'text-slate-900')}>
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-28 animate-pulse">
            <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
            <div className="h-8 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const scoreRate = stats.totalBusinesses > 0
    ? Math.round((stats.scored / stats.totalBusinesses) * 100)
    : 0

  const conversionRate = stats.emailsSent > 0
    ? Math.round((stats.won / stats.emailsSent) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Businesses"
        value={stats.totalBusinesses.toLocaleString()}
        sub="across all uploads"
        icon={Building2}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
      />
      <StatCard
        label="Scored"
        value={stats.scored.toLocaleString()}
        sub={`${scoreRate}% completion rate`}
        icon={CheckCircle2}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        label="Opportunities"
        value={stats.opportunities.toLocaleString()}
        sub="low-score businesses"
        icon={Target}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        highlight
      />
      <StatCard
        label="Avg Score"
        value={`${stats.avgScore}`}
        sub="out of 100 points"
        icon={TrendingUp}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard
        label="Emails Sent"
        value={stats.emailsSent.toLocaleString()}
        sub={`${stats.emailsOpened} opened · ${stats.sitesClicked} clicked site`}
        icon={Mail}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        label="Won"
        value={stats.won.toLocaleString()}
        sub={`${conversionRate}% conversion`}
        icon={Trophy}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />
      <StatCard
        label="No Website"
        value={stats.noWebsite.toLocaleString()}
        sub="biggest pain point"
        icon={Globe}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard
        label="Outreach Funnel"
        value={`${stats.emailsSent} → ${stats.emailsOpened} → ${stats.sitesClicked}`}
        sub="sent → opened → clicked"
        icon={Mail}
        iconBg="bg-teal-100"
        iconColor="text-teal-600"
      />
    </div>
  )
}
