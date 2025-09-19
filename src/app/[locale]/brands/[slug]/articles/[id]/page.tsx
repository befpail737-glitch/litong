import { getArticle, getArticleSlugsOnly } from '@/lib/sanity/queries';
import { getBrandData, getBrandSlugsOnly } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
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
    console.log('🔧 [generateStaticParams] 生成品牌-文章组合的静态参数...');

    // 使用真实的Sanity数据生成所有品牌-文章组合
    const { client } = await import('@/lib/sanity/client');

    const combinations = await client.fetch(`
      *[_type == "article" && isPublished == true && defined(slug.current) && count(relatedBrands) > 0] {
        "articleSlug": slug.current,
        "brandSlugs": relatedBrands[]->slug.current
      }
    `);

    const params = [];

    // 为每个文章生成其关联品牌的所有语言版本
    combinations.forEach(article => {
      article.brandSlugs?.forEach(brandSlug => {
        if (brandSlug) {
          // 生成中英文版本
          params.push(
            { locale: 'zh-CN', slug: brandSlug, id: article.articleSlug },
            { locale: 'en', slug: brandSlug, id: article.articleSlug }
          );
        }
      });
    });

    console.log(`✅ [generateStaticParams] 成功生成 ${params.length} 个品牌-文章组合`);
    console.log('🔍 [generateStaticParams] 示例组合:', params.slice(0, 5));

    return params;

  } catch (error) {
    console.error('❌ [generateStaticParams] 生成静态参数失败:', error);

    // 增强的fallback，包含实际存在的重要组合
    const fallbackParams = [
      // 基于实际Sanity数据的重要组合
      { locale: 'zh-CN', slug: 'ixys', id: '33333' },
      { locale: 'zh-CN', slug: 'ixys', id: '111111111' },
      { locale: 'zh-CN', slug: 'cree', id: 'aaaaa' },
      { locale: 'zh-CN', slug: 'cree', id: '11111' },
      { locale: 'zh-CN', slug: 'cree', id: '55555' },
      { locale: 'zh-CN', slug: 'cree', id: 'loss' },
      { locale: 'zh-CN', slug: 'cree', id: 'supply' },
      // 英文版本
      { locale: 'en', slug: 'ixys', id: '33333' },
      { locale: 'en', slug: 'cree', id: 'aaaaa' },
      { locale: 'en', slug: 'cree', id: '11111' }
    ];

    console.log(`🆘 [generateStaticParams] 使用fallback: ${fallbackParams.length} 个组合`);
    return fallbackParams;
  }
}

export default async function BrandArticlePage({ params }: BrandArticlePageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  console.log(`🔍 [BrandArticlePage] 请求品牌文章页面: brand=${decodedSlug}, article=${id}, locale=${locale}`);

  // Get both brand and article data with error handling
  let brandData, article;

  try {
    [brandData, article] = await Promise.all([
      getBrandData(decodedSlug),
      getArticle(id)
    ]);

    console.log(`📊 [BrandArticlePage] 数据获取结果: brand=${brandData?.brand?.name || 'null'}, article=${article?.title || 'null'}`);

  } catch (error) {
    console.error(`❌ [BrandArticlePage] 数据获取失败 brand: ${decodedSlug}, article: ${id}`, error);
    notFound();
  }

  // Enhanced validation and logging
  if (!brandData?.brand) {
    console.warn(`⚠️ [BrandArticlePage] 品牌未找到: ${decodedSlug}`);
    notFound();
  }

  if (!article) {
    console.warn(`⚠️ [BrandArticlePage] 文章未找到: ${id}`);
    notFound();
  }

  // Validate that the article is actually related to this brand
  const articleBrands = article.relatedBrands || [];
  const isRelatedToBrand = articleBrands.some(brand =>
    brand.slug === brandData.brand.slug ||
    brand.slug === decodedSlug ||
    brand.name === brandData.brand.name
  );

  if (!isRelatedToBrand) {
    console.warn(`⚠️ [BrandArticlePage] 文章 ${id} 不属于品牌 ${decodedSlug}`);
    console.log(`📋 [BrandArticlePage] 文章关联的品牌:`, articleBrands.map(b => `${b.name}(${b.slug})`));
    notFound();
  }

  console.log(`✅ [BrandArticlePage] 成功匹配品牌文章: ${brandData.brand.name} - ${article.title}`);

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
                  src={safeImageUrl(brand.logo, { width: 32, height: 32 })}
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
                src={safeImageUrl(article.coverImage, { width: 800, height: 450 })}
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
                          src={safeImageUrl(related.coverImage, { width: 300, height: 200 })}
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