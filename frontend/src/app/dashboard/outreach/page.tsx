'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type OutreachBusiness } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import {
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Send,
  CalendarClock,
  AlertCircle,
  Loader2,
} from 'lucide-react'

function EmailStatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-xs text-slate-400">—</span>
  const map: Record<string, { label: string; className: string }> = {
    SENT: { label: 'Sent', className: 'bg-green-100 text-green-700' },
    PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
    FAILED: { label: 'Failed', className: 'bg-red-100 text-red-700' },
    BOUNCED: { label: 'Bounced', className: 'bg-orange-100 text-orange-700' },
  }
  const cfg = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

function ScoreBadge({ score }: { score: number | undefined }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const color = score >= 60 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-500'
  return <span className={`text-sm font-semibold ${color}`}>{score}</span>
}

export default function OutreachPage() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['outreach-ready'],
    queryFn: adminApi.outreachReady,
  })

  const { mutate: sendEmails, isPending: isSending } = useMutation({
    mutationFn: async () => {
      const ids = Array.from(selected)
      let scheduledFor: string | undefined
      if (scheduleMode === 'later' && scheduledDate) {
        scheduledFor = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString()
      }
      return adminApi.scheduleEmails(ids, scheduledFor)
    },
    onSuccess: (result) => {
      setToast({ type: 'success', msg: result.message })
      setSelected(new Set())
      queryClient.invalidateQueries({ queryKey: ['outreach-ready'] })
      setTimeout(() => setToast(null), 5000)
    },
    onError: (err: Error) => {
      setToast({ type: 'error', msg: err.message })
      setTimeout(() => setToast(null), 5000)
    },
  })

  function toggleAll() {
    if (selected.size === businesses.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(businesses.map((b) => b.id)))
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div>
      <Header
        title="Email Outreach"
        subtitle="Send personalised emails to businesses with generated website previews"
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Schedule picker */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleMode('now')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                scheduleMode === 'now'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Send Now
            </button>
            <button
              onClick={() => setScheduleMode('later')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                scheduleMode === 'later'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Schedule
            </button>
          </div>

          {scheduleMode === 'later' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                min={minDate}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* Send button */}
          <button
            onClick={() => sendEmails()}
            disabled={selected.size === 0 || isSending || (scheduleMode === 'later' && !scheduledDate)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : scheduleMode === 'later' ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {isSending
              ? 'Queuing...'
              : scheduleMode === 'later'
              ? `Schedule ${selected.size} Email${selected.size !== 1 ? 's' : ''}`
              : `Send ${selected.size} Email${selected.size !== 1 ? 's' : ''} Now`}
          </button>
        </div>

        {scheduleMode === 'later' && scheduledDate && (
          <p className="mt-3 text-xs text-indigo-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Emails will be delivered on {new Date(`${scheduledDate}T${scheduledTime}:00`).toLocaleString()}
          </p>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No businesses ready for outreach</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Businesses appear here once they have a generated website preview and a valid email address.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === businesses.length && businesses.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Business</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">Score</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">Email Status</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {businesses.map((biz: OutreachBusiness) => (
                <tr
                  key={biz.id}
                  onClick={() => toggle(biz.id)}
                  className={`cursor-pointer transition-colors ${
                    selected.has(biz.id) ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(biz.id)}
                      onChange={() => toggle(biz.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{biz.name}</p>
                    {biz.address && (
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{biz.address}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{biz.category ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBadge score={biz.presenceScore?.total} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{biz.email ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <EmailStatusBadge status={biz.emailLog?.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {biz.websiteGen ? (
                      <a
                        href={biz.websiteGen.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-700 text-xs"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-xs flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> No site
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            {businesses.length} business{businesses.length !== 1 ? 'es' : ''} ready ·{' '}
            {selected.size} selected
          </div>
        </div>
      )}
    </div>
  )
}
