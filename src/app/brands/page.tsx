'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default locale (Chinese)
    router.replace('/zh-CN/brands/');
  }, [router]);

  // Fallback content while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳转到品牌页面...</p>
      </div>
    </div>
  );
}