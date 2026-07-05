'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLogout, useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Upload,
  Building2,
  LogOut,
  Search,
  ChevronRight,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/uploads', label: 'Uploads', icon: Upload, exact: false },
  { href: '/dashboard/outreach', label: 'Email Outreach', icon: Mail, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { mutate: logout, isPending } = useLogout()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="w-64 h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-40 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">ScoutIQ</span>
            <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider leading-none">
              B2B Outreach
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-2 mb-2">
          Menu
        </div>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          )
        })}

        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-2 mt-5 mb-2">
          Businesses
        </div>
        <Link
          href="/dashboard/uploads"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">All Businesses</span>
        </Link>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-slate-700"
            />
          ) : (
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name ?? '...'}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
