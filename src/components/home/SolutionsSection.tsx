'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const solutions = [
  {
    title: '工业自动化解决方案',
    titleEn: 'Industrial Automation Solutions',
    slug: 'industrial-automation',
    description: '为工业4.0提供完整的MCU、传感器和通信模块解决方案，实现智能制造和数字化工厂',
    industry: '工业自动化',
    applications: ['PLC控制', '机器视觉', '工业通信', '电机控制', '预测维护', '数据采集'],
    image: '/icons/industrial-automation-icon.svg',
    keyComponents: ['STM32F4系列', 'CAN总线收发器', '工业以太网PHY', '隔离电源模块', '运动控制IC'],
    marketSize: '¥2.8万亿',
    coreAdvantages: ['实时控制', '高可靠性', '工业级温度范围', '长期供货保证']
  },
  {
    title: '智能家居解决方案',
    titleEn: 'Smart Home Solutions',
    slug: 'smart-home',
    description: '基于WiFi、蓝牙、Zigbee的智能家居生态系统，打造舒适便捷的智能生活体验',
    industry: '智能家居',
    applications: ['智能开关', '环境监测', '安防系统', '语音控制', '场景联动', '远程控制'],
    image: '/icons/smart-home-icon.svg',
    keyComponents: ['ESP32-C3', 'Nordic nRF52832', '环境传感器', '语音识别芯片', 'Matter协议栈'],
    marketSize: '¥5.6千亿',
    coreAdvantages: ['低功耗设计', '多协议支持', '云端互联', 'OTA升级']
  },
  {
    title: '新能源汽车解决方案',
    titleEn: 'Electric Vehicle Solutions',
    slug: 'electric-vehicle',
    description: '电动汽车BMS、OBC、DC-DC、充电桩等核心电子系统的完整解决方案',
    industry: '新能源汽车',
    applications: ['BMS电池管理', 'OBC车载充电', 'DC-DC转换', '充电桩控制', '电机驱动', '车联网'],
    image: '/icons/electric-vehicle-icon.svg',
    keyComponents: ['车规级MCU', '电池管理专用IC', 'CAN-FD控制器', 'SiC功率器件', '车载以太网PHY'],
    marketSize: '¥1.2万亿',
    coreAdvantages: ['车规级认证', '功能安全', '宽温度范围', '长寿命设计']
  }
];

export default function SolutionsSection() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="text-blue-600">解决方案</span>与应用领域
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-4xl mx-auto">
            针对<span className="font-semibold text-blue-600">工业4.0</span>、<span className="font-semibold text-blue-600">智能家居</span>、<span className="font-semibold text-blue-600">新能源汽车</span>等重点行业，提供完整的<span className="font-semibold text-blue-600">电子元件代理</span>解决方案
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <div key={solution.slug} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              {/* 专业行业图标 */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                <Image
                  src={solution.image}
                  alt={`${solution.title} - ${solution.titleEn}`}
                  width={200}
                  height={150}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-8">
                {/* 行业标签和市场规模 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {solution.industry}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    市场规模: {solution.marketSize}
                  </span>
                </div>
                
                {/* 方案标题 */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                  {solution.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{solution.titleEn}</p>
                
                {/* 方案描述 */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {solution.description}
                </p>
                
                {/* 核心优势 */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">🚀 核心优势</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {solution.coreAdvantages.map((advantage, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {advantage}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 应用场景 */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">🎯 应用场景</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.applications.slice(0, 4).map((app) => (
                      <span key={app} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        {app}
                      </span>
                    ))}
                    {solution.applications.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        +{solution.applications.length - 4} 更多
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 推荐物料清单（BOM List） */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">📋 推荐物料清单</h4>
                  <div className="space-y-2">
                    {solution.keyComponents.slice(0, 3).map((component, idx) => (
                      <Link 
                        key={idx}
                        href={`/${locale}/products/search?q=${encodeURIComponent(component)}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium">{component}</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* 查看详情按钮 */}
                <Link
                  href={`/${locale}/solutions/${solution.slug}`}
                  className="group inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  查看完整解决方案
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              {/* 装饰性渐变 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-bl-2xl"></div>
            </div>
          ))}
        </div>

        {/* 查看所有解决方案按钮 */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/solutions`}
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            探索全部行业解决方案
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* 底部分销商行动号召 */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            需要定制化解决方案？
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            作为专业的<span className="font-semibold text-white">电子元件分销商</span>，我们提供从选型设计到批量供货的全流程技术支持服务
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            联系技术专家
          </Link>
        </div>
      </div>
    </section>
  );
}