'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandSolutionsProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
    solutions: Array<{
      id: string;
      title: string;
      slug: string;
      category: string;
      image: string;
      summary: string;
      description: string;
      keyFeatures: string[];
      applications: string[];
      blockDiagram: string;
      bomList: Array<{
        partNumber: string;
        description: string;
        function: string;
        package: string;
        link: string;
      }>;
      technicalDocs: Array<{
        title: string;
        type: string;
        link: string;
      }>;
      relatedProducts: string[];
    }>;
  };
}

export default function BrandSolutions({ brand }: BrandSolutionsProps) {
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
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
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

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {brand.name} 解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            基于{brand.name}产品的完整行业解决方案，从方案设计到技术支持，助力您的项目成功
          </p>
        </div>

        {/* Solutions List */}
        <div className="space-y-12">
          {brand.solutions.map((solution, index) => (
            <div key={solution.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Solution Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-2">
                      {solution.category}
                    </span>
                    <Link href={`/${locale}/brands/${brand.slug}/solutions/${solution.id}`}>
                      <h2 className="text-2xl font-bold hover:text-primary-100 transition-colors cursor-pointer">
                        {solution.title}
                      </h2>
                    </Link>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <p className="text-primary-100 text-lg">{solution.summary}</p>
              </div>

              <div className="p-8">
                {/* Solution Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">方案概述</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{solution.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Key Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      核心优势
                    </h3>
                    <ul className="space-y-3">
                      {solution.keyFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Applications */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                      </svg>
                      应用场景
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {solution.applications.map((app, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Block Diagram Placeholder */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">方案框图</h3>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-600">
                      方案框图：{solution.blockDiagram}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      详细的系统架构图和连接方式，展示各组件之间的信号流和控制逻辑
                    </p>
                  </div>
                </div>

                {/* BOM List */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">推荐物料清单 (BOM List)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-gray-50 rounded-lg">
                      <thead>
                        <tr className="bg-primary-600 text-white">
                          <th className="border border-gray-300 px-4 py-3 text-left">器件型号</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">器件描述</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">功能</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">封装</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solution.bomList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white transition-colors">
                            <td className="border border-gray-300 px-4 py-3">
                              <Link 
                                href={item.link}
                                className="font-semibold text-primary-600 hover:text-primary-800"
                              >
                                {item.partNumber}
                              </Link>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                              {item.description}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {item.function}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {item.package}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <Link
                                href={item.link}
                                className="inline-flex items-center px-3 py-1 border border-primary-300 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
                              >
                                查看详情
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Documents */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">技术文档</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {solution.technicalDocs.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.link}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">{doc.type.replace('-', ' ')}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Related Products */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">相关产品系列</h3>
                  <div className="flex flex-wrap gap-2">
                    {solution.relatedProducts.map((product, idx) => (
                      <Link
                        key={idx}
                        href={`/${locale}/products?search=${encodeURIComponent(product)}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        {product}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <Link
                    href={`/${locale}/brands/${brand.slug}/solutions/${solution.id}`}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    查看详情
                  </Link>
                  <Link
                    href={`/${locale}/contact?subject=${encodeURIComponent(solution.title)}咨询`}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    方案咨询
                  </Link>
                  <Link
                    href={`/${locale}/contact?subject=申请${solution.title}样品`}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-400 text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    申请样品
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Solutions CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            需要定制化解决方案？
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            我们的FAE团队拥有丰富的行业经验，可以根据您的具体需求定制专业的解决方案，
            从选型设计到批量供货，提供全程技术支持。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact?subject=定制解决方案咨询`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              联系FAE团队
            </Link>
            <Link
              href={`/${locale}/brands/${brand.slug}/support`}
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              查看技术文档
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}