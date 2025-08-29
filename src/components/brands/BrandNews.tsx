'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';

interface BrandNewsProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
    news: Array<{
      id: string;
      title: string;
      slug: string;
      category: string;
      publishedAt: string;
      summary: string;
      content: string;
      image: string;
      tags: string[];
      readTime: string;
      author: {
        name: string;
        avatar: string;
      };
      featured: boolean;
    }>;
  };
}

export default function BrandNews({ brand }: BrandNewsProps) {
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(brand.news.map(article => article.category)))];

  const filteredNews = brand.news.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredNews = brand.news.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      '产品发布': 'bg-blue-100 text-blue-800',
      '合作伙伴': 'bg-green-100 text-green-800',
      '应用案例': 'bg-purple-100 text-purple-800',
      '展会活动': 'bg-orange-100 text-orange-800',
      '技术创新': 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Brand Navigation */}
        <nav className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <Link
                href={`/${locale}/brands/${brand.slug}/about`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                关于品牌
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/products`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                产品分类
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/solutions`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                解决方案
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/support`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                技术支持
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/news`}
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
              >
                新闻中心
              </Link>
            </nav>
          </div>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {brand.name} 新闻中心
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            获取{brand.name}最新产品发布、技术创新、合作伙伴和行业动态的第一手资讯
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索新闻</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="搜索标题、内容或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">新闻分类</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? '全部分类' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              重点新闻
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Featured Image */}
                  <div className="h-64 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)} mb-2`}>
                        {article.category}
                      </span>
                      <p className="text-white text-sm">图片: {article.image}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                      <Link href={`/${locale}/brands/${brand.slug}/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-semibold text-gray-600">
                            {article.author.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.author.name}</div>
                          <div className="text-xs text-gray-500">{article.publishedAt}</div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>

                    {/* Read More */}
                    <div className="mt-4">
                      <Link
                        href={`/${locale}/brands/${brand.slug}/news/${article.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                      >
                        阅读全文
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular News */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? '全部新闻' : selectedCategory}
            </h2>
            <div className="text-sm text-gray-600">
              找到 {filteredNews.length} 篇新闻
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                {/* Card Image */}
                <div className="h-48 bg-gray-200 rounded-t-lg relative">
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs bg-black/50 p-2 rounded">
                      图片: {article.image}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                    <Link href={`/${locale}/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{article.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-semibold text-gray-600">
                          {article.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">{article.author.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{article.publishedAt}</div>
                      <div className="text-xs text-gray-500">{article.readTime}</div>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4">
                    <Link
                      href={`/${locale}/news/${article.slug}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      阅读全文
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的新闻</h3>
              <p className="text-gray-600 mb-4">尝试调整搜索条件或浏览其他分类</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                重置筛选条件
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Subscription CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            订阅{brand.name}最新资讯
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            第一时间获取{brand.name}产品发布、技术创新和行业动态，让您掌握半导体行业最新趋势。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="请输入您的邮箱地址"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200">
              订阅
            </button>
          </div>
          <p className="text-primary-200 text-sm mt-4">
            我们承诺保护您的隐私，不会向第三方分享您的邮箱信息
          </p>
        </section>

        {/* Related Links */}
        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">相关资源</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/${locale}/brands/${brand.slug}/support`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">技术支持</h4>
                <p className="text-sm text-gray-600">技术文档和应用指南</p>
              </div>
            </Link>
            
            <Link
              href={`/${locale}/brands/${brand.slug}/products`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">产品分类</h4>
                <p className="text-sm text-gray-600">浏览完整产品线</p>
              </div>
            </Link>
            
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">官方网站</h4>
                <p className="text-sm text-gray-600">访问{brand.name}官网</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}