import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '力通电子 - 专业电子元器件分销商',
    template: '%s | 力通电子'
  },
  description: '力通电子致力于为客户提供高品质的电子元器件产品和专业的技术支持服务，涵盖半导体、传感器、连接器等多个产品类别。',
  keywords: ['电子元器件', '半导体', '传感器', '连接器', '电子分销', '力通电子'],
  authors: [{ name: '力通电子' }],
  creator: '力通电子',
  publisher: '力通电子',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://litong.pages.dev'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh',
      'en': '/en',
      'ja': '/ja',
      'ko': '/ko',
    },
  },
  openGraph: {
    title: '力通电子 - 专业电子元器件分销商',
    description: '力通电子致力于为客户提供高品质的电子元器件产品和专业的技术支持服务',
    url: '/',
    siteName: '力通电子',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '力通电子',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '力通电子 - 专业电子元器件分销商',
    description: '力通电子致力于为客户提供高品质的电子元器件产品和专业的技术支持服务',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
              <div className="flex h-14 items-center">
                <div className="mr-4 flex">
                  <a className="mr-6 flex items-center space-x-2" href="/">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-bold text-xl">力通电子</span>
                  </a>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <a className="transition-colors hover:text-blue-600" href="/products">产品列表</a>
                    <a className="transition-colors hover:text-blue-600" href="/brands">品牌列表</a>
                    <a className="transition-colors hover:text-blue-600" href="/about">关于我们</a>
                  </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <div className="w-full flex-1 md:w-auto md:flex-none">
                    <button className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-3 py-1 rounded-md text-sm h-8 w-40 lg:w-64 text-muted-foreground">
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      搜索产品型号...
                    </button>
                  </div>
                  <nav className="flex items-center space-x-2">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2">
                      立即询价
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">产品分类</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a className="text-gray-600 hover:text-blue-600" href="/category/semiconductors">半导体</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/category/sensors">传感器</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/category/connectors">连接器</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/category/passive">被动元件</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">服务支持</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a className="text-gray-600 hover:text-blue-600" href="/support/technical">技术支持</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/support/documentation">产品资料</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/support/samples">样品申请</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/support/training">培训服务</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">关于力通</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a className="text-gray-600 hover:text-blue-600" href="/about/company">公司简介</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/about/team">团队介绍</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/about/news">新闻动态</a></li>
                    <li><a className="text-gray-600 hover:text-blue-600" href="/about/careers">加入我们</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">联系方式</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>深圳市南山区科技园</p>
                    <p>电话: +86-755-xxxxxxxx</p>
                    <p>邮箱: info@litongtech.com</p>
                    <div className="flex space-x-2 pt-2">
                      <a className="text-gray-400 hover:text-blue-600" href="#">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a className="text-gray-400 hover:text-blue-600" href="#">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                <p>&copy; 2024 力通电子. 版权所有. | 粤ICP备xxxxxxxx号</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
