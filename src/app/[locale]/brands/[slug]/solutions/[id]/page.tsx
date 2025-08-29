import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 解决方案详情数据获取函数
const getSolutionData = (brandSlug: string, solutionId: string) => {
  // 示例解决方案数据
  const solutions = {
    'stm': {
      'iot-smart-home': {
        id: 'iot-smart-home',
        title: 'IoT智能家居解决方案',
        subtitle: '基于STM32的完整智能家居生态系统',
        hero_image: '/images/solutions/stm32-iot-hero.jpg',
        summary: '利用STM32微控制器构建安全、高效、易扩展的智能家居系统，支持语音控制、远程监控和自动化场景。',
        
        challenge: {
          title: '行业挑战',
          description: '随着物联网技术的快速发展，传统家居设备面临着连接性差、安全隐患、功耗高等问题。消费者需要一个统一、安全、节能的智能家居解决方案。',
          points: [
            '设备互联性差，形成信息孤岛',
            '数据安全和隐私保护不足',
            '功耗过高影响电池设备使用体验',
            '系统扩展性和兼容性有限'
          ]
        },
        
        solution: {
          title: '解决方案概述',
          description: 'STM32 IoT智能家居解决方案提供从传感器节点到云端的完整技术栈，确保系统的安全性、可靠性和可扩展性。',
          architecture_image: '/images/solutions/stm32-iot-architecture.jpg',
          
          components: [
            {
              name: '边缘计算节点',
              description: '基于STM32H7系列的高性能边缘计算设备，支持本地AI推理',
              chips: ['STM32H747XL', 'STM32H743VL'],
              features: ['480MHz双核', '2MB Flash', 'Cortex-M7+M4']
            },
            {
              name: '传感器节点',
              description: '超低功耗传感器节点，支持多种传感器接入和无线通信',
              chips: ['STM32L4+', 'STM32WB55'],
              features: ['μA级功耗', 'BLE 5.0', '多传感器接口']
            },
            {
              name: '网关设备',
              description: '智能家居网关，连接各类设备并提供云端通信',
              chips: ['STM32MP1'],
              features: ['Linux生态', '多协议支持', '边缘AI']
            }
          ]
        },
        
        features: [
          {
            title: '安全加密',
            description: '硬件级安全加密，保护数据传输和存储安全',
            icon: '🔒',
            details: [
              '内置安全启动和固件更新',
              'AES-256硬件加密引擎',
              '安全密钥管理',
              'TrustZone安全区域'
            ]
          },
          {
            title: '超低功耗',
            description: '优化的功耗管理，延长电池设备工作时间',
            icon: '🔋',
            details: [
              'Stop/Standby模式功耗<1μA',
              '动态电压频率调节',
              '智能唤醒机制',
              '功耗监控和优化'
            ]
          },
          {
            title: '无线连接',
            description: '支持多种无线协议，确保设备互联互通',
            icon: '📡',
            details: [
              'Wi-Fi 6/BLE 5.0双模',
              'Zigbee 3.0支持',
              'LoRa长距离通信',
              'Sub-GHz专有协议'
            ]
          },
          {
            title: '边缘AI',
            description: '本地AI推理能力，降低云端依赖',
            icon: '🧠',
            details: [
              'X-CUBE-AI神经网络',
              '语音识别和处理',
              '图像识别和分析',
              '预测性维护'
            ]
          }
        ],
        
        use_cases: [
          {
            title: '智能照明系统',
            description: '基于环境光线和用户习惯的自适应照明控制',
            image: '/images/solutions/smart-lighting.jpg',
            benefits: ['节能30%', '自动调节', '场景模式', '远程控制']
          },
          {
            title: '安防监控系统',
            description: 'AI驱动的智能安防，支持人脸识别和行为分析',
            image: '/images/solutions/security-system.jpg',
            benefits: ['AI识别', '实时报警', '云端存储', '移动推送']
          },
          {
            title: '环境监测系统',
            description: '实时监测空气质量、温湿度等环境参数',
            image: '/images/solutions/environment-monitor.jpg',
            benefits: ['多参数监测', '异常报警', '历史分析', '健康建议']
          }
        ],
        
        development_tools: [
          {
            name: 'STM32CubeMX',
            description: '图形化配置工具，快速生成初始化代码',
            url: 'https://www.st.com/stm32cubemx'
          },
          {
            name: 'X-CUBE-AI',
            description: 'AI神经网络扩展包，支持边缘AI开发',
            url: 'https://www.st.com/x-cube-ai'
          },
          {
            name: 'STM32CubeIDE',
            description: '集成开发环境，支持调试和性能优化',
            url: 'https://www.st.com/stm32cubeide'
          }
        ],
        
        documents: [
          {
            type: 'application-note',
            title: 'AN5270: STM32 IoT智能家居应用指南',
            url: '/documents/an5270-stm32-iot-smart-home.pdf',
            size: '2.8MB'
          },
          {
            type: 'reference-design',
            title: 'STM32智能家居参考设计',
            url: '/documents/stm32-smart-home-reference.pdf',
            size: '5.2MB'
          },
          {
            type: 'software-package',
            title: 'X-CUBE-IOT软件包',
            url: '/downloads/x-cube-iot-package.zip',
            size: '45MB'
          }
        ],
        
        contact_info: {
          title: '获取技术支持',
          description: '我们的FAE团队可以为您提供专业的技术支持和定制化解决方案。',
          cta_text: '联系FAE工程师',
          cta_link: '/contact?subject=STM32 IoT智能家居解决方案咨询'
        }
      }
    }
  };

  return (solutions as any)[brandSlug]?.[solutionId] || null;
};

