import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandProducts from '@/components/brands/BrandProducts';
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
          description: 'STM32系列32位ARM® Cortex®-M微控制器，提供丰富的外设和强大的性能',
          productCount: 800,
          image: '/images/categories/microcontroller.svg',
          subcategories: [
            {
              name: 'STM32F0系列',
              description: '入门级ARM® Cortex®-M0微控制器',
              productCount: 50
            },
            {
              name: 'STM32F1系列',
              description: '主流ARM® Cortex®-M3微控制器',
              productCount: 80
            },
            {
              name: 'STM32F4系列',
              description: '高性能ARM® Cortex®-M4微控制器',
              productCount: 120
            },
            {
              name: 'STM32F7系列',
              description: '超高性能ARM® Cortex®-M7微控制器',
              productCount: 65
            },
            {
              name: 'STM32H7系列',
              description: '旗舰ARM® Cortex®-M7微控制器',
              productCount: 45
            },
            {
              name: 'STM32L4系列',
              description: '超低功耗ARM® Cortex®-M4微控制器',
              productCount: 90
            },
            {
              name: 'STM32G0系列',
              description: '通用ARM® Cortex®-M0+微控制器',
              productCount: 35
            },
            {
              name: 'STM32G4系列',
              description: '高性能混合信号微控制器',
              productCount: 55
            }
          ],
          features: [
            'ARM® Cortex®-M内核',
            '丰富的外设接口',
            '低功耗设计',
            '完善的开发生态',
            '工业级温度范围',
            'ECOPACK®环保封装'
          ],
          applications: [
            '工业自动化',
            '消费电子',
            '医疗设备',
            '智能家居',
            '汽车电子',
            '物联网'
          ]
        },
        {
          id: '2', 
          name: '模拟IC',
          slug: 'analog-ics',
          description: '高性能模拟集成电路，包括运算放大器、比较器、电压基准和模拟开关',
          productCount: 500,
          image: '/images/categories/analog-ic.svg',
          subcategories: [
            {
              name: '运算放大器',
              description: '高精度、低噪声运算放大器',
              productCount: 150
            },
            {
              name: '比较器',
              description: '高速、低功耗比较器',
              productCount: 80
            },
            {
              name: '电压基准',
              description: '高精度电压基准源',
              productCount: 45
            },
            {
              name: '模拟开关',
              description: '低阻抗、低失真模拟开关',
              productCount: 95
            },
            {
              name: '信号调理',
              description: '信号放大和调理电路',
              productCount: 70
            },
            {
              name: '数据转换器',
              description: 'ADC和DAC转换器',
              productCount: 60
            }
          ],
          features: [
            '高精度性能',
            '低噪声设计',
            '宽工作温度范围',
            '低功耗',
            '小封装尺寸',
            '高可靠性'
          ],
          applications: [
            '精密测量',
            '传感器接口',
            '音频处理',
            '工业控制',
            '医疗电子',
            '通信设备'
          ]
        },
        {
          id: '3',
          name: '功率器件',
          slug: 'power-devices', 
          description: '高效能功率半导体器件，包括MOSFET、IGBT、二极管和功率模块',
          productCount: 400,
          image: '/images/categories/power-device.svg',
          subcategories: [
            {
              name: 'MOSFET',
              description: '低导通阻抗MOSFET功率管',
              productCount: 120
            },
            {
              name: 'IGBT',
              description: '绝缘栅双极晶体管',
              productCount: 85
            },
            {
              name: '功率二极管',
              description: '肖特基、快恢复二极管',
              productCount: 95
            },
            {
              name: '功率模块',
              description: '集成功率模块解决方案',
              productCount: 55
            },
            {
              name: '碳化硅器件',
              description: 'SiC MOSFET和二极管',
              productCount: 25
            },
            {
              name: '氮化镓器件',
              description: 'GaN功率器件',
              productCount: 20
            }
          ],
          features: [
            '高开关频率',
            '低导通损耗',
            '高温工作能力',
            '优化热设计',
            '可靠性保证',
            '符合汽车标准'
          ],
          applications: [
            '电源管理',
            '电机驱动',
            '充电桩',
            '太阳能逆变器',
            '工业电源',
            '汽车电子'
          ]
        },
        {
          id: '4',
          name: '传感器',
          slug: 'sensors',
          description: 'MEMS传感器、环境传感器和图像传感器，实现智能感知',
          productCount: 300,
          image: '/images/categories/sensor.svg',
          subcategories: [
            {
              name: '加速度计',
              description: '3轴加速度传感器',
              productCount: 45
            },
            {
              name: '陀螺仪',
              description: '3轴角速度传感器',
              productCount: 35
            },
            {
              name: '磁力计',
              description: '3轴磁力传感器',
              productCount: 25
            },
            {
              name: '压力传感器',
              description: '绝对/相对压力传感器',
              productCount: 50
            },
            {
              name: '温湿度传感器',
              description: '数字温湿度传感器',
              productCount: 40
            },
            {
              name: 'ToF传感器',
              description: '飞行时间测距传感器',
              productCount: 30
            },
            {
              name: '环境传感器',
              description: '气体、光照传感器',
              productCount: 35
            },
            {
              name: '图像传感器',
              description: 'CMOS图像传感器',
              productCount: 40
            }
          ],
          features: [
            'MEMS技术',
            '高精度测量',
            '低功耗',
            '小尺寸',
            '数字输出',
            '宽温度范围'
          ],
          applications: [
            '消费电子',
            '汽车电子',
            '工业物联网',
            '智能穿戴',
            '无人机',
            '机器人'
          ]
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
    title: `${brand.name}产品分类 - 电子元件代理 | LiTong`,
    description: `力通电子为您提供${brand.name}全系列产品分类，包括微控制器、模拟IC、功率器件、传感器等，现货供应，技术支持。`,
    keywords: [`${brand.name}产品`, `${brand.name}分类`, `${brand.name}现货`, '电子元件代理'],
    openGraph: {
      title: `${brand.name}产品分类 - 电子元件代理 | LiTong`,
      description: `${brand.name}全系列产品分类，现货供应，技术支持`,
      type: 'website'
    }
  };
}

export default async function BrandProductsPage({
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
    { label: '产品分类', href: `/brands/${brandSlug}/products` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandProducts 
        brand={{
          _id: brand.id,
          name: brand.name,
          nameEn: brand.name,
          slug: { current: brandSlug },
          description: brand.description,
          website: brand.website,
          country: brand.headquarters,
          founded: parseInt(brand.founded)
        }} 
        categories={brand.categories.map((cat: any) => ({
          _id: cat.id,
          name: cat.name,
          nameEn: cat.name,
          slug: { current: cat.slug },
          description: cat.description,
          productCount: cat.productCount,
          subcategories: cat.subcategories?.map((sub: any) => ({
            _id: sub.name,
            name: sub.name,
            nameEn: sub.name,
            slug: { current: sub.name.toLowerCase().replace(/\s+/g, '-') },
            description: sub.description,
            productCount: sub.productCount
          })) || []
        }))}
      />
      
      {/* JSON-LD Schema for Brand Products Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${brand.name}产品分类`,
            "description": `${brand.name}全系列产品分类页面`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": brand.categories.length,
              "itemListElement": brand.categories.map((category: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "ProductGroup",
                  "name": category.name,
                  "description": category.description,
                  "hasVariant": `${category.productCount}+ products`
                }
              }))
            }
          })
        }}
      />
    </>
  );
}