'use client'

import { InquiryProvider } from '@/contexts/InquiryContext'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <InquiryProvider>
      {children}
    </InquiryProvider>
  )
}