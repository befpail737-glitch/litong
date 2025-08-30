import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductCategoriesSection from '@/components/home/ProductCategoriesSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import NewsSection from '@/components/home/NewsSection';
import CTASection from '@/components/home/CTASection';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh': '/zh',
        'en': '/en',
        'ja': '/ja',
        'ko': '/ko',
        'ru': '/ru',
        'vi': '/vi',
        'fr': '/fr',
        'de': '/de',
        'it': '/it',
        'tr': '/tr',
        'ar': '/ar',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

export async function generateStaticParams() {
  const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  return locales.map((locale) => ({
    locale
  }));
}

// 结构化数据（Schema.org）
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LiTong Electronics",
  "alternateName": "力通电子",
  "description": "专业电子元件代理商，提供正品原装现货、技术支持和优势价格",
  "url": "https://litong-electronics.pages.dev",
  "logo": "https://litong-electronics.pages.dev/icons/litong-logo.svg",
  "foundingDate": "2004",
  "numberOfEmployees": "200-500",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CN",
    "addressLocality": "深圳市",
    "addressRegion": "广东省"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+86-400-888-9999",
    "contactType": "customer service",
    "availableLanguage": ["zh-CN", "en"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/litong-electronics",
    "https://weibo.com/litongelectronics"
  ]
};

export default function HomePage() {
  return (
    <>
      {/* 结构化数据 */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <main className="min-h-screen">
        {/* 英雄横幅 - SEO优化的H1标签 */}
        <HeroSection />
        
        {/* 核心优势 - Why Choose Us */}
        <FeaturesSection />
        
        {/* 核心产品领域 - Core Product Areas */}
        <ProductCategoriesSection />
        
        {/* 解决方案与应用领域 - Solutions & Applications */}
        <SolutionsSection />
        
        {/* 最新动态 - Latest News */}
        <NewsSection />
        
        {/* 最终行动号召 - Final Call-to-Action */}
        <CTASection />
      </main>
    </>
  );
}