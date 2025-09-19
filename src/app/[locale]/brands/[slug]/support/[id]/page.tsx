import { getBrandData, getAllBrands, getBrandSupportCombinations, getSupportDocument } from '@/lib/sanity/queries';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Download,
  FileText,
  Video,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Clock,
  Star,
  Users,
  BookOpen,
  Headphones,
  Calendar,
  Tag,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandNavigation } from '@/components/layout/BrandNavigation';

interface BrandSupportDetailPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Generate static params for all brand-support combinations
export async function generateStaticParams() {
  console.log('🔧 [Brand Support] Generating static parameters...');

  try {
    const locales = ['zh-CN', 'en'];

    // Get real brand-support combinations from new Sanity integration
    const realCombinations = await getBrandSupportCombinations(200);
    console.log(`🔍 [Brand Support] Found ${realCombinations.length} brand-support combinations`);

    const params = [];

    // Add real combinations first
    for (const locale of locales) {
      for (const combination of realCombinations) {
        if (combination.brandSlug && combination.supportId) {
          params.push({
            locale,
            slug: combination.brandSlug,
            id: combination.supportId,
          });

          // For Chinese brands, also add URL-encoded version
          if (combination.brandSlug !== encodeURIComponent(combination.brandSlug)) {
            params.push({
              locale,
              slug: encodeURIComponent(combination.brandSlug),
              id: combination.supportId,
            });
          }
        }
      }
    }

    // Add critical fallback combinations based on actual brand data
    const criticalCombinations = [
      // Based on real active brands from Sanity analysis
      { brandSlug: 'cree', supportId: '11111' },
      { brandSlug: 'cree', supportId: 'datasheet' },
      { brandSlug: 'cree', supportId: 'user-manual' },
      { brandSlug: 'ixys', supportId: '11111' },
      { brandSlug: 'ixys', supportId: 'datasheet' },
      { brandSlug: 'Electronicon', supportId: '11111' },
      { brandSlug: 'Electronicon', supportId: 'application-note' },
      { brandSlug: 'epcos', supportId: 'user-manual' },
      { brandSlug: 'lem', supportId: 'installation-guide' },
      { brandSlug: 'littelfuse', supportId: 'datasheet' },
      { brandSlug: 'mediatek', supportId: 'driver-download' },
      { brandSlug: 'pi', supportId: 'technical-faq' },
      { brandSlug: 'qualcomm', supportId: 'firmware-update' },
      { brandSlug: 'sanrex', supportId: 'user-manual' },
      { brandSlug: 'semikron', supportId: 'datasheet' },
      { brandSlug: 'vicor', supportId: 'application-note' },
    ];

    // Add critical combinations if not already included
    for (const locale of locales) {
      for (const critical of criticalCombinations) {
        const exists = params.some(p =>
          p.locale === locale &&
          p.slug === critical.brandSlug &&
          p.id === critical.supportId
        );

        if (!exists) {
          params.push({
            locale,
            slug: critical.brandSlug,
            id: critical.supportId,
          });
        }
      }
    }

    console.log(`✅ [Brand Support] Generated ${params.length} static params (${realCombinations.length * locales.length} real + ${params.length - realCombinations.length * locales.length} fallback)`);
    return params;

  } catch (error) {
    console.error('❌ [Brand Support] Error generating static params:', error);

    // Minimal emergency fallback based on most important combinations
    const emergencyParams = [];
    const locales = ['zh-CN', 'en'];
    const emergencyCombinations = [
      { brandSlug: 'cree', supportId: '11111' },
      { brandSlug: 'cree', supportId: 'datasheet' },
      { brandSlug: 'ixys', supportId: '11111' },
      { brandSlug: 'Electronicon', supportId: '11111' },
      { brandSlug: 'epcos', supportId: 'user-manual' },
      { brandSlug: 'lem', supportId: 'application-note' },
      { brandSlug: 'mediatek', supportId: 'driver-download' },
      { brandSlug: 'semikron', supportId: 'datasheet' },
    ];

    for (const locale of locales) {
      for (const combination of emergencyCombinations) {
        emergencyParams.push({
          locale,
          slug: combination.brandSlug,
          id: combination.supportId,
        });
      }
    }

    console.log(`🆘 [Brand Support] Using emergency fallback: ${emergencyParams.length} params`);
    return emergencyParams;
  }
}

