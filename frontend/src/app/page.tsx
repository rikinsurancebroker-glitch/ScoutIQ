'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Loader2,
  Search,
  Zap,
  Mail,
  BarChart3,
  ArrowRight,
  Upload,
  Sparkles,
  QrCode,
  CheckCircle2,
} from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    )
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const loginUrl = `${apiUrl}/api/auth/google`

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[380px] w-[380px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-1/4 -right-32 h-[380px] w-[380px] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-900/50">
              <Search className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">The Human Collective</span>
          </div>
          <a
            href={loginUrl}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100"
          >
            <GoogleIcon />
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Sign in</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <section className="flex flex-col items-center pt-20 pb-24 text-center md:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered B2B Outreach
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Find leads hiding in
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}plain sight
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            Upload a CSV of local businesses. The Human Collective scores their online presence,
            auto-generates a free website preview for low-scorers, and sends personalised outreach —
            all automatically.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={loginUrl}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-base font-semibold text-white shadow-2xl shadow-indigo-900/50 transition-all hover:-translate-y-0.5 hover:shadow-indigo-800/60"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            No credit card required · Sign in with Google
          </p>

          {/* Stats */}
          <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
            {[
              { value: '25+', label: 'Presence signals analysed' },
              { value: '7-day', label: 'Live preview sites' },
              { value: '100%', label: 'Automated outreach' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-950/40 px-6 py-7 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl font-bold text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 py-16">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              From spreadsheet to sent, in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload your list',
                desc: 'Drop in a CSV of local businesses. We parse and de-duplicate every row automatically.',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'Score & generate',
                desc: 'Each business is scored across 25+ signals, and low-scorers get a bespoke preview site built by AI.',
              },
              {
                step: '03',
                icon: Mail,
                title: 'Reach out',
                desc: 'Personalised emails with a QR code to their free preview go out — you just watch replies land.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-indigo-400/30 hover:bg-white/[0.06]"
              >
                <span className="absolute -right-2 -top-4 text-7xl font-black text-white/[0.04] transition-colors group-hover:text-indigo-500/10">
                  {step}
                </span>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Everything you need
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              A full outreach engine, out of the box
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: BarChart3,
                color: 'text-blue-300',
                ring: 'from-blue-500/20 to-cyan-500/20',
                title: 'Presence Scoring',
                desc: 'Analyse 25+ signals — website, Google, social media, hours, reviews — for an actionable score out of 100.',
              },
              {
                icon: Zap,
                color: 'text-purple-300',
                ring: 'from-purple-500/20 to-fuchsia-500/20',
                title: 'AI Site Previews',
                desc: 'Auto-generate a beautiful 7-day live preview website for every business scoring below your threshold.',
              },
              {
                icon: QrCode,
                color: 'text-green-300',
                ring: 'from-green-500/20 to-emerald-500/20',
                title: 'Smart Outreach',
                desc: "Personalised cold emails with QR codes linking to each business's free preview, sent automatically.",
              },
            ].map(({ icon: Icon, color, ring, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-left transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ring} ring-1 ring-white/10`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-950 px-8 py-14 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[100px]" />
            <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">
              Ready to turn a CSV into conversations?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
              Sign in and run your first list in minutes. No setup, no credit card.
            </p>
            <a
              href={loginUrl}
              className="group relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-slate-900 shadow-2xl transition-all hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <GoogleIcon />
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Search className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">The Human Collective</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} The Human Collective · AI-powered local business outreach
          </p>
        </div>
      </footer>
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
