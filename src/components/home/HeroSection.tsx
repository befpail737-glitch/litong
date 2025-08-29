'use client';

import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              {t('hero.subtitle')}
            </p>
            <p className="mt-4 text-lg text-blue-200 max-w-2xl">
              {t('hero.description')}
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                {t('hero.contactButton')}
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                {t('hero.catalogButton')}
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-sm text-blue-200">{t('hero.stats.experience')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10万+</div>
                <div className="text-sm text-blue-200">{t('hero.stats.models')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-blue-200">{t('hero.stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm text-blue-200">{t('hero.stats.genuine')}</div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <div className="w-full h-96 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-32 h-32 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              
              <div className="absolute -top-4 -left-4 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">{t('hero.features.stock')}</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">{t('hero.features.support')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}