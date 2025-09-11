import { getAllBrands, getFeaturedBrands, getBrandStats } from '../lib/sanity/brands';
import { urlFor } from '../lib/sanity/client';

interface Brand {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  headquarters?: string;
  established?: string;
  isActive: boolean;
  isFeatured?: boolean;
  slug?: string;
  logo?: any;
}

interface BrandStats {
  total: number;
  authorized: number;
  totalProducts: number;
}

export default async function BrandsPage() {
  // Fetch data from Sanity CMS
  const [allBrands, featuredBrands, brandStats] = await Promise.all([
    getAllBrands().catch(err => { console.error('Failed to fetch brands:', err); return []; }),
    getFeaturedBrands().catch(err => { console.error('Failed to fetch featured brands:', err); return []; }),
    getBrandStats().catch(err => { console.error('Failed to fetch brand stats:', err); return { total: 0, authorized: 0, totalProducts: 0 }; })
  ]);

  // Group brands by categories based on their names or descriptions
  const brandCategories = {
    '微控制器与处理器': allBrands.filter(brand => 
      ['STMicroelectronics', 'Texas Instruments', 'Microchip', 'NXP', 'Espressif', 'ARM', 'Intel'].includes(brand.name)
    ),
    '模拟与电源管理': allBrands.filter(brand => 
      ['Analog Devices', 'Linear Technology', 'Maxim', 'ON Semiconductor', 'Infineon'].includes(brand.name)
    ),
    '传感器与连接器': allBrands.filter(brand => 
      ['Bosch', 'Sensirion', 'TE Connectivity', 'Molex', 'JAE', 'Vishay'].includes(brand.name)
    )
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">合作品牌</h1>
            <p className="text-xl text-purple-100">
              与全球顶尖品牌合作，为您提供优质的电子元器件产品
            </p>
            <div className="mt-6 flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{brandStats.total}+</div>
                <div className="text-purple-200">合作品牌</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{brandStats.authorized}+</div>
                <div className="text-purple-200">授权代理</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{(brandStats.totalProducts / 1000).toFixed(0)}K+</div>
                <div className="text-purple-200">产品型号</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">品牌分类</h2>
            <p className="text-lg text-gray-600">按产品类别浏览合作品牌</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {Object.entries(brandCategories).map(([categoryName, brands], index) => {
              const icons = [
                (<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>),
                (<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>),
                (<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>)
              ];
              
              return (
                <div key={categoryName} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-purple-600 mb-4">
                    {icons[index] || icons[0]}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{categoryName}</h3>
                  <ul className="space-y-2">
                    {brands.length > 0 ? brands.map((brand) => (
                      <li key={brand._id} className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">
                        • {brand.name}
                      </li>
                    )) : (
                      <li className="text-gray-500 italic">暂无品牌数据</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">特色合作品牌</h2>
            <p className="text-lg text-gray-600">深度合作的优质品牌伙伴</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBrands.length > 0 ? featuredBrands.map((brand) => (
              <div key={brand._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {brand.logo && (
                      <img 
                        src={urlFor(brand.logo).width(60).height(60).url()}
                        alt={brand.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                      <p className="text-gray-600 text-sm">{brand.description || '全球领先的电子元器件供应商'}</p>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    授权代理
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium text-gray-700">品牌官网:</span> 
                    {brand.website ? (
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">
                        {brand.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="ml-1">联系我们获取</span>
                    )}
                  </p>
                  {brand.established && (
                    <p className="text-sm"><span className="font-medium text-gray-700">成立时间:</span> {brand.established}</p>
                  )}
                  {brand.country && (
                    <p className="text-sm"><span className="font-medium text-gray-700">总部:</span> {brand.country}</p>
                  )}
                  {brand.headquarters && (
                    <p className="text-sm"><span className="font-medium text-gray-700">地址:</span> {brand.headquarters}</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-purple-600 font-medium">查看产品</span>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    浏览产品 →
                  </button>
                </div>
              </div>
            )) : (
              // Fallback brands if CMS data is not available
              [
                {
                  name: 'STMicroelectronics',
                  description: '全球领先的半导体供应商',
                  products: '微控制器、传感器、功率器件',
                  established: '1987年',
                  country: '瑞士',
                  partnership: '2015年至今',
                  productCount: '15,000+'
                },
                {
                  name: 'Texas Instruments',
                  description: '模拟IC和嵌入式处理器制造商',
                  products: '模拟IC、DSP、微控制器',
                  established: '1930年',
                  country: '美国',
                  partnership: '2016年至今',
                  productCount: '12,500+'
                },
                {
                  name: 'Espressif Systems',
                  description: 'WiFi和蓝牙芯片领先厂商',
                  products: '无线通信芯片、模组',
                  established: '2008年',
                  country: '中国上海',
                  partnership: '2018年至今',
                  productCount: '200+'
                }
              ].map((brand, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                      <p className="text-gray-600 text-sm">{brand.description}</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      授权代理
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><span className="font-medium text-gray-700">主要产品:</span> {brand.products}</p>
                    <p className="text-sm"><span className="font-medium text-gray-700">成立时间:</span> {brand.established}</p>
                    <p className="text-sm"><span className="font-medium text-gray-700">总部:</span> {brand.country}</p>
                    <p className="text-sm"><span className="font-medium text-gray-700">合作年限:</span> {brand.partnership}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-purple-600 font-medium">{brand.productCount} 产品</span>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      查看产品 →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">合作优势</h2>
            <p className="text-lg text-gray-600">作为授权代理商，我们为您提供的专业服务</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: '原厂授权',
                description: '100%原装正品保证',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: '技术支持',
                description: '原厂技术资源支持',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                )
              },
              {
                title: '供货稳定',
                description: '优先供货保障',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              {
                title: '价格优势',
                description: '一手货源价格',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">成为我们的合作伙伴</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            我们期待与更多优秀品牌建立长期合作关系 | 现有 {brandStats.total}+ 合作品牌
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
              品牌合作
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-medium transition-colors">
              联系我们
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}