import SearchPageClient from '@/components/search/SearchPageClient';

// Generate static params for supported locales
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN' },
    { locale: 'en' }
  ];
}

interface SearchPageProps {
  params: { locale: string };
}

export default function SearchPage({ params }: SearchPageProps) {
  return <SearchPageClient locale={params.locale} />;
}