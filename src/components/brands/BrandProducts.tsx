'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

import { BrandCategory } from '@/lib/brandData';

interface BrandProductsProps {
  brand: {
    _id: string;
    name: string;
    nameEn: string;
    slug: { current: string };
    description: string;
    website?: string;
    country?: string;
    founded?: number;
  };
  categories: BrandCategory[];
}

export default function BrandProducts({ brand, categories }: BrandProductsProps) {
  const locale = useLocale();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Brand Navigation */}
        <nav className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <Link
                href={`/${locale}/brands/${brand.slug.current}/about`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                关于品牌
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug.current}/products`}
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
              >
                产品分类
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug.current}/solutions`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                解决方案
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug.current}/support`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                技术支持
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug.current}/news`}
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
            {brand.name} 产品分类
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            发现{brand.name}的完整产品线，从微控制器到传感器，为您的项目找到完美的解决方案
          </p>
        </div>

        {/* Product Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {category.productCount}+ 产品
                  </span>
                </div>
                <p className="text-primary-100">{category.description}</p>
              </div>

              {/* Category Content */}
              <div className="p-6">
                {/* Subcategories */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">产品子类</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.subcategories.slice(0, 6).map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/${locale}/brands/${brand.slug.current}/products/${category.slug.current}?subcategory=${sub.slug.current}`}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 text-sm">{sub.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{sub.description}</p>
                        <span className="text-xs text-primary-600 font-medium">
                          {sub.productCount} 个产品
                        </span>
                      </Link>
                    ))}
                    {category.subcategories.length > 6 && (
                      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          +{category.subcategories.length - 6} 更多...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Statistics */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">分类统计</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{category.productCount}</div>
                      <div className="text-sm text-gray-600">产品型号</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{category.subcategories.length}</div>
                      <div className="text-sm text-gray-600">产品子类</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/${locale}/brands/${brand.slug.current}/products/${category.slug.current}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    产品筛选
                  </Link>
                  <Link
                    href={`/${locale}/contact?subject=${category.name}选型咨询`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    选型咨询
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Search & Filter CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            找不到合适的产品分类？
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            使用我们的高级产品搜索功能，通过参数筛选快速找到满足您需求的{brand.name}产品
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {categories.length > 0 && (
              <Link
                href={`/${locale}/brands/${brand.slug.current}/products/${categories[0].slug.current}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                产品筛选
              </Link>
            )}
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              咨询FAE
            </Link>
          </div>
        </section>

        {/* Technical Support Links */}
        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">技术资源</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/${locale}/brands/${brand.slug.current}/support`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">技术文档</h4>
                <p className="text-sm text-gray-600">应用笔记和选型指南</p>
              </div>
            </Link>
            
            <Link
              href={`/${locale}/brands/${brand.slug.current}/solutions`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">解决方案</h4>
                <p className="text-sm text-gray-600">行业应用方案</p>
              </div>
            </Link>
            
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">官方网站</h4>
                  <p className="text-sm text-gray-600">访问{brand.name}官网</p>
                </div>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}