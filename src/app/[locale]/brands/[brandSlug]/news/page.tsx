import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandNews from '@/components/brands/BrandNews';
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
      news: [
        {
          id: '1',
          title: 'STMicroelectronics发布新一代STM32H7+ MCU系列',
          slug: 'stm32h7-plus-new-generation-mcu',
          category: '产品发布',
          publishedAt: '2024-11-20',
          summary: 'ST推出最新STM32H7+ MCU系列，集成更高性能ARM Cortex-M7内核，工作频率高达550MHz，为高端嵌入式应用提供卓越性能。',
          content: 'STMicroelectronics今日宣布推出新一代STM32H7+ MCU系列，这是STM32产品线中性能最强大的微控制器产品。新产品基于ARM Cortex-M7内核，工作频率高达550MHz，集成了高达2MB的Flash存储器和1MB的RAM，为工业自动化、高级UI界面和实时控制应用提供了前所未有的处理能力。',
          image: '/images/news/stm32h7-plus-announcement.jpg',
          tags: ['STM32H7+', '微控制器', '产品发布', 'ARM Cortex-M7'],
          readTime: '5分钟',
          author: {
            name: 'ST官方',
            avatar: '/images/authors/st-official.jpg'
          },
          featured: true
        },
        {
          id: '2',
          title: 'ST与力通电子签署战略合作协议，深化中国市场布局',
          slug: 'st-litong-strategic-partnership-agreement',
          category: '合作伙伴',
          publishedAt: '2024-11-18',
          summary: 'STMicroelectronics与力通电子签署战略合作协议，进一步加强在中国市场的产品供应和技术支持能力。',
          content: 'STMicroelectronics与力通电子正式签署战略合作协议，双方将在产品供应、技术支持、市场推广等方面深化合作。作为ST的授权分销商，力通电子将为中国客户提供更加及时的产品供应和专业的技术支持服务，助力中国电子制造业的快速发展。',
          image: '/images/news/st-litong-partnership.jpg',
          tags: ['战略合作', '力通电子', '中国市场', '分销伙伴'],
          readTime: '3分钟',
          author: {
            name: 'ST中国',
            avatar: '/images/authors/st-china.jpg'
          },
          featured: true
        },
        {
          id: '3',
          title: 'ST发布业界首款多区域ToF传感器VL53L8CX',
          slug: 'vl53l8cx-multi-zone-tof-sensor-launch',
          category: '产品发布',
          publishedAt: '2024-11-15',
          summary: '新推出的VL53L8CX ToF传感器支持64个独立测距区域，为手势识别和空间感知应用带来革命性突破。',
          content: 'STMicroelectronics推出突破性的VL53L8CX多区域Time-of-Flight传感器，这是业界首款支持64个独立测距区域的ToF传感器。该产品为智能手机、AR/VR设备、机器人和智能家居等应用提供了前所未有的空间感知能力，能够实现复杂的手势识别和精确的物体检测功能。',
          image: '/images/news/vl53l8cx-tof-sensor.jpg',
          tags: ['VL53L8CX', 'ToF传感器', '手势识别', '空间感知'],
          readTime: '4分钟',
          author: {
            name: 'ST传感器部门',
            avatar: '/images/authors/st-sensors.jpg'
          },
          featured: false
        },
        {
          id: '4',
          title: 'STM32WL无线MCU在智能计量领域获得广泛应用',
          slug: 'stm32wl-smart-metering-applications',
          category: '应用案例',
          publishedAt: '2024-11-12',
          summary: 'STM32WL系列无线微控制器凭借其集成的LoRa收发器和超低功耗特性，在智能水表、电表和燃气表等智能计量应用中获得广泛采用。',
          content: 'STMicroelectronics的STM32WL系列无线微控制器在智能计量市场取得显著成功。该系列产品集成了LoRa/LoRaWAN收发器，支持超低功耗运行，电池供电可持续工作数年。目前已有多家知名计量设备制造商采用STM32WL开发新一代智能水表、电表和燃气表产品。',
          image: '/images/news/stm32wl-smart-metering.jpg',
          tags: ['STM32WL', '智能计量', 'LoRa', '物联网'],
          readTime: '6分钟',
          author: {
            name: 'ST物联网团队',
            avatar: '/images/authors/st-iot.jpg'
          },
          featured: false
        },
        {
          id: '5',
          title: 'ST在2024年慕尼黑电子展展示最新汽车电子解决方案',
          slug: 'st-electronica-2024-automotive-solutions',
          category: '展会活动',
          publishedAt: '2024-11-08',
          summary: 'STMicroelectronics在2024年慕尼黑电子展上展示了其最新的汽车电子产品和解决方案，重点关注电动汽车、ADAS和车联网技术。',
          content: '在2024年慕尼黑电子展上，STMicroelectronics展示了面向未来汽车的完整半导体解决方案。展出的产品涵盖电动汽车功率模块、ADAS传感器融合、车载充电器控制芯片以及车联网通信解决方案。ST的汽车级产品符合AEC-Q100标准，为汽车制造商提供可靠、高效的电子系统解决方案。',
          image: '/images/news/electronica-2024-st-booth.jpg',
          tags: ['慕尼黑电子展', '汽车电子', '电动汽车', 'ADAS'],
          readTime: '4分钟',
          author: {
            name: 'ST汽车部门',
            avatar: '/images/authors/st-automotive.jpg'
          },
          featured: false
        },
        {
          id: '6',
          title: 'ST功率器件助力可再生能源发电效率提升',
          slug: 'st-power-devices-renewable-energy',
          category: '技术创新',
          publishedAt: '2024-11-05',
          summary: 'STMicroelectronics的碳化硅(SiC)功率器件在太阳能逆变器和风力发电系统中展现出卓越性能，显著提升能源转换效率。',
          content: 'STMicroelectronics的碳化硅(SiC) MOSFET和二极管在可再生能源领域取得重要进展。这些宽禁带半导体器件具有更低的开关损耗和更高的工作温度，使太阳能逆变器和风力发电系统的效率提升至99%以上。ST的SiC产品已被多家知名可再生能源设备制造商采用，为全球绿色能源发展贡献力量。',
          image: '/images/news/st-sic-renewable-energy.jpg',
          tags: ['SiC功率器件', '可再生能源', '太阳能逆变器', '碳化硅'],
          readTime: '5分钟',
          author: {
            name: 'ST功率器件部门',
            avatar: '/images/authors/st-power.jpg'
          },
          featured: false
        }
      ]
    }
  };
  
  return (brands as any)[slug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs and locales
  const brandSlugs = ['stm', 'ti']; // Add more brand slugs as needed
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
    title: `${brand.name}新闻中心 - 最新资讯与动态 | LiTong`,
    description: `了解${brand.name}最新产品发布、技术创新、合作伙伴和行业动态。力通电子为您提供第一手的${brand.name}资讯。`,
    keywords: [`${brand.name}新闻`, `${brand.name}资讯`, `${brand.name}产品发布`, '半导体新闻'],
    openGraph: {
      title: `${brand.name}新闻中心 - 最新资讯与动态 | LiTong`,
      description: `${brand.name}最新资讯与动态，第一手产品信息`,
      type: 'website'
    }
  };
}

export default async function BrandNewsPage({
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
    { label: '新闻中心', href: `/brands/${brandSlug}/news` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandNews brand={brand} />
      
      {/* JSON-LD Schema for Brand News Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${brand.name}新闻中心`,
            "description": `${brand.name}最新新闻和资讯页面`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": brand.news.length,
              "itemListElement": brand.news.map((article: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "headline": article.title,
                  "description": article.summary,
                  "datePublished": article.publishedAt,
                  "author": {
                    "@type": "Organization",
                    "name": article.author.name
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "LiTong Electronics"
                  }
                }
              }))
            }
          })
        }}
      />
    </>
  );
}