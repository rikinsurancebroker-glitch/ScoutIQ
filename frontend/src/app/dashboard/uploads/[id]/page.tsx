'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { businessesApi, type BusinessListParams } from '@/lib/api'
import { useUploadStatus } from '@/hooks/useUploadStatus'
import { Header } from '@/components/layout/Header'
import { BusinessTable } from '@/components/businesses/BusinessTable'
import { BusinessFilters } from '@/components/businesses/BusinessFilters'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_PARAMS: BusinessListParams = {
  sort: 'created_desc',
  page: 1,
  limit: 50,
}

export default function UploadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [params, setParams] = useState<BusinessListParams>({ ...DEFAULT_PARAMS, uploadId: id })

  const { data: statusData, isLoading: statusLoading } = useUploadStatus(
    id,
    true
  )

  const isProcessing =
    statusData?.status === 'PROCESSING' || statusData?.status === 'SCORING'

  // After scoring (DONE), websites are still being generated for opportunities.
  const isGeneratingSites =
    statusData?.status === 'DONE' &&
    (statusData?.generated ?? 0) < (statusData?.opportunities ?? 0)

  const isActive = isProcessing || isGeneratingSites

  const qKey = ['businesses', params]

  const { data, isLoading } = useQuery({
    queryKey: qKey,
    queryFn: () => businessesApi.list(params),
    refetchInterval: isActive ? 5000 : false,
  })

  function updateParams(updates: Partial<BusinessListParams>) {
    setParams((p) => ({ ...p, ...updates, page: 1 }))
  }

  function resetFilters() {
    setParams({ ...DEFAULT_PARAMS, uploadId: id })
  }

  const total = data?.meta.total ?? 0
  const totalPages = data?.meta.totalPages ?? 1
  const page = params.page ?? 1

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard/uploads" className="hover:text-indigo-600 transition-colors">
          Uploads
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium">Upload detail</span>
      </div>

      <Header
        title="Businesses"
        subtitle={
          statusLoading
            ? 'Loading...'
            : isProcessing
            ? `Processing… ${statusData?.scored ?? 0} scored so far`
            : isGeneratingSites
            ? `Building websites… ${statusData?.generated ?? 0} / ${statusData?.opportunities ?? 0} ready`
            : `${total.toLocaleString()} businesses · ${statusData?.opportunities ?? 0} opportunities`
        }
      />

      {/* Processing banner */}
      {isProcessing && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4 text-sm text-indigo-700">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>
            Scoring in progress — {statusData?.processedRows ?? 0} / {statusData?.totalRows ?? '?'} rows processed.
            Page auto-refreshes every 5 seconds.
          </span>
        </div>
      )}

      {/* Website generation banner */}
      {isGeneratingSites && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4 text-sm text-indigo-700">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>
            Scoring complete — generating websites for opportunities ({statusData?.generated ?? 0} /{' '}
            {statusData?.opportunities ?? 0} ready). Page auto-refreshes every 5 seconds.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <BusinessFilters params={params} onChange={updateParams} onReset={resetFilters} />

        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <BusinessTable businesses={data?.data ?? []} queryKey={qKey} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages} · {total.toLocaleString()} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
