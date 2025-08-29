import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '电子元件核心代理 | 提供正品原装现货 | LiTong',
  description: '力通是电子元件核心代理，长期稳定供应提供正品原装现货。并提供技术支持和优势价格，欢迎咨询。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="robots" content="noindex, follow" />
      </head>
      <body>{children}</body>
    </html>
  );
}