'use client'

import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadsApi, type Upload } from '@/lib/api'
import { useUploadStatus } from '@/hooks/useUploadStatus'
import { timeAgo, formatDate } from '@/lib/utils'
import { FileText, Trash2, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UploadCardProps {
  upload: Upload
}

const STATUS_STYLES = {
  PENDING: 'bg-slate-100 text-slate-500',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SCORING: 'bg-indigo-100 text-indigo-700',
  DONE: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

const STATUS_LABELS = {
  PENDING: 'Pending',
  PROCESSING: 'Parsing CSV…',
  SCORING: 'Scoring…',
  DONE: 'Done',
  FAILED: 'Failed',
}

export function UploadCard({ upload }: UploadCardProps) {
  const queryClient = useQueryClient()
  const isActive = upload.status === 'PROCESSING' || upload.status === 'SCORING'

  const { data: statusData } = useUploadStatus(upload.id, isActive)
  const currentStatus = statusData?.status ?? upload.status
  const processedRows = statusData?.processedRows ?? upload.processedRows
  const totalRows = statusData?.totalRows ?? upload.totalRows

  const deleteMutation = useMutation({
    mutationFn: () => uploadsApi.delete(upload.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
  })

  const progress = totalRows > 0 ? Math.round((processedRows / totalRows) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate text-sm">{upload.fileName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{timeAgo(upload.createdAt)}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[currentStatus]}`}>
          {isActive && currentStatus === 'SCORING' ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              {STATUS_LABELS[currentStatus]}
            </span>
          ) : (
            STATUS_LABELS[currentStatus]
          )}
        </span>
      </div>

      {/* Progress bar (active uploads) */}
      {isActive && totalRows > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{processedRows.toLocaleString()} / {totalRows.toLocaleString()} rows</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{(upload._count?.businesses ?? 0).toLocaleString()} businesses</span>
        <span className="text-slate-200">·</span>
        <span>{formatDate(upload.createdAt)}</span>
        {statusData?.opportunities != null && statusData.opportunities > 0 && (
          <>
            <span className="text-slate-200">·</span>
            <span className="text-indigo-600 font-medium">
              {statusData.opportunities} opportunities
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Link href={`/dashboard/uploads/${upload.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            <ChevronRight className="w-3.5 h-3.5" />
            View businesses
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteMutation.mutate()}
          loading={deleteMutation.isPending}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
