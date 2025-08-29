'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const productCategories = [
  {
    name: '微控制器',
    nameEn: 'Microcontrollers',
    slug: 'microcontrollers',
    description: 'ARM Cortex、RISC-V、8位/16位/32位MCU',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z"/>
      </svg>
    ),
    productCount: '2000+',
    brands: ['STM32', 'ESP32', 'Arduino', 'PIC']
  },
  {
    name: '电源管理',
    nameEn: 'Power Management',
    slug: 'power-management',
    description: 'DC-DC转换器、LDO、充电管理IC',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.5 2L6 6.5L7.5 8L12 4.5L16.5 8L18 6.5L12.5 2H11.5M7 10V12H9V14H7V22H10V14H12V16H14V14H12V12H14V10H12V8H10V10H7M17 12V22H20V12H17Z"/>
      </svg>
    ),
    productCount: '1500+',
    brands: ['TI', 'Maxim', 'Linear', 'ON Semi']
  },
  {
    name: '模拟与混合信号',
    nameEn: 'Analog & Mixed Signal',
    slug: 'analog-mixed-signal',
    description: 'ADC、DAC、放大器、比较器',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 7.97L15.45 8.95L14.5 9.41L15.45 9.87L16 10.85L16.55 9.87L17.5 9.41L16.55 8.95L16 7.97M12.5 2L11 6.5L6.5 8L11 9.5L12.5 14L14 9.5L18.5 8L14 6.5L12.5 2M12.5 4.28L13.26 6.5L15.22 7.22L13.26 7.94L12.5 10.16L11.74 7.94L9.78 7.22L11.74 6.5L12.5 4.28M7 16L5.5 20.5L1 22L5.5 23.5L7 28L8.5 23.5L13 22L8.5 20.5L7 16Z"/>
      </svg>
    ),
    productCount: '3000+',
    brands: ['ADI', 'TI', 'Maxim', 'Infineon']
  },
  {
    name: 'RF与无线',
    nameEn: 'RF & Wireless',
    slug: 'rf-wireless',
    description: 'WiFi、蓝牙、LoRa、5G模块',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
      </svg>
    ),
    productCount: '800+',
    brands: ['Espressif', 'Nordic', 'Qualcomm', 'Broadcom']
  },
  {
    name: '传感器',
    nameEn: 'Sensors',
    slug: 'sensors',
    description: '温湿度、压力、加速度、光电传感器',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
      </svg>
    ),
    productCount: '1200+',
    brands: ['Bosch', 'STM', 'Honeywell', 'Sensirion']
  },
  {
    name: '接口IC',
    nameEn: 'Interface ICs',
    slug: 'interface-ics',
    description: 'UART、SPI、I2C、CAN、USB接口芯片',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V15A2,2 0 0,0 6,13V11A2,2 0 0,0 8,9V5H10V3H8M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V15A2,2 0 0,1 18,13V11A2,2 0 0,1 16,9V5H14V3H16Z"/>
      </svg>
    ),
    productCount: '600+',
    brands: ['FTDI', 'Silicon Labs', 'TI', 'Maxim']
  }
];

export default function ProductCategoriesSection() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            核心产品领域
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            覆盖完整的电子元件产品线，为各行业提供专业的解决方案
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/products/${category.slug}`}
              className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                    {category.icon}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.nameEn}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {category.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600">
                      {category.productCount} 型号
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {category.brands.slice(0, 3).map((brand) => (
                      <span key={brand} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {brand}
                      </span>
                    ))}
                    {category.brands.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{category.brands.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            查看所有产品分类
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}