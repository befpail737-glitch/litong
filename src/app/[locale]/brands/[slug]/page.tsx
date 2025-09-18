import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { getBrandWithContent, getBrandSlugsOnly } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { generateSolutionUrl } from '@/lib/utils/slug';

interface BrandPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all brands and locales
export async function generateStaticParams() {
  try {
    console.log('🔧 [generateStaticParams] Starting brand page static generation...');

    // 使用轻量级查询仅获取slugs，大幅减少查询复杂度
    const brandSlugs = await getBrandSlugsOnly(50); // 增加到50个品牌确保足够的详情页

    if (!brandSlugs || brandSlugs.length === 0) {
      console.warn('⚠️ [generateStaticParams] No brand slugs found, using fallback');
      const fallbackSlugs = ['cree', 'infineon', 'ti', 'stmicroelectronics', 'lem'];
      const fallbackParams = [];
      for (const locale of ['zh-CN', 'en']) {
        for (const slug of fallbackSlugs) {
          fallbackParams.push({ locale, slug });
        }
      }
      return fallbackParams;
    }

    // 仅限制为主要语言以减少构建时间
    const locales = ['zh-CN', 'en'];

    const params = [];
    for (const locale of locales) {
      for (const slug of brandSlugs) {
        if (slug && typeof slug === 'string' && slug.trim().length > 0) {
          // 验证slug格式
          const trimmedSlug = slug.trim();

          // 添加原始slug
          params.push({
            locale,
            slug: trimmedSlug,
          });

          // 对于中文品牌，也添加URL编码版本
          const encodedSlug = encodeURIComponent(trimmedSlug);
          if (trimmedSlug !== encodedSlug) {
            params.push({
              locale,
              slug: encodedSlug,
            });
          }
        }
      }
    }

    // 验证生成的参数
    const validParams = params.filter(param =>
      param.locale &&
      param.slug &&
      typeof param.slug === 'string' &&
      param.slug.trim().length > 0
    );

    console.log(`✅ [generateStaticParams] Generated ${validParams.length} static params for brands (from ${brandSlugs.length} slugs)`);

    // 如果有效参数太少，添加fallback
    if (validParams.length < 10) {
      const fallbackSlugs = ['cree', 'infineon', 'ti', 'stmicroelectronics', 'lem'];
      for (const locale of locales) {
        for (const slug of fallbackSlugs) {
          if (!validParams.find(p => p.locale === locale && p.slug === slug)) {
            validParams.push({ locale, slug });
          }
        }
      }
      console.log(`🔄 [generateStaticParams] Augmented with fallback params, total: ${validParams.length}`);
    }

    return validParams;
  } catch (error) {
    console.error('❌ [generateStaticParams] Error generating static params for brands:', error);
    // 紧急情况下使用最小化的fallback
    const emergencyParams = [
      { locale: 'zh-CN', slug: 'cree' },
      { locale: 'zh-CN', slug: 'infineon' },
      { locale: 'zh-CN', slug: 'ti' },
      { locale: 'zh-CN', slug: 'stmicroelectronics' },
      { locale: 'zh-CN', slug: 'lem' },
      { locale: 'en', slug: 'cree' },
      { locale: 'en', slug: 'infineon' },
      { locale: 'en', slug: 'ti' },
      { locale: 'en', slug: 'stmicroelectronics' },
      { locale: 'en', slug: 'lem' }
    ];
    console.log(`🆘 [generateStaticParams] Using emergency fallback params: ${emergencyParams.length}`);
    return emergencyParams;
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, slug } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  console.log(`🔍 [BrandPage] Loading brand page for: ${decodedSlug} (locale: ${locale})`);

  try {
    const { brand, products, solutions, articles, categories } = await getBrandWithContent(decodedSlug);

    if (!brand) {
      console.warn(`❌ [BrandPage] Brand not found for slug: ${decodedSlug}`);

      // 返回友好的品牌未找到页面而不是404
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl">?</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">品牌未找到</h1>
            <p className="text-gray-600 mb-6">
              抱歉，我们没有找到 "{decodedSlug}" 品牌的相关信息。
            </p>
            <div className="space-y-3">
              <Link
                href={`/${locale}/brands`}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                浏览所有品牌
              </Link>
              <Link
                href={`/${locale}/search?q=${encodeURIComponent(decodedSlug)}`}
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                搜索相关产品
              </Link>
            </div>
          </div>
        </div>
      );
    }

    console.log(`✅ [BrandPage] Successfully loaded brand: ${brand.name}`);

    // 正常渲染品牌页面
    return (
      <div className="min-h-screen bg-gray-50">
        <BrandNavigation brand={brand} locale={locale} />
        <div className="container mx-auto px-4 py-8">
          {/* Brand Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Brand Logo */}
              {brand.logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={safeImageUrl(brand.logo, { width: 200, height: 120 })}
                    alt={`${brand.name} Logo`}
                    width={200}
                    height={120}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Brand Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{brand.name}</h1>

                {brand.description && (
                  <p className="text-gray-600 text-lg mb-6">{brand.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brand.website && (
                    <div>
                      <span className="font-medium text-gray-700">官方网站:</span>
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {brand.website}
                      </a>
                    </div>
                  )}

                  {brand.country && (
                    <div>
                      <span className="font-medium text-gray-700">国家/地区:</span>
                      <span className="ml-2 text-gray-600">{brand.country}</span>
                    </div>
                  )}

                  {brand.headquarters && (
                    <div>
                      <span className="font-medium text-gray-700">总部:</span>
                      <span className="ml-2 text-gray-600">{brand.headquarters}</span>
                    </div>
                  )}

                  {brand.established && (
                    <div>
                      <span className="font-medium text-gray-700">成立时间:</span>
                      <span className="ml-2 text-gray-600">{brand.established}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">产品分类</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} 个产品</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products */}
          {products && products.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">热门产品</h2>
                <Link
                  href={`/${locale}/products?brand=${brand.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <div key={product._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    {product.images?.[0] && (
                      <Image
                        src={safeImageUrl(product.images[0], { width: 200, height: 150 })}
                        alt={product.title}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                    {product.partNumber && (
                      <p className="text-sm text-gray-600 mb-2">型号: {product.partNumber}</p>
                    )}
                    <Link
                      href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products/${product.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      查看详情 →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solutions */}
          {solutions && solutions.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">解决方案</h2>
                <Link
                  href={`/${locale}/solutions?brand=${brand.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutions.slice(0, 6).map((solution) => (
                  <div key={solution._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-3">{solution.title}</h3>
                    {solution.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{solution.summary}</p>
                    )}
                    <Link
                      href={generateSolutionUrl(locale, brand.slug || brand.name, solution.slug)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      了解更多 →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Articles */}
          {articles && articles.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">技术文章</h2>
                <Link
                  href={`/${locale}/articles?brand=${brand.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 4).map((article) => (
                  <div key={article._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-3">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/articles/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        阅读全文 →
                      </Link>
                      {article.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Brands */}
          <div className="text-center">
            <Link
              href={`/${locale}/brands`}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              ← 返回品牌列表
            </Link>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error(`❌ [BrandPage] Error loading brand page for ${decodedSlug}:`, error);

    // 返回错误页面而不是崩溃
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">页面加载错误</h1>
          <p className="text-gray-600 mb-6">
            抱歉，加载品牌页面时发生了错误。请稍后重试。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
            <Link
              href={`/${locale}/brands`}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回品牌列表
            </Link>
          </div>
        </div>
      </div>
    );
  }
}