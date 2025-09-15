import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  HelpCircle,
  FileText,
  Download,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Users,
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';

import { getBrandData, getBrandArticles } from '@/lib/sanity/brands';

interface BrandSupportPageProps {
  params: {
    slug: string;
  };
}

export default async function BrandSupportPage({ params }: BrandSupportPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  const [brand, articles] = await Promise.all([
    getBrandData(decodedSlug),
    getBrandArticles(decodedSlug, 12)
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`} className="hover:text-blue-600">
            {brand.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">技术支持</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {brand.name} 技术支持
        </h1>
        <p className="text-lg text-gray-600">
          获取专业的技术文档、支持服务和培训资源
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">产品资料</h3>
          <p className="text-gray-600 text-sm mb-4">下载完整的产品规格书和技术文档</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            浏览资料 →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">在线咨询</h3>
          <p className="text-gray-600 text-sm mb-4">专业工程师在线解答技术问题</p>
          <Link href="/inquiry" className="text-blue-600 text-sm font-medium hover:text-blue-800">
            立即咨询 →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">技术培训</h3>
          <p className="text-gray-600 text-sm mb-4">参加产品培训和技术研讨会</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            查看日程 →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">知识库</h3>
          <p className="text-gray-600 text-sm mb-4">搜索常见问题和解决方案</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            搜索帮助 →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Technical Articles */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            技术文章
          </h2>

          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article: any) => (
                <div key={article._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/support/${article.slug}`}
                      className="font-semibold text-gray-900 text-lg hover:text-blue-600 cursor-pointer line-clamp-2 block"
                    >
                      {article.title}
                    </Link>
                  </div>

                  {article.summary && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {article.publishedAt && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                      )}
                      {article.readingTime && (
                        <span>阅读时间: {article.readingTime}分钟</span>
                      )}
                    </div>
                    <Link
                      href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/support/${article.slug}`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>阅读全文</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">技术文章正在完善中</h3>
              <p className="text-gray-500 mb-6">
                {brand.name} 的技术文章和支持文档正在整理中，敬请期待
              </p>

              {/* Default Support Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">产品手册</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    完整的产品规格书、安装指南和使用说明
                  </p>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <Download className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">软件工具</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    开发工具、驱动程序和配置软件下载
                  </p>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">应用笔记</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    实用的应用案例和设计参考资料
                  </p>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">常见问题</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    常见技术问题的解答和故障排除指南
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                联系技术支持
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">邮件咨询</p>
                    <p className="text-sm text-gray-600">support@litongtech.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">电话咨询</p>
                    <p className="text-sm text-gray-600">+86-755-xxxxxxxx</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">服务时间</p>
                    <p className="text-sm text-gray-600">周一至周五 9:00-18:00</p>
                  </div>
                </div>
              </div>
              <Link
                href="/inquiry"
                className="w-full mt-6 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
              >
                提交技术咨询
              </Link>
            </div>

            {/* Brand Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌信息</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">品牌名称</span>
                  <p className="font-medium">{brand.name}</p>
                </div>
                {brand.country && (
                  <div>
                    <span className="text-sm text-gray-500">所属国家</span>
                    <p className="font-medium">{brand.country}</p>
                  </div>
                )}
                {brand.established && (
                  <div>
                    <span className="text-sm text-gray-500">成立时间</span>
                    <p className="font-medium">{brand.established}</p>
                  </div>
                )}
                {brand.website && (
                  <div>
                    <span className="text-sm text-gray-500">官方网站</span>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-medium"
                    >
                      <span>访问官网</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速链接</h3>
              <div className="space-y-2">
                <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
                      className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                  产品分类
                </Link>
                <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}
                      className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                  解决方案
                </Link>
                <Link href="/inquiry"
                      className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                  获取报价
                </Link>
                <Link href="/about"
                      className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                  关于力通
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    console.log('🔧 [brands/[slug]/support] Generating static params...');

    const { getAllBrands } = await import('@/lib/sanity/brands');
    const brands = await getAllBrands();

    console.log(`🔧 [brands/[slug]/support] Fetched ${brands.length} brands from Sanity`);

    if (brands.length === 0) {
      console.warn('⚠️ [brands/[slug]/support] No brands found, using fallback brand list');
      const fallbackBrands = [
        'MediaTek', 'Qualcomm', 'Cree', 'Littelfuse', 'IXYS',
        'LEM', 'PI', 'Semikron', 'Sanrex', 'NCC',
        '英飞凌', 'Epcos'
      ];

      const fallbackParams = [];
      fallbackBrands.forEach(brandName => {
        if (/^[A-Z]/.test(brandName)) {
          // 英文品牌生成大写和小写版本
          fallbackParams.push({ slug: encodeURIComponent(brandName) });
          fallbackParams.push({ slug: encodeURIComponent(brandName.toLowerCase()) });
        } else {
          // 中文品牌只生成一个版本
          fallbackParams.push({ slug: encodeURIComponent(brandName) });
        }
      });
      return fallbackParams;
    }

    const staticParams = [];

    brands
      .filter(brand => brand.isActive !== false && (brand.slug || brand.name))
      .forEach(brand => {
        const originalSlug = brand.slug || brand.name;

        // 为英文品牌生成大写和小写两个版本
        if (/^[A-Z]/.test(originalSlug)) {
          // 原始版本（如 MediaTek）
          const originalEncoded = encodeURIComponent(originalSlug);
          staticParams.push({ slug: originalEncoded });
          console.log(`🔧 [brands/[slug]/support] Creating static param (original): ${brand.name} -> ${originalEncoded}`);

          // 小写版本（如 mediatek）
          const lowercaseSlug = originalSlug.toLowerCase();
          const lowercaseEncoded = encodeURIComponent(lowercaseSlug);
          staticParams.push({ slug: lowercaseEncoded });
          console.log(`🔧 [brands/[slug]/support] Creating static param (lowercase): ${brand.name} -> ${lowercaseEncoded}`);
        } else {
          // 中文品牌或其他，只生成一个版本
          const slug = encodeURIComponent(originalSlug);
          staticParams.push({ slug });
          console.log(`🔧 [brands/[slug]/support] Creating static param: ${brand.name} -> ${slug}`);
        }
      });

    console.log(`🔧 [brands/[slug]/support] Generated ${staticParams.length} static params`);
    return staticParams;
  } catch (error) {
    console.error('❌ [brands/[slug]/support] Error generating static params:', error);

    const fallbackBrands = [
      'MediaTek', 'Qualcomm', 'Cree', 'Littelfuse', 'IXYS',
      'LEM', 'PI', 'Semikron', 'Sanrex', 'NCC',
      '英飞凌', 'Epcos'
    ];

    console.log(`🔧 [brands/[slug]/support] Using fallback brands: ${fallbackBrands.length} brands`);
    const fallbackParams = [];
    fallbackBrands.forEach(brandName => {
      if (/^[A-Z]/.test(brandName)) {
        // 英文品牌生成大写和小写版本
        fallbackParams.push({ slug: encodeURIComponent(brandName) });
        fallbackParams.push({ slug: encodeURIComponent(brandName.toLowerCase()) });
      } else {
        // 中文品牌只生成一个版本
        fallbackParams.push({ slug: encodeURIComponent(brandName) });
      }
    });
    return fallbackParams;
  }
}

export async function generateMetadata({ params }: BrandSupportPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    return {
      title: '品牌技术支持 - 力通电子',
      description: '品牌技术支持页面'
    };
  }

  return {
    title: `${brand.name} 技术支持 - 力通电子`,
    description: `获取 ${brand.name} 的专业技术文档、支持服务和培训资源，专业工程师为您提供全方位技术支持。`,
    keywords: `${brand.name}, 技术支持, 产品资料, 技术咨询, ${brand.country || ''}`,
  };
}
