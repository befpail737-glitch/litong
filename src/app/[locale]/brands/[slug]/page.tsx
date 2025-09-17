import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { getBrandWithContent, getAllBrands } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface BrandPageProps {
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
          // Add both encoded and decoded versions for Chinese brands
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

    console.log('Generated static params for brands:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brands:', error);
    return [];
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, slug } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  const { brand, products, solutions, articles, categories } = await getBrandWithContent(decodedSlug);

  if (!brand) {
    console.warn(`Brand not found for slug: ${decodedSlug}`);
    notFound();
  }

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
                      href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions/${solution.slug}`}
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
}