'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="text-center lg:text-left">
            {/* SEO优化的H1标签 */}
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">电子元件</span>
              <span className="block text-blue-300">核心代理商</span>
            </h1>
            
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              <strong>正品原装现货 · 技术支持 · 优势价格</strong>
            </p>
            
            <p className="mt-4 text-lg text-blue-200 max-w-2xl">
              力通电子专注<span className="font-semibold text-white">电子元件代理</span>20年，为客户提供正品原装现货，专业技术支持和有竞争力的<span className="font-semibold text-white">芯片现货</span>供应。
            </p>
            
            {/* 强化行动号召按钮 */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/zh/contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-blue-900 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                立即获取报价
              </a>
              <a
                href="/zh/products"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white border-2 border-white hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                浏览产品目录
              </a>
            </div>

            {/* 核心数据展示 */}
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-sm text-blue-200 font-medium">年行业经验</div>
              </div>
              <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
                <div className="text-3xl font-bold text-white">10万+</div>
                <div className="text-sm text-blue-200 font-medium">现货型号</div>
              </div>
              <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-sm text-blue-200 font-medium">服务客户</div>
              </div>
              <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-sm text-blue-200 font-medium">正品保证</div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="relative">
              {/* 专业电路板图形 */}
              <div className="w-full h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Image
                  src="/icons/electronic-circuit.svg"
                  alt="专业电子元件代理 - 电路板设计"
                  width={200}
                  height={200}
                  className="opacity-90"
                />
              </div>
              
              {/* 特色标签 */}
              <div className="absolute -top-4 -left-4 bg-green-500 text-white rounded-lg p-4 shadow-xl animate-pulse">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                  <span className="text-sm font-bold">现货库存充足</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white rounded-lg p-4 shadow-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                  <span className="text-sm font-bold">专业技术支持</span>
                </div>
              </div>
              
              <div className="absolute top-4 -right-4 bg-orange-500 text-white rounded-lg p-4 shadow-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-300 rounded-full mr-2"></div>
                  <span className="text-sm font-bold">正品保证</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}