'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const solutions = [
  {
    title: '工业自动化解决方案',
    titleEn: 'Industrial Automation',
    slug: 'industrial-automation',
    description: '为工业4.0提供完整的MCU、传感器和通信模块解决方案',
    industry: '工业自动化',
    applications: ['PLC控制', '机器视觉', '工业通信', '电机控制'],
    image: '/images/solutions/industrial-automation.svg',
    keyComponents: ['STM32F4', 'CAN收发器', '工业以太网PHY', '隔离电源']
  },
  {
    title: '智能家居解决方案',
    titleEn: 'Smart Home',
    slug: 'smart-home',
    description: '基于WiFi、蓝牙、Zigbee的智能家居生态系统',
    industry: '智能家居',
    applications: ['智能开关', '环境监测', '安防系统', '语音控制'],
    image: '/images/solutions/smart-home.svg',
    keyComponents: ['ESP32', 'Nordic nRF52', '环境传感器', '语音识别芯片']
  },
  {
    title: '新能源汽车解决方案',
    titleEn: 'Electric Vehicle',
    slug: 'electric-vehicle',
    description: '电动汽车BMS、充电桩、车载娱乐系统核心器件',
    industry: '新能源汽车',
    applications: ['BMS系统', '充电管理', 'OBC车载充电', 'DC-DC转换'],
    image: '/images/solutions/electric-vehicle.svg',
    keyComponents: ['车规级MCU', '电池管理芯片', 'CAN-FD控制器', '功率MOSFET']
  }
];

export default function SolutionsSection() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            解决方案与应用领域
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            针对不同行业应用场景，提供定制化的电子元件解决方案和技术支持
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {solutions.map((solution) => (
            <div key={solution.slug} className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {solution.industry}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {solution.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{solution.titleEn}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {solution.description}
                </p>
                
                {/* Applications */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">应用场景</h4>
                  <div className="flex flex-wrap gap-1">
                    {solution.applications.map((app) => (
                      <span key={app} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Key Components */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">核心器件</h4>
                  <div className="space-y-1">
                    {solution.keyComponents.slice(0, 2).map((component) => (
                      <div key={component} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                        {component}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link
                  href={`/${locale}/solutions/${solution.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  查看详情
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/solutions`}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            查看所有解决方案
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}