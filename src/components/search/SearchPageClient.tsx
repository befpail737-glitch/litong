'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedSearchBox } from '@/components/search/EnhancedSearchBox';
import { Search, Filter, Grid, List, ChevronDown, Package, Building2, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchPageClientProps {
  locale: string;
}

// Mock search results - 在实际应用中应该从API获取
const mockSearchResults = {
  products: [
    {
      id: '1',
      name: 'C3M0065090D SiC MOSFET',
      partNumber: 'C3M0065090D',
      brand: 'Wolfspeed',
      description: '650V 90mΩ Silicon Carbide Power MOSFET',
      price: '询价',
      image: '/images/products/sic-mosfet.jpg',
      category: 'SiC功率器件',
      inStock: true,
      url: '/zh-CN/products/c3m0065090d'
    },
    {
      id: '2',
      name: 'LA 25-P 电流传感器',
      partNumber: 'LA 25-P',
      brand: 'LEM',
      description: '±25A 闭环霍尔效应电流传感器',
      price: '询价',
      image: '/images/products/current-sensor.jpg',
      category: '电流传感器',
      inStock: true,
      url: '/zh-CN/products/la25-p'
    },
    {
      id: '3',
      name: 'STM32F407VGT6',
      partNumber: 'STM32F407VGT6',
      brand: 'STMicroelectronics',
      description: '168MHz ARM Cortex-M4F 微控制器',
      price: '询价',
      image: '/images/products/stm32.jpg',
      category: '微控制器',
      inStock: true,
      url: '/zh-CN/products/stm32f407vgt6'
    }
  ],
  brands: [
    {
      id: '1',
      name: 'Wolfspeed',
      description: 'SiC功率半导体领导者',
      productCount: 1200,
      image: '/images/brands/wolfspeed-logo.png',
      url: '/zh-CN/brands/cree'
    },
    {
      id: '2',
      name: 'LEM',
      description: '电流电压传感器专家',
      productCount: 850,
      image: '/images/brands/lem-logo.png',
      url: '/zh-CN/brands/lem'
    }
  ],
  articles: [
    {
      id: '1',
      title: 'SiC MOSFET在电动汽车中的应用',
      excerpt: '探讨碳化硅MOSFET在电动汽车逆变器中的优势和应用案例',
      publishedAt: '2024-01-15',
      category: '技术文章',
      url: '/zh-CN/articles/sic-mosfet-ev-application'
    },
    {
      id: '2',
      title: '霍尔效应电流传感器原理与选型',
      excerpt: '详细介绍霍尔效应电流传感器的工作原理和选型要点',
      publishedAt: '2024-01-10',
      category: '技术文章',
      url: '/zh-CN/articles/hall-current-sensor-guide'
    }
  ]
};

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  if (!q) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索</h3>
        <p className="text-gray-500">输入产品型号、品牌或关键词进行搜索</p>

        {/* 热门搜索建议 */}
        <div className="mt-8 max-w-md mx-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-4">热门搜索</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {['STM32', 'ESP32', 'SiC MOSFET', '电流传感器', 'LEM', 'Cree'].map((term, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const results = mockSearchResults;
  const totalResults = results.products.length + results.brands.length + results.articles.length;

  return (
    <div>
      {/* Search Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            搜索结果
          </h2>
          <p className="text-gray-600">
            为 "<span className="font-medium text-gray-900">{q}</span>" 找到 {totalResults} 个结果
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="relevance">相关性排序</option>
            <option value="name">名称排序</option>
            <option value="brand">品牌排序</option>
          </select>

          <div className="flex border border-gray-200 rounded-lg">
            <button className="p-2 text-blue-600 bg-blue-50 rounded-l-lg">
              <Grid className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-r-lg">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button className={`py-2 px-1 border-b-2 font-medium text-sm ${
            type === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
            全部 ({totalResults})
          </button>
          <button className={`py-2 px-1 border-b-2 font-medium text-sm ${
            type === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
            产品 ({results.products.length})
          </button>
          <button className={`py-2 px-1 border-b-2 font-medium text-sm ${
            type === 'brands'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
            品牌 ({results.brands.length})
          </button>
          <button className={`py-2 px-1 border-b-2 font-medium text-sm ${
            type === 'articles'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
            文章 ({results.articles.length})
          </button>
        </nav>
      </div>

      {/* Products Section */}
      {(type === 'all' || type === 'products') && results.products.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">产品</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.products.map((product) => (
              <Link
                key={product.id}
                href={product.url}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.brand} • {product.partNumber}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {product.price}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? '有货' : '缺货'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Brands Section */}
      {(type === 'all' || type === 'brands') && results.brands.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">品牌</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.brands.map((brand) => (
              <Link
                key={brand.id}
                href={brand.url}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {brand.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {brand.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {brand.productCount.toLocaleString()} 个产品
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles Section */}
      {(type === 'all' || type === 'articles') && results.articles.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">技术文章</h3>
          </div>

          <div className="space-y-4">
            {results.articles.map((article) => (
              <Link
                key={article.id}
                href={article.url}
                className="group block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPageClient({ locale }: SearchPageClientProps) {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <EnhancedSearchBox
                placeholder="搜索产品型号、品牌或关键词..."
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">搜索中...</p>
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}