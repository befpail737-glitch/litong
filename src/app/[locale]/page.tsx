import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-blue-100 text-blue-800">
              专业B2B电子元器件平台
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              欢迎来到
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 ml-0 sm:ml-3">
                力通电子
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              专业的电子元器件供应链服务商，为全球客户提供高品质产品和专业技术支持，
              助力您的项目成功
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 py-2">
                立即询价
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-6 py-2">
                浏览品牌
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
                <div className="text-gray-600 text-sm">年行业经验</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">12+</div>
                <div className="text-gray-600 text-sm">合作品牌</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">174K+</div>
                <div className="text-gray-600 text-sm">产品型号</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">10,000+</div>
                <div className="text-gray-600 text-sm">客户信赖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-green-100 text-green-800">
              核心优势
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择力通电子
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              凭借15年的行业经验，我们为客户提供一站式电子元器件采购解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">品质保证</h3>
                <p className="text-gray-600 leading-relaxed">
                  严格的质量控制体系，确保每一个产品都符合最高标准，所有产品均为原装正品
                </p>
              </div>
            </div>

            <div className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">快速交付</h3>
                <p className="text-gray-600 leading-relaxed">
                  高效的供应链管理，24小时快速报价，48小时内发货，确保项目进度
                </p>
              </div>
            </div>

            <div className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14h3a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a9 9 0 0118 0v7a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">技术支持</h3>
                <p className="text-gray-600 leading-relaxed">
                  专业的技术团队，为客户提供全方位的技术支持和定制化解决方案
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-purple-100 text-purple-800">
              合作品牌
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              与全球知名品牌合作
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们是多家国际知名品牌的授权代理商，确保产品的原装正品和供货稳定性
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {['STMicroelectronics', 'Texas Instruments', 'Analog Devices', 'Infineon Technologies', 'NXP Semiconductors', 'Microchip Technology', 'Espressif Systems', 'ROHM Semiconductor'].map((brand, index) => (
              <div key={index} className="hover:shadow-md transition-shadow cursor-pointer group h-full rounded-lg bg-white p-6 text-center">
                <svg className="h-8 w-8 text-gray-400 mx-auto mb-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors mb-2">
                  {brand}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.floor(Math.random() * 50000 + 5000).toLocaleString()}+ 产品
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2">
              查看所有品牌
              <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-orange-100 text-orange-800">
                客户信赖
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                值得信赖的合作伙伴
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ISO认证</h3>
                <p className="text-gray-600 text-sm">ISO9001质量管理体系认证</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">专业团队</h3>
                <p className="text-gray-600 text-sm">资深技术和销售专家</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">原装保证</h3>
                <p className="text-gray-600 text-sm">100%原厂授权正品保证</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">持续增长</h3>
                <p className="text-gray-600 text-sm">业务持续稳定增长</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始您的项目了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            让我们的专业团队为您提供最优质的电子元器件供应链服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2">
              立即询价
            </button>
            <button className="border-white text-white hover:bg-white hover:text-blue-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-6 py-2">
              联系我们
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}