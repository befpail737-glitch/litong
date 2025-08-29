import type { Metadata } from 'next';
import './globals.css';

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
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">LiTong Electronics</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-blue-600">首页</a>
                  <a href="/brands" className="text-gray-700 hover:text-blue-600">品牌列表</a>
                  <a href="/products" className="text-gray-700 hover:text-blue-600">产品列表</a>
                  <a href="/about" className="text-gray-700 hover:text-blue-600">关于我们</a>
                  <a href="/contact" className="text-gray-700 hover:text-blue-600">联系我们</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p>&copy; 2024 LiTong Electronics. 电子元件代理 | 芯片现货供应商</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}