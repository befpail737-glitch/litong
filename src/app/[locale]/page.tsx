import { useTranslations } from 'next-intl';
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
      siteName: 'LiTong Electronics'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductCategoriesSection />
      <SolutionsSection />
      <NewsSection />
      <CTASection />
      
      {/* JSON-LD Schema for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "LiTong Electronics - 电子元件核心代理",
            "description": "力通是电子元件核心代理，长期稳定供应提供正品原装现货。并提供技术支持和优势价格，欢迎咨询。",
            "url": "https://www.litong-electronics.com",
            "mainEntity": {
              "@type": "Organization",
              "name": "LiTong Electronics",
              "alternateName": "力通电子",
              "url": "https://www.litong-electronics.com",
              "description": "专业电子元件代理商",
              "foundingDate": "2004",
              "industry": "Electronic Components Distribution",
              "knowsAbout": [
                "电子元件代理",
                "芯片现货",
                "半导体分销",
                "技术支持",
                "Electronic Components",
                "Semiconductors"
              ]
            }
          })
        }}
      />
    </>
  );
}