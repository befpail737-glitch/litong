'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, ExternalLink } from 'lucide-react'

export default function AdminProducts() {
  // 处理添加产品按钮点击，跳转到Sanity Studio
  const handleAddProduct = () => {
    // 打开Sanity Studio的产品创建页面
    window.open('/studio/structure/product;new', '_blank')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回仪表盘
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
          </div>
          <button 
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增产品
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索产品名称、型号..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {/* 产品列表 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">产品列表</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v8h-8V5h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品数据</h3>
              <p className="text-gray-600 mb-6">开始添加您的第一个产品</p>
              <button 
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                添加产品
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}