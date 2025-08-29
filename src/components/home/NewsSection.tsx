'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const newsItems = [
  {
    id: '1',
    title: '力通电子与STMicroelectronics签署战略合作协议',
    titleEn: 'LiTong Electronics Signs Strategic Partnership with STMicroelectronics',
    slug: 'strategic-partnership-stmicroelectronics',
    excerpt: '深化在工业自动化和汽车电子领域的合作，为客户提供更优质的产品和服务...',
    category: 'company-news',
    publishedAt: '2024-11-15',
    image: '/images/news/company-news-1.svg',
    tags: ['合作伙伴', 'STM', '战略合作']
  },
  {
    id: '2',
    title: '2024年全球半导体市场展望：AI芯片需求持续增长',
    titleEn: '2024 Global Semiconductor Market Outlook: AI Chip Demand Continues to Grow',
    slug: 'semiconductor-market-outlook-2024',
    excerpt: '人工智能应用的快速发展推动了高性能计算芯片的需求，预计2024年市场将...',
    category: 'industry-news',
    publishedAt: '2024-11-12',
    image: '/images/news/industry-news-1.svg',
    tags: ['市场分析', 'AI芯片', '行业趋势']
  },
  {
    id: '3',
    title: '新能源汽车电池管理系统的技术发展趋势',
    titleEn: 'Technical Development Trends of EV Battery Management Systems',
    slug: 'ev-bms-technology-trends',
    excerpt: '随着电动汽车续航里程要求的提升，BMS系统的安全性和智能化成为关键...',
    category: 'industry-news',
    publishedAt: '2024-11-10',
    image: '/images/news/industry-news-2.svg',
    tags: ['新能源汽车', 'BMS', '电池管理']
  }
];

export default function NewsSection() {
  const t = useTranslations('common');
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            最新动态
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            了解行业最新趋势和公司发展动态，把握电子元件市场脉搏
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {newsItems.map((news) => (
            <article key={news.id} className="group">
              <Link href={`/${locale}/news/${news.slug}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                    </svg>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        news.category === 'company-news' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {news.category === 'company-news' ? '公司新闻' : '行业动态'}
                      </span>
                      <time className="text-xs text-gray-500">
                        {formatDate(news.publishedAt)}
                      </time>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                      {news.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {news.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                        {t('readMore')}
                      </span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            查看所有新闻
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}