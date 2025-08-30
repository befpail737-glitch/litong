import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ProductsFilter from '@/components/products/ProductsFilter';
import ProductsList from '@/components/products/ProductsList';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 强制静态生成
export const dynamic = 'force-static';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: `产品列表 - ${t('title')}`,
    description: '力通电子产品目录，包括微控制器、电源管理、模拟IC、传感器等各类电子元件，支持参数筛选和在线选型。',
    keywords: ['电子元件产品', '微控制器', '电源管理IC', '模拟IC', '传感器', '芯片选型'],
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
  { label: '产品列表', href: '/products' }
];

export default function ProductsPage() {
  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">产品列表</h1>
            <p className="mt-2 text-lg text-gray-600">
              专业的电子元件选型平台，支持多维度参数筛选
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductsFilter />
              </Suspense>
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductsList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      
      {/* JSON-LD Schema for Products Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "电子元件产品列表 - 力通电子",
            "description": "专业的电子元件产品目录，支持参数筛选和在线选型",
            "url": "https://www.litong-electronics.com/products",
            "mainEntity": {
              "@type": "ItemList",
              "name": "电子元件产品",
              "description": "包括微控制器、电源管理、模拟IC、传感器等各类产品"
            }
          })
        }}
      />
    </>
  );
}