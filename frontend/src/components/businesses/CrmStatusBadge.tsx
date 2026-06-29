'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { businessesApi, type CrmStatus } from '@/lib/api'
import { CRM_LABELS, CRM_COLORS, cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'

const CRM_ORDER: CrmStatus[] = [
  'NOT_CONTACTED',
  'EMAIL_SENT',
  'REPLIED',
  'INTERESTED',
  'NEGOTIATING',
  'WON',
  'LOST',
  'SKIPPED',
]

interface CrmStatusBadgeProps {
  businessId: string
  status: CrmStatus
  queryKey?: unknown[]
}

export function CrmStatusBadge({ businessId, status, queryKey }: CrmStatusBadgeProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newStatus: CrmStatus) => businessesApi.updateCrm(businessId, newStatus),
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }
      queryClient.invalidateQueries({ queryKey: ['business', businessId] })
    },
  })

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 focus:outline-none',
            CRM_COLORS[status]
          )}
        >
          {CRM_LABELS[status]}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 min-w-[180px] animate-in fade-in-0 zoom-in-95"
          sideOffset={4}
        >
          {CRM_ORDER.map((s) => (
            <DropdownMenu.Item
              key={s}
              onSelect={() => mutation.mutate(s)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  CRM_COLORS[s].split(' ')[0].replace('bg-', 'bg-').replace('100', '400')
                )}
              />
              <span className="flex-1 text-slate-700">{CRM_LABELS[s]}</span>
              {s === status && <Check className="w-3.5 h-3.5 text-indigo-500" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
