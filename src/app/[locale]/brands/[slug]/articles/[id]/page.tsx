import { getArticle, getArticles } from '@/lib/sanity/queries';
import { getBrandData, getAllBrands } from '@/lib/sanity/brands';
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
  Eye,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandNavigation } from '@/components/layout/BrandNavigation';

interface BrandArticlePageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Generate static params for all brand-article combinations
export async function generateStaticParams() {
  try {
    // Get all brands
    const brands = await getAllBrands();

    // Limit to primary locales to reduce build time
    const locales = ['zh-CN', 'en'];

    // Create a set of known article slugs for faster builds
    const articleSlugs = ['aaaaa', 'bbbbb', 'ccccc'];

    const params = [];
    for (const locale of locales) {
      for (const brand of brands.slice(0, 15)) { // Limit brands for faster builds
        if (brand && brand.slug) {
          for (const articleSlug of articleSlugs) {
            // Add regular slug
            params.push({
              locale,
              slug: brand.slug,
              id: articleSlug,
            });

            // For Chinese brands, also add URL-encoded version
            if (brand.slug !== encodeURIComponent(brand.slug)) {
              params.push({
                locale,
                slug: encodeURIComponent(brand.slug),
                id: articleSlug,
              });
            }
          }
        }
      }
    }

    console.log('Generated static params for brand articles:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brand articles:', error);
    // Emergency fallback
    return [
      { locale: 'zh-CN', slug: 'cree', id: 'aaaaa' },
      { locale: 'zh-CN', slug: 'mediatek', id: 'aaaaa' },
      { locale: 'en', slug: 'cree', id: 'aaaaa' },
    ];
  }
}

export default async function BrandArticlePage({ params }: BrandArticlePageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Get both brand and article data with error handling
  let brandData, article;

  try {
    [brandData, article] = await Promise.all([
      getBrandData(decodedSlug),
      getArticle(id)
    ]);
  } catch (error) {
    console.error(`Error fetching data for brand: ${decodedSlug}, article: ${id}`, error);
    notFound();
  }

  if (!brandData || !brandData.brand || !article) {
    console.warn(`Brand or article not found for slug: ${decodedSlug}, id: ${id}`);
    notFound();
  }

  const { brand } = brandData;

  // Get related articles if category exists
  // TODO: Implement getRelatedArticles function in queries
  const relatedArticles = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Navigation */}
      <BrandNavigation brand={brand} locale={locale} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands`} className="hover:text-blue-600">
              品牌
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`} className="hover:text-blue-600">
              {brand.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/articles`} className="hover:text-blue-600">
              技术文章
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/articles`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 {brand.name} 文章列表
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            {/* Brand and Category */}
            <div className="flex items-center gap-3 mb-4">
              {brand.logo && (
                <Image
                  src={urlFor(brand.logo).width(32).height(32).url()}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
              )}
              <Link
                href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {brand.name}
              </Link>
              {article.category && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{article.category.name}</span>
                </>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author.name}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} 分钟阅读</span>
                </div>
              )}
              {article.viewCount && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount} 次浏览</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Summary */}
            {article.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline">
                <ThumbsUp className="h-4 w-4 mr-2" />
                点赞
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                收藏
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <Image
                src={urlFor(article.coverImage).width(800).height(450).url()}
                alt={article.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="prose max-w-none text-gray-700">
            {typeof article.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  文章内容将在此处显示。请联系开发团队完成 Portable Text 渲染组件的集成。
                </p>
                {article.excerpt && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">文章摘要</h3>
                    <p>{article.excerpt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Articles from Same Brand */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{brand.name} 相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related._id}
                  href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/articles/${related.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {related.coverImage && (
                      <div className="aspect-video bg-white overflow-hidden">
                        <Image
                          src={urlFor(related.coverImage).width(300).height(200).url()}
                          alt={related.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-6">
                        {related.title}
                      </h3>
                      {related.summary && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {related.summary}
                        </p>
                      )}
                      {related.publishedAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(related.publishedAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Articles Button */}
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/articles`}>
                  查看 {brand.name} 所有文章
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}