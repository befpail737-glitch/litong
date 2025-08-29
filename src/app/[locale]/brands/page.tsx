import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BrandsList from '@/components/brands/BrandsList';
import Breadcrumb from '@/components/ui/Breadcrumb';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: `品牌列表 - ${t('title')}`,
    description: '力通电子代理的知名电子元件品牌，包括STM、TI、Maxim、Infineon等全球顶级半导体厂商。',
    keywords: ['电子元件品牌', 'STM代理', 'TI代理', '半导体品牌', '芯片品牌'],
  };
}

const breadcrumbItems = [
  { label: '首页', href: '/' },
  { label: '品牌列表', href: '/brands' }
];

export default function BrandsPage() {
  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">品牌列表</h1>
            <p className="mt-2 text-lg text-gray-600">
              我们是全球知名电子元件品牌的授权代理商
            </p>
          </div>
        </div>
      </div>
      
      <BrandsList />
      
      {/* JSON-LD Schema for Brands Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "电子元件品牌列表 - 力通电子",
            "description": "力通电子代理的知名电子元件品牌",
            "url": "https://www.litong-electronics.com/brands",
            "mainEntity": {
              "@type": "ItemList",
              "name": "电子元件品牌",
              "itemListElement": [
                {
                  "@type": "Brand",
                  "name": "STMicroelectronics",
                  "description": "全球领先的半导体供应商"
                },
                {
                  "@type": "Brand", 
                  "name": "Texas Instruments",
                  "description": "模拟和嵌入式处理半导体厂商"
                }
              ]
            }
          })
        }}
      />
    </>
  );
}