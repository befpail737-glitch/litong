import { notFound } from 'next/navigation';

interface BrandSupportDetailPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Temporarily disabled for Cloudflare deployment optimization
export async function generateStaticParams() {
  console.log('⚠️ [generateStaticParams] Brand support pages temporarily disabled for deployment optimization');

  // Return minimal params to avoid build timeout
  return [
    { locale: 'zh-CN', slug: 'cree', id: 'sample-support' },
    { locale: 'en', slug: 'cree', id: 'sample-support' }
  ];
}

export default async function BrandSupportDetailPage({ params }: BrandSupportDetailPageProps) {
  // Temporarily disabled during Cloudflare deployment optimization
  console.log('⚠️ Brand support pages temporarily disabled');
  notFound();
}