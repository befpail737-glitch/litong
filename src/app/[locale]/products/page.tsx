import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts, getProductCategories } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import { Suspense } from 'react'

interface ProductsPageProps {
  searchParams: {
    category?: string
    page?: string
  }
}

// 产品卡片组件
function ProductCard({ product }: { product: any }) {
  console.log('ProductCard received product data:', {
    partNumber: product.partNumber,
    brand: product.brand,
    hasImage: !!product.image,
    hasPricing: !!product.pricing
  })
  
  const imageUrl = product.image ? urlFor(product.image).width(300).height(300).url() : null

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow">
      {/* 产品图片 */}
      <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl text-gray-300">📱</div>
        )}
      </div>

      {/* 产品信息 */}
      <div className="space-y-2">
        {/* 标签 */}
        <div className="flex gap-2">
          {product.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              新品
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              推荐
            </span>
          )}
        </div>

        {/* 产品型号和品牌 */}
        <div>
          <h3 className="font-semibold text-sm text-gray-900">
            {product.partNumber}
          </h3>
          <p className="text-xs text-gray-500">{product.brand?.name || 'Unknown Brand'}</p>
        </div>

        {/* 产品标题 */}
        <h4 className="text-sm line-clamp-2">
          {product.title}
        </h4>

        {/* 简短描述 */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* 价格 */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <div>
              {product.pricing?.tiers && product.pricing.tiers.length > 0 ? (
                <>
                  <span className="text-lg font-bold text-blue-600">
                    ¥{product.pricing.tiers[0].price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">起</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">价格待询</span>
              )}
            </div>
            <Link href={`/products/${product.slug}`}>
              <Button size="sm" variant="outline">
                查看详情
              </Button>
            </Link>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            立即询价
          </Button>
        </div>
      </div>
    </div>
  )
}

// 分类列表组件
function CategoryList({ categories }: { categories: any[] }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">产品分类</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">{category.name}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.productCount || 0}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// 产品网格组件
function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
        <p className="text-gray-500">
          请稍后再试，或联系我们获取更多产品信息。
        </p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const pageSize = 12
  const offset = (currentPage - 1) * pageSize
  
  // 获取产品和分类数据
  const [productsData, categories] = await Promise.all([
    getProducts({ 
      limit: pageSize, 
      offset, 
      category: searchParams.category 
    }),
    getProductCategories()
  ])

  const { products, total } = productsData
  const totalPages = Math.ceil(total / pageSize)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">产品中心</h1>
        <p className="text-lg text-gray-600">
          精选优质电子元器件，满足您的各种项目需求
        </p>
        {searchParams.category && (
          <p className="text-sm text-gray-500 mt-2">
            当前分类：{searchParams.category} | 共 {total} 个产品
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 侧边栏 - 分类导航 */}
        <div className="lg:col-span-1">
          <CategoryList categories={categories} />
        </div>

        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          {/* 搜索和筛选栏 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索产品型号、品牌或关键词..."
                className="input w-full"
              />
            </div>
            <Button variant="outline">
              高级筛选
            </Button>
          </div>

          {/* 产品网格 */}
          <ProductGrid products={products} />

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Link href={`?${new URLSearchParams({ 
                ...searchParams, 
                page: Math.max(1, currentPage - 1).toString() 
              })}`}>
                <Button variant="outline" disabled={currentPage <= 1}>
                  上一页
                </Button>
              </Link>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1
                  const isActive = page === currentPage
                  return (
                    <Link key={page} href={`?${new URLSearchParams({ 
                      ...searchParams, 
                      page: page.toString() 
                    })}`}>
                      <Button 
                        size="sm" 
                        variant={isActive ? "default" : "outline"}
                      >
                        {page}
                      </Button>
                    </Link>
                  )
                })}
                {totalPages > 7 && (
                  <>
                    <span className="px-3 py-2 text-gray-500">...</span>
                    <Link href={`?${new URLSearchParams({ 
                      ...searchParams, 
                      page: totalPages.toString() 
                    })}`}>
                      <Button size="sm" variant="outline">{totalPages}</Button>
                    </Link>
                  </>
                )}
              </div>

              <Link href={`?${new URLSearchParams({ 
                ...searchParams, 
                page: Math.min(totalPages, currentPage + 1).toString() 
              })}`}>
                <Button variant="outline" disabled={currentPage >= totalPages}>
                  下一页
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}