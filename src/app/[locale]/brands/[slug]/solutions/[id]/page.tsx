import { notFound } from 'next/navigation';

interface BrandSolutionPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Temporarily disabled for Cloudflare deployment optimization
export async function generateStaticParams() {
  console.log('⚠️ [generateStaticParams] Brand solution pages temporarily disabled for deployment optimization');

  // Return minimal params to avoid build timeout
  return [
    { locale: 'zh-CN', slug: 'cree', id: 'sample-solution' },
    { locale: 'en', slug: 'cree', id: 'sample-solution' }
  ];
}

export default async function BrandSolutionPage({ params }: BrandSolutionPageProps) {
  // Temporarily disabled during Cloudflare deployment optimization
  console.log('⚠️ Brand solution pages temporarily disabled');
  notFound();
}