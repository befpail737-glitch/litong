'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { getSolutions } from '@/lib/sanity'

interface Solution {
  _id: string
  title: string
  titleEn?: string
  summary: string
  content: string
  category: string
  tags?: string[]
  author?: string
  publishDate: string
  _createdAt: string
  _updatedAt: string
  slug?: {
    current: string
  }
}

export default function SolutionsPage() {
  const t = useTranslations()
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'technical', label: '技术方案' },
    { value: 'application', label: '应用案例' },
    { value: 'selection', label: '选型指南' },
    { value: 'troubleshooting', label: '问题解决' }
  ]

  useEffect(() => {
    loadSolutions()
  }, [])

  const loadSolutions = async () => {
    try {
      setLoading(true)
      const data = await getSolutions()
      setSolutions(data)
    } catch (error) {
      console.error('Failed to load solutions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSolutions = selectedCategory === 'all' 
    ? solutions 
    : solutions.filter(solution => solution.category === selectedCategory)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            技术解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专业的技术指导与应用案例，助力您的项目成功
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        {filteredSolutions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h30m-30 4h30m-30 4h30m-30 4h30" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无解决方案</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' ? '还没有发布任何解决方案' : '该分类下暂无内容'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSolutions.map((solution) => (
              <article
                key={solution._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* 分类标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {categories.find(cat => cat.value === solution.category)?.label || solution.category}
                    </span>
                    <time className="text-sm text-gray-500">
                      {formatDate(solution.publishDate || solution._createdAt)}
                    </time>
                  </div>

                  {/* 标题 */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200">
                    <a href={solution.slug ? `/zh/solutions/${solution.slug.current}` : '#'}>
                      {solution.title}
                    </a>
                  </h2>

                  {/* 摘要 */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {truncateContent(solution.summary)}
                  </p>

                  {/* 标签 */}
                  {solution.tags && solution.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {solution.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 作者信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500">
                        {solution.author || '立通电子'}
                      </div>
                    </div>
                    <a
                      href={solution.slug ? `/zh/solutions/${solution.slug.current}` : '#'}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      阅读更多
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        {solutions.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              共找到 <span className="font-medium text-gray-900">{filteredSolutions.length}</span> 个解决方案
              {selectedCategory !== 'all' && (
                <span>
                  ，分类：<span className="font-medium text-blue-600">
                    {categories.find(cat => cat.value === selectedCategory)?.label}
                  </span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}