import { getSolution, getRelatedSolutions, getSolutionSlugsOnly } from '@/lib/sanity/queries';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cleanSlug } from '@/lib/utils/slug';
import {
  ArrowLeft,
  Star,
  Download,
  ExternalLink,
  ChevronRight,
  Building2,
  Target,
  Lightbulb,
  Zap,
  Users,
  Calendar,
  Eye,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolutionPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all solutions and locales
export async function generateStaticParams() {
  try {
    // 使用轻量级查询仅获取slugs，大幅减少查询复杂度
    const solutionSlugs = await getSolutionSlugsOnly(30); // 增加到30个解决方案确保足够的详情页
    // 仅限制为主要语言以减少构建时间
    const locales = ['zh-CN', 'en'];

    const params = [];
    for (const locale of locales) {
      for (const slug of solutionSlugs) {
        if (slug) {
          params.push({
            locale,
            slug,
          });
        }
      }
    }

    console.log('Generated static params for solutions:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for solutions:', error);
    // 紧急情况下使用最小化的fallback
    return [
      { locale: 'zh-CN', slug: 'demo-solution-1' },
      { locale: 'zh-CN', slug: 'demo-solution-2' },
      { locale: 'en', slug: 'demo-solution-1' }
    ];
  }
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { locale, slug } = params;

  const solution = await getSolution(slug);

  if (!solution) {
    console.warn(`Solution not found for slug: ${slug}`);
    notFound();
  }

  // Get related solutions if target market exists
  const relatedSolutions = solution.targetMarket
    ? await getRelatedSolutions(solution._id, solution.targetMarket, 4)
    : [];

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
              <Link href={`/${locale}/solutions`} className="hover:text-blue-600">
                解决方案
              </Link>
              {solution.targetMarket && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <Link
                    href={`/${locale}/solutions?market=${solution.targetMarket}`}
                    className="hover:text-blue-600"
                  >
                    {solution.targetMarket}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{solution.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/solutions`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回解决方案
              </Link>
            </Button>
          </div>

          {/* Solution Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            {/* Cover Image */}
            {solution.coverImage && (
              <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
                <Image
                  src={safeImageUrl(solution.coverImage, { width: 1200, height: 600 })}
                  alt={solution.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {solution.targetMarket && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {solution.targetMarket}
                  </span>
                )}
                {solution.complexity && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    复杂度: {solution.complexity}
                  </span>
                )}
                {solution.isFeatured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    推荐方案
                  </span>
                )}
              </div>

              {/* Title and Summary */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{solution.title}</h1>
                {solution.summary && (
                  <p className="text-xl text-gray-700 leading-relaxed">{solution.summary}</p>
                )}
              </div>

              {/* Brands */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                {solution.primaryBrand && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">主要品牌:</span>
                    <Link
                      href={`/${locale}/brands/${solution.primaryBrand.slug}`}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      {solution.primaryBrand.logo && (
                        <Image
                          src={safeImageUrl(solution.primaryBrand.logo, { width: 32, height: 32 })}
                          alt={solution.primaryBrand.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      )}
                      <span className="font-medium">{solution.primaryBrand.name}</span>
                    </Link>
                  </div>
                )}

                {solution.relatedBrands && solution.relatedBrands.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">相关品牌:</span>
                    <div className="flex items-center gap-2">
                      {solution.relatedBrands.slice(0, 3).map((brand) => (
                        <Link
                          key={brand._id}
                          href={`/${locale}/brands/${brand.slug}`}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          {brand.logo && (
                            <Image
                              src={safeImageUrl(brand.logo, { width: 24, height: 24 })}
                              alt={brand.name}
                              width={24}
                              height={24}
                              className="rounded"
                            />
                          )}
                          <span className="text-sm">{brand.name}</span>
                        </Link>
                      ))}
                      {solution.relatedBrands.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{solution.relatedBrands.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">发布时间</p>
                    <p className="font-medium">
                      {solution.publishedAt
                        ? new Date(solution.publishedAt).toLocaleDateString('zh-CN')
                        : '最近'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">浏览次数</p>
                    <p className="font-medium">{solution.viewCount || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">应用领域</p>
                    <p className="font-medium">{solution.targetMarket || '通用'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="flex-1">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  咨询方案
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className="h-5 w-5 mr-2" />
                  下载方案书
                </Button>
                <Button variant="outline" size="lg">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  分享方案
                </Button>
              </div>
            </div>
          </div>

          {/* Solution Content */}
          {solution.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">方案详情</h2>
              <div className="prose max-w-none text-gray-700">
                {typeof solution.description === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: solution.description }} />
                ) : (
                  <p>方案详情将在此处显示。请联系开发团队完成 Portable Text 渲染组件的集成。</p>
                )}
              </div>
            </div>
          )}

          {/* Key Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">方案特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">创新设计</h3>
                  <p className="text-gray-600">采用最新技术和创新设计理念，确保方案的先进性和可靠性。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">高效性能</h3>
                  <p className="text-gray-600">优化的系统架构和算法，提供卓越的性能和效率。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">专业支持</h3>
                  <p className="text-gray-600">专业团队提供全程技术支持和售后服务。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Solutions */}
          {relatedSolutions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">相关解决方案</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedSolutions.map((related) => (
                  <Link
                    key={related._id}
                    href={`/${locale}/solutions/${cleanSlug(related.slug)}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {related.coverImage && (
                        <div className="aspect-video bg-gray-100">
                          <Image
                            src={safeImageUrl(related.coverImage, { width: 400, height: 200 })}
                            alt={related.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {related.targetMarket && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {related.targetMarket}
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
                        {related.summary && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {related.summary}
                          </p>
                        )}
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