export async function generateMetadata({
  params: { locale, slug, id }
}: {
  params: { locale: string; slug: string; id: string };
}): Promise<Metadata> {
  const solution = getSolutionData(slug, id);
  
  if (!solution) {
    return {
      title: 'Solution Not Found'
    };
  }
  
  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;
  
  return {
    title: `${solution.title} - ${brandName} | LiTong`,
    description: solution.summary,
    keywords: [solution.title, `${brandName}解决方案`, 'IoT', '智能家居', 'STM32'],
    openGraph: {
      title: solution.title,
      description: solution.summary,
      type: 'article',
      images: solution.hero_image ? [solution.hero_image] : undefined
    }
  };
}

export default async function SolutionDetailPage({
  params: { locale, slug, id }
}: {
  params: { locale: string; slug: string; id: string };
}) {
  const solution = getSolutionData(slug, id);
  
  if (!solution) {
    notFound();
  }

  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brandName, href: `/brands/${slug}` },
    { label: '解决方案', href: `/brands/${slug}/solutions` },
    { label: solution.title, href: `/brands/${slug}/solutions/${id}` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{solution.title}</h1>
            <p className="text-xl text-blue-100 mb-6">{solution.subtitle}</p>
            <p className="text-lg leading-relaxed">{solution.summary}</p>
          </div>
        </div>
        {solution.hero_image && (
          <div className="absolute right-0 top-0 h-full w-1/3 bg-cover bg-center opacity-20"
               style={{backgroundImage: `url(${solution.hero_image})`}} />
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Challenge Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{solution.challenge.title}</h2>
          <p className="text-lg text-gray-600 mb-8">{solution.challenge.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solution.challenge.points.map((point: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{solution.solution.title}</h2>
          <p className="text-lg text-gray-600 mb-8">{solution.solution.description}</p>
          
          {/* Components */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {solution.solution.components.map((component, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{component.name}</h3>
                <p className="text-gray-600 mb-4">{component.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">推荐芯片:</h4>
                  <div className="flex flex-wrap gap-2">
                    {component.chips.map((chip, chipIndex) => (
                      <span key={chipIndex} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  {component.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">核心特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solution.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">应用场景</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {solution.use_cases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <span key={benefitIndex} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">开发工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solution.development_tools.map((tool, index) => (
              <a key={index} href={tool.url} target="_blank" rel="noopener noreferrer"
                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{tool.name}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">技术文档</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solution.documents.map((doc, index) => (
              <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer"
                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-500">{doc.size}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{solution.contact_info.title}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{solution.contact_info.description}</p>
          <a href={solution.contact_info.cta_link}
             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            {solution.contact_info.cta_text}
          </a>
        </section>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": solution.title,
            "description": solution.summary,
            "author": {
              "@type": "Organization",
              "name": brandName
            },
            "publisher": {
              "@type": "Organization",
              "name": "LiTong Electronics"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/${locale}/brands/${slug}/solutions/${id}`
            },
            "image": solution.hero_image,
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
          })
        }}
      />
    </>
  );
}