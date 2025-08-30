'use client'

import { useState } from 'react'
import { useProductData } from '@/hooks/useProductData'
import ExcelUploader from '@/components/admin/ExcelUploader'

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { uploadToSanity } = useProductData()

  // 创建测试文章数据
  const createTestArticle = async () => {
    setIsLoading(true)
    
    const testArticle = {
      title: "STM32微控制器开发指南",
      titleEn: "STM32 Microcontroller Development Guide",
      summary: "本指南将介绍如何使用STM32微控制器进行嵌入式开发，包括开发环境搭建、程序编写和调试技巧。",
      content: "STM32是意法半导体推出的基于ARM Cortex-M内核的32位微控制器系列。本文将详细介绍STM32的特性、开发工具链的使用、以及实际项目开发中的最佳实践。\n\n## 主要特性\n\n1. **高性能ARM Cortex-M内核**：支持多种内核类型，从低功耗的Cortex-M0+到高性能的Cortex-M7\n2. **丰富的外设接口**：包括UART、SPI、I2C、CAN、USB等通信接口\n3. **灵活的时钟系统**：支持多种时钟源和灵活的时钟配置\n4. **低功耗特性**：多种低功耗模式，适合电池供电应用\n\n## 开发环境\n\n推荐使用STM32CubeIDE作为主要开发环境，它集成了代码生成、编译、调试等功能。",
      category: "technical"
    }

    try {
      const result = await uploadToSanity([testArticle], 'solutions')
      setTestResults(prev => [...prev, {
        type: 'article_upload',
        status: 'success',
        data: result,
        timestamp: new Date().toLocaleString()
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'article_upload',
        status: 'error',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toLocaleString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 创建测试品牌数据
  const createTestBrand = async () => {
    setIsLoading(true)
    
    const testBrand = {
      name: "意法半导体",
      nameEn: "STMicroelectronics",
      description: "意法半导体是全球领先的半导体公司，为各种电子应用提供创新的半导体解决方案。",
      website: "https://www.st.com",
      country: "意大利",
      founded: 1987
    }

    try {
      const result = await uploadToSanity([testBrand], 'brands')
      setTestResults(prev => [...prev, {
        type: 'brand_upload',
        status: 'success',
        data: result,
        timestamp: new Date().toLocaleString()
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'brand_upload',
        status: 'error',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toLocaleString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 创建测试产品分类
  const createTestCategory = async () => {
    setIsLoading(true)
    
    const testCategory = {
      name: "微控制器",
      nameEn: "Microcontrollers",
      description: "基于ARM Cortex-M内核的32位微控制器，适用于各种嵌入式应用。"
    }

    try {
      const result = await uploadToSanity([testCategory], 'categories')
      setTestResults(prev => [...prev, {
        type: 'category_upload',
        status: 'success',
        data: result,
        timestamp: new Date().toLocaleString()
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'category_upload',
        status: 'error',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toLocaleString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcelUpload = (result: any) => {
    setTestResults(prev => [...prev, {
      type: 'excel_upload',
      status: 'success',
      data: result,
      timestamp: new Date().toLocaleString()
    }])
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 后台管理测试中心
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 测试操作面板 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">测试操作</h2>
              
              <div className="space-y-4">
                <button
                  onClick={createTestArticle}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isLoading ? '上传中...' : '上传测试文章'}
                </button>

                <button
                  onClick={createTestBrand}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {isLoading ? '上传中...' : '上传测试品牌'}
                </button>

                <button
                  onClick={createTestCategory}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {isLoading ? '上传中...' : '上传测试分类'}
                </button>

                <button
                  onClick={clearResults}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  清除结果
                </button>
              </div>

              {/* Excel 上传测试 */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Excel上传测试</h3>
                <ExcelUploader
                  onUploadComplete={handleExcelUpload}
                  showSanityUpload={true}
                />
              </div>
            </div>

            {/* 测试结果面板 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">测试结果</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center">暂无测试结果</p>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        result.status === 'success' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-gray-700">
                            {result.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.timestamp}
                          </span>
                        </div>
                        
                        {result.status === 'success' ? (
                          <div className="text-green-800">
                            <div className="flex items-center mb-1">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              成功
                            </div>
                            <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div className="text-red-800">
                            <div className="flex items-center mb-1">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              失败
                            </div>
                            <p className="text-sm">{result.error}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">快速链接</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/zh/admin"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                管理面板
              </a>
              <a
                href="/zh/admin/products"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                产品管理
              </a>
              <a
                href="/zh/brands"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                品牌页面
              </a>
              <a
                href="/zh"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                前台主页
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}