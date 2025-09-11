import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio - 力通电子内容管理',
  description: '力通电子网站内容管理系统',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="sanity-studio">
        {children}
      </body>
    </html>
  )
}