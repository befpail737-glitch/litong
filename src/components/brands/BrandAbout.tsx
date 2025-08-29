'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandAboutProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
    employees: string;
    revenue: string;
    about: {
      overview: string;
      history: Array<{
        year: string;
        milestone: string;
      }>;
      vision: string;
      mission: string;
      values: Array<{
        title: string;
        description: string;
      }>;
      markets: Array<{
        name: string;
        percentage: number;
        description: string;
      }>;
    };
  };
}

export default function BrandAbout({ brand }: BrandAboutProps) {
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
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">成立时间</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.founded}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">总部</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.headquarters}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">员工数</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.employees}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">年营收</dt>
                    <dd className="text-lg font-semibold text-gray-900">{brand.revenue}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">公司概述</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 leading-relaxed text-lg">{brand.about.overview}</p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">愿景使命</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                企业愿景
              </h3>
              <p className="text-gray-700 leading-relaxed">{brand.about.vision}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                企业使命
              </h3>
              <p className="text-gray-700 leading-relaxed">{brand.about.mission}</p>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">核心价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brand.about.values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Development History */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">发展历程</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
              <div className="space-y-8">
                {brand.about.history.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.year}
                      </div>
                    </div>
                    <div className="ml-8">
                      <p className="text-gray-700 leading-relaxed">{item.milestone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Segments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">主要市场</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brand.about.markets.map((market, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                  <span className="text-2xl font-bold text-primary-600">{market.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${market.percentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">{market.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            选择{brand.name}，选择可靠的合作伙伴
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            力通电子作为{brand.name}授权代理商，为您提供原装正品、技术支持和优质服务。
            让我们携手共创美好未来。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              联系我们
            </Link>
            <Link
              href={`/${locale}/brands/${brand.slug}/products`}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
            >
              查看产品分类
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}