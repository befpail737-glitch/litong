import { getProducts } from '@/lib/sanity/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { safeImageUrl } from '@/lib/sanity/client';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Star,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    category?: string;
    brand?: string;
    search?: string;
    page?: string;
  };
}

// Force static generation for this page
export const dynamic = 'force-static';

// Generate static params for supported locales
export async function generateStaticParams() {
  const locales = ['zh-CN', 'en'];

  return locales.map((locale) => ({
    locale,
  }));
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = params;

  // For static generation, use default values. In production, filtering will be handled client-side
  const defaultParams = {
    category: undefined,
    brand: undefined,
    search: undefined,
    page: '1'
  };

  // Use default params for static generation, searchParams for runtime (if not static)
  const { category, brand, search, page = '1' } = process.env.NODE_ENV === 'production' ? defaultParams : (searchParams || defaultParams);

  const currentPage = parseInt(page, 10);
  const pageSize = 12;

  try {
    const productsData = await getProducts({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      category,
      brand,
      search,
    });

    const products = productsData?.products || [];
    const total = productsData?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">产品中心</h1>
                <p className="text-gray-600 mt-2">
                  共找到 {total} 个产品
                  {category && ` · 类别: ${category}`}
                  {brand && ` · 品牌: ${brand}`}
                  {search && ` · 搜索: ${search}`}
                </p>
              </div>

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href={`/${locale}`} className="hover:text-blue-600">
                  首页
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">产品中心</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="搜索产品名称、型号..."
                    defaultValue={search}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  defaultValue={category || ''}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有类别</option>
                  <option value="semiconductor">半导体</option>
                  <option value="passive">无源器件</option>
                  <option value="connector">连接器</option>
                  <option value="sensor">传感器</option>
                </select>

                <select
                  defaultValue={brand || ''}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有品牌</option>
                  <option value="cree">CREE</option>
                  <option value="infineon">Infineon</option>
                  <option value="ti">TI</option>
                  <option value="stmicroelectronics">STMicroelectronics</option>
                </select>

                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.image ? (
                        <Image
                          src={safeImageUrl(product.image, { width: 300, height: 300 })}
                          alt={product.title}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8" />
                            </div>
                            <p className="text-sm">暂无图片</p>
                          </div>
                        </div>
                      )}

                      {product.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                            推荐
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        {product.brand && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.brand}
                          </span>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                        {product.title}
                      </h3>

                      {product.model && (
                        <p className="text-sm text-gray-600 mb-2">
                          型号: {product.model}
                        </p>
                      )}

                      {product.category && (
                        <p className="text-sm text-gray-500 mb-3">
                          类别: {product.category}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          查看详情 →
                        </span>

                        {product.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关产品</h3>
              <p className="text-gray-600 mb-6">请尝试调整搜索条件或浏览其他类别</p>
              <Button asChild>
                <Link href={`/${locale}/products`}>
                  查看所有产品
                </Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={{
                    pathname: `/${locale}/products`,
                    query: { ...searchParams, page: pageNum.toString() }
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading products page:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: ProductsPageProps) {
  return {
    title: '产品中心 - 力通电子',
    description: '浏览力通电子的全系列电子元器件产品，包括半导体、传感器、连接器等各类电子组件。',
  };
}