import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandSolutions from '@/components/brands/BrandSolutions';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Sample brand data - would come from CMS in real app
const getBrandData = (slug: string) => {
  const brands = {
    'stm': {
      id: '1',
      name: 'STMicroelectronics',
      slug: 'stm',
      logo: '/images/brands/stm-logo.svg',
      description: 'STMicroelectronics是全球领先的半导体供应商，为各种应用提供创新的智能技术解决方案。',
      website: 'https://www.st.com',
      founded: '1987',
      headquarters: '日内瓦，瑞士',
      solutions: [
        {
          id: '1',
          title: '工业自动化解决方案',
          slug: 'industrial-automation',
          category: '工业控制',
          image: '/images/solutions/industrial-automation.svg',
          summary: '基于STM32微控制器的完整工业自动化解决方案，支持实时控制、通信协议和HMI界面',
          description: 'STMicroelectronics为工业自动化提供从传感器到执行器的完整解决方案。我们的STM32微控制器系列具有丰富的通信接口、实时控制能力和低功耗特性，是工业4.0应用的理想选择。',
          keyFeatures: [
            '实时控制性能',
            '丰富的通信接口 (CAN, Ethernet, RS485)',
            '工业级温度范围 (-40°C to +105°C)',
            '功能安全认证 (IEC 61508)',
            '低功耗设计',
            '完整的开发生态系统'
          ],
          applications: [
            'PLC控制器',
            '变频器',
            '机器人控制',
            '工业网关',
            '传感器节点',
            'HMI终端'
          ],
          blockDiagram: '/images/solutions/industrial-automation-block.svg',
          bomList: [
            {
              partNumber: 'STM32F407VGT6',
              description: '32位ARM Cortex-M4微控制器',
              function: '主控制器',
              package: 'LQFP100',
              link: '/products/stm32f407vgt6'
            },
            {
              partNumber: 'L6470',
              description: '步进电机驱动器',
              function: '电机控制',
              package: 'HTSSOP28',
              link: '/products/l6470'
            },
            {
              partNumber: 'LIS3DH',
              description: '3轴加速度传感器',
              function: '振动监测',
              package: 'LGA16',
              link: '/products/lis3dh'
            },
            {
              partNumber: 'STPD01',
              description: '电源保护开关',
              function: '电源管理',
              package: 'PowerFLAT',
              link: '/products/stpd01'
            }
          ],
          technicalDocs: [
            {
              title: 'STM32工业控制应用笔记',
              type: 'application-note',
              link: '/documents/an-industrial-control-stm32.pdf'
            },
            {
              title: 'CAN总线通信指南',
              type: 'user-guide', 
              link: '/documents/can-bus-communication-guide.pdf'
            }
          ],
          relatedProducts: ['STM32F4系列', 'STM32H7系列', 'L6470', 'LIS3DH']
        },
        {
          id: '2',
          title: '汽车电子解决方案',
          slug: 'automotive-electronics',
          category: '汽车电子',
          image: '/images/solutions/automotive-electronics.svg',
          summary: '符合汽车级标准的电子系统解决方案，涵盖车身控制、动力管理和安全系统',
          description: 'STMicroelectronics提供符合AEC-Q100标准的汽车级半导体产品，为现代汽车的电气化、智能化和自动化提供可靠的解决方案。我们的产品通过了严格的汽车质量认证，能够在恶劣的汽车环境中稳定工作。',
          keyFeatures: [
            'AEC-Q100汽车级认证',
            '宽工作温度范围 (-40°C to +150°C)',
            'ISO 26262功能安全支持',
            '低EMI设计',
            '高可靠性和长寿命',
            'AUTOSAR兼容性'
          ],
          applications: [
            '车身控制模块 (BCM)',
            '发动机管理系统',
            '电池管理系统 (BMS)',
            '智能照明系统',
            '胎压监测系统 (TPMS)',
            '车载信息娱乐系统'
          ],
          blockDiagram: '/images/solutions/automotive-electronics-block.svg',
          bomList: [
            {
              partNumber: 'SPC58EC80E5',
              description: '32位汽车级微控制器',
              function: '车身控制',
              package: 'LQFP176',
              link: '/products/spc58ec80e5'
            },
            {
              partNumber: 'VN7140AJ',
              description: '智能电源开关',
              function: '负载驱动',
              package: 'PowerSO20',
              link: '/products/vn7140aj'
            },
            {
              partNumber: 'L9369-TR',
              description: 'CAN收发器',
              function: '总线通信',
              package: 'SO8',
              link: '/products/l9369-tr'
            },
            {
              partNumber: 'STPSC40L06',
              description: '肖特基二极管',
              function: '电源保护',
              package: 'PowerFLAT',
              link: '/products/stpsc40l06'
            }
          ],
          technicalDocs: [
            {
              title: '汽车电子系统设计指南',
              type: 'design-guide',
              link: '/documents/automotive-system-design-guide.pdf'
            },
            {
              title: 'ISO 26262功能安全实施',
              type: 'application-note',
              link: '/documents/iso26262-functional-safety.pdf'
            }
          ],
          relatedProducts: ['SPC5系列', 'VN系列', 'L9369', 'STPSC系列']
        },
        {
          id: '3',
          title: '物联网解决方案',
          slug: 'iot-solutions',
          category: '物联网',
          image: '/images/solutions/iot-solutions.svg',
          summary: '低功耗无线连接解决方案，支持LoRa、Wi-Fi、蓝牙等多种通信协议，适用于智能城市和工业物联网',
          description: 'STMicroelectronics为物联网应用提供超低功耗的微控制器和无线连接解决方案。我们的STM32WL系列集成了LoRa收发器，STM32WB系列支持蓝牙和Zigbee，为各种IoT应用提供灵活的连接选择。',
          keyFeatures: [
            '超低功耗设计 (1.7V-3.6V)',
            '多种无线协议支持',
            '内置安全加密引擎',
            '电池供电优化',
            '云平台连接',
            '边缘AI处理能力'
          ],
          applications: [
            '智能农业监测',
            '工业传感器网络',
            '智能建筑管理',
            '资产追踪',
            '环境监测',
            '智能计量'
          ],
          blockDiagram: '/images/solutions/iot-solutions-block.svg',
          bomList: [
            {
              partNumber: 'STM32WLE5JC',
              description: 'LoRa微控制器',
              function: '主控+无线通信',
              package: 'UFBGA73',
              link: '/products/stm32wle5jc'
            },
            {
              partNumber: 'LIS2DH12',
              description: '3轴加速度计',
              function: '运动检测',
              package: 'LGA12',
              link: '/products/lis2dh12'
            },
            {
              partNumber: 'HTS221',
              description: '温湿度传感器',
              function: '环境监测',
              package: 'HLGA',
              link: '/products/hts221'
            },
            {
              partNumber: 'STBC08',
              description: '线性电池充电器',
              function: '电池管理',
              package: 'DFN8',
              link: '/products/stbc08'
            }
          ],
          technicalDocs: [
            {
              title: 'LoRaWAN网络部署指南',
              type: 'deployment-guide',
              link: '/documents/lorawan-deployment-guide.pdf'
            },
            {
              title: '物联网设备低功耗设计',
              type: 'application-note',
              link: '/documents/iot-low-power-design.pdf'
            }
          ],
          relatedProducts: ['STM32WL系列', 'STM32WB系列', 'LIS系列', 'HTS221']
        }
      ]
    }
  };
  
  return (brands as any)[slug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs and locales
  const brandSlugs = ['stm']; // Add more brand slugs as needed
  const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  const params = [];
  for (const locale of locales) {
    for (const brandSlug of brandSlugs) {
      params.push({ locale, brandSlug });
    }
  }
  
  return params;
}

export async function generateMetadata({
  params: { locale, brandSlug }
}: {
  params: { locale: string; brandSlug: string };
}): Promise<Metadata> {
  const brand = getBrandData(brandSlug);
  
  if (!brand) {
    return {
      title: 'Brand Not Found'
    };
  }
  
  return {
    title: `${brand.name}解决方案 - 行业应用方案 | LiTong`,
    description: `力通电子提供${brand.name}完整的行业解决方案，包括工业自动化、汽车电子、物联网等领域的专业方案和技术支持。`,
    keywords: [`${brand.name}解决方案`, `${brand.name}应用方案`, '工业自动化', '汽车电子', '物联网'],
    openGraph: {
      title: `${brand.name}解决方案 - 行业应用方案 | LiTong`,
      description: `${brand.name}完整的行业解决方案，专业技术支持`,
      type: 'website'
    }
  };
}

export default async function BrandSolutionsPage({
  params: { locale, brandSlug }
}: {
  params: { locale: string; brandSlug: string };
}) {
  const brand = getBrandData(brandSlug);
  
  if (!brand) {
    notFound();
  }

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brand.name, href: `/brands/${brandSlug}` },
    { label: '解决方案', href: `/brands/${brandSlug}/solutions` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandSolutions brand={brand} />
      
      {/* JSON-LD Schema for Brand Solutions Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${brand.name}解决方案`,
            "description": `${brand.name}行业应用解决方案页面`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": brand.solutions.length,
              "itemListElement": brand.solutions.map((solution, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Service",
                  "name": solution.title,
                  "description": solution.summary,
                  "category": solution.category
                }
              }))
            }
          })
        }}
      />
    </>
  );
}