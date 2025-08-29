'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

const brands = [
  {
    id: '1',
    name: 'STMicroelectronics',
    slug: 'stmicroelectronics',
    logo: '/images/brands/stm-logo.svg',
    description: '全球领先的半导体供应商，专注于微控制器、模拟IC、功率器件和传感器',
    website: 'https://www.st.com',
    categories: ['微控制器', '模拟IC', '功率器件', '传感器'],
    productCount: '2000+',
    featured: true
  },
  {
    id: '2',
    name: 'Texas Instruments',
    slug: 'texas-instruments',
    logo: '/images/brands/ti-logo.svg',
    description: '模拟和嵌入式处理半导体的全球领导者，提供创新的半导体解决方案',
    website: 'https://www.ti.com',
    categories: ['模拟IC', '嵌入式处理器', '电源管理', '接口IC'],
    productCount: '1800+',
    featured: true
  },
  {
    id: '3',
    name: 'Maxim Integrated',
    slug: 'maxim-integrated',
    logo: '/images/brands/maxim-logo.svg',
    description: '高性能模拟和混合信号半导体产品的领先供应商',
    website: 'https://www.maximintegrated.com',
    categories: ['模拟IC', '电源管理', '接口IC', '数据转换器'],
    productCount: '1200+',
    featured: true
  },
  {
    id: '4',
    name: 'Infineon Technologies',
    slug: 'infineon',
    logo: '/images/brands/infineon-logo.svg',
    description: '功率半导体、安全和汽车电子解决方案的全球领导者',
    website: 'https://www.infineon.com',
    categories: ['功率半导体', '微控制器', '安全芯片', '传感器'],
    productCount: '1500+',
    featured: true
  },
  {
    id: '5',
    name: 'Espressif Systems',
    slug: 'espressif',
    logo: '/images/brands/espressif-logo.svg',
    description: '专注于WiFi和蓝牙物联网芯片的创新公司',
    website: 'https://www.espressif.com',
    categories: ['WiFi芯片', '蓝牙芯片', '物联网SoC'],
    productCount: '100+',
    featured: false
  },
  {
    id: '6',
    name: 'Nordic Semiconductor',
    slug: 'nordic',
    logo: '/images/brands/nordic-logo.svg',
    description: '低功耗无线通信解决方案的领导者',
    website: 'https://www.nordicsemi.com',
    categories: ['蓝牙芯片', '无线SoC', '低功耗芯片'],
    productCount: '150+',
    featured: false
  },
  {
    id: '7',
    name: 'Analog Devices',
    slug: 'analog-devices',
    logo: '/images/brands/adi-logo.svg',
    description: '高性能信号处理解决方案的全球领导者',
    website: 'https://www.analog.com',
    categories: ['数据转换器', '放大器', '电源管理', 'RF芯片'],
    productCount: '2500+',
    featured: true
  },
  {
    id: '8',
    name: 'ON Semiconductor',
    slug: 'on-semiconductor',
    logo: '/images/brands/onsemi-logo.svg',
    description: '智能电源和感知技术的领先供应商',
    website: 'https://www.onsemi.com',
    categories: ['功率器件', '图像传感器', '电源管理', '保护器件'],
    productCount: '1000+',
    featured: false
  }
];

export default function BrandsList() {
  const locale = useLocale();
  
  const featuredBrands = brands.filter(brand => brand.featured);
  const otherBrands = brands.filter(brand => !brand.featured);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Featured Brands */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">核心代理品牌</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/${locale}/brands/${brand.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Brand Logo Placeholder */}
                  <div className="h-16 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-gray-600">{brand.name.substring(0, 2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {brand.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      核心代理
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                  
                  {/* Product Categories */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {brand.categories.slice(0, 3).map((category) => (
                        <span key={category} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {category}
                        </span>
                      ))}
                      {brand.categories.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          +{brand.categories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600">
                      {brand.productCount} 产品
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Brands */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">合作品牌</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/${locale}/brands/${brand.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 p-4"
              >
                {/* Brand Logo Placeholder */}
                <div className="h-12 w-full bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-gray-600">{brand.name.substring(0, 2)}</span>
                </div>
                
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  {brand.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {brand.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {brand.productCount} 产品
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            没有找到您需要的品牌？
          </h2>
          <p className="text-gray-600 mb-6">
            我们与全球数百家电子元件制造商建立了合作关系，如果您有特殊需求，请联系我们。
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            联系我们
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  );
}