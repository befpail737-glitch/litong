'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { urlFor } from '@/lib/sanity/client';
import { Brand } from '@/lib/sanity/brands';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Package, Settings, HelpCircle } from 'lucide-react';

interface BrandNavigationProps {
  brand: Brand;
}

export function BrandNavigation({ brand }: BrandNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const baseUrl = `/brands/${encodeURIComponent(brand.slug || brand.name)}`;
  
  const navigation = [
    { 
      name: '品牌首页', 
      href: baseUrl,
      icon: Home,
      isActive: pathname === baseUrl
    },
    { 
      name: '产品分类', 
      href: `${baseUrl}/products`,
      icon: Package,
      isActive: pathname.startsWith(`${baseUrl}/products`)
    },
    { 
      name: '解决方案', 
      href: `${baseUrl}/solutions`,
      icon: Settings,
      isActive: pathname.startsWith(`${baseUrl}/solutions`)
    },
    { 
      name: '技术支持', 
      href: `${baseUrl}/support`,
      icon: HelpCircle,
      isActive: pathname.startsWith(`${baseUrl}/support`)
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar - Back to main site */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← 返回力通电子主站
            </Link>
            <div className="text-gray-500">
              {brand.country && <span>来自 {brand.country}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Info */}
          <div className="flex items-center space-x-4">
            {brand.logo && (
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src={urlFor(brand.logo).width(60).height(60).url()}
                  alt={brand.name}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain rounded-lg border p-1"
                />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{brand.name}</h1>
              {brand.description && (
                <p className="text-sm text-gray-600 max-w-md truncate">
                  {brand.description}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {brand.website && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  官方网站
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link href="/inquiry">
                立即询价
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      item.isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="px-3 pt-4 space-y-2">
                {brand.website && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      官方网站
                    </a>
                  </Button>
                )}
                <Button size="sm" className="w-full" asChild>
                  <Link 
                    href="/inquiry"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    立即询价
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}