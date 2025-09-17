import { getArticle, getArticles } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Star,
  Share2,
  Bookmark,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Tag,
  Building2,
  ThumbsUp,
  MessageCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all articles and locales
export async function generateStaticParams() {
  try {
    const result = await getArticles({ limit: 1000 });
    const articles = result.articles || [];
    const locales = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'ar'];

    const params = [];
    for (const locale of locales) {
      for (const article of articles) {
        if (article.slug) {
          params.push({
            locale,
            slug: article.slug,
          });
        }
      }
    }

    console.log('Generated static params for articles:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = params;

  const article = await getArticle(slug);

  if (!article) {
    console.warn(`Article not found for slug: ${slug}`);
    notFound();
  }

  // Get related articles from the same category
  const relatedArticles = article.category
    ? await getArticles({ category: article.category.slug, limit: 4 })
    : { articles: [] };

  // Filter out current article from related articles
  const filteredRelated = relatedArticles.articles?.filter(
    (related) => related._id !== article._id
  ) || [];

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href={`/${locale}`} className="hover:text-blue-600">
                首页
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${locale}/articles`} className="hover:text-blue-600">
                技术文章
              </Link>
              {article.category && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <Link
                    href={`/${locale}/articles?category=${article.category.slug}`}
                    className="hover:text-blue-600"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{article.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/articles`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回文章列表
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            {/* Featured Image */}
            {article.image && (
              <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
                <Image
                  src={urlFor(article.image).width(1200).height(600).url()}
                  alt={article.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {article.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {article.category.name}
                  </span>
                )}
                {article.difficulty && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    难度: {article.difficulty}
                  </span>
                )}
                {article.isFeatured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    推荐文章
                  </span>
                )}
                {article.tags && article.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed mb-6">{article.excerpt}</p>
              )}

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                {/* Author */}
                {article.author && (
                  <div className="flex items-center gap-3">
                    {article.author.avatar && (
                      <Image
                        src={urlFor(article.author.avatar).width(40).height(40).url()}
                        alt={article.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">作者</p>
                      <p className="font-medium text-gray-900">{article.author.name}</p>
                    </div>
                  </div>
                )}

                {/* Publish Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">发布时间</p>
                    <p className="font-medium text-gray-900">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('zh-CN')
                        : '最近'}
                    </p>
                  </div>
                </div>

                {/* Read Time */}
                {article.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">阅读时间</p>
                      <p className="font-medium text-gray-900">{article.readTime} 分钟</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Brands */}
              {article.relatedBrands && article.relatedBrands.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">相关品牌</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    {article.relatedBrands.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/${locale}/brands/${brand.slug}`}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {brand.logo && (
                          <Image
                            src={urlFor(brand.logo).width(32).height(32).url()}
                            alt={brand.name}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        )}
                        <span className="font-medium text-gray-900">{brand.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  分享文章
                </Button>
                <Button variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  收藏
                </Button>
                <Button variant="outline">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  点赞
                </Button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          {article.content && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* Note: In a real implementation, you'd render the portable text content here */}
                <div className="text-gray-700 leading-relaxed">
                  {typeof article.content === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : (
                    <p>文章内容将在此处显示。请联系开发团队完成 Portable Text 渲染组件的集成。</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Article Stats and Engagement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-5 w-5" />
                  <span>浏览 0</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ThumbsUp className="h-5 w-5" />
                  <span>点赞 0</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>评论 0</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  写评论
                </Button>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {filteredRelated.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRelated.slice(0, 4).map((related) => (
                  <Link
                    key={related._id}
                    href={`/${locale}/articles/${related.slug}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {related.image && (
                        <div className="aspect-video bg-gray-100">
                          <Image
                            src={urlFor(related.image).width(400).height(200).url()}
                            alt={related.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {related.category && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {related.category.name}
                            </span>
                          )}
                          {related.isFeatured && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              推荐
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {related.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {related.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {related.readTime} 分钟
                            </span>
                          )}
                          {related.publishedAt && (
                            <span>
                              {new Date(related.publishedAt).toLocaleDateString('zh-CN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}