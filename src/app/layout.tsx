import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LiTong Electronics - 力通电子',
  description: '专业电子元件代理商',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}