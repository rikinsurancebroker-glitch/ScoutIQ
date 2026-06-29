'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Search, Zap, Mail, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    )
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">ScoutIQ</span>
        </div>
        <a
          href={`${apiUrl}/api/auth/google`}
          className="flex items-center gap-2 bg-white text-slate-800 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors shadow-lg"
        >
          <GoogleIcon />
          Sign in with Google
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered B2B Outreach
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-4xl mb-6">
          Find leads hiding in
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {' '}plain sight
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Upload a CSV of local businesses. ScoutIQ scores their online presence, auto-generates a
          free website preview for low-scorers, and sends personalised outreach emails — all automatically.
        </p>

        <a
          href={`${apiUrl}/api/auth/google`}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-800/50 hover:-translate-y-0.5"
        >
          Get started free
        </a>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
          {[
            {
              icon: BarChart3,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              title: 'Presence Scoring',
              desc: 'Analyse 25+ signals — website, Google, social media, hours, reviews — to produce an actionable score out of 100.',
            },
            {
              icon: Zap,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              title: 'AI Site Previews',
              desc: 'Auto-generate a beautiful 7-day live preview website for every business scoring below your threshold.',
            },
            {
              icon: Mail,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              title: 'Smart Outreach',
              desc: 'Personalised cold emails with QR codes linking to the business\'s free preview, sent automatically.',
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/8 transition-colors"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
