import { notFound } from 'next/navigation';

interface BrandProductPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Temporarily disabled for Cloudflare deployment optimization
export async function generateStaticParams() {
  console.log('⚠️ [generateStaticParams] Brand product pages temporarily disabled for deployment optimization');

  // Return minimal params to avoid build timeout
  return [
    { locale: 'zh-CN', slug: 'cree', id: 'sample-product' },
    { locale: 'en', slug: 'cree', id: 'sample-product' }
  ];
}

// Enable ISR for dynamic page generation of uncached pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function BrandProductPage({ params }: BrandProductPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Decode product ID to handle special characters
  const decodedProductId = decodeURIComponent(id);

  // Temporarily disabled during Cloudflare deployment optimization
  console.log('⚠️ Brand product pages temporarily disabled');
  notFound();
}