'use client';

import { useTranslations } from 'next-intl';

const features = [
  {
    key: 'inventory',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    key: 'authentic',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'support',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'logistics',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export default function FeaturesSection() {
  const t = useTranslations('features');

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            作为专业的电子元件代理商，我们为客户提供全方位的服务支持
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.key} className="relative group">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 -m-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">数字证书追踪</h4>
              <p className="mt-2 text-sm text-gray-600">每个产品都有数字证书和报关单，确保产品来源可追溯</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">优势价格</h4>
              <p className="mt-2 text-sm text-gray-600">直接与原厂合作，提供具有竞争力的价格和灵活的付款方式</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">快速交付</h4>
              <p className="mt-2 text-sm text-gray-600">全球仓储布局，大部分产品可在24小时内发货</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}