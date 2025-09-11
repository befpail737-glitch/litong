'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearch } from '@/contexts/SearchContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Clock,
  Package,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShoppingCart,
  Heart
} from 'lucide-react'

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { 
    searchQuery, 
    searchResults, 
    isLoading, 
    error, 
    sortBy, 
    updateSort,
    formatPrice,
    formatStock,
    getSortText
  } = useSearch()
  const router = useRouter()

  // 如果没有搜索结果，显示搜索提示
  if (!searchResults && !isLoading && !searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            产品搜索
          </h1>
          <p className="text-gray-600 mb-6">
            搜索超过150,000种电子元器件产品
          </p>
          <Button onClick={() => router.push('/')} className="mr-4">
            返回首页
          </Button>
          <Button variant="outline" onClick={() => router.push('/categories')}>
            浏览分类
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 搜索标题和结果统计 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            搜索结果
          </h1>
          {searchQuery && (
            <p className="text-gray-600">
              关键词: "<span className="font-medium">{searchQuery}</span>"
              {searchResults && (
                <>
                  {' '}• 找到 <span className="font-medium text-blue-600">{searchResults.total}</span> 个产品
                  {searchResults.searchTime && (
                    <span className="text-sm text-gray-500">
                      {' '}({searchResults.searchTime.toFixed(0)}ms)
                    </span>
                  )}
                </>
              )}
            </p>
          )}
        </div>

        {/* 视图切换和排序 */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <select
            value={sortBy}
            onChange={(e) => updateSort(e.target.value as any)}
            className="ml-4 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">相关性</option>
            <option value="price_asc">价格低到高</option>
            <option value="price_desc">价格高到低</option>
            <option value="stock_desc">库存多到少</option>
            <option value="newest">最新产品</option>
            <option value="name_asc">名称A-Z</option>
          </select>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">搜索中...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">搜索失败</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* 搜索结果 */}
      {searchResults && !isLoading && (
        <>
          {/* 无结果状态 */}
          {searchResults.total === 0 && (
            <div className="text-center py-16">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                未找到匹配的产品
              </h2>
              <p className="text-gray-600 mb-6">
                请尝试使用不同的关键词或浏览产品分类
              </p>
              <Button onClick={() => router.push('/categories')}>
                浏览产品分类
              </Button>
            </div>
          )}

          {/* 产品列表 */}
          {searchResults.total > 0 && (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {searchResults.products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {product.brand} • {product.model}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {product.rohs && (
                          <Badge variant="secondary" className="text-xs">
                            RoHS
                          </Badge>
                        )}
                        {product.lifecycle === 'active' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    {/* 产品规格 */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 价格和库存 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </div>
                        {product.minOrderQuantity && (
                          <p className="text-xs text-gray-500">
                            起订量: {product.minOrderQuantity}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={product.stock > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {formatStock(product.stock)}
                        </Badge>
                        {product.leadTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {product.leadTime}天
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        询价
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      {product.datasheet && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 分页 */}
          {searchResults.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={searchResults.page === 1}
              >
                上一页
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, searchResults.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={page === searchResults.page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
                {searchResults.totalPages > 5 && <span className="text-gray-500">...</span>}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={searchResults.page === searchResults.totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}