'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const productCategories = [
  {
    name: '微控制器',
    nameEn: 'Microcontrollers',
    slug: 'microcontrollers',
    description: 'ARM Cortex、RISC-V、8位/16位/32位MCU',
    icon: '/icons/microcontroller-icon.svg',
    productCount: '25,000+',
    brands: ['STM32', 'ESP32', 'Arduino', 'PIC'],
    color: 'bg-blue-500'
  },
  {
    name: '电源管理',
    nameEn: 'Power Management',
    slug: 'power-management',
    description: 'DC-DC转换器、LDO、充电管理IC',
    icon: '/icons/power-management-icon.svg',
    productCount: '18,000+',
    brands: ['TI', 'Maxim', 'Linear', 'ON Semi'],
    color: 'bg-green-500'
  },
  {
    name: '模拟与混合信号',
    nameEn: 'Analog & Mixed Signal',
    slug: 'analog-mixed-signal',
    description: 'ADC、DAC、放大器、比较器',
    icon: '/icons/analog-mixed-signal-icon.svg',
    productCount: '30,000+',
    brands: ['ADI', 'TI', 'Maxim', 'Infineon'],
    color: 'bg-orange-500'
  },
  {
    name: 'RF与无线',
    nameEn: 'RF & Wireless',
    slug: 'rf-wireless',
    description: 'WiFi、蓝牙、LoRa、5G模块',
    icon: '/icons/rf-wireless-icon.svg',
    productCount: '12,000+',
    brands: ['Espressif', 'Nordic', 'Qualcomm', 'Broadcom'],
    color: 'bg-purple-500'
  }
];

export default function ProductCategoriesSection() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="text-blue-600">核心产品</span>领域
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            覆盖<span className="font-semibold text-blue-600">电子元件代理</span>全领域，提供从微控制器到RF无线的完整<span className="font-semibold text-blue-600">芯片现货</span>解决方案
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/${locale}/products/${category.slug}`}
              className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* 顶部装饰条 */}
              <div className={`h-2 ${category.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              
              <div className="p-8">
                <div className="text-center">
                  {/* 专业图标 */}
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300">
                    <Image
                      src={category.icon}
                      alt={`${category.name} 电子元件代理`}
                      width={48}
                      height={48}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* 分类标题 */}
                  <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mt-1">{category.nameEn}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {category.description}
                  </p>
                  
                  {/* 产品数量 */}
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{category.productCount}</span>
                    <span className="ml-2 text-sm text-gray-500">现货型号</span>
                  </div>
                  
                  {/* 主要品牌 */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">主要品牌：</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {category.brands.map((brand) => (
                        <span
                          key={brand}
                          className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-200"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 查看详情按钮 */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600">
                      查看产品
                      <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 悬停背景效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* 查看所有产品按钮 */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/products`}
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            浏览全部产品分类
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* 底部统计数据 */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-blue-600">85,000+</div>
              <div className="text-sm text-gray-600 mt-1">现货型号总数</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600 mt-1">合作品牌</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-orange-600">24小时</div>
              <div className="text-sm text-gray-600 mt-1">快速发货</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">正品保证率</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}