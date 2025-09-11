'use client';

import { useState, useEffect } from 'react';

import { X, ArrowLeftRight, Scale, Star, CheckCircle, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface Product {
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
  specifications?: Array<{
    name: string
    value: string
    unit?: string
    category: string
  }>
  inventory?: {
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
    quantity?: number
  }
  isNew?: boolean
  isFeatured?: boolean
  isActive?: boolean
}

interface ProductCompareProps {
  products: Product[]
  onRemoveProduct: (productId: string) => void
  onClose: () => void
  className?: string
}

// 产品规格比较分类
const specCategories = {
  basic: '基本参数',
  electrical: '电气参数',
  mechanical: '机械参数',
  environmental: '环境参数',
  performance: '性能参数',
};

export function ProductCompare({ products, onRemoveProduct, onClose, className }: ProductCompareProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set(products.map(p => p.id)));

  // 获取所有规格项目的并集
  const allSpecs = Array.from(
    new Set(
      products.flatMap(product =>
        product.specifications?.map(spec => `${spec.category}-${spec.name}`) || []
      )
    )
  ).sort();

  const getSpecValue = (product: Product, specKey: string) => {
    const [category, name] = specKey.split('-', 2);
    const spec = product.specifications?.find(s => s.category === category && s.name === name);
    return spec ? `${spec.value}${spec.unit || ''}` : '-';
  };

  const getSpecsByCategory = (category: string) => {
    return allSpecs.filter(spec => spec.startsWith(category + '-'));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectedProductsList = products.filter(p => selectedProducts.has(p.id));

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无产品比较</h3>
        <p className="text-gray-600">请先添加产品到比较列表</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 比较工具栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            产品比较 ({products.length} 个产品)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setSelectedProducts(new Set(products.map(p => p.id)))}>
            全选
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedProducts(new Set())}>
            清空
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 产品比较表格 */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* 产品基本信息行 */}
          <Card className="mb-4">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-x" style={{gridTemplateColumns: `200px repeat(${products.length}, 1fr)`}}>
                {/* 标题列 */}
                <div className="p-4 bg-gray-50 font-semibold">
                  产品信息
                </div>

                {/* 产品列 */}
                {products.map((product) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* 产品图片 */}
                      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
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

                      {/* 产品信息 */}
                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.isNew && <Badge variant="success" className="text-xs">新品</Badge>}
                          {product.isFeatured && <Badge variant="default" className="text-xs">推荐</Badge>}
                        </div>

                        <h3 className="font-semibold text-sm mb-1">{product.partNumber}</h3>
                        <p className="text-xs text-gray-600 mb-1">{product.brand.name}</p>
                        <p className="text-xs text-gray-700 line-clamp-2 mb-2">{product.title}</p>

                        {product.pricing && (
                          <div className="text-blue-600 font-semibold">
                            ¥{product.pricing.tiers[0]?.price.toFixed(2)}
                            <span className="text-xs text-gray-500 ml-1">起</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 规格比较表格 */}
          {Object.entries(specCategories).map(([category, categoryName]) => {
            const categorySpecs = getSpecsByCategory(category);
            if (categorySpecs.length === 0) return null;

            return (
              <Card key={category} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">{categoryName}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {categorySpecs.map((specKey) => {
                    const specName = specKey.split('-')[1];
                    const specValues = products.map(product => getSpecValue(product, specKey));
                    const hasVariation = new Set(specValues.filter(v => v !== '-')).size > 1;

                    return (
                      <div
                        key={specKey}
                        className="grid divide-x border-b last:border-b-0"
                        style={{gridTemplateColumns: `200px repeat(${products.length}, 1fr)`}}
                      >
                        <div className={`p-3 bg-gray-50 text-sm font-medium ${hasVariation ? 'bg-yellow-50' : ''}`}>
                          {specName}
                          {hasVariation && (
                            <span className="ml-2 text-orange-500" title="规格存在差异">
                              <Star className="h-3 w-3 inline" />
                            </span>
                          )}
                        </div>

                        {products.map((product, index) => {
                          const value = getSpecValue(product, specKey);
                          const isSelected = selectedProducts.has(product.id);

                          return (
                            <div
                              key={product.id}
                              className={`p-3 text-sm ${!isSelected ? 'opacity-50 bg-gray-100' : ''} ${hasVariation ? 'bg-yellow-50' : ''}`}
                            >
                              <span className={hasVariation && value !== '-' ? 'font-medium' : ''}>
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}

          {/* 比较结果摘要 */}
          {selectedProductsList.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  比较摘要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">价格比较</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProductsList
                        .filter(p => p.pricing?.tiers[0]?.price)
                        .sort((a, b) => (a.pricing!.tiers[0]!.price) - (b.pricing!.tiers[0]!.price))
                        .map((product, index) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <span className="text-sm">
                              {index === 0 && <Badge variant="success" className="mr-2 text-xs">最便宜</Badge>}
                              {product.partNumber}
                            </span>
                            <span className="font-semibold text-blue-600">
                              ¥{product.pricing!.tiers[0]!.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">推荐理由</h4>
                    <div className="space-y-2">
                      {selectedProductsList.map((product) => (
                        <div key={product.id} className="text-sm">
                          <span className="font-medium">{product.partNumber}：</span>
                          {product.isNew && '新品推荐、'}
                          {product.isFeatured && '热门产品、'}
                          {product.inventory?.status === 'in_stock' && '现货供应、'}
                          适合相应应用场景
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
