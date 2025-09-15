import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Package, Grid, List } from 'lucide-react';

import { getBrandData, getBrandProducts, getBrandProductCategories } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';

interface BrandProductsPageProps {
  params: {
    slug: string;
  };
}

export default async function BrandProductsPage({ params }: BrandProductsPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  const [brand, products, categories] = await Promise.all([
    getBrandData(decodedSlug),
    getBrandProducts(decodedSlug, 24),
    getBrandProductCategories(decodedSlug)
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
          <span className="text-gray-900">产品分类</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {brand.name} 产品分类
        </h1>
        <p className="text-lg text-gray-600">
          浏览 {brand.name} 的全部产品系列和分类
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 产品分类侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Grid className="h-5 w-5 mr-2" />
              产品分类
            </h3>
            {categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((category: any) => (
                  <div
                    key={category.slug}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Grid className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无分类信息</p>
              </div>
            )}
          </div>
        </div>

        {/* 产品列表 */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              全部产品 ({products.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md bg-blue-100 text-blue-600">
                <Grid className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:bg-gray-100">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  {/* 产品图片 */}
                  {product.images?.[0] && (
                    <div className="w-full h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(product.images[0]).width(300).height(200).url()}
                        alt={product.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* 产品信息 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    {product.partNumber && (
                      <p className="text-blue-600 text-sm font-mono mb-2">
                        {product.partNumber}
                      </p>
                    )}

                    {product.shortDescription && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}

                    {/* 产品属性 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.category?.name && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {product.category.name}
                        </span>
                      )}
                      {product.package && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {product.package}
                        </span>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products/${product.slug || product._id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        查看详情
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        询价
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无产品信息
              </h3>
              <p className="text-gray-500 mb-6">
                该品牌的产品信息正在完善中，敬请期待
              </p>
              <Link
                href="/inquiry"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                联系我们了解更多
              </Link>
            </div>
          )}

          {/* 加载更多 */}
          {products.length >= 24 && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                加载更多产品
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    console.log('🔧 [brands/[slug]/products] Generating static params...');

    const { getAllBrands } = await import('@/lib/sanity/brands');
    const brands = await getAllBrands();

    console.log(`🔧 [brands/[slug]/products] Fetched ${brands.length} brands from Sanity`);

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
      console.warn('⚠️ [brands/[slug]/products] No brands found, using extended fallback brand list');
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
          console.log(`🔧 [brands/[slug]/products] Creating static param (original): ${brand.name} -> ${originalSlug}`);

          // 小写版本
          const lowercaseSlug = originalSlug.toLowerCase();
          staticParams.add(encodeURIComponent(lowercaseSlug));
          console.log(`🔧 [brands/[slug]/products] Creating static param (lowercase): ${brand.name} -> ${lowercaseSlug}`);

          // 大写版本（如果原始不是大写）
          const uppercaseSlug = originalSlug.toUpperCase();
          staticParams.add(encodeURIComponent(uppercaseSlug));
          console.log(`🔧 [brands/[slug]/products] Creating static param (uppercase): ${brand.name} -> ${uppercaseSlug}`);
        } else {
          // 中文品牌或其他特殊字符
          staticParams.add(encodeURIComponent(originalSlug));
          console.log(`🔧 [brands/[slug]/products] Creating static param: ${brand.name} -> ${originalSlug}`);
        }
      });

    // 添加 fallback 品牌确保生产环境常见品牌都有对应页面
    fallbackBrands.forEach(brandName => {
      staticParams.add(encodeURIComponent(brandName));
    });

    const result = Array.from(staticParams).map(slug => ({ slug }));
    console.log(`🔧 [brands/[slug]/products] Generated ${result.length} static params`);
    return result;
  } catch (error) {
    console.error('❌ [brands/[slug]/products] Error generating static params:', error);

    // 即使出错也要提供 fallback，确保基本的品牌页面能生成
    const emergencyFallback = [
      'MediaTek', 'mediatek', 'Qualcomm', 'qualcomm', 'Cree', 'cree',
      'Littelfuse', 'littelfuse', 'IXYS', 'ixys', 'LEM', 'lem',
      'PI', 'pi', 'Semikron', 'semikron', 'Sanrex', 'sanrex',
      'NCC', 'ncc', 'Epcos', 'epcos', 'Infineon', 'infineon',
      '英飞凌', 'STMicroelectronics', 'stmicroelectronics'
    ];

    console.log(`🔧 [brands/[slug]/products] Using emergency fallback: ${emergencyFallback.length} brands`);
    return emergencyFallback.map(brandName => ({
      slug: encodeURIComponent(brandName)
    }));
  }
}

export async function generateMetadata({ params }: BrandProductsPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    return {
      title: '品牌产品 - 力通电子',
      description: '品牌产品页面'
    };
  }

  return {
    title: `${brand.name} 产品分类 - 力通电子`,
    description: `浏览 ${brand.name} 的全部产品系列和分类，包含详细的技术规格和应用信息。`,
    keywords: `${brand.name}, 产品分类, 电子元器件, ${brand.country || ''}`,
  };
}
