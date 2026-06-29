'use client'

import { useQuery } from '@tanstack/react-query'
import { uploadsApi } from '@/lib/api'

export function useUploadStatus(uploadId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['upload-status', uploadId],
    queryFn: () => uploadsApi.status(uploadId!),
    enabled: !!uploadId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!status) return 3000
      if (status === 'DONE' || status === 'FAILED') return false
      return 2000
    },
    staleTime: 0,
  })
}
