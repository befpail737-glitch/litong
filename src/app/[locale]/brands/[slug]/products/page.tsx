import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, Grid3X3, List, Filter, Search } from 'lucide-react';
import { Metadata } from 'next';

import { getBrandData } from '@/lib/sanity/brands';
import { urlFor, validateBrandProductAssociation, checkDocumentPublishStatus, client } from '@/lib/sanity/client';
import { getProducts } from '@/lib/sanity/queries';
import { locales } from '@/i18n';

// 为静态生成提供基本参数（简化版本）
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN', slug: 'sample-brand' }
  ];
}

interface Props {
  params: {
    slug: string
    locale: string
  }
  searchParams: {
    view?: 'grid' | 'list'
    category?: string
    search?: string
    page?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandSlug = decodeURIComponent(params.slug);

  try {
    const brand = await getBrandData(brandSlug);

    if (!brand) {
      return {
        title: '品牌未找到 - 力通电子',
        description: '未找到指定的品牌信息',
      };
    }

    return {
      title: `${brand.name}产品列表 - 力通电子`,
      description: `查看${brand.name}品牌的所有产品，包括详细规格参数和价格信息`,
      keywords: [`${brand.name}产品`, '电子元器件', '产品列表'],
    };
  } catch (error) {
    return {
      title: '产品列表 - 力通电子',
      description: '查看品牌产品列表'
    };
  }
}

export default async function BrandProductsPage({ params, searchParams }: Props) {
  const brandSlug = decodeURIComponent(params.slug);
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 12;
  const view = searchParams.view || 'grid';

  console.log('BrandProductsPage called with slug:', params.slug, 'decoded:', brandSlug);

  try {
    // 获取品牌信息
    const brand = await getBrandData(brandSlug);
    console.log('Brand found:', brand);

    if (!brand) {
      console.error('Brand not found for slug:', brandSlug);
      notFound();
    }

    // 验证品牌发布状态
    const brandStatus = await checkDocumentPublishStatus(brand._id, 'brandBasic');
    console.log('Brand publish status:', brandStatus);

    // 验证品牌-产品关联
    const association = await validateBrandProductAssociation(brandSlug);
    console.log('Brand-Product association validation:', association);

    if (!association.brandExists) {
      console.error('Brand does not exist in published state:', brandSlug);
      notFound();
    }

    if (!association.brandActive) {
      console.error('Brand is not active:', brandSlug);
      notFound();
    }

    // 添加详细的查询参数调试
    const queryParams = {
      brand: brandSlug,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };
    console.log('About to query products with params:', queryParams);
    console.log('Expected product count for brand:', association.productCount);

    // 获取该品牌的产品
    const productsData = await getProducts(queryParams);

    console.log('BrandProductsPage - Products data for brand:', brandSlug, {
      total: productsData.total,
      fetchedCount: productsData.products?.length || 0,
      expectedCount: association.productCount,
      products: productsData.products?.map((p: any) => ({ id: p._id, partNumber: p.partNumber, slug: p.slug })) || []
    });

    const { products, total } = productsData;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href={`/${params.locale}/brands/${brandSlug}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回品牌页面
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{brand?.name || brandSlug} 产品列表</h1>
                <p className="text-gray-600 mt-2">
                  找到 {total} 个产品
                </p>
              </div>

              {/* 视图切换 */}
              <div className="flex items-center gap-2">
                <Link
                  href={`?${new URLSearchParams({ ...searchParams, view: 'grid' }).toString()}`}
                  className={`p-2 rounded-lg transition-colors $\{
                    view === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </Link>
                <Link
                  href={`?${new URLSearchParams({ ...searchParams, view: 'list' }).toString()}`}
                  className={`p-2 rounded-lg transition-colors $\{
                    view === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {products.length === 0 ? (
            /* 空状态 */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v8h-8V5h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无产品</h3>
              <p className="text-gray-600 mb-6">
                该品牌下暂时没有产品，或者产品正在审核中
              </p>
              <Link
                href={`/${params.locale}/brands/${brandSlug}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回品牌页面
              </Link>
            </div>
          ) : (
            /* 产品列表 */
            <>
              <div className={`grid gap-6 $\{
                view === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product: any) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    {/* 产品图片 */}
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      {product.image ? (
                        <img
                          src={urlFor(product.image).width(400).height(400).url()}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v8h-8V5h8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 产品信息 */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.title || product.partNumber}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        型号：{product.partNumber}
                      </p>
                      {product.shortDescription && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}

                      {/* 产品状态 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {product.inventory?.status === 'in_stock' && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              现货
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              新品
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/${params.locale}/products/${product.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {currentPage > 1 && (
                    <Link
                      href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) }).toString()}`}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      上一页
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`?${new URLSearchParams({ ...searchParams, page: String(pageNum) }).toString()}`}
                      className={`px-3 py-2 rounded transition-colors $\{
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}

                  {currentPage < totalPages && (
                    <Link
                      href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) }).toString()}`}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      下一页
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in BrandProductsPage:', error);
    notFound();
  }
}
