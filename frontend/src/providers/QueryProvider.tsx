'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => {
              if (axios401(error)) return false
              return failureCount < 2
            },
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function axios401(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const e = error as { response?: { status?: number } }
    return e.response?.status === 401
  }
  return false
}
