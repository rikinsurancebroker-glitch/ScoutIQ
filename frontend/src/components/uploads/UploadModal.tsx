'use client'

import { useState, useRef, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadsApi } from '@/lib/api'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Upload, FileText, CheckCircle2, XCircle, CloudUpload } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'select' | 'uploading' | 'processing' | 'done' | 'error'

export function UploadModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  function reset() {
    setStep('select')
    setFile(null)
    setProgress(0)
    setUploadId(null)
    setErrorMsg('')
  }

  const createMutation = useMutation({
    mutationFn: async (f: File) => {
      setStep('uploading')
      setProgress(10)

      const { uploadId: id, signedUrl } = await uploadsApi.create(f.name)
      setUploadId(id)
      setProgress(30)

      await fetch(signedUrl, {
        method: 'PUT',
        body: f,
        headers: { 'Content-Type': 'text/csv' },
      })
      setProgress(70)

      await uploadsApi.confirm(id)
      setProgress(100)
      setStep('processing')

      await queryClient.invalidateQueries({ queryKey: ['uploads'] })
      return id
    },
    onError: (e) => {
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed')
      setStep('error')
    },
  })

  const handleFile = useCallback(
    (f: File) => {
      if (!f.name.endsWith('.csv')) {
        setErrorMsg('Only CSV files are supported')
        setStep('error')
        return
      }
      setFile(f)
      createMutation.mutate(f)
    },
    [createMutation]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="w-4 h-4" />
          New Upload
        </Button>
      </DialogTrigger>

      <DialogContent
        title="Upload CSV"
        description="Upload a CSV of local businesses. We'll score and process them automatically."
      >
        {step === 'select' && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                dragOver
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              )}
            >
              <CloudUpload
                className={cn('w-10 h-10 mx-auto mb-3', dragOver ? 'text-indigo-500' : 'text-slate-300')}
              />
              <p className="text-sm font-medium text-slate-700">
                Drop your CSV here, or{' '}
                <span className="text-indigo-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports name, email, phone, website, social links, Google data, business hours
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        )}

        {step === 'uploading' && (
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-indigo-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file?.name}</p>
                <p className="text-xs text-slate-400">{((file?.size ?? 0) / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {progress < 50 ? 'Creating upload...' : progress < 80 ? 'Uploading file...' : 'Confirming...'}
            </p>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Upload complete!</h3>
            <p className="text-sm text-slate-500 mb-6">
              Your CSV is queued for scoring. Processing typically takes 1–5 minutes depending on size.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => { setOpen(false); reset() }}
              >
                Close
              </Button>
              {uploadId && (
                <Button
                  onClick={() => {
                    setOpen(false)
                    reset()
                    window.location.href = `/dashboard/uploads/${uploadId}`
                  }}
                >
                  View progress
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Upload failed</h3>
            <p className="text-sm text-slate-500 mb-6">{errorMsg}</p>
            <Button variant="secondary" onClick={reset}>
              Try again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
