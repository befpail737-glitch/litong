import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Settings, Target, Calendar, ArrowRight, Lightbulb } from 'lucide-react';

import { getBrandData, getBrandSolutions } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';

interface BrandSolutionsPageProps {
  params: {
    slug: string;
  };
}

export default async function BrandSolutionsPage({ params }: BrandSolutionsPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  const [brand, solutions] = await Promise.all([
    getBrandData(decodedSlug),
    getBrandSolutions(decodedSlug, 20)
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
          <span className="text-gray-900">解决方案</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {brand.name} 解决方案
        </h1>
        <p className="text-lg text-gray-600">
          探索 {brand.name} 提供的完整解决方案和技术应用
        </p>
      </div>

      {solutions.length > 0 ? (
        <>
          {/* Featured Solution */}
          {solutions[0] && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">精选解决方案</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="order-2 lg:order-1 p-8 lg:p-12">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        精选方案
                      </span>
                      {solutions[0].targetMarket && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {solutions[0].targetMarket}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {solutions[0].title}
                    </h3>
                    {solutions[0].summary && (
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {solutions[0].summary}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8">
                      {solutions[0].publishedAt && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(solutions[0].publishedAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>行业应用</span>
                      </div>
                    </div>
                    <Link
                      href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions/${solutions[0].slug}`}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>了解详情</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="order-1 lg:order-2">
                    {solutions[0].heroImage ? (
                      <div className="h-64 lg:h-full">
                        <Image
                          src={urlFor(solutions[0].heroImage).width(600).height(400).url()}
                          alt={solutions[0].title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Settings className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solutions Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="h-6 w-6 mr-2" />
              全部解决方案
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.slice(1).map((solution: any) => (
                <div
                  key={solution._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Solution Image */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    {solution.heroImage ? (
                      <Image
                        src={urlFor(solution.heroImage).width(400).height(200).url()}
                        alt={solution.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Settings className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {solution.targetMarket && (
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
                          {solution.targetMarket}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Solution Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {solution.title}
                    </h3>

                    {solution.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {solution.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {solution.publishedAt && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(solution.publishedAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions/${solution.slug}`}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1"
                      >
                        <span>查看详情</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">需要定制化解决方案？</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              我们的技术团队可以根据您的具体需求，基于 {brand.name} 的产品为您打造专属解决方案
            </p>
            <Link
              href="/inquiry"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <span>咨询定制方案</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            解决方案正在完善中
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {brand.name} 的解决方案正在整理中，我们正在为您准备更多优质的技术方案和应用案例
          </p>

          {/* Default Solutions Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">行业定制方案</h4>
              <p className="text-gray-600 text-sm">
                针对特定行业需求，提供量身定制的完整解决方案
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-left">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">技术集成服务</h4>
              <p className="text-gray-600 text-sm">
                提供完整的技术集成和系统优化服务支持
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-left">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">创新应用支持</h4>
              <p className="text-gray-600 text-sm">
                支持创新项目开发和前沿技术应用实施
              </p>
            </div>
          </div>

          <Link
            href="/inquiry"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>联系我们了解更多</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    console.log('🔧 [brands/[slug]/solutions] Generating static params...');

    const { getAllBrands } = await import('@/lib/sanity/brands');
    const brands = await getAllBrands();

    console.log(`🔧 [brands/[slug]/solutions] Fetched ${brands.length} brands from Sanity`);

    // 扩展的 fallback 品牌列表，包含生产环境常见的品牌
    const fallbackBrands = [
      'MediaTek', 'mediatek', 'Qualcomm', 'qualcomm', 'Cree', 'cree',
      'Littelfuse', 'littelfuse', 'IXYS', 'ixys', 'LEM', 'lem',
      'PI', 'pi', 'Semikron', 'semikron', 'Sanrex', 'sanrex',
      'NCC', 'ncc', 'Epcos', 'epcos', 'Infineon', 'infineon',
      '英飞凌', 'STMicroelectronics', 'stmicroelectronics', 'ST', 'st',
      'TI', 'ti', 'Texas Instruments', 'texas instruments',
      'Analog Devices', 'analog devices', 'ADI', 'adi',
      'Maxim', 'maxim', 'Linear Technology', 'linear technology',
      'Vishay', 'vishay', 'Murata', 'murata', 'TDK', 'tdk',
      'Panasonic', 'panasonic', 'Nichicon', 'nichicon'
    ];

    if (brands.length === 0) {
      console.warn('⚠️ [brands/[slug]/solutions] No brands found, using extended fallback brand list');
      return fallbackBrands.map(brandName => ({
        slug: encodeURIComponent(brandName)
      }));
    }

    const staticParams = new Set();

    // 处理从 Sanity 获取的品牌
    brands
      .filter(brand => brand.isActive !== false && (brand.slug || brand.name))
      .forEach(brand => {
        const originalSlug = brand.slug || brand.name;

        // 为英文品牌生成大写和小写两个版本
        if (/^[A-Za-Z]/.test(originalSlug)) {
          // 原始版本
          staticParams.add(encodeURIComponent(originalSlug));
          console.log(`🔧 [brands/[slug]/solutions] Creating static param (original): ${brand.name} -> ${originalSlug}`);

          // 小写版本
          const lowercaseSlug = originalSlug.toLowerCase();
          staticParams.add(encodeURIComponent(lowercaseSlug));
          console.log(`🔧 [brands/[slug]/solutions] Creating static param (lowercase): ${brand.name} -> ${lowercaseSlug}`);

          // 大写版本（如果原始不是大写）
          const uppercaseSlug = originalSlug.toUpperCase();
          staticParams.add(encodeURIComponent(uppercaseSlug));
          console.log(`🔧 [brands/[slug]/solutions] Creating static param (uppercase): ${brand.name} -> ${uppercaseSlug}`);
        } else {
          // 中文品牌或其他特殊字符
          staticParams.add(encodeURIComponent(originalSlug));
          console.log(`🔧 [brands/[slug]/solutions] Creating static param: ${brand.name} -> ${originalSlug}`);
        }
      });

    // 添加 fallback 品牌确保生产环境常见品牌都有对应页面
    fallbackBrands.forEach(brandName => {
      staticParams.add(encodeURIComponent(brandName));
    });

    const result = Array.from(staticParams).map(slug => ({ slug }));
    console.log(`🔧 [brands/[slug]/solutions] Generated ${result.length} static params`);
    return result;
  } catch (error) {
    console.error('❌ [brands/[slug]/solutions] Error generating static params:', error);

    // 即使出错也要提供 fallback，确保基本的品牌页面能生成
    const emergencyFallback = [
      'MediaTek', 'mediatek', 'Qualcomm', 'qualcomm', 'Cree', 'cree',
      'Littelfuse', 'littelfuse', 'IXYS', 'ixys', 'LEM', 'lem',
      'PI', 'pi', 'Semikron', 'semikron', 'Sanrex', 'sanrex',
      'NCC', 'ncc', 'Epcos', 'epcos', 'Infineon', 'infineon',
      '英飞凌', 'STMicroelectronics', 'stmicroelectronics'
    ];

    console.log(`🔧 [brands/[slug]/solutions] Using emergency fallback: ${emergencyFallback.length} brands`);
    return emergencyFallback.map(brandName => ({
      slug: encodeURIComponent(brandName)
    }));
  }
}

export async function generateMetadata({ params }: BrandSolutionsPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    return {
      title: '品牌解决方案 - 力通电子',
      description: '品牌解决方案页面'
    };
  }

  return {
    title: `${brand.name} 解决方案 - 力通电子`,
    description: `探索 ${brand.name} 提供的完整解决方案和技术应用，为您的项目提供专业的技术支持。`,
    keywords: `${brand.name}, 解决方案, 技术应用, 电子元器件, ${brand.country || ''}`,
  };
}
