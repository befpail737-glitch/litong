'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  category: 'selection-guide' | 'application-note' | 'troubleshooting' | 'product-review';
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
  brand?: string;
  featured?: boolean;
  readTime?: number;
}

interface BrandSupportProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    website: string;
    founded: string;
    headquarters: string;
  };
}

export default function BrandSupport({ brand }: BrandSupportProps) {
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟从管理后台获取文章数据
  useEffect(() => {
    // 模拟API调用延迟
    const loadArticles = async () => {
      setIsLoading(true);
      
      // 模拟的文章数据（实际应从API获取）
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'STM32选型指南：如何选择合适的微控制器',
          category: 'selection-guide',
          content: '在选择STM32微控制器时，需要考虑多个因素...',
          excerpt: '详细介绍STM32系列微控制器的选型要点，帮助工程师做出正确的选择。',
          tags: ['STM32', '选型', '微控制器'],
          author: 'FAE团队',
          publishedAt: '2024-11-15',
          status: 'published',
          brand: 'stmicroelectronics',
          readTime: 8,
          featured: true
        },
        {
          id: '2',
          title: 'STM32CubeMX使用指南',
          category: 'application-note',
          content: 'STM32CubeMX是一款图形化配置工具...',
          excerpt: '深入了解STM32CubeMX的使用方法和最佳实践。',
          tags: ['STM32CubeMX', '工具', '配置'],
          author: '张工程师',
          publishedAt: '2024-11-10',
          status: 'published',
          brand: 'stmicroelectronics',
          readTime: 12
        },
        {
          id: '3',
          title: 'STM32调试问题排查手册',
          category: 'troubleshooting',
          content: '常见的STM32调试问题及解决方案...',
          excerpt: '汇总STM32开发中的常见问题和解决方案。',
          tags: ['调试', 'FAQ', '问题排查'],
          author: '李工程师',
          publishedAt: '2024-11-05',
          status: 'published',
          brand: 'stmicroelectronics',
          readTime: 15
        }
      ];

      // 过滤当前品牌的文章
      const brandArticles = mockArticles.filter(article => 
        article.brand === brand.slug || !article.brand
      );
      
      setArticles(brandArticles);
      setIsLoading(false);
    };

    loadArticles();
  }, [brand.slug]);

  const categories = [
    { value: 'all', label: '所有文章' },
    { value: 'selection-guide', label: '选型指南' },
    { value: 'application-note', label: '应用笔记' },
    { value: 'troubleshooting', label: '问题排查' },
    { value: 'product-review', label: '新品评测' }
  ];

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'all' || article.category === selectedCategory
  );

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
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
                className="border-primary-500 text-primary-600 border-b-2 py-2 px-1 text-sm font-medium"
              >
                技术支持
              </Link>
              <Link
                href={`/${locale}/brands/${brand.slug}/news`}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium"
              >
                新闻中心
              </Link>
            </nav>
          </div>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {brand.name} 技术支持
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            获取专业的技术文档、应用指南和故障排除方案，我们的FAE团队为您提供全方位技术支持
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Categories">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`${
                    selectedCategory === category.value
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Articles Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      article.category === 'selection-guide' ? 'bg-blue-100 text-blue-800' :
                      article.category === 'application-note' ? 'bg-green-100 text-green-800' :
                      article.category === 'troubleshooting' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getCategoryLabel(article.category)}
                    </span>
                    {article.featured && (
                      <span className="inline-flex items-center text-yellow-500">
                        ⭐
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link 
                      href={`/${locale}/brands/${brand.slug}/support/${article.id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{article.author}</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    {article.readTime && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {article.readTime} 分钟
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredArticles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-500">该分类下暂时没有技术支持文章，请选择其他分类查看。</p>
            </div>
          </div>
        )}

        {/* Contact FAE CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            需要技术支持？
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            我们的专业FAE团队拥有丰富的{brand.name}产品经验，可为您提供一对一的技术支持和定制化解决方案。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact?subject=${brand.name}技术支持咨询`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              联系FAE
            </Link>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              访问官网
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}