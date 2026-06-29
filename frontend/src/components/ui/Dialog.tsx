'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export function DialogContent({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-top-4',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <RadixDialog.Title className="text-lg font-semibold text-slate-900">
                {title}
              </RadixDialog.Title>
            )}
            {description && (
              <RadixDialog.Description className="text-sm text-slate-500 mt-0.5">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-4">
            <X className="w-4 h-4" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
