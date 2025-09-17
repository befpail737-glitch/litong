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
  MessageCircle
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
  console.log('🔧 Generating brand solution static parameters...');

  try {
    const locales = ['zh-CN', 'en'];

    // Get real brand-solution combinations from Sanity
    const combinations = await getBrandSolutionCombinations(25);
    console.log('🔍 Found brand-solution combinations:', combinations.length);

    const params = [];
    for (const locale of locales) {
      for (const combination of combinations) {
        // Add regular slug combination
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

    console.log('📦 Generated static params for brand solutions:', params.length);
    return params;
  } catch (error) {
    console.error('❌ Error generating static params for brand solutions:', error);
    // Emergency fallback with real brand-solution combinations
    const fallbackParams = [];
    const locales = ['zh-CN', 'en'];
    const fallbackCombinations = [
      { brandSlug: 'cree', solutionSlug: '11111' },
      { brandSlug: 'infineon', solutionSlug: '22222' },
      { brandSlug: 'ti', solutionSlug: '33333' },
      { brandSlug: 'mediatek', solutionSlug: '11111' },
    ];

    for (const locale of locales) {
      for (const combination of fallbackCombinations) {
        fallbackParams.push({
          locale,
          slug: combination.brandSlug,
          id: combination.solutionSlug,
        });
      }
    }

    console.log('🔄 Using fallback params:', fallbackParams.length);
    return fallbackParams;
  }
}

export default async function BrandSolutionPage({ params }: BrandSolutionPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Get both brand and solution data with error handling
  let brand, solution;

  try {
    console.log(`🔍 Fetching data for brand: ${decodedSlug}, solution: ${id}`);
    [brand, solution] = await Promise.all([
      getBrandData(decodedSlug),
      getSolution(id)
    ]);
  } catch (error) {
    console.error(`❌ Error fetching data for brand: ${decodedSlug}, solution: ${id}`, error);
    notFound();
  }

  // Enhanced validation with detailed logging
  if (!brand) {
    console.warn(`❌ Brand not found: ${decodedSlug}`);
    notFound();
  }

  if (!solution) {
    console.warn(`❌ Solution not found: ${id}`);
    notFound();
  }

  // Validate that solution is associated with the brand
  const solutionBrandSlug = solution.primaryBrand?.slug || solution.relatedBrands?.[0]?.slug;

  if (solutionBrandSlug && solutionBrandSlug !== brand.slug && solutionBrandSlug !== brand.name.toLowerCase()) {
    console.warn(`⚠️ Solution ${id} is not associated with brand ${decodedSlug}. Solution brand: ${solutionBrandSlug}`);
    // Don't throw 404 immediately - allow solutions to be viewed under any brand for flexibility
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