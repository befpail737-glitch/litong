'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandDetailProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      productCount: number;
      subcategories: string[];
    }>;
    solutions: Array<{
      title: string;
      description: string;
    }>;
    technicalSupport: Array<{
      title: string;
      type: string;
      slug: string;
    }>;
    news: Array<{
      title: string;
      publishedAt: string;
      slug: string;
    }>;
  };
}

export default function BrandDetail({ brand }: BrandDetailProps) {
  const locale = useLocale();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Brand Header */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600">{brand.name.substring(0, 2)}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    授权代理
                  </span>
                </div>
                <p className="text-lg text-gray-600 mb-6">{brand.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">成立时间</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.founded}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">总部</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.headquarters}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">产品类别</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.categories.length} 个</dd>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                  >
                    访问官网
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
                  >
                    联系询价
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
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
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
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

        {/* Product Categories */}
        <section id="products" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">产品分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brand.categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/brands/${brand.slug}/${category.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {category.productCount}+ 产品
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span key={sub} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-700">
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-700">
                      +{category.subcategories.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-end">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">解决方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brand.solutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 text-sm">{solution.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Support */}
        <section id="support" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">技术支持</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brand.technicalSupport.map((doc, index) => (
              <Link
                key={index}
                href={`/${locale}/technical-support/${doc.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {doc.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      doc.type === 'selection-guide' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {doc.type === 'selection-guide' ? '选型指南' : '应用笔记'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* News */}
        <section id="news" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">新闻中心</h2>
          <div className="space-y-4">
            {brand.news.map((news, index) => (
              <Link
                key={index}
                href={`/${locale}/news/${news.slug}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {news.title}
                    </h3>
                    <time className="text-sm text-gray-500">{news.publishedAt}</time>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            需要{brand.name}产品支持？
          </h2>
          <p className="text-gray-600 mb-6">
            我们的专业FAE团队提供选型指导、技术支持和现货供应服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              联系技术支持
            </Link>
            <Link
              href={`/${locale}/products?brand=${brand.slug}`}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
            >
              查看所有产品
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}