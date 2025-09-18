import Link from 'next/link';

import { ArrowLeftRight } from 'lucide-react';

import { QuickInquiry } from '@/components/inquiry/QuickInquiry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string
    partNumber: string
    title: string
    shortDescription?: string
    image?: string
    brand: {
      name: string
      slug: string
    }
    category: {
      name: string
      slug: string
    }
    pricing?: {
      tiers: Array<{
        quantity: number
        price: number
        unit?: string
      }>
      currency?: string
    }
    inventory?: {
      status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
    }
    isNew?: boolean
    isFeatured?: boolean
    isActive?: boolean
  }
  className?: string
  showBrand?: boolean
  showCategory?: boolean
  showInventory?: boolean
  showCompare?: boolean
  onAddToCompare?: (productId: string) => void
  locale?: string
  useBrandContext?: boolean
}

const inventoryStatusMap = {
  in_stock: { label: '现货', variant: 'success' as const },
  low_stock: { label: '库存紧张', variant: 'warning' as const },
  out_of_stock: { label: '缺货', variant: 'error' as const },
  discontinued: { label: '停产', variant: 'secondary' as const },
};

export function ProductCard({
  product,
  className,
  showBrand = true,
  showCategory = false,
  showInventory = true,
  showCompare = false,
  onAddToCompare,
  locale = 'zh-CN',
  useBrandContext = true,
}: ProductCardProps) {
  const inventoryStatus = product.inventory?.status || 'in_stock';
  const inventoryInfo = inventoryStatusMap[inventoryStatus];
  const basePrice = product.pricing?.tiers[0]?.price;
  const currency = product.pricing?.currency || 'CNY';

  // Generate the appropriate product detail URL
  const productDetailUrl = useBrandContext
    ? `/${locale}/brands/${encodeURIComponent(product.brand.slug)}/products/${product.id}`
    : `/${locale}/products/${product.id}`;

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-200 h-full flex flex-col', className)}>
      <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
        {/* 产品图片 */}
        <div className="relative aspect-square bg-gray-100 rounded-md mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="text-2xl sm:text-4xl text-gray-300">📱</div>
          )}

          {/* 心愿单按钮 - 悬浮在图片右上角 */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <WishlistButton
              productId={product.id}
              productName={product.partNumber}
              size="sm"
              variant="ghost"
              showText={false}
              className="bg-white/80 backdrop-blur-sm hover:bg-white h-8 w-8"
            />
          </div>
        </div>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {product.isNew && (
            <Badge variant="success" className="text-xs px-2 py-0.5">
              新品
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="default" className="text-xs px-2 py-0.5">
              推荐
            </Badge>
          )}
          {showInventory && (
            <Badge variant={inventoryInfo.variant} className="text-xs px-2 py-0.5">
              {inventoryInfo.label}
            </Badge>
          )}
          {!product.isActive && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              停售
            </Badge>
          )}
        </div>

        {/* 产品基本信息 */}
        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3 flex-1">
          {/* 产品型号 */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-sm sm:text-base font-semibold text-gray-900 truncate">
              {product.partNumber}
            </span>
            {showCategory && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                {product.category.name}
              </span>
            )}
          </div>

          {/* 品牌 */}
          {showBrand && (
            <div className="text-xs sm:text-sm text-gray-500">
              {product.brand.name}
            </div>
          )}

          {/* 产品标题 */}
          <h3 className="text-sm sm:text-base font-medium line-clamp-2 text-gray-800 leading-tight">
            {product.title}
          </h3>

          {/* 简短描述 */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-tight">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* 价格和操作区域 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 sm:pt-3 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            {basePrice ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-bold text-blue-600">
                    {currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : ''}
                    {basePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">起</span>
                </div>
                {product.pricing!.tiers.length > 1 && (
                  <span className="text-xs text-gray-500">
                    {product.pricing!.tiers[0].quantity}+ 件
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">询价</span>
            )}
          </div>

          <div className="flex gap-1.5 sm:gap-1">
            <Button
              size="sm"
              variant="outline"
              className="text-xs px-3 py-2 h-8 sm:h-7 flex-1 sm:flex-initial"
              asChild
            >
              <Link href={productDetailUrl}>
                详情
              </Link>
            </Button>

            {showCompare && onAddToCompare && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToCompare(product.id)}
                className="text-xs px-2 py-2 h-8 w-8 sm:h-7 sm:w-7"
                title="添加到比较"
              >
                <ArrowLeftRight className="h-3 w-3" />
              </Button>
            )}

            {inventoryStatus === 'in_stock' && (
              <QuickInquiry
                productId={product.id}
                productName={product.partNumber}
                className="text-xs px-3 py-2 h-8 sm:h-7 flex-1 sm:flex-initial"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
