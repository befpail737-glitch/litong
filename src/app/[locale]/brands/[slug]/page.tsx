import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandDetail from '@/components/brands/BrandDetail';
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
      categories: [
        {
          id: '1',
          name: '微控制器',
          slug: 'microcontrollers',
          description: 'STM32系列32位ARM® Cortex®-M微控制器',
          productCount: 800,
          subcategories: ['STM32F4', 'STM32F7', 'STM32H7', 'STM32L4']
        },
        {
          id: '2', 
          name: '模拟IC',
          slug: 'analog-ics',
          description: '运算放大器、比较器、电压基准和开关',
          productCount: 500,
          subcategories: ['运算放大器', '比较器', '电压基准', '模拟开关']
        },
        {
          id: '3',
          name: '功率器件',
          slug: 'power-devices', 
          description: 'MOSFET、IGBT、二极管和功率模块',
          productCount: 400,
          subcategories: ['MOSFET', 'IGBT', '功率二极管', '功率模块']
        },
        {
          id: '4',
          name: '传感器',
          slug: 'sensors',
          description: 'MEMS传感器、环境传感器和图像传感器',
          productCount: 300,
          subcategories: ['加速度计', '陀螺仪', '压力传感器', '温湿度传感器']
        }
      ],
      solutions: [
        {
          title: '工业自动化',
          description: '基于STM32的工业控制解决方案'
        },
        {
          title: '汽车电子',
          description: '符合车规标准的汽车电子产品'
        },
        {
          title: '物联网',
          description: '低功耗无线连接解决方案'
        }
      ],
      technicalSupport: [
        {
          title: 'STM32选型指南',
          type: 'selection-guide',
          slug: 'stm32-selection-guide'
        },
        {
          title: 'STM32CubeMX使用指南',
          type: 'application-note',
          slug: 'stm32cubemx-guide'
        }
      ],
      news: [
        {
          title: 'STMicroelectronics推出新一代STM32H7微控制器',
          publishedAt: '2024-11-01',
          slug: 'stm32h7-new-generation'
        }
      ]
    },
    'stmicroelectronics': {
      id: '1',
      name: 'STMicroelectronics',
      slug: 'stmicroelectronics',
      logo: '/images/brands/stm-logo.svg',
      description: 'STMicroelectronics是全球领先的半导体供应商，为各种应用提供创新的智能技术解决方案。',
      website: 'https://www.st.com',
      founded: '1987',
      headquarters: '日内瓦，瑞士',
      categories: [
        {
          id: '1',
          name: '微控制器',
          slug: 'microcontrollers',
          description: 'STM32系列32位ARM® Cortex®-M微控制器',
          productCount: 800,
          subcategories: ['STM32F4', 'STM32F7', 'STM32H7', 'STM32L4']
        },
        {
          id: '2', 
          name: '模拟IC',
          slug: 'analog-ics',
          description: '运算放大器、比较器、电压基准和开关',
          productCount: 500,
          subcategories: ['运算放大器', '比较器', '电压基准', '模拟开关']
        },
        {
          id: '3',
          name: '功率器件',
          slug: 'power-devices', 
          description: 'MOSFET、IGBT、二极管和功率模块',
          productCount: 400,
          subcategories: ['MOSFET', 'IGBT', '功率二极管', '功率模块']
        },
        {
          id: '4',
          name: '传感器',
          slug: 'sensors',
          description: 'MEMS传感器、环境传感器和图像传感器',
          productCount: 300,
          subcategories: ['加速度计', '陀螺仪', '压力传感器', '温湿度传感器']
        }
      ],
      solutions: [
        {
          title: '工业自动化',
          description: '基于STM32的工业控制解决方案'
        },
        {
          title: '汽车电子',
          description: '符合车规标准的汽车电子产品'
        },
        {
          title: '物联网',
          description: '低功耗无线连接解决方案'
        }
      ],
      technicalSupport: [
        {
          title: 'STM32选型指南',
          type: 'selection-guide',
          slug: 'stm32-selection-guide'
        },
        {
          title: 'STM32CubeMX使用指南',
          type: 'application-note',
          slug: 'stm32cubemx-guide'
        }
      ],
      news: [
        {
          title: 'STMicroelectronics推出新一代STM32H7微控制器',
          publishedAt: '2024-11-01',
          slug: 'stm32h7-new-generation'
        }
      ]
    }
  };
  
  return (brands as any)[slug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs
  const brandSlugs = ['stm', 'stmicroelectronics']; // Add more brand slugs as needed
  
  return brandSlugs.map((slug) => ({
    slug: slug,
  }));
}

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
    title: `${brand.name} - 电子元件代理 | LiTong`,
    description: `力通电子是${brand.name}授权代理商，提供${brand.name}全系列电子元件产品，现货供应，技术支持。`,
    keywords: [`${brand.name}代理`, `${brand.name}现货`, `${brand.name}产品`, '电子元件代理'],
    openGraph: {
      title: `${brand.name} - 电子元件代理 | LiTong`,
      description: `力通电子是${brand.name}授权代理商，提供全系列产品和技术支持。`,
      type: 'website'
    }
  };
}

export default async function BrandDetailPage({
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
    { label: brand.name, href: `/brands/${slug}` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandDetail brand={brand} />
      
      {/* JSON-LD Schema for Brand Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": brand.name,
            "description": brand.description,
            "url": brand.website,
            "foundingDate": brand.founded,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": brand.headquarters
            },
            "makesOffer": brand.categories.map((category: any) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": category.name,
                "description": category.description
              }
            }))
          })
        }}
      />
    </>
  );
}