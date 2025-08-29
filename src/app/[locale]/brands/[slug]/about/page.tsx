import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BrandAbout from '@/components/brands/BrandAbout';
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
      employees: '48,000+',
      revenue: '16.1亿美元 (2023)',
      about: {
        overview: 'STMicroelectronics (简称ST) 是一家全球化的半导体公司，为智能驾驶、智能工厂、智能城市和智能家居等各种应用提供创新的半导体解决方案。ST的产品组合包括微控制器、传感器、功率器件、模拟器件等，广泛应用于汽车、工业、个人电子、通信设备和计算机设备等领域。',
        history: [
          {
            year: '1957',
            milestone: 'SGS (Società Generale Semiconduttori) 在意大利阿格拉特布里安察成立'
          },
          {
            year: '1972', 
            milestone: 'Thomson Semiconducteurs 在法国成立'
          },
          {
            year: '1987',
            milestone: 'SGS 和 Thomson Semiconducteurs 合并成立 STMicroelectronics'
          },
          {
            year: '1994',
            milestone: '纽约证券交易所上市'
          },
          {
            year: '2007',
            milestone: '推出首款STM32微控制器，开创ARM Cortex-M时代'
          },
          {
            year: '2020',
            milestone: '年营收突破100亿美元，跻身全球十大半导体公司'
          }
        ],
        vision: 'ST致力于成为智能移动、电力和能源管理以及物联网和连接技术领域的首选半导体合作伙伴。',
        mission: '我们通过创新的半导体技术，让我们的客户能够设计和制造智能、节能和安全的产品，从而改善人们的生活。',
        values: [
          {
            title: '客户至上',
            description: '以客户需求为中心，提供卓越的产品和服务'
          },
          {
            title: '创新驱动',
            description: '持续投资研发，推动半导体技术的边界'
          },
          {
            title: '质量承诺',
            description: '确保每一个产品都符合最高的质量标准'
          },
          {
            title: '可持续发展',
            description: '致力于环境保护和社会责任'
          }
        ],
        markets: [
          {
            name: '汽车电子',
            percentage: 38,
            description: '车身电子、动力总成、安全系统、信息娱乐'
          },
          {
            name: '工业自动化',
            percentage: 25,
            description: '工业控制、电机驱动、电源管理、传感器'
          },
          {
            name: '消费电子',
            percentage: 22,
            description: '智能手机、可穿戴设备、家电、游戏设备'
          },
          {
            name: '通信基础设施',
            percentage: 15,
            description: '5G基站、路由器、交换机、光通信'
          }
        ]
      }
    },
    'ti': {
      id: '2',
      name: 'Texas Instruments',
      slug: 'ti',
      logo: '/images/brands/ti-logo.svg',
      description: 'Texas Instruments (TI) 是全球领先的模拟和嵌入式处理技术供应商。',
      website: 'https://www.ti.com',
      founded: '1930',
      headquarters: '达拉斯，德克萨斯州，美国',
      employees: '30,000+',
      revenue: '200亿美元 (2023)',
      about: {
        overview: 'Texas Instruments (TI) 设计并制造半导体技术，帮助客户开发和制造电子产品。TI专注于模拟和嵌入式处理产品，为工业、汽车、个人电子、通信设备和企业系统等市场提供服务。',
        history: [
          {
            year: '1930',
            milestone: 'Geophysical Service Incorporated (GSI) 成立，TI的前身'
          },
          {
            year: '1951',
            milestone: '公司更名为Texas Instruments'
          },
          {
            year: '1958',
            milestone: '发明集成电路，Jack Kilby获得诺贝尔物理学奖'
          },
          {
            year: '1967',
            milestone: '发明手持计算器'
          },
          {
            year: '1982',
            milestone: '推出首款数字信号处理器(DSP)'
          }
        ],
        vision: '通过让电子产品更实惠，让世界更智能、更健康、更安全、更环保、更有趣。',
        mission: '我们设计并制造半导体技术，帮助我们的客户创造世界上最具创新性的电子产品。',
        values: [
          {
            title: '诚信',
            description: '在所有业务往来中保持最高的道德标准'
          },
          {
            title: '创新',
            description: '持续推动技术进步和产品创新'
          },
          {
            title: '承诺',
            description: '对客户、员工和股东负责'
          }
        ],
        markets: [
          {
            name: '工业',
            percentage: 35,
            description: '工厂自动化、电网基础设施、医疗电子'
          },
          {
            name: '汽车',
            percentage: 25,
            description: '车身电子、安全系统、信息娱乐、ADAS'
          },
          {
            name: '个人电子',
            percentage: 25,
            description: '智能手机、平板电脑、音频设备'
          },
          {
            name: '通信设备',
            percentage: 15,
            description: '网络设备、基站、数据中心'
          }
        ]
      }
    }
  };
  
  return (brands as any)[slug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs
  const brandSlugs = ['stm', 'ti']; // Add more brand slugs as needed
  
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
    title: `关于${brand.name} - 品牌介绍 | LiTong`,
    description: `了解${brand.name}的发展历程、企业文化和技术实力。力通电子作为${brand.name}授权代理商，为您提供专业的产品和技术支持。`,
    keywords: [`关于${brand.name}`, `${brand.name}公司介绍`, `${brand.name}历史`, `${brand.name}代理商`],
    openGraph: {
      title: `关于${brand.name} - 品牌介绍 | LiTong`,
      description: `了解${brand.name}的发展历程、企业文化和技术实力`,
      type: 'website'
    }
  };
}

export default async function BrandAboutPage({
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
    { label: '关于品牌', href: `/brands/${slug}/about` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <BrandAbout brand={brand} />
      
      {/* JSON-LD Schema for Brand About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Organization",
              "name": brand.name,
              "description": brand.about.overview,
              "url": brand.website,
              "foundingDate": brand.founded,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": brand.headquarters
              },
              "numberOfEmployees": brand.employees,
              "mission": brand.about.mission
            }
          })
        }}
      />
    </>
  );
}