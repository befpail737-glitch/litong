'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Heart, ShoppingCart, ArrowLeftRight, Trash2, ArrowLeft } from 'lucide-react';

import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WishlistButton, wishlistUtils } from '@/components/wishlist/WishlistButton';

// 模拟产品数据（实际应用中应该从API获取）
const mockProductsData = {
  '1': {
    id: '1',
    partNumber: 'STM32F401RET6',
    title: 'STM32F401RET6 ARM Cortex-M4 微控制器',
    shortDescription: '84MHz ARM Cortex-M4 内核，512KB Flash，96KB SRAM',
    image: '/images/products/stm32f401.jpg',
    brand: { name: 'STMicroelectronics', slug: 'stmicroelectronics' },
    category: { name: '微控制器', slug: 'microcontrollers' },
    pricing: {
      tiers: [{ quantity: 1, price: 25.50 }],
      currency: 'CNY'
    },
    inventory: { status: 'in_stock' as const },
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  '2': {
    id: '2',
    partNumber: 'STM32F103C8T6',
    title: 'STM32F103C8T6 ARM Cortex-M3 微控制器',
    shortDescription: '72MHz ARM Cortex-M3 内核，64KB Flash，20KB SRAM',
    brand: { name: 'STMicroelectronics', slug: 'stmicroelectronics' },
    category: { name: '微控制器', slug: 'microcontrollers' },
    pricing: {
      tiers: [{ quantity: 1, price: 18.80 }],
      currency: 'CNY'
    },
    inventory: { status: 'in_stock' as const },
    isActive: true,
  },
  '3': {
    id: '3',
    partNumber: 'ESP32-WROOM-32',
    title: 'ESP32-WROOM-32 WiFi+蓝牙模块',
    shortDescription: '双核240MHz，WiFi+蓝牙，4MB Flash',
    brand: { name: 'Espressif', slug: 'espressif' },
    category: { name: '无线模块', slug: 'wireless-modules' },
    pricing: {
      tiers: [{ quantity: 1, price: 32.00 }],
      currency: 'CNY'
    },
    inventory: { status: 'low_stock' as const },
    isFeatured: true,
    isActive: true,
  }
};

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 获取心愿单
    const wishlist = wishlistUtils.getWishlist();
    setWishlistIds(wishlist);

    // 监听心愿单更新
    const handleWishlistUpdate = () => {
      const updatedWishlist = wishlistUtils.getWishlist();
      setWishlistIds(updatedWishlist);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const wishlistProducts = wishlistIds
    .map(id => mockProductsData[id as keyof typeof mockProductsData])
    .filter(Boolean);

  const selectedProducts = Array.from(selectedIds)
    .map(id => mockProductsData[id as keyof typeof mockProductsData])
    .filter(Boolean);

  const handleSelectProduct = (productId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === wishlistProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(wishlistProducts.map(p => p.id)));
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach(id => {
      wishlistUtils.removeFromWishlist(id);
    });
    setSelectedIds(new Set());
  };

  const handleAddToCompare = (productId: string) => {
    setCompareIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else if (newSet.size < 4) { // 限制比较数量
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleCompareProducts = () => {
    if (compareIds.size >= 2) {
      const compareUrl = `/products/compare?ids=${Array.from(compareIds).join(',')}`;
      router.push(compareUrl);
    }
  };

  const handleBulkInquiry = () => {
    if (selectedIds.size > 0) {
      // 这里可以跳转到询价页面，并预填产品信息
      const productParams = Array.from(selectedIds).map(id => `product=${id}`).join('&');
      router.push(`/inquiry?${productParams}`);
    }
  };

  const handleClearWishlist = () => {
    if (confirm('确定要清空心愿单吗？')) {
      wishlistUtils.clearWishlist();
      setSelectedIds(new Set());
      setCompareIds(new Set());
    }
  };

  const totalValue = selectedProducts.reduce((sum, product) => {
    return sum + (product.pricing?.tiers[0]?.price || 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的心愿单</h1>
              <p className="text-gray-600 mt-1">
                保存感兴趣的产品，随时查看和比较
              </p>
            </div>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-3 py-1">
          {wishlistProducts.length} 个产品
        </Badge>
      </div>

      {wishlistProducts.length === 0 ? (
        /* 空状态 */
        <Card>
          <CardContent className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">心愿单为空</h3>
            <p className="text-gray-600 mb-6">
              浏览产品时点击心形图标，就能将产品添加到心愿单
            </p>
            <Button onClick={() => router.push('/products')}>
              去逛逛
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 操作工具栏 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.size === wishlistProducts.length && wishlistProducts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  全选 ({selectedIds.size}/{wishlistProducts.length})
                </span>
              </div>

              {selectedIds.size > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleRemoveSelected}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除选中 ({selectedIds.size})
                  </Button>

                  <Button size="sm" onClick={handleBulkInquiry}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    批量询价
                  </Button>

                  {selectedIds.size > 0 && (
                    <div className="text-sm text-gray-600">
                      选中商品总价: <span className="font-semibold text-blue-600">¥{totalValue.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {compareIds.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompareProducts}
                  disabled={compareIds.size < 2}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  比较 ({compareIds.size}/4)
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={handleClearWishlist}>
                清空心愿单
              </Button>
            </div>
          </div>

          {/* 产品列表 */}
          <div className="space-y-4">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* 选择框 */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToCompare(product.id)}
                        className={`h-8 w-8 p-0 ${compareIds.has(product.id) ? 'bg-blue-50 text-blue-600' : ''}`}
                        disabled={!compareIds.has(product.id) && compareIds.size >= 4}
                        title="添加到比较"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* 产品信息 */}
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      {/* 产品图片和基本信息 */}
                      <div className="md:col-span-2 flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="text-2xl text-gray-300">📱</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex flex-wrap gap-1 mb-1">
                                {product.isNew && <Badge variant="success" className="text-xs">新品</Badge>}
                                {product.isFeatured && <Badge variant="default" className="text-xs">推荐</Badge>}
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{product.partNumber}</h3>
                              <p className="text-sm text-gray-600 mb-1">{product.brand.name}</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{product.title}</p>
                            </div>
                            <WishlistButton
                              productId={product.id}
                              productName={product.partNumber}
                              size="sm"
                              variant="ghost"
                              showText={false}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 价格 */}
                      <div className="flex items-center">
                        {product.pricing && (
                          <div>
                            <div className="text-xl font-bold text-blue-600">
                              ¥{product.pricing.tiers[0]?.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">起订价</div>
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/products/${product.id}`}>
                            查看详情
                          </a>
                        </Button>
                        <Button size="sm">
                          立即询价
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
