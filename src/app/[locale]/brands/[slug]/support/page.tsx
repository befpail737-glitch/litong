import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandSupport from '@/components/brands/BrandSupport';
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
      technicalSupport: {
        categories: [
          {
            id: 'selection-guides',
            name: '选型指南',
            description: '帮助您选择最适合的STMicroelectronics产品',
            icon: '📋',
            articles: [
              {
                id: '1',
                title: 'STM32微控制器选型完全指南',
                slug: 'stm32-mcu-selection-guide',
                type: 'selection-guide',
                publishedAt: '2024-11-15',
                readTime: '15分钟',
                summary: '详细介绍如何根据应用需求选择合适的STM32微控制器型号，包括性能对比、封装选择和成本考虑。',
                tags: ['STM32', '微控制器', '选型', 'ARM Cortex-M'],
                difficulty: 'intermediate',
                downloads: 1250,
                author: {
                  name: '张工程师',
                  title: 'STM32 FAE',
                  avatar: '/images/authors/zhang-engineer.jpg'
                }
              },
              {
                id: '2',
                title: '功率MOSFET选型指南：如何选择合适的功率器件',
                slug: 'power-mosfet-selection-guide',
                type: 'selection-guide',
                publishedAt: '2024-11-10',
                readTime: '12分钟',
                summary: '从Rds(on)、Qg、热阻等关键参数详解功率MOSFET选型要点，适用于电源管理和电机驱动应用。',
                tags: ['MOSFET', '功率器件', '电源管理', '电机驱动'],
                difficulty: 'intermediate',
                downloads: 890,
                author: {
                  name: '李工程师',
                  title: '功率器件 FAE',
                  avatar: '/images/authors/li-engineer.jpg'
                }
              },
              {
                id: '3',
                title: 'MEMS传感器选型：加速度计和陀螺仪对比',
                slug: 'mems-sensor-selection-guide',
                type: 'selection-guide',
                publishedAt: '2024-11-05',
                readTime: '10分钟',
                summary: '详细对比ST的MEMS加速度计和陀螺仪产品线，帮助您为IoT和消费电子应用选择最佳传感器。',
                tags: ['MEMS', '传感器', '加速度计', '陀螺仪', 'IoT'],
                difficulty: 'beginner',
                downloads: 567,
                author: {
                  name: '王工程师',
                  title: 'MEMS传感器 FAE',
                  avatar: '/images/authors/wang-engineer.jpg'
                }
              }
            ]
          },
          {
            id: 'application-notes',
            name: '应用笔记',
            description: '实用的应用设计指导和最佳实践',
            icon: '📝',
            articles: [
              {
                id: '4',
                title: 'STM32 USB设备开发详解',
                slug: 'stm32-usb-device-development',
                type: 'application-note',
                publishedAt: '2024-11-12',
                readTime: '25分钟',
                summary: '从硬件设计到软件实现，完整介绍如何使用STM32开发USB设备，包含HID、CDC等常用设备类。',
                tags: ['STM32', 'USB', 'HID', 'CDC', '固件开发'],
                difficulty: 'advanced',
                downloads: 2100,
                author: {
                  name: '陈工程师',
                  title: 'STM32应用工程师',
                  avatar: '/images/authors/chen-engineer.jpg'
                }
              },
              {
                id: '5',
                title: '低功耗设计：STM32L4优化策略',
                slug: 'stm32l4-low-power-optimization',
                type: 'application-note',
                publishedAt: '2024-11-08',
                readTime: '18分钟',
                summary: '深入分析STM32L4的各种低功耗模式，提供实际项目中的功耗优化技巧和测量方法。',
                tags: ['STM32L4', '低功耗', '电池供电', 'IoT'],
                difficulty: 'intermediate',
                downloads: 1450,
                author: {
                  name: '刘工程师',
                  title: '低功耗应用专家',
                  avatar: '/images/authors/liu-engineer.jpg'
                }
              },
              {
                id: '6',
                title: 'IGBT驱动电路设计与保护',
                slug: 'igbt-driver-circuit-design',
                type: 'application-note',
                publishedAt: '2024-11-03',
                readTime: '22分钟',
                summary: '详解IGBT驱动电路的设计要点，包括栅极驱动、短路保护、dv/dt保护等关键技术。',
                tags: ['IGBT', '驱动电路', '保护', '功率电子'],
                difficulty: 'advanced',
                downloads: 1800,
                author: {
                  name: '赵工程师',
                  title: '功率电子专家',
                  avatar: '/images/authors/zhao-engineer.jpg'
                }
              }
            ]
          },
          {
            id: 'troubleshooting',
            name: '问题排查',
            description: '常见问题解答和故障排除方法',
            icon: '🔧',
            articles: [
              {
                id: '7',
                title: 'STM32调试常见问题及解决方案',
                slug: 'stm32-debugging-common-issues',
                type: 'troubleshooting',
                publishedAt: '2024-11-14',
                readTime: '20分钟',
                summary: '汇总STM32开发中最常遇到的调试问题，提供系统化的排查方法和解决步骤。',
                tags: ['STM32', '调试', '故障排查', 'JTAG', 'SWD'],
                difficulty: 'intermediate',
                downloads: 3200,
                author: {
                  name: '孙工程师',
                  title: '技术支持专家',
                  avatar: '/images/authors/sun-engineer.jpg'
                }
              },
              {
                id: '8',
                title: '功率器件热设计问题分析',
                slug: 'power-device-thermal-analysis',
                type: 'troubleshooting',
                publishedAt: '2024-11-06',
                readTime: '16分钟',
                summary: '分析功率器件过热的原因，提供散热设计优化方案和温度监测方法。',
                tags: ['功率器件', '热设计', '散热', 'MOSFET', 'IGBT'],
                difficulty: 'intermediate',
                downloads: 950,
                author: {
                  name: '周工程师',
                  title: '热设计专家',
                  avatar: '/images/authors/zhou-engineer.jpg'
                }
              }
            ]
          },
          {
            id: 'product-reviews',
            name: '新品评测',
            description: '最新产品的深度评测和性能分析',
            icon: '⭐',
            articles: [
              {
                id: '9',
                title: 'STM32H7A3评测：高性能与低功耗的完美结合',
                slug: 'stm32h7a3-review-performance-analysis',
                type: 'product-review',
                publishedAt: '2024-11-13',
                readTime: '30分钟',
                summary: '深度评测STM32H7A3微控制器的性能表现，对比前代产品，分析其在高端应用中的优势。',
                tags: ['STM32H7A3', '评测', '性能分析', 'ARM Cortex-M7'],
                difficulty: 'intermediate',
                downloads: 1650,
                author: {
                  name: '吴工程师',
                  title: '产品评测专家',
                  avatar: '/images/authors/wu-engineer.jpg'
                }
              },
              {
                id: '10',
                title: 'VL53L8CX多区域ToF传感器深度评测',
                slug: 'vl53l8cx-multi-zone-tof-sensor-review',
                type: 'product-review',
                publishedAt: '2024-11-01',
                readTime: '25分钟',
                summary: '全面评测ST最新的多区域ToF传感器VL53L8CX，展示其在手势识别和空间感知方面的应用潜力。',
                tags: ['VL53L8CX', 'ToF传感器', '手势识别', '评测'],
                difficulty: 'intermediate',
                downloads: 780,
                author: {
                  name: '郑工程师',
                  title: '传感器应用专家',
                  avatar: '/images/authors/zheng-engineer.jpg'
                }
              }
            ]
          }
        ]
      }
    }
  };
  
  return (brands as any)[slug] || null;
};

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const brand = getBrandData(slug);
  
  if (!brand) {
    return {
      title: 'Brand Not Found'
    };
  }
  
  return {
    title: `${brand.name}技术支持 - 技术文档与应用指南 | LiTong`,
    description: `力通电子为您提供${brand.name}完整的技术支持资源，包括选型指南、应用笔记、问题排查和新品评测，助力您的项目开发。`,
    keywords: [`${brand.name}技术支持`, `${brand.name}选型指南`, `${brand.name}应用笔记`, '技术文档'],
    openGraph: {
      title: `${brand.name}技术支持 - 技术文档与应用指南 | LiTong`,
      description: `${brand.name}完整的技术支持资源，专业技术团队`,
      type: 'website'
    }
  };
}

export default async function BrandSupportPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const brand = getBrandData(slug);
  
  if (!brand) {
    notFound();
  }

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brand.name, href: `/brands/${slug}` },
    { label: '技术支持', href: `/brands/${slug}/support` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandSupport brand={brand} />
      
      {/* JSON-LD Schema for Brand Support Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${brand.name}技术支持`,
            "description": `${brand.name}技术支持资源页面`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": brand.technicalSupport.categories.reduce((total, cat) => total + cat.articles.length, 0),
              "itemListElement": brand.technicalSupport.categories.flatMap((category, catIndex) =>
                category.articles.map((article, artIndex) => ({
                  "@type": "ListItem",
                  "position": catIndex * 10 + artIndex + 1,
                  "item": {
                    "@type": "TechArticle",
                    "headline": article.title,
                    "description": article.summary,
                    "datePublished": article.publishedAt,
                    "author": {
                      "@type": "Person",
                      "name": article.author.name,
                      "jobTitle": article.author.title
                    }
                  }
                }))
              )
            }
          })
        }}
      />
    </>
  );
}