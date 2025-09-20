import { getSolution, getRelatedSolutions, getSolutions, getBrandSolutionCombinations } from '@/lib/sanity/queries';
import { getBrandData, getAllBrands } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { generateSolutionUrl } from '@/lib/utils/slug';
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
  MessageCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandNavigation } from '@/components/layout/BrandNavigation';

interface BrandSolutionPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Generate static params for all brand-solution combinations
export async function generateStaticParams() {
  console.log('🔧 [Brand Solutions] Generating static parameters...');

  try {
    const locales = ['zh-CN', 'en'];

    // 使用最小限制来避免Cloudflare构建超时
    const realCombinations = await getBrandSolutionCombinations(20);
    console.log(`🔍 [Brand Solutions] Found ${realCombinations.length} real brand-solution combinations`);

    const params = [];

    // Add real Sanity combinations first
    for (const locale of locales) {
      for (const combination of realCombinations) {
        if (combination.brandSlug && combination.solutionSlug) {
          params.push({
            locale,
            slug: combination.brandSlug,
            id: combination.solutionSlug,
          });

          // For Chinese brands, also add URL-encoded version
          if (combination.brandSlug !== encodeURIComponent(combination.brandSlug)) {
            params.push({
              locale,
              slug: encodeURIComponent(combination.brandSlug),
              id: combination.solutionSlug,
            });
          }
        }
      }
    }

    // Add critical fallback combinations based on actual Sanity data analysis
    const criticalCombinations = [
      // Real combinations from Sanity analysis
      { brandSlug: 'ixys', solutionSlug: '99999' },
      { brandSlug: 'cree', solutionSlug: '11111' },
      { brandSlug: 'cree', solutionSlug: 'concrol' },
      { brandSlug: 'cree', solutionSlug: 'supplysolution' },
      { brandSlug: 'cree', solutionSlug: 'charger' },
      { brandSlug: 'cree', solutionSlug: 'motodiriver' },
      { brandSlug: 'cree', solutionSlug: 'swift power supply' },

      // Additional critical combinations for major brands
      { brandSlug: 'Electronicon', solutionSlug: '11111' },
      { brandSlug: 'Electronicon', solutionSlug: '22222' },
      { brandSlug: 'epcos', solutionSlug: '11111' },
      { brandSlug: 'lem', solutionSlug: '11111' },
      { brandSlug: 'littelfuse', solutionSlug: '11111' },
      { brandSlug: 'mediatek', solutionSlug: '11111' },
      { brandSlug: 'pi', solutionSlug: '11111' },
      { brandSlug: 'qualcomm', solutionSlug: '11111' },
      { brandSlug: 'sanrex', solutionSlug: '11111' },
      { brandSlug: 'semikron', solutionSlug: '11111' },
      { brandSlug: 'vicor', solutionSlug: '11111' },
    ];

    // Add critical combinations if not already included
    for (const locale of locales) {
      for (const critical of criticalCombinations) {
        const exists = params.some(p =>
          p.locale === locale &&
          p.slug === critical.brandSlug &&
          p.id === critical.solutionSlug
        );

        if (!exists) {
          params.push({
            locale,
            slug: critical.brandSlug,
            id: critical.solutionSlug,
          });
        }
      }
    }

    console.log(`✅ [Brand Solutions] Generated ${params.length} static params (${realCombinations.length * locales.length} real + ${params.length - realCombinations.length * locales.length} fallback)`);
    return params;

  } catch (error) {
    console.error('❌ [Brand Solutions] Error generating static params:', error);

    // Minimal emergency fallback based on real data
    const emergencyParams = [];
    const locales = ['zh-CN', 'en'];
    const emergencyCombinations = [
      // Confirmed real combinations from Sanity
      { brandSlug: 'ixys', solutionSlug: '99999' },
      { brandSlug: 'cree', solutionSlug: '11111' },
      { brandSlug: 'cree', solutionSlug: 'concrol' },
      { brandSlug: 'cree', solutionSlug: 'supplysolution' },
      { brandSlug: 'cree', solutionSlug: 'charger' },
      { brandSlug: 'cree', solutionSlug: 'motodiriver' },
    ];

    for (const locale of locales) {
      for (const combination of emergencyCombinations) {
        emergencyParams.push({
          locale,
          slug: combination.brandSlug,
          id: combination.solutionSlug,
        });
      }
    }

    console.log(`🆘 [Brand Solutions] Using emergency fallback: ${emergencyParams.length} params`);
    return emergencyParams;
  }
}

