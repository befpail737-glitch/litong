import { getProducts, getProductCategories, getSiteStats } from '../lib/sanity/queries';
import { urlFor } from '../lib/sanity/client';

interface Product {
  _id: string;
  partNumber: string;
  title: string;
  shortDescription?: string;
  image?: any;
  brand?: {
    name: string;
    slug: string;
    logo?: any;
  };
  category?: {
    name: string;
    slug: string;
  };
  pricing?: {
    price?: number;
    currency?: string;
  };
  inventory?: {
    inStock?: boolean;
    quantity?: number;
  };
  isFeatured?: boolean;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: any;
  image?: any;
}

interface SiteStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  featuredProducts: number;
}

export default async function ProductsPage() {
  // Fetch data from Sanity CMS
  const [categoriesResult, productsResult, statsResult] = await Promise.all([
    getProductCategories().catch(err => { console.error('Failed to fetch categories:', err); return []; }),
    getProducts({ featured: true, limit: 6 }).catch(err => { console.error('Failed to fetch products:', err); return { products: [], total: 0 }; }),
    getSiteStats().catch(err => { console.error('Failed to fetch stats:', err); return { totalProducts: 0, totalBrands: 0, totalCategories: 0, featuredProducts: 0 }; })
  ]);
  
  const categories: Category[] = categoriesResult || [];
  const { products, total }: { products: Product[], total: number } = productsResult || { products: [], total: 0 };
  const stats: SiteStats = statsResult || { totalProducts: 0, totalBrands: 0, totalCategories: 0, featuredProducts: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">产品中心</h1>
            <p className="text-xl text-blue-100">
              为您提供全方位的电子元器件产品解决方案
            </p>
            <div className="mt-6 flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}+</div>
                <div className="text-blue-200">产品型号</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalBrands}+</div>
                <div className="text-blue-200">合作品牌</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalCategories}+</div>
                <div className="text-blue-200">产品分类</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="搜索产品型号、品牌或分类..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                搜索
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">产品分类</h2>
            <p className="text-lg text-gray-600">涵盖多个领域的高品质电子元器件</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.length > 0 ? categories.map((category, index) => (
              <div key={category._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon ? (
                    <img 
                      src={urlFor(category.icon).width(32).height(32).url()} 
                      alt={category.name}
                      className="h-8 w-8"
                    />
                  ) : (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description || '高品质电子元器件产品'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium">查看产品</span>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )) : (
              // Fallback categories if CMS data is not available
              [
                {
                  title: '半导体',
                  description: 'MCU、处理器、存储器等',
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  ),
                  count: '45,000+'
                },
                {
                  title: '传感器',
                  description: '温度、压力、光学传感器',
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  count: '12,000+'
                },
                {
                  title: '连接器',
                  description: '插座、接头、线缆组件',
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  count: '8,500+'
                },
                {
                  title: '被动元件',
                  description: '电阻、电容、电感器',
                  icon: (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
                }
              ].map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">{category.count || '查看产品'}</span>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Hot Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门产品</h2>
            <p className="text-lg text-gray-600">精选高需求产品推荐</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? products.map((product) => (
              <div key={product._id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                {product.image && (
                  <div className="mb-4">
                    <img 
                      src={urlFor(product.image).width(200).height(150).url()}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.title || product.partNumber}</h3>
                    <p className="text-blue-600 text-sm">{product.brand?.name || '力通电子'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.inventory?.inStock ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.inventory?.inStock ? '现货充足' : '联系询价'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{product.category?.name || product.shortDescription || '电子元器件'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    {product.pricing?.price 
                      ? `${product.pricing.currency || '¥'}${product.pricing.price}`
                      : '询价'
                    }
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    立即询价
                  </button>
                </div>
              </div>
            )) : (
              // Fallback products if CMS data is not available
              [
                {
                  name: 'STM32F103C8T6',
                  brand: 'STMicroelectronics',
                  category: '微控制器',
                  price: '¥12.50',
                  stock: '现货充足'
                },
                {
                  name: 'ESP32-WROOM-32',
                  brand: 'Espressif',
                  category: '无线模块',
                  price: '¥28.00',
                  stock: '现货充足'
                },
                {
                  name: 'LM358N',
                  brand: 'Texas Instruments',
                  category: '运算放大器',
                  price: '¥2.80',
                  stock: '现货充足'
                },
                {
                  name: 'AMS1117-3.3',
                  brand: 'Advanced Monolithic',
                  category: '电压调节器',
                  price: '¥1.50',
                  stock: '现货充足'
                },
                {
                  name: 'HC-SR04',
                  brand: '通用',
                  category: '超声波传感器',
                  price: '¥8.90',
                  stock: '现货充足'
                },
                {
                  name: 'DS18B20',
                  brand: 'Maxim Integrated',
                  category: '温度传感器',
                  price: '¥6.50',
                  stock: '现货充足'
                }
              ].map((product, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-blue-600 text-sm">{product.brand}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {product.stock}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                      立即询价
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">找不到您需要的产品？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们的专业团队将为您提供定制化的产品采购方案 | 现有 {stats.totalProducts.toLocaleString()}+ 产品型号
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
              联系我们
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors">
              获取报价
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}