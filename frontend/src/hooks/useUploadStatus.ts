'use client'

import { useQuery } from '@tanstack/react-query'
import { uploadsApi } from '@/lib/api'

export function useUploadStatus(uploadId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['upload-status', uploadId],
    queryFn: () => uploadsApi.status(uploadId!),
    enabled: !!uploadId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data
      const status = data?.status
      if (!status) return 3000
      if (status === 'FAILED') return false
      // Website generation runs after scoring finishes (status DONE), so keep
      // polling until every opportunity has a generated website.
      if (status === 'DONE') {
        const stillGenerating = (data?.generated ?? 0) < (data?.opportunities ?? 0)
        return stillGenerating ? 3000 : false
      }
      return 2000
    },
    staleTime: 0,
  })
}
