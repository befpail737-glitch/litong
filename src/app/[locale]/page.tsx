import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords')
  };
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          力通电子
        </h1>
        <p className="text-lg text-gray-600">
          专业电子元件代理商
        </p>
      </div>
    </div>
  );
}