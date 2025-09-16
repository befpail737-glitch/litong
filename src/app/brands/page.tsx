'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { getBrands } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import { useEffect, useState } from 'react';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        console.log('🔍 开始获取品牌数据...');
        setDebugInfo({ stage: 'fetching', message: '正在连接Sanity CMS...' });

        const brandsData = await getBrands();

        console.log('📊 品牌数据获取结果:', {
          数量: brandsData?.length || 0,
          数据: brandsData
        });

        setDebugInfo({
          stage: 'success',
          message: `成功获取 ${brandsData?.length || 0} 个品牌`
        });

        setBrands(brandsData || []);
        setError(null);
      } catch (error) {
        console.error('❌ 品牌数据获取失败:', error);
        setError(error.message || '获取品牌数据失败');
        setDebugInfo({
          stage: 'error',
          message: `错误: ${error.message}`,
          details: error
        });
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-blue-100 text-blue-800">
              品牌中心
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              全球知名品牌合作伙伴
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              力通电子与全球领先的半导体制造商建立了深度合作关系，为客户提供原装正品的电子元器件产品。
              我们是多家国际知名品牌的授权代理商，确保产品质量和供货稳定性。
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="搜索品牌..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>所有分类</option>
                  <option>微控制器</option>
                  <option>模拟IC</option>
                  <option>功率器件</option>
                  <option>传感器</option>
                </select>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>所有地区</option>
                  <option>美国</option>
                  <option>欧洲</option>
                  <option>亚洲</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Info Section (Development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <section className="py-4 bg-yellow-50 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-sm font-mono">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${
                    debugInfo.stage === 'success' ? 'bg-green-500' :
                    debugInfo.stage === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></span>
                  <span className="font-semibold">调试信息:</span>
                  <span>{debugInfo.message}</span>
                </div>
                {debugInfo.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">详细信息</summary>
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                      {JSON.stringify(debugInfo.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brands Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">加载中...</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {debugInfo?.message || '正在获取品牌信息，请稍候...'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">数据加载失败</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无品牌数据</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                品牌信息正在维护中，请稍后再查看或联系我们获取更多信息。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {brands.map((brand) => (
                <div key={brand._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                          {brand.logo ? (
                            <img
                              src={urlFor(brand.logo).width(64).height(64).url()}
                              alt={`${brand.name} logo`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {brand.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {brand.name}
                          </h3>
                          {brand.country && (
                            <div className="text-gray-500 text-sm">
                              {brand.country}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {brand.description && (
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {brand.description}
                      </p>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex gap-3">
                        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          查看产品
                        </button>
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            官方网站
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            寻找特定品牌或产品？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们的专业团队将帮助您找到最适合的产品解决方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              联系我们
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              获取报价
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}