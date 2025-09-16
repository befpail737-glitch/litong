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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elec-distributor.com'),
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
  return children;
}
