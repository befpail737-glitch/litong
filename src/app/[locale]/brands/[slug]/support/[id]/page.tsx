import { getBrandData, getAllBrands } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';
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
  try {
    // Get all brands
    const brands = await getAllBrands();

    // Limit to primary locales to reduce build time
    const locales = ['zh-CN', 'en'];

    // Create a set of known support resource IDs for faster builds
    const supportIds = ['11111', '22222', '33333'];

    const params = [];
    for (const locale of locales) {
      for (const brand of brands.slice(0, 15)) { // Limit brands for faster builds
        if (brand && brand.slug) {
          for (const supportId of supportIds) {
            // Add regular slug
            params.push({
              locale,
              slug: brand.slug,
              id: supportId,
            });

            // For Chinese brands, also add URL-encoded version
            if (brand.slug !== encodeURIComponent(brand.slug)) {
              params.push({
                locale,
                slug: encodeURIComponent(brand.slug),
                id: supportId,
              });
            }
          }
        }
      }
    }

    console.log('Generated static params for brand support:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brand support:', error);
    // Emergency fallback
    return [
      { locale: 'zh-CN', slug: 'cree', id: '11111' },
      { locale: 'zh-CN', slug: 'mediatek', id: '11111' },
      { locale: 'en', slug: 'cree', id: '11111' },
    ];
  }
}

export default async function BrandSupportDetailPage({ params }: BrandSupportDetailPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Get brand data with error handling
  let brandData;

  try {
    brandData = await getBrandData(decodedSlug);
  } catch (error) {
    console.error(`Error fetching data for brand: ${decodedSlug}, support: ${id}`, error);
    notFound();
  }

  if (!brandData || !brandData.brand) {
    console.warn(`Brand or support not found for slug: ${decodedSlug}, id: ${id}`);
    notFound();
  }

  const { brand } = brandData;

  // Mock support resource data based on ID
  const getSupportResource = (resourceId: string) => {
    const resources = {
      '11111': {
        id: '11111',
        title: '产品数据手册集合',
        type: 'datasheet',
        category: '技术文档',
        description: '包含完整的技术规格、电气特性和应用参考的综合数据手册',
        downloadUrl: '/downloads/datasheet-collection.pdf',
        fileSize: '12.5 MB',
        version: 'v3.2',
        lastUpdated: '2024-01-15',
        downloadCount: 2450,
        rating: 4.8,
        tags: ['数据手册', '技术规格', '电气特性'],
        relatedFiles: [
          { name: '快速入门指南', size: '2.1 MB', type: 'PDF' },
          { name: '应用示例代码', size: '1.8 MB', type: 'ZIP' },
          { name: 'PCB设计参考', size: '5.2 MB', type: 'PDF' }
        ]
      },
      '22222': {
        id: '22222',
        title: '视频教程系列',
        type: 'video',
        category: '培训资源',
        description: '系统的产品安装、配置和故障排除视频教程，帮助快速上手',
        downloadUrl: '/videos/tutorial-series',
        fileSize: '850 MB',
        version: 'v2.1',
        lastUpdated: '2024-01-10',
        downloadCount: 1890,
        rating: 4.9,
        tags: ['视频教程', '安装指导', '故障排除'],
        relatedFiles: [
          { name: '教程配套资料', size: '15.3 MB', type: 'ZIP' },
          { name: '练习项目文件', size: '8.7 MB', type: 'ZIP' },
          { name: '常见问题解答', size: '1.2 MB', type: 'PDF' }
        ]
      },
      '33333': {
        id: '33333',
        title: '设计工具套件',
        type: 'software',
        category: '开发工具',
        description: '专业的设计软件、仿真工具和开发环境，提升开发效率',
        downloadUrl: '/software/design-toolkit',
        fileSize: '425 MB',
        version: 'v4.5',
        lastUpdated: '2024-01-20',
        downloadCount: 3200,
        rating: 4.7,
        tags: ['设计工具', '仿真软件', '开发环境'],
        relatedFiles: [
          { name: '工具使用手册', size: '6.8 MB', type: 'PDF' },
          { name: '示例项目', size: '12.4 MB', type: 'ZIP' },
          { name: '许可证文档', size: '0.5 MB', type: 'PDF' }
        ]
      }
    };

    return resources[resourceId as keyof typeof resources] || resources['11111'];
  };

  const supportResource = getSupportResource(id);

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
                      src={urlFor(brand.logo).width(40).height(40).url()}
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