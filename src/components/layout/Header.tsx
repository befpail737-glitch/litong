'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
// Removed @heroicons dependency, using inline SVG instead

const navigation = [
  { name: 'home', href: '/' },
  { name: 'brands', href: '/brands' },
  { name: 'products', href: '/products' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const t = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href={`/${locale}`} className="-m-1.5 p-1.5">
              <span className="sr-only">LiTong Electronics</span>
              <div className="flex items-center">
                <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">LiTong</span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={`/${locale}${item.href}`}
                className="text-sm font-medium leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                {t(item.name)}
              </Link>
            ))}
          </div>

          {/* Search and CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href={`/${locale}/contact`}
              className="btn-primary text-sm"
            >
              {t('contact')}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isHydrated && mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href={`/${locale}`} className="-m-1.5 p-1.5">
                  <span className="sr-only">LiTong Electronics</span>
                  <div className="flex items-center">
                    <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span className="ml-2 text-xl font-bold text-gray-900">LiTong</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={`/${locale}${item.href}`}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.name)}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link
                      href={`/${locale}/contact`}
                      className="btn-primary w-full text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('contact')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}