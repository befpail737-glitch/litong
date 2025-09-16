import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        力通电子 - 专业电子元器件代理商
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/brands" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4">品牌代理</h2>
          <p className="text-gray-600">浏览我们代理的国际知名品牌</p>
        </Link>

        <Link href="/products" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4">产品目录</h2>
          <p className="text-gray-600">查找各类电子元器件产品</p>
        </Link>

        <Link href="/solutions" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4">解决方案</h2>
          <p className="text-gray-600">专业的行业解决方案</p>
        </Link>
      </div>
    </div>
  );
}