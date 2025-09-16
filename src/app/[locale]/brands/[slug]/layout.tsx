import { notFound } from 'next/navigation';

import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { Footer } from '@/components/layout/Footer';
import { getBrandData } from '@/lib/sanity/brands';

interface BrandLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default async function BrandLayout({ children, params }: BrandLayoutProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BrandNavigation brand={brand} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