// Enable ISR for dynamic page generation of uncached pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function BrandSolutionPage({ params }: BrandSolutionPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Detect if we're in build time (static generation)
  const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

  // Get both brand and solution data with error handling
  let brand, solution;

  try {
    console.log(`🔍 [Brand Solution Page] Loading ${decodedSlug}/${id} ${isBuildTime ? '(构建时)' : '(运行时)'}`);
    [brand, solution] = await Promise.all([
      getBrandData(decodedSlug),
      getSolution(id)
    ]);
  } catch (error) {
    console.error(`❌ [Brand Solution Page] Error fetching data for brand: ${decodedSlug}, solution: ${id}`, error);
    if (!isBuildTime) {
      notFound();
    }
    // During build time, provide fallback data to prevent build failure
    brand = { name: decodedSlug, slug: decodedSlug, _id: `fallback-${decodedSlug}` };
    solution = {
      _id: `fallback-${id}`,
      title: `解决方案 ${id}`,
      slug: id,
      summary: '解决方案详情加载中...',
      isPublished: true,
      primaryBrand: brand
    };
  }

  // Enhanced validation with runtime fallback
  if (!brand) {
    console.warn(`❌ [Brand Solution Page] Brand not found: ${decodedSlug}`);
    if (!isBuildTime) {
      notFound();
    }
    // Provide fallback brand during build
    brand = { name: decodedSlug, slug: decodedSlug, _id: `fallback-${decodedSlug}` };
  }

  if (!solution) {
    console.warn(`❌ [Brand Solution Page] Solution not found: ${id}`);

    if (!isBuildTime) {
      // Runtime: Create a "solution not found" page instead of 404
      console.log(`🔧 [Brand Solution Page] Creating "solution not found" page for runtime access: ${decodedSlug}/${id}`);
      solution = {
        _id: `not-found-${id}`,
        title: `解决方案 "${id}" 暂时不可用`,
        slug: id,
        summary: `抱歉，解决方案 "${id}" 在品牌 "${brand?.name || decodedSlug}" 下暂时不可用。这可能是因为方案已下架、更改了名称，或者数据正在更新中。`,
        isPublished: false,
        primaryBrand: brand,
        isNotFound: true // Mark as not found solution
      };
    } else {
      // Build time: Provide fallback to prevent build failure
      solution = {
        _id: `fallback-${id}`,
        title: `解决方案 ${id}`,
        slug: id,
        summary: '解决方案详情加载中...',
        isPublished: true,
        primaryBrand: brand
      };
    }
  }

  // Validate brand-solution association with flexibility
  const solutionBrandSlug = solution.primaryBrand?.slug || solution.relatedBrands?.[0]?.slug;

  if (solutionBrandSlug && solutionBrandSlug !== brand.slug && solutionBrandSlug !== brand.name.toLowerCase()) {
    console.warn(`⚠️ [Brand Solution Page] Solution ${id} brand mismatch - expected: ${decodedSlug}, actual: ${solutionBrandSlug}`);
    // Allow cross-brand viewing but log the mismatch
  }

  // Get related solutions if target market exists
  const relatedSolutions = solution.targetMarket
    ? await getRelatedSolutions(solution._id, solution.targetMarket, 4)
    : [];

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
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`} className="hover:text-blue-600">
              解决方案
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{solution.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 {brand.name} 解决方案列表
            </Link>
          </Button>
        </div>

        {/* Solution Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Solution Image */}
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {solution.coverImage ? (
                  <Image
                    src={safeImageUrl(solution.coverImage, { width: 600, height: 400 })}
                    alt={solution.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Lightbulb className="h-24 w-24" />
                  </div>
                )}
              </div>

              {/* Solution Gallery */}
              {solution.gallery && solution.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {solution.gallery.slice(0, 3).map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded border overflow-hidden">
                      <Image
                        src={safeImageUrl(image, { width: 200, height: 150 })}
                        alt={`${solution.title} ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution Info */}
            <div className="space-y-6">
              {/* Title and Brand */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {brand.logo && (
                    <Image
                      src={safeImageUrl(brand.logo, { width: 40, height: 40 })}
                      alt={brand.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <Link
                    href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {brand.name}
                  </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{solution.title}</h1>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {solution.isFeatured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    推荐方案
                  </span>
                )}
                {solution.targetMarket && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {solution.targetMarket === 'industrial-automation' ? '工业自动化' :
                     solution.targetMarket === 'consumer-electronics' ? '消费电子' :
                     solution.targetMarket === 'automotive' ? '汽车电子' :
                     solution.targetMarket === 'telecommunications' ? '通信设备' :
                     solution.targetMarket}
                  </span>
                )}
                {solution.complexity && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    solution.complexity === 'basic' ? 'bg-green-100 text-green-800' :
                    solution.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {solution.complexity === 'basic' ? '基础' :
                     solution.complexity === 'medium' ? '中级' : '高级'}
                  </span>
                )}
              </div>

              {/* Solution Not Found Warning */}
              {solution.isNotFound && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-800 font-medium mb-1">解决方案信息提示</h4>
                      <p className="text-yellow-700 text-sm">
                        该解决方案页面是根据您的访问自动生成的，但我们暂时没有找到对应的方案信息。如果您确实需要此解决方案，请通过下方的"咨询方案"按钮联系我们。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {solution.summary && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {solution.summary}
                </p>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-gray-200">
                {solution.publishedAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">
                      发布时间: {new Date(solution.publishedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
                {solution.viewCount && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm">浏览量: {solution.viewCount}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" asChild>
                  <Link href={`/${locale}/inquiry`}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    咨询方案
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className="h-5 w-5 mr-2" />
                  下载资料
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Details */}
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

        {/* Technical Specifications */}
        {solution.specifications && solution.specifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">技术规格</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{spec.name}</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Solutions from Same Brand */}
        {relatedSolutions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{brand.name} 相关解决方案</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSolutions.map((related) => (
                <Link
                  key={related._id}
                  href={generateSolutionUrl(locale, brand.slug || brand.name, related.slug)}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {related.coverImage && (
                      <div className="aspect-video bg-white rounded mb-4 overflow-hidden">
                        <Image
                          src={safeImageUrl(related.coverImage, { width: 300, height: 200 })}
                          alt={related.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    {related.summary && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {related.summary}
                      </p>
                    )}
                    {related.targetMarket && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {related.targetMarket === 'industrial-automation' ? '工业自动化' :
                         related.targetMarket === 'consumer-electronics' ? '消费电子' :
                         related.targetMarket === 'automotive' ? '汽车电子' :
                         related.targetMarket === 'telecommunications' ? '通信设备' :
                         related.targetMarket}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Solutions Button */}
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}>
                  查看 {brand.name} 所有解决方案
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}