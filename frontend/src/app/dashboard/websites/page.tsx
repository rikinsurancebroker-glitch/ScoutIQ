'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi, type GeneratedSite } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import {
  Globe,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
  X,
  LayoutTemplate,
  Clock,
} from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  LIVE: 'bg-green-100 text-green-700',
  EXTENDED: 'bg-blue-100 text-blue-700',
  CLAIMED: 'bg-indigo-100 text-indigo-700',
  EXPIRED: 'bg-orange-100 text-orange-700',
  DELETED: 'bg-slate-100 text-slate-500',
}

function ScoreBadge({ score }: { score: number | undefined }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const color = score >= 60 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-500'
  return <span className={`text-sm font-semibold ${color}`}>{score}</span>
}

// ─── Full-screen preview modal ────────────────────────────────────────────────

function PreviewModal({ site, onClose }: { site: GeneratedSite; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-800 text-base truncate">{site.business.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                <LayoutTemplate className="w-3.5 h-3.5" />
                {site.templateId}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">{site.business.category ?? 'Uncategorised'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={site.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Open <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <iframe
          src={site.siteUrl}
          title={site.business.name}
          className="flex-1 w-full border-0 bg-white"
        />
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function SiteCard({ site, onPreview }: { site: GeneratedSite; onPreview: () => void }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all">
      {/* Thumbnail preview */}
      <div
        className="relative h-52 overflow-hidden bg-slate-100 cursor-pointer border-b border-slate-100"
        onClick={onPreview}
      >
        <iframe
          src={site.siteUrl}
          title={site.business.name}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: '1280px', height: '1000px', transform: 'scale(0.32)' }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow">
            <Eye className="w-3.5 h-3.5" /> Preview
          </span>
        </div>
        {/* Template badge */}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-sm">
          <LayoutTemplate className="w-3 h-3" />
          {site.templateId}
        </span>
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            STATUS_STYLES[site.status] ?? 'bg-slate-100 text-slate-600'
          }`}
        >
          {site.status}
        </span>
      </div>

      {/* Meta */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">{site.business.name}</p>
            <p className="text-xs text-slate-400 truncate">{site.business.category ?? 'Uncategorised'}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <ScoreBadge score={site.business.presenceScore?.total} />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Score</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {site.viewCount} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(site.expiresAt) > new Date()
              ? `Expires ${new Date(site.expiresAt).toLocaleDateString()}`
              : 'Expired'}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <a
            href={site.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Open <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebsitesPage() {
  const [templateFilter, setTemplateFilter] = useState<string>('all')
  const [preview, setPreview] = useState<GeneratedSite | null>(null)

  const { data: sites = [], isLoading, isError } = useQuery({
    queryKey: ['generated-websites'],
    queryFn: adminApi.websites,
  })

  const templates = useMemo(() => {
    const set = new Set(sites.map((s) => s.templateId))
    return Array.from(set).sort()
  }, [sites])

  const filtered = useMemo(
    () => (templateFilter === 'all' ? sites : sites.filter((s) => s.templateId === templateFilter)),
    [sites, templateFilter]
  )

  return (
    <div>
      <Header
        title="Generated Websites"
        subtitle="Preview every generated site and the template it uses"
      />

      {preview && <PreviewModal site={preview} onClose={() => setPreview(null)} />}

      {/* Template filter */}
      {templates.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setTemplateFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              templateFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({sites.length})
          </button>
          {templates.map((t) => {
            const count = sites.filter((s) => s.templateId === t).length
            return (
              <button
                key={t}
                onClick={() => setTemplateFilter(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  templateFilter === t
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                {t} ({count})
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-red-500">Failed to load websites. Try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <Globe className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No generated websites yet</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Sites appear here once businesses are scored below your threshold and a preview is generated.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((site) => (
              <SiteCard key={site.business.id} site={site} onPreview={() => setPreview(site)} />
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400 text-center">
            Showing {filtered.length} of {sites.length} generated site{sites.length !== 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  )
}
