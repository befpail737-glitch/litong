import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CompanyProfile from '@/components/about/CompanyProfile';
import CompanyHistory from '@/components/about/CompanyHistory';
import QualityAssurance from '@/components/about/QualityAssurance';
import CustomerCases from '@/components/about/CustomerCases';

// 强制静态生成
export const dynamic = 'force-static';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: `关于我们 - ${t('title')}`,
    description: '力通电子成立于2004年，专注电子元件代理20年，为客户提供正品原装现货、数字证书追踪、专业技术支持和优势价格。',
    keywords: ['力通电子', '电子元件代理', '公司简介', '发展历程', '质量保证', '客户案例'],
  };
}

export async function generateStaticParams() {
  const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  return locales.map((locale) => ({
    locale
  }));
}

const breadcrumbItems = [
  { label: '首页', href: '/' },
  { label: '关于我们', href: '/about' }
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">关于我们</h1>
            <p className="mt-2 text-lg text-gray-600">
              专业电子元件代理商，20年行业经验，值得信赖
            </p>
          </div>
        </div>
      </div>
      
      <CompanyProfile />
      <CompanyHistory />
      <QualityAssurance />
      <CustomerCases />
      
      {/* JSON-LD Schema for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "关于力通电子",
            "description": "专业电子元件代理商，20年行业经验",
            "url": "https://www.litong-electronics.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "LiTong Electronics",
              "alternateName": "力通电子",
              "foundingDate": "2004",
              "description": "专注电子元件代理20年，为客户提供正品原装现货、数字证书追踪、专业技术支持和优势价格",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+86-400-123-4567",
                "contactType": "customer service"
              },
              "knowsAbout": [
                "电子元件代理",
                "芯片现货",
                "半导体分销",
                "技术支持"
              ]
            }
          })
        }}
      />
    </>
  );
}