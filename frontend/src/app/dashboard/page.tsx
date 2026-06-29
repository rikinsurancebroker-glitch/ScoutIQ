'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { ExpiryStatsPanel } from '@/components/dashboard/ExpiryStats'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Upload } from 'lucide-react'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.stats(),
  })

  const { data: expiryStats } = useQuery({
    queryKey: ['dashboard', 'expiry-stats'],
    queryFn: dashboardApi.expiryStats,
  })

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Your outreach pipeline at a glance"
        action={
          <Link href="/dashboard/uploads">
            <Button size="md">
              <Upload className="w-4 h-4" />
              New Upload
            </Button>
          </Link>
        }
      />

      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
            <CategoryChart data={stats.categoryBreakdown} />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-400 text-sm">No data yet — upload a CSV to get started</p>
              <Link href="/dashboard/uploads" className="mt-4 inline-block">
                <Button size="sm" variant="secondary">
                  <Upload className="w-3.5 h-3.5" />
                  Upload CSV
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div>
          <ExpiryStatsPanel data={expiryStats} />
        </div>
      </div>
    </div>
  )
}
