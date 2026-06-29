'use client'

import { useQuery } from '@tanstack/react-query'
import { uploadsApi } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import { UploadModal } from '@/components/uploads/UploadModal'
import { UploadCard } from '@/components/uploads/UploadCard'
import { CloudUpload } from 'lucide-react'

export default function UploadsPage() {
  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ['uploads'],
    queryFn: uploadsApi.list,
  })

  return (
    <div>
      <Header
        title="Uploads"
        subtitle="Manage your CSV uploads and track processing status"
        action={<UploadModal />}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-44 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded w-full mb-2" />
              <div className="h-2 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <CloudUpload className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No uploads yet</h3>
          <p className="text-slate-400 text-sm max-w-xs mb-6">
            Upload a CSV of local businesses to start scoring and generating outreach.
          </p>
          <UploadModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {uploads.map((upload) => (
            <UploadCard key={upload.id} upload={upload} />
          ))}
        </div>
      )}
    </div>
  )
}
