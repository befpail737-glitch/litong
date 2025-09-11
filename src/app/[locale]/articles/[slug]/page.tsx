import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Calendar, Clock, User, Building2, ArrowLeft, Tag } from 'lucide-react';

import PortableText from '@/components/PortableText';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { urlFor, client } from '@/lib/sanity/client';
import { getArticle } from '@/lib/sanity/queries';
import { locales } from '@/i18n';

// 为静态生成提供基本参数（简化版本）
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN', slug: 'sample-article' }
  ];
}

type Article = {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: any[] // 富文本内容数组
  image: any
  author: {
    name: string
    slug: string
    avatar?: any
  }
  relatedBrands?: Array<{
    _id: string
    name: string
    slug: string
    logo?: any
  }>
  category: {
    name: string
    slug: string
  }
  tags?: string[]
  readTime?: number
  difficulty: string
  publishedAt: string
  isPublished: boolean
  isFeatured: boolean
}

interface ArticleDetailPageProps {
  params: {
    locale: string
    slug: string
  }
}

// 禁用缓存，确保总是获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticleDetailPage({ params: { locale, slug } }: ArticleDetailPageProps) {

  // 解码URL编码的slug（处理包含空格的slug）
  const decodedSlug = decodeURIComponent(slug);
  console.log('ArticleDetailPage called with slug:', slug, 'decoded:', decodedSlug);

  let article: Article | null = null;
  let error = null;

  try {
    article = await getArticle(decodedSlug);
    console.log('Successfully fetched article from Sanity:', article?._id || 'null');
    console.log('Article brand data:', {
      relatedBrands: article?.relatedBrands?.map(b => b.name)
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch article';
    console.error('Error fetching article from Sanity:', err);
  }

  if (!article && !error) {
    notFound();
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold text-lg">加载错误</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
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
            {/* 返回技术文章列表的链接 */}
            <Link
              href={`/${locale}/articles`}
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回技术文章列表
            </Link>

            <div className="mb-8">
              {/* 文章标签 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {article!.category && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {article!.category.name}
                  </Badge>
                )}
                {article!.difficulty && (
                  <Badge
                    variant="secondary"
                    className={`${difficultyColors[article!.difficulty]} border-0`}
                  >
                    {difficultyLabels[article!.difficulty] || article!.difficulty}
                  </Badge>
                )}
                {article!.readTime && (
                  <Badge variant="outline" className="border-white/30 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    {article!.readTime}分钟阅读
                  </Badge>
                )}
                {article!.isFeatured && (
                  <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                    推荐文章
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">
                {article!.title || '未命名文章'}
              </h1>

              <p className="text-xl text-blue-100 mb-6">
                {article!.excerpt || '暂无简介'}
              </p>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
                {article!.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article!.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article!.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
                {article!.relatedBrands && article!.relatedBrands.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>相关品牌: {article!.relatedBrands.map(b => b.name).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主内容 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 封面图片 */}
            {article!.image && (
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(article!.image).width(800).height(450).url()}
                      alt={article!.image.alt || article!.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {article!.image.caption && (
                    <p className="text-center text-sm text-gray-600 mt-3">
                      {article!.image.caption}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 文章内容 */}
            <Card>
              <CardContent className="p-8">
                <PortableText
                  content={article!.content}
                  className="max-w-none"
                />
              </CardContent>
            </Card>

            {/* 文章标签 */}
            {article!.tags && article!.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    相关标签
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article!.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息 */}
            {article!.author && (
              <Card>
                <CardHeader>
                  <CardTitle>作者信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    {article!.author.avatar ? (
                      <Image
                        src={urlFor(article!.author.avatar).width(48).height(48).url()}
                        alt={article!.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{article!.author.name}</p>
                      <p className="text-sm text-gray-600">技术作者</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 相关品牌 */}
            {article!.relatedBrands && article!.relatedBrands.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>相关品牌</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {article!.relatedBrands.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/${locale}/brands/${brand.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {brand.logo ? (
                          <Image
                            src={urlFor(brand.logo).width(40).height(40).url()}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-sm text-gray-600">查看品牌详情</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 文章统计 */}
            <Card>
              <CardHeader>
                <CardTitle>文章信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">分类:</span>
                  <span className="font-medium">{article!.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">难度:</span>
                  <span className="font-medium">
                    {difficultyLabels[article!.difficulty] || article!.difficulty}
                  </span>
                </div>
                {article!.readTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">阅读时长:</span>
                    <span className="font-medium">{article!.readTime} 分钟</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">发布时间:</span>
                  <span className="font-medium">
                    {new Date(article!.publishedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO元数据
export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  try {
    const article = await getArticle(decodedSlug);

    if (!article) {
      return {
        title: '文章未找到 | 力通电子'
      };
    }

    const brandNames = article.relatedBrands?.map((b: any) => b.name).join(', ') || '';

    return {
      title: `${article.title} | 力通电子技术文章`,
      description: article.excerpt || `${article.title} - 力通电子技术文章`,
      keywords: [
        article.title,
        article.category.name,
        '技术文章',
        '力通电子',
        ...(article.tags || []),
        ...(brandNames ? [brandNames] : [])
      ].join(','),
      openGraph: {
        title: article.title,
        description: article.excerpt || '',
        type: 'article',
        publishedTime: article.publishedAt,
        authors: article.author ? [article.author.name] : [],
        ...(article.image && {
          images: [{
            url: urlFor(article.image).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: article.image.alt || article.title,
          }]
        })
      }
    };
  } catch (error) {
    console.error('Error generating metadata for article:', error);
    return {
      title: '技术文章 | 力通电子'
    };
  }
}
