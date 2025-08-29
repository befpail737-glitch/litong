'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandSupportProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
  };
}

export default function BrandSupport({ brand }: BrandSupportProps) {
  const locale = useLocale();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Brand Navigation */}
        <nav className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <Link
                href={`/${locale}/brands/${brand.slug}/about`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                关于品牌
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/products`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                产品分类
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/solutions`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                解决方案
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/support`}
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
              >
                技术支持
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/news`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                新闻中心
              </Link>
            </nav>
          </div>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {brand.name} 技术支持
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            获取专业的技术文档、应用指南和故障排除方案，我们的FAE团队为您提供全方位技术支持
          </p>
        </div>

        {/* Contact FAE CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            需要技术支持？
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            我们的专业FAE团队拥有丰富的{brand.name}产品经验，可为您提供一对一的技术支持和定制化解决方案。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact?subject=${brand.name}技术支持咨询`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              联系FAE
            </Link>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              访问官网
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}