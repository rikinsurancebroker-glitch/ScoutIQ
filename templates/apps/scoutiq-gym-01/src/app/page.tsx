import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: '#FF6B1A' }}>
          ScoutIQ Preview
        </p>
        <h1 className="font-display text-3xl font-bold uppercase text-white mb-4">
          Gym Template
        </h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          This template renders a business preview at{' '}
          <code style={{ color: '#FF8B3D' }}>/{'{businessId}'}</code>. Open a full preview link
          from your dashboard, or view the local design preview below.
        </p>
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-black hover:scale-105 transition-transform"
          style={{ background: '#FF6B1A' }}
        >
          View design preview →
        </Link>
      </div>
    </div>
  )
}
