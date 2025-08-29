'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const footerSections = [
  {
    name: 'products',
    links: [
      { name: 'Microcontrollers', href: '/products/microcontrollers' },
      { name: 'Power Management', href: '/products/power-management' },
      { name: 'Analog & Mixed Signal', href: '/products/analog-mixed-signal' },
      { name: 'RF & Wireless', href: '/products/rf-wireless' },
    ]
  },
  {
    name: 'support',
    links: [
      { name: 'Selection Guide', href: '/technical-support/selection-guide' },
      { name: 'Application Notes', href: '/technical-support/application-notes' },
      { name: 'Troubleshooting', href: '/technical-support/troubleshooting' },
      { name: 'Product Reviews', href: '/technical-support/product-reviews' },
    ]
  },
  {
    name: 'company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Company Profile', href: '/about/profile' },
      { name: 'Quality Assurance', href: '/about/quality' },
      { name: 'Contact', href: '/contact' },
    ]
  }
];

export default function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="ml-2 text-xl font-bold">LiTong Electronics</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              专业电子元件代理商，提供正品原装现货、技术支持和优势价格。20年行业经验，值得信赖。
            </p>
            <p className="text-gray-400 text-xs">
              电子元件代理 · 芯片现货 · 技术支持
            </p>
          </div>

          {/* Navigation sections */}
          {footerSections.map((section) => (
            <div key={section.name}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {section.name === 'products' && 'Product Categories'}
                {section.name === 'support' && 'Technical Support'}
                {section.name === 'company' && 'Company'}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {currentYear} LiTong Electronics. All rights reserved. | 电子元件代理 | 芯片现货供应商
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href={`/${locale}/sitemap`} className="text-gray-400 hover:text-white text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org Organization markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "LiTong Electronics",
            "url": "https://www.litong-electronics.com",
            "logo": "https://www.litong-electronics.com/logo.svg",
            "description": "专业电子元件代理商，提供正品原装现货、技术支持和优势价格",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+86-400-123-4567",
              "contactType": "customer service",
              "availableLanguage": ["Chinese", "English"]
            },
            "sameAs": [
              "https://www.linkedin.com/company/litong-electronics"
            ]
          })
        }}
      />
    </footer>
  );
}