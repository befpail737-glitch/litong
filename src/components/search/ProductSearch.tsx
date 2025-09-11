'use client';

import { useState, useMemo } from 'react';

import { Filter, SortAsc, SortDesc, Grid, List, Settings } from 'lucide-react';

import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllBrands } from '@/data/brands';
import { mockProducts, searchProducts, productCategories, type Product } from '@/data/products';

import { AdvancedFilter } from './AdvancedFilter';
import { SearchBox } from './SearchBox';

interface ProductSearchProps {
  initialProducts?: Product[]
  showFilters?: boolean
}

export function ProductSearch({
  initialProducts = mockProducts,
  showFilters = true
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const brands = getAllBrands();

  const filteredAndSortedProducts = useMemo(() => {
    // Search and filter
    const results = searchProducts(initialProducts, searchQuery, {
      brand: selectedBrand || undefined,
      category: selectedCategory || undefined,
      priceRange: priceRange[0] > 0 || priceRange[1] < 1000 ? priceRange : undefined,
      inStock: inStockOnly
    });

    // Sort
    results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = (a.pricing.tiers[0]?.price || 0) - (b.pricing.tiers[0]?.price || 0);
          break;
        case 'brand':
          comparison = a.brand.name.localeCompare(b.brand.name);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  }, [initialProducts, searchQuery, selectedBrand, selectedCategory, priceRange, inStockOnly, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setInStockOnly(false);
  };

  const activeFiltersCount = [
    searchQuery,
    selectedBrand,
    selectedCategory,
    inStockOnly,
    priceRange[0] > 0 || priceRange[1] < 1000
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="搜索产品型号、品牌或描述..."
      />

      {/* Filters and Controls */}
      {showFilters && (
        <div className="space-y-4">
          {/* Main Filter Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Brand Filter */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="选择品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有品牌</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.slug}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有分类</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                高级筛选
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={handleClearFilters}>
                  清除筛选
                </Button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'brand') => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">按名称</SelectItem>
                    <SelectItem value="price">按价格</SelectItem>
                    <SelectItem value="brand">按品牌</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <AdvancedFilter
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={setInStockOnly}
            />
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          找到 <span className="font-medium text-gray-900">{filteredAndSortedProducts.length}</span> 个产品
          {searchQuery && (
            <span> 搜索："<span className="font-medium">{searchQuery}</span>"</span>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关产品</h3>
          <p className="text-gray-600 mb-4">
            尝试调整搜索条件或清除筛选条件
          </p>
          <Button onClick={handleClearFilters}>
            清除所有筛选
          </Button>
        </div>
      )}
    </div>
  );
}
