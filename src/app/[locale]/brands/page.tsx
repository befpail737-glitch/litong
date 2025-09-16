import { MainLayout } from '@/components/layout/MainLayout';
import { getBrands } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';

// Generate static params for supported locales
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN' },
    { locale: 'zh-TW' },
    { locale: 'en' },
    { locale: 'ja' },
    { locale: 'ko' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'es' },
    { locale: 'ru' },
    { locale: 'ar' }
  ];
}

interface BrandsPageProps {
  params: {
    locale: string;
  };
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = params;
  let brands = [];
  let error = null;

  try {
    brands = await getBrands();
  } catch (err) {
    error = err.message || '获取品牌数据失败';
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">品牌列表</h1>

        {error ? (
          <p className="text-red-600">数据加载失败: {error}</p>
        ) : brands.length === 0 ? (
          <p className="text-gray-600">暂无品牌数据</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <div key={brand._id} className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                <a href={`/${locale}/brands/${brand.slug}`} className="text-gray-900 hover:text-blue-600 font-medium">
                  {brand.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}