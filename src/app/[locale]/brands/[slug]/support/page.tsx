import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { getBrandWithContent, getAllBrands } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Download,
  FileText,
  Video,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandSupportPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all brands and locales
export async function generateStaticParams() {
  try {
    const brands = await getAllBrands();
    // Temporarily limit to primary locales to reduce build time
    const locales = ['zh-CN', 'en'];

    const params = [];
    for (const locale of locales) {
      for (const brand of brands) {
        if (brand.slug) {
          params.push({
            locale,
            slug: brand.slug,
          });

          // For Chinese brands, also add URL-encoded version
          if (brand.slug !== encodeURIComponent(brand.slug)) {
            params.push({
              locale,
              slug: encodeURIComponent(brand.slug),
            });
          }
        }
      }
    }

    console.log('Generated static params for brand support:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brand support:', error);
    return [];
  }
}

export default async function BrandSupportPage({ params }: BrandSupportPageProps) {
  const { locale, slug } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  const { brand, articles } = await getBrandWithContent(decodedSlug);

  if (!brand) {
    console.warn(`Brand not found for slug: ${decodedSlug}`);
    notFound();
  }

    // Mock support resources for demonstration
    const supportCategories = [
      {
        icon: FileText,
        title: '技术文档',
        description: '产品数据表、用户手册、应用指南',
        count: 25,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        icon: Video,
        title: '视频教程',
        description: '产品演示、安装指导、故障排除',
        count: 12,
        color: 'bg-green-100 text-green-600'
      },
      {
        icon: Download,
        title: '软件工具',
        description: '设计软件、仿真工具、驱动程序',
        count: 8,
        color: 'bg-purple-100 text-purple-600'
      }
    ];

    const supportResources = [
      {
        type: 'datasheet',
        title: '产品数据手册 v2.3',
        description: '完整的技术规格和电气特性',
        fileSize: '2.1 MB',
        downloadCount: 1250,
        lastUpdated: '2024-01-15'
      },
      {
        type: 'manual',
        title: '用户操作手册',
        description: '详细的安装和使用说明',
        fileSize: '5.8 MB',
        downloadCount: 890,
        lastUpdated: '2024-01-10'
      },
      {
        type: 'guide',
        title: '应用设计指南',
        description: '最佳实践和设计建议',
        fileSize: '3.2 MB',
        downloadCount: 567,
        lastUpdated: '2023-12-20'
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <BrandNavigation brand={brand} locale={locale} />
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {brand.name} 技术支持
                </h1>
                <p className="text-gray-600">
                  获取专业的技术文档、支持资源和专家服务
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索支持内容..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">需要即时帮助？</h2>
                <p className="text-blue-100">
                  我们的技术专家随时为您提供专业支持
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  在线咨询
                </Button>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  电话支持
                </Button>
              </div>
            </div>
          </div>

          {/* Support Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">支持资源分类</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.count} 个资源</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Downloads */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">热门下载</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {supportResources.map((resource, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {resource.downloadCount} 次下载
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            更新于 {resource.lastUpdated}
                          </span>
                          <span>{resource.fileSize}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      下载
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline">
                查看所有下载资源
              </Button>
            </div>
          </div>

          {/* Technical Articles */}
          {articles && articles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">技术文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 4).map((article) => (
                  <div key={article._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        技术文章
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">4.8</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {article.publishedAt && (
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${locale}/articles/${article.slug}`}>
                          阅读全文
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">邮件支持</h3>
              </div>
              <p className="text-gray-600 mb-4">
                发送详细的技术问题，我们会在24小时内回复
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">技术支持: technical@litong.com</p>
                <p className="text-sm text-gray-500">销售咨询: sales@litong.com</p>
              </div>
              <Button className="w-full" asChild>
                <Link href={`mailto:technical@litong.com?subject=${encodeURIComponent(`${brand.name} 技术咨询`)}`}>
                  发送邮件
                </Link>
              </Button>
            </div>

            {/* Official Website */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">官方支持</h3>
              </div>
              <p className="text-gray-600 mb-4">
                访问 {brand.name} 官方网站获取最新的技术支持
              </p>
              {brand.website && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={brand.website} target="_blank" rel="noopener noreferrer">
                    访问官网
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}