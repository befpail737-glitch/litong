'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Sample product data - would come from API/CMS in real app
const sampleProducts = [
  {
    id: '1',
    name: 'STM32F407VGT6',
    brand: 'STMicroelectronics',
    category: 'microcontrollers',
    package: 'LQFP100',
    description: '32位ARM Cortex-M4微控制器，168MHz，1MB Flash，192KB RAM',
    specifications: [
      { parameter: '内核', value: 'ARM Cortex-M4', unit: '' },
      { parameter: '主频', value: '168', unit: 'MHz' },
      { parameter: 'Flash', value: '1', unit: 'MB' },
      { parameter: 'RAM', value: '192', unit: 'KB' },
      { parameter: '工作电压', value: '1.8-3.6', unit: 'V' },
      { parameter: '工作温度', value: '-40 to +85', unit: '°C' }
    ],
    price: 25.50,
    stock: 1000,
    datasheet: '/datasheets/STM32F407VGT6.pdf',
    image: '/images/products/stm32f407vgt6.jpg'
  },
  {
    id: '2', 
    name: 'TPS54360DDA',
    brand: 'Texas Instruments',
    category: 'power-management',
    package: 'HSOP8',
    description: '3.5V至60V输入、3.5A同步降压转换器',
    specifications: [
      { parameter: '输入电压', value: '3.5-60', unit: 'V' },
      { parameter: '输出电流', value: '3.5', unit: 'A' },
      { parameter: '效率', value: '95', unit: '%' },
      { parameter: '开关频率', value: '500', unit: 'kHz' },
      { parameter: '工作温度', value: '-40 to +125', unit: '°C' }
    ],
    price: 8.20,
    stock: 500,
    datasheet: '/datasheets/TPS54360DDA.pdf',
    image: '/images/products/tps54360dda.jpg'
  },
  {
    id: '3',
    name: 'MAX3232ESE',
    brand: 'Maxim Integrated', 
    category: 'interface-ics',
    package: 'SOIC16',
    description: '3.0V至5.5V多通道RS-232线路驱动器/接收器',
    specifications: [
      { parameter: '电源电压', value: '3.0-5.5', unit: 'V' },
      { parameter: '通道数', value: '2', unit: 'ch' },
      { parameter: '数据速率', value: '250', unit: 'kbps' },
      { parameter: '工作温度', value: '0 to +70', unit: '°C' }
    ],
    price: 12.80,
    stock: 800,
    datasheet: '/datasheets/MAX3232ESE.pdf',
    image: '/images/products/max3232ese.jpg'
  }
];

export default function ProductsList() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  
  // Filter products based on search params
  const filteredProducts = sampleProducts.filter(product => {
    // Category filter
    const category = searchParams.get('category');
    if (category) {
      if (!category.split(',').includes(product.category)) return false;
    }
    
    // Brand filter
    const brand = searchParams.get('brand');
    if (brand) {
      const brands = brand.split(',');
      const brandSlug = product.brand.toLowerCase().replace(/\s+/g, '-');
      if (!brands.includes(brandSlug)) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'stock':
        return b.stock - a.stock;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            产品结果 ({filteredProducts.length})
          </h2>
          <p className="text-sm text-gray-500">
            {filteredProducts.length > 0 
              ? `显示 1-${Math.min(20, filteredProducts.length)} 个产品，共 ${filteredProducts.length} 个`
              : '未找到匹配的产品'
            }
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="name">按名称排序</option>
            <option value="price-low">价格低到高</option>
            <option value="price-high">价格高到低</option>
            <option value="stock">按库存排序</option>
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'list'
                  ? 'bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zM3 11h18v2H3zM3 17h18v2H3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到产品</h3>
          <p className="mt-1 text-sm text-gray-500">请调整筛选条件或搜索其他产品。</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {sortedProducts.map((product) => (
            <div key={product.id} className={`group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-200 ${
              viewMode === 'list' ? 'flex p-4' : 'overflow-hidden'
            }`}>
              {/* Product Image */}
              <div className={`${
                viewMode === 'list' 
                  ? 'flex-shrink-0 w-24 h-24' 
                  : 'aspect-square bg-gray-100'
              } flex items-center justify-center`}>
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>

              {/* Product Info */}
              <div className={viewMode === 'list' ? 'ml-4 flex-1' : 'p-4'}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link 
                      href={`/${locale}/products/${product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">¥{product.price.toFixed(2)}</div>
                    <div className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `现货${product.stock}` : '缺货'}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Key Specifications */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.specifications.slice(0, 3).map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {spec.parameter}: {spec.value}{spec.unit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      href={`/${locale}/products/${product.id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      查看详情
                    </Link>
                    {product.datasheet && (
                      <a
                        href={product.datasheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        规格书
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors">
                      询价
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 20 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              上一页
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              下一页
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">20</span> 个结果，共{' '}
                <span className="font-medium">{filteredProducts.length}</span> 个
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">上一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  2
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">下一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}