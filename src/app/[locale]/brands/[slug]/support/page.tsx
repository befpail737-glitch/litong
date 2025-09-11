import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Building2, ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';

import SearchInput from '@/components/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/lib/sanity/client';
import { getArticles } from '@/lib/sanity/queries';
import { locales } from '@/i18n';

// 为静态生成提供基本参数（简化版本）
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN', slug: 'sample-brand' }
  ];
}

// 从Sanity获取品牌数据
const getBrandData = async (slug: string) => {
  try {
    const brand = await client.fetch(`
      *[_type == "brandBasic" && slug.current == $slug && isActive == true][0] {
        _id,
        name,
        "slug": slug.current,
        description,
        isActive
      }
    `, { slug });

    return brand;
  } catch (error) {
    console.error('Error fetching brand from Sanity:', error);
    return null;
  }
};

interface BrandSupportPageProps {
  params: {
    locale: string
    slug: string
  }
  searchParams: {
    category?: string
    search?: string
  }
}

// 禁用缓存，确保总是获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BrandSupportPage({ params, searchParams }: BrandSupportPageProps) {
  // 解码URL编码的slug（处理中文slug）
  const decodedSlug = decodeURIComponent(params.slug);
  console.log('BrandSupportPage called with slug:', params.slug, 'decoded:', decodedSlug);

  // 从Sanity获取品牌数据
  const brand = await getBrandData(decodedSlug);
  console.log('Brand from Sanity:', brand);

  if (!brand) {
    console.log('Brand not found, calling notFound()');
    notFound();
  }

  // 获取该品牌相关的技术支持文章
  let articles: any[] = [];
  let total = 0;
  let error = null;

  try {
    // 直接获取与品牌相关的技术支持文章
    const result = await getArticles({
      limit: 100,
      category: searchParams.category,
      brand: decodedSlug
    });
    articles = result.articles;

    // 如果有搜索词，进一步筛选
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase();
      articles = articles.filter((article: any) => {
        const title = (article.title || '').toLowerCase();
        const excerpt = (article.excerpt || '').toLowerCase();
        return title.includes(searchTerm) || excerpt.includes(searchTerm);
      });
    }

    total = articles.length;
    console.log(`Found ${total} support articles for brand ${brand.name}`);

  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch support articles';
    console.error('Error fetching support articles for brand:', err);
  }

  const difficultyLabels: Record<string, string> = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级',
    'expert': '专家'
  };

  const difficultyColors: Record<string, string> = {
    'beginner': 'bg-green-100 text-green-800',
    'intermediate': 'bg-blue-100 text-blue-800',
    'advanced': 'bg-orange-100 text-orange-800',
    'expert': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* 返回品牌页面的链接 */}
            <Link
              href={`/${params.locale}/brands/${params.slug}`}
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回 {brand.name} 品牌页面
            </Link>

            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{brand.name} 技术支持</h1>
                <p className="text-xl text-blue-100">
                  为您提供 {brand.name} 产品的专业技术文档、应用指南和技术支持资料
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">技术支持文档</h2>
              <p className="text-gray-600">
                {brand.name} 产品相关的技术文档和支持资料
              </p>
            </div>
            {total > 0 && (
              <div className="text-sm text-gray-600">
                找到 {total} 篇文档
              </div>
            )}
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="搜索技术文档..."
                  defaultValue={searchParams.search || ''}
                  locale={params.locale}
                  basePath={`/${params.locale}/brands/${params.slug}/support`}
                />
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/${params.locale}/brands/${params.slug}/support`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !searchParams.category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </Link>
                <Link
                  href={`/${params.locale}/brands/${params.slug}/support?category=technical-guide`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchParams.category === 'technical-guide'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  技术指南
                </Link>
                <Link
                  href={`/${params.locale}/brands/${params.slug}/support?category=datasheet`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchParams.category === 'datasheet'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  数据手册
                </Link>
                <Link
                  href={`/${params.locale}/brands/${params.slug}/support?category=application-note`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchParams.category === 'application-note'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  应用笔记
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-semibold text-lg">加载错误</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}

        {articles.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无技术支持文档</h3>
            <p className="text-gray-500 mb-6">
              {brand.name} 相关的技术支持文档正在准备中，敬请期待
            </p>
            <div className="text-sm text-gray-400 mb-6">
              <p>您可以在 Sanity Studio 中创建技术支持文档：</p>
              <p className="mt-2">1. 创建新的技术文章</p>
              <p>2. 在"关联品牌"中选择 {brand.name}</p>
              <p>3. 选择"技术支持"分类</p>
              <p>4. 发布文章</p>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href={`/${params.locale}/brands/${params.slug}/solutions`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                查看解决方案
              </Link>
              <Link
                href={`/${params.locale}/brands/${params.slug}`}
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-2 rounded-lg transition-colors"
              >
                返回品牌页面
              </Link>
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    {article.isFeatured && (
                      <Badge variant="default" className="bg-yellow-600 text-white">
                        推荐
                      </Badge>
                    )}
                    {article.difficulty && (
                      <Badge
                        variant="secondary"
                        className={difficultyColors[article.difficulty] || 'bg-gray-100 text-gray-800'}
                      >
                        {difficultyLabels[article.difficulty] || article.difficulty}
                      </Badge>
                    )}
                    {article.readTime && (
                      <Badge variant="outline">
                        {article.readTime}分钟
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="line-clamp-2">
                    {article.title || '未命名文档'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {article.excerpt || '暂无描述'}
                  </CardDescription>

                  {/* 标签 */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {article.slug ? (
                      <Link
                        href={`/${params.locale}/articles/${article.slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        阅读文档
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-gray-400">无链接</span>
                    )}
                    {article.publishedAt && (
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// SEO元数据
export async function generateMetadata({ params }: BrandSupportPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    return {
      title: '品牌未找到'
    };
  }

  return {
    title: `${brand.name} 技术支持 | 力通电子`,
    description: `${brand.name} 专业技术支持文档和资料，包括技术指南、数据手册、应用笔记等。力通电子提供全面的${brand.name}技术支持服务。`,
    keywords: `${brand.name}技术支持,${brand.name}技术文档,${brand.name}数据手册,${brand.name}应用笔记,${brand.name}技术指南`,
  };
}