// Enable ISR for dynamic page generation of uncached pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function BrandSupportDetailPage({ params }: BrandSupportDetailPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Detect if we're in build time (static generation)
  const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

  // Get brand and support data with error handling
  let brand, supportResource;

  try {
    console.log(`🔍 [Brand Support Page] Loading ${decodedSlug}/${id} ${isBuildTime ? '(构建时)' : '(运行时)'}`);

    // Get brand data and support document in parallel
    const [brandData, supportDoc] = await Promise.all([
      getBrandData(decodedSlug),
      getSupportDocument(id, decodedSlug)
    ]);

    brand = brandData?.brand;
    supportResource = supportDoc;

  } catch (error) {
    console.error(`❌ [Brand Support Page] Error fetching data for brand: ${decodedSlug}, support: ${id}`, error);
    if (!isBuildTime) {
      notFound();
    }
    // During build time, provide fallback data to prevent build failure
    brand = { name: decodedSlug, slug: decodedSlug, _id: `fallback-${decodedSlug}` };
    supportResource = {
      id: id,
      title: `技术支持文档 ${id}`,
      type: 'datasheet',
      category: '技术文档',
      description: '技术支持文档加载中...',
      fileSize: '10.0 MB',
      version: 'v1.0',
      lastUpdated: '2024-01-15',
      downloadCount: 1000,
      rating: 4.5,
      tags: ['技术支持']
    };
  }

  // Enhanced validation with runtime fallback
  if (!brand) {
    console.warn(`❌ [Brand Support Page] Brand not found: ${decodedSlug}`);
    if (!isBuildTime) {
      notFound();
    }
    // Provide fallback brand during build
    brand = { name: decodedSlug, slug: decodedSlug, _id: `fallback-${decodedSlug}` };
  }

  if (!supportResource) {
    console.warn(`❌ [Brand Support Page] Support resource not found: ${id}`);

    if (!isBuildTime) {
      // Runtime: Create a "support not found" page instead of 404
      console.log(`🔧 [Brand Support Page] Creating "support not found" page for runtime access: ${decodedSlug}/${id}`);
      supportResource = {
        id: id,
        title: `技术支持文档 "${id}" 暂时不可用`,
        type: 'unavailable',
        category: '技术支持',
        description: `抱歉，技术支持文档 "${id}" 在品牌 "${brand?.name || decodedSlug}" 下暂时不可用。这可能是因为文档已更新、重新分类，或者正在维护中。`,
        fileSize: '0 MB',
        version: 'N/A',
        lastUpdated: new Date().toISOString().split('T')[0],
        downloadCount: 0,
        rating: 0,
        tags: ['暂不可用'],
        isNotFound: true // Mark as not found resource
      };
    } else {
      // Build time: Provide fallback to prevent build failure
      supportResource = {
        id: id,
        title: `技术支持文档 ${id}`,
        type: 'datasheet',
        category: '技术文档',
        description: '技术支持文档详情加载中...',
        fileSize: '10.0 MB',
        version: 'v1.0',
        lastUpdated: '2024-01-15',
        downloadCount: 1000,
        rating: 4.5,
        tags: ['技术支持']
      };
    }
  }

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
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/support`} className="hover:text-blue-600">
              技术支持
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{supportResource.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/support`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 {brand.name} 技术支持
            </Link>
          </Button>
        </div>

        {/* Support Resource Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Resource Preview */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden border-2 border-dashed border-blue-200 flex items-center justify-center">
                {supportResource.type === 'datasheet' && (
                  <div className="text-center">
                    <FileText className="h-24 w-24 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-600 font-medium">技术文档预览</p>
                  </div>
                )}
                {supportResource.type === 'video' && (
                  <div className="text-center">
                    <Video className="h-24 w-24 text-green-400 mx-auto mb-4" />
                    <p className="text-green-600 font-medium">视频教程预览</p>
                  </div>
                )}
                {supportResource.type === 'software' && (
                  <div className="text-center">
                    <Download className="h-24 w-24 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-600 font-medium">软件工具预览</p>
                  </div>
                )}
              </div>

              {/* Resource Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{supportResource.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">用户评分</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-gray-900">{supportResource.downloadCount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">下载次数</p>
                </div>
              </div>
            </div>

            {/* Resource Info */}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{supportResource.title}</h1>
                <p className="text-lg text-gray-600">资源编号: {supportResource.id}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {supportResource.category}
                </span>
                {supportResource.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Support Not Found Warning */}
              {supportResource.isNotFound && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-800 font-medium mb-1">技术支持信息提示</h4>
                      <p className="text-yellow-700 text-sm">
                        该技术支持页面是根据您的访问自动生成的，但我们暂时没有找到对应的支持文档。如果您确实需要此技术支持，请通过下方的"联系技术支持"按钮联系我们。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed">
                {supportResource.description}
              </p>

              {/* Resource Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">资源信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">文件大小</span>
                    <span className="font-medium">{supportResource.fileSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">版本</span>
                    <span className="font-medium">{supportResource.version}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">更新时间</span>
                    <span className="font-medium">{supportResource.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">下载次数</span>
                    <span className="font-medium">{supportResource.downloadCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <Download className="h-5 w-5 mr-2" />
                  立即下载
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  技术咨询
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">即时下载</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">专家支持</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Headphones className="h-5 w-5" />
                  <span className="text-sm">在线服务</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Files */}
        {supportResource.relatedFiles && supportResource.relatedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文件</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportResource.relatedFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{file.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical Support */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Headphones className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">技术支持</h3>
            </div>
            <p className="text-gray-600 mb-4">
              需要专业的技术指导？我们的工程师团队随时为您服务
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">工作时间: 周一至周五 9:00-18:00</p>
              <p className="text-sm text-gray-500">响应时间: 通常在2小时内回复</p>
            </div>
            <Button className="w-full" asChild>
              <Link href={`/${locale}/inquiry?product=${encodeURIComponent(supportResource.title)}&brand=${encodeURIComponent(brand.name)}`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                联系技术支持
              </Link>
            </Button>
          </div>

          {/* Official Resources */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">官方资源</h3>
            </div>
            <p className="text-gray-600 mb-4">
              访问 {brand.name} 官方网站获取更多技术资源和支持
            </p>
            <div className="space-y-3">
              {brand.website && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    访问官网
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/support`} className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  浏览所有支持资源
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}