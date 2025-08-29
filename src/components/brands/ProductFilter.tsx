'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useProductData } from '@/hooks/useProductData';

interface FilterColumn {
  key: string;
  name: string;
  type: 'select' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

interface Product {
  id: string;
  partNumber: string;
  description: string;
  brand: string;
  category: string;
  parameters: Record<string, string>;
  package: string;
  datasheet?: string;
  price?: string;
  stock?: number;
  image?: string;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  features: string[];
  applications: string[];
  filterColumns: FilterColumn[];
  products: Product[];
}

interface ProductFilterProps {
  brandSlug: string;
  brandName: string;
  categoryData: CategoryData;
}

export default function ProductFilter({ brandSlug, brandName, categoryData }: ProductFilterProps) {
  const locale = useLocale();
  const { products: dynamicProducts, filterColumns: dynamicColumns, loadStoredData } = useProductData();
  
  // 筛选状态
  const [filters, setFilters] = useState<Record<string, string | [number, number]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('partNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 加载存储的产品数据
  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  // 合并静态数据和动态数据
  const allProducts = useMemo(() => {
    const categoryProducts = dynamicProducts.length > 0 
      ? dynamicProducts.filter(p => p.category === categoryData.id)
      : categoryData.products;
    return categoryProducts;
  }, [dynamicProducts, categoryData.products, categoryData.id]);

  // 合并筛选列配置
  const allFilterColumns = useMemo(() => {
    return dynamicColumns.length > 0 ? dynamicColumns : categoryData.filterColumns;
  }, [dynamicColumns, categoryData.filterColumns]);

  // 筛选逻辑
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // 应用文本搜索
    if (searchQuery) {
      result = result.filter(product => 
        product.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 应用筛选条件
    result = result.filter(product => {
      return Object.entries(filters).every(([key, value]) => {
        const productValue = product.parameters[key];
        if (!productValue) return true;

        if (Array.isArray(value)) {
          // 范围筛选
          const numValue = parseFloat(productValue);
          return numValue >= value[0] && numValue <= value[1];
        } else {
          // 选项筛选
          return !value || productValue === value;
        }
      });
    });

    // 排序
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'partNumber':
          aValue = a.partNumber;
          bValue = b.partNumber;
          break;
        case 'price':
          aValue = parseFloat(a.price?.replace('¥', '') || '0');
          bValue = parseFloat(b.price?.replace('¥', '') || '0');
          break;
        case 'stock':
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        default:
          aValue = a.parameters[sortBy] || '';
          bValue = b.parameters[sortBy] || '';
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return result;
  }, [allProducts, filters, searchQuery, sortBy, sortOrder]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 更新筛选条件
  const updateFilter = useCallback((key: string, value: string | [number, number]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // 重置到第一页
  }, []);

  // 清除筛选条件
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // 导出Excel功能
  const exportToExcel = useCallback(() => {
    const csvContent = [
      // 表头
      ['型号', '描述', '封装', '价格', '库存', ...allFilterColumns.map(col => col.name)].join(','),
      // 数据行
      ...filteredProducts.map(product => [
        product.partNumber,
        `"${product.description}"`,
        product.package,
        product.price || '',
        product.stock || '',
        ...allFilterColumns.map(col => product.parameters[col.key] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${brandName}_${categoryData.name}_产品清单.csv`;
    link.click();
  }, [filteredProducts, brandName, categoryData, allFilterColumns]);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {brandName} {categoryData.name}
              </h1>
              <p className="text-lg text-gray-600">{categoryData.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                导出Excel
              </button>
              <Link
                href={`/${locale}/contact?subject=${categoryData.name}选型咨询`}
                className="inline-flex items-center px-4 py-2 border-2 border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                选型咨询
              </Link>
            </div>
          </div>

          {/* Category Features & Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">产品特性</h3>
              <div className="flex flex-wrap gap-2">
                {categoryData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">应用领域</h3>
              <div className="flex flex-wrap gap-2">
                {categoryData.applications.map((app, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">产品筛选</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清除所有筛选
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  placeholder="搜索型号或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allFilterColumns.map((column) => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {column.name}
                  </label>
                  
                  {column.type === 'select' ? (
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={filters[column.key] as string || ''}
                      onChange={(e) => updateFilter(column.key, e.target.value)}
                    >
                      <option value="">全部</option>
                      {column.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{column.min}{column.unit}</span>
                        <span>-</span>
                        <span>{column.max}{column.unit}</span>
                      </div>
                      <input
                        type="range"
                        min={column.min}
                        max={column.max}
                        step={column.max > 100 ? 10 : 1}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          updateFilter(column.key, [column.min!, value]);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                找到 <span className="font-semibold text-gray-900">{filteredProducts.length}</span> 个产品
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">每页显示:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">排序:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="partNumber">型号</option>
                    <option value="price">价格</option>
                    <option value="stock">库存</option>
                    {allFilterColumns.map((col) => (
                      <option key={col.key} value={col.key}>{col.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品型号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  {allFilterColumns.slice(0, 4).map((column) => (
                    <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.name}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    封装
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              {product.partNumber.substring(0, 3)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.partNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    {allFilterColumns.slice(0, 4).map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.parameters[column.key] || '-'}
                        {column.unit && product.parameters[column.key] ? column.unit : ''}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-red-600">
                        {product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 100 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 10 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {product.datasheet && (
                          <a
                            href={product.datasheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            title="下载规格书"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </a>
                        )}
                        <Link
                          href={`/${locale}/contact?subject=询价 ${product.partNumber}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="询价"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, filteredProducts.length)}
                    </span>{' '}
                    条，共 <span className="font-medium">{filteredProducts.length}</span> 条记录
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNumber = Math.max(1, currentPage - 2) + index;
                    if (pageNumber > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? 'text-primary-600 bg-primary-50 border border-primary-300'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            需要选型帮助？
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            我们的专业FAE团队可以帮助您选择最适合的{categoryData.name}产品，
            提供详细的参数对比和应用建议。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact?subject=${categoryData.name}选型咨询`}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              联系FAE
            </Link>
            <Link
              href={`/${locale}/brands/${brandSlug}/support`}
              className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              技术文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}