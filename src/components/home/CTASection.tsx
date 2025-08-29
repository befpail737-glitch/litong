'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function CTASection() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="bg-primary-600">
      <div className="max-w-7xl mx-auto py-24 px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            立即开始您的项目
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-100 max-w-2xl mx-auto">
            无论您需要单个器件还是完整解决方案，我们的专业团队都能为您提供最适合的产品和技术支持
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              联系我们
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              浏览产品目录
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">电话咨询</h3>
              <p className="mt-2 text-primary-100">+86 400-123-4567</p>
              <p className="text-sm text-primary-200">工作日 9:00-18:00</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">邮件联系</h3>
              <p className="mt-2 text-primary-100">sales@litong.com</p>
              <p className="text-sm text-primary-200">24小时内回复</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">在线客服</h3>
              <p className="mt-2 text-primary-100">技术支持</p>
              <p className="text-sm text-primary-200">专业FAE团队</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}