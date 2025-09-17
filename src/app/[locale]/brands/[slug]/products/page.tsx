import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { getBrandWithContent, getAllBrands } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Grid, List, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandProductsPageProps {
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

    console.log('Generated static params for brand products:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brand products:', error);
    return [];
  }
}

export default async function BrandProductsPage({ params }: BrandProductsPageProps) {
  const { locale, slug } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  const { brand, products, categories } = await getBrandWithContent(decodedSlug);

  if (!brand) {
    console.warn(`Brand not found for slug: ${decodedSlug}`);
    notFound();
  }

    return (
      <div className="min-h-screen bg-gray-50">
        <BrandNavigation brand={brand} locale={locale} />
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {brand.name} 产品分类
                </h1>
                <p className="text-gray-600">
                  浏览 {brand.name} 的所有产品分类和型号
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索产品..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">产品分类</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name || 'Unknown Category'}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.count || 0} 个产品</p>
                    <Button variant="outline" size="sm" className="w-full">
                      查看分类
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products */}
          {products && products.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">热门产品</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {product.images?.[0] && (
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={safeImageUrl(product.images[0], { width: 300, height: 300 })}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      {product.partNumber && (
                        <p className="text-sm text-gray-600 mb-2">
                          型号: {product.partNumber}
                        </p>
                      )}
                      {product.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mb-3">
                          {typeof product.category === 'string' ? product.category : product.category.name}
                        </span>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products/${product.slug || product._id}`}>
                            查看详情
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/${locale}/inquiry`}>
                            立即询价
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {products.length >= 12 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    加载更多产品
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No Products */}
          {(!products || products.length === 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
              <p className="text-gray-600 mb-6">
                {brand.name} 的产品信息正在整理中，请稍后再来查看。
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`}>
                    返回品牌首页
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/${locale}/inquiry`}>
                    联系我们
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}