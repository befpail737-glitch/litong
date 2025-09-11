'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  FileText,
  Download,
  Star,
  User,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  Search,
  ArrowUpDown,
  Bookmark,
  Share2,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 搜索结果类型
interface SearchResult {
  id: string
  type: 'article' | 'document' | 'product'
  title: string
  excerpt: string
  url: string
  score: number
  highlights: string[]
  image?: {
    url: string
    alt: string
  }
  metadata: {
    author?: string
    authorUrl?: string
    category?: string
    categoryUrl?: string
    publishedAt?: string
    readTime?: number
    downloadCount?: number
    viewCount?: number
    tags?: string[]
    difficulty?: string
    fileSize?: number
    language?: string
    isFeatured?: boolean
  }
}

// 搜索统计
interface SearchStats {
  totalResults: number
  searchTime: number
  facets: {
    contentTypes: Array<{ type: string; count: number }>
    categories: Array<{ category: string; count: number }>
    authors: Array<{ author: string; count: number }>
    tags: Array<{ tag: string; count: number }>
    languages: Array<{ language: string; count: number }>
  }
}

interface SearchResultsProps {
  query: string
  results: SearchResult[]
  stats: SearchStats
  loading?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
  viewMode?: 'grid' | 'list'
  sortBy?: string
  onPageChange?: (page: number) => void
  onViewModeChange?: (mode: 'grid' | 'list') => void
  onSortChange?: (sort: string) => void
  onResultClick?: (result: SearchResult) => void
  onFacetClick?: (facetType: string, value: string) => void
  locale: Locale
  className?: string
}

export function SearchResults({
  query,
  results,
  stats,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 12,
  viewMode = 'list',
  sortBy = 'relevance',
  onPageChange,
  onViewModeChange,
  onSortChange,
  onResultClick,
  onFacetClick,
  locale,
  className
}: SearchResultsProps) {
  const t = useTranslations('search')
  const { dateShort, fileSize: formatFileSize } = useFormatters()
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())

  // 内容类型图标映射
  const contentTypeIcons = {
    article: FileText,
    document: Download,
    product: Star
  }

  // 内容类型颜色映射
  const contentTypeColors = {
    article: 'text-blue-600 bg-blue-100',
    document: 'text-green-600 bg-green-100',
    product: 'text-purple-600 bg-purple-100'
  }

  // 难度级别映射
  const difficultyMap = {
    beginner: { label: t('difficulty.beginner'), color: 'bg-green-100 text-green-800' },
    intermediate: { label: t('difficulty.intermediate'), color: 'bg-blue-100 text-blue-800' },
    advanced: { label: t('difficulty.advanced'), color: 'bg-orange-100 text-orange-800' },
    expert: { label: t('difficulty.expert'), color: 'bg-red-100 text-red-800' }
  }

  // 语言映射
  const languageMap: Record<string, string> = {
    'zh-CN': '中文',
    'zh-TW': '繁体中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어'
  }

  // 排序选项
  const sortOptions = [
    { value: 'relevance', label: t('sortBy.relevance'), icon: Target },
    { value: 'date', label: t('sortBy.date'), icon: Calendar },
    { value: 'popularity', label: t('sortBy.popularity'), icon: TrendingUp },
    { value: 'title', label: t('sortBy.title'), icon: ArrowUpDown }
  ]

  // 切换结果展开
  const toggleExpanded = (resultId: string) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId)
    } else {
      newExpanded.add(resultId)
    }
    setExpandedResults(newExpanded)
  }

  // 高亮搜索关键词
  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return text
    
    let highlightedText = text
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi')
      highlightedText = highlightedText.replace(
        regex, 
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      )
    })
    
    return highlightedText
  }

  // 结果项组件
  const ResultItem = ({ result }: { result: SearchResult }) => {
    const IconComponent = contentTypeIcons[result.type]
    const isExpanded = expandedResults.has(result.id)
    const contentTypeColor = contentTypeColors[result.type]

    const handleClick = () => {
      onResultClick?.(result)
    }

    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-300",
        viewMode === 'list' && "flex flex-row"
      )}>
        <div className={cn(
          "relative",
          viewMode === 'grid' ? "aspect-video" : "w-48 flex-shrink-0"
        )}>
          {result.image?.url ? (
            <Image
              src={result.image.url}
              alt={result.image.alt || result.title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center rounded-t-lg",
              contentTypeColor
            )}>
              <IconComponent className="w-12 h-12" />
            </div>
          )}

          {/* 内容类型标识 */}
          <Badge className={cn("absolute top-2 left-2", contentTypeColor)}>
            <IconComponent className="w-3 h-3 mr-1" />
            {t(`contentTypes.${result.type}`)}
          </Badge>

          {/* 特色标识 */}
          {result.metadata.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              {t('featured')}
            </Badge>
          )}

          {/* 相关性评分 */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.round(result.score * 100)}%
          </div>
        </div>

        <div className="flex-1">
          <CardHeader className={cn(viewMode === 'list' && "py-4")}>
            <div className="flex items-center gap-2 mb-2">
              {result.metadata.category && (
                <Badge variant="outline">
                  {result.metadata.category}
                </Badge>
              )}
              
              {result.metadata.difficulty && (
                <Badge className={difficultyMap[result.metadata.difficulty as keyof typeof difficultyMap]?.color}>
                  {difficultyMap[result.metadata.difficulty as keyof typeof difficultyMap]?.label}
                </Badge>
              )}
              
              {result.metadata.language && (
                <Badge variant="secondary">
                  {languageMap[result.metadata.language] || result.metadata.language}
                </Badge>
              )}
            </div>

            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={result.url} onClick={handleClick}>
                <span
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(result.title, result.highlights) 
                  }}
                />
              </Link>
            </CardTitle>

            <CardDescription className={cn(
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            )}>
              <span
                dangerouslySetInnerHTML={{ 
                  __html: highlightText(result.excerpt, result.highlights) 
                }}
              />
            </CardDescription>

            {result.excerpt.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(result.id)}
                className="p-0 h-auto text-xs text-primary"
              >
                {isExpanded ? t('showLess') : t('showMore')}
              </Button>
            )}
          </CardHeader>

          <CardContent className={cn(viewMode === 'list' && "py-0 pb-4")}>
            {/* 标签 */}
            {result.metadata.tags && result.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {result.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onFacetClick?.('tags', tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {result.metadata.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{result.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 元数据 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {result.metadata.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <Link
                      href={result.metadata.authorUrl || '#'}
                      className="hover:text-primary transition-colors"
                      onClick={() => onFacetClick?.('authors', result.metadata.author!)}
                    >
                      {result.metadata.author}
                    </Link>
                  </div>
                )}

                {result.metadata.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {dateShort(new Date(result.metadata.publishedAt))}
                  </div>
                )}

                {result.metadata.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {result.metadata.readTime} {t('minutes')}
                  </div>
                )}

                {result.metadata.fileSize && (
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {formatFileSize(result.metadata.fileSize)}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {result.metadata.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {result.metadata.viewCount}
                  </div>
                )}

                {result.metadata.downloadCount && (
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {result.metadata.downloadCount}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Bookmark className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边栏 - 搜索统计和筛选器 */}
        <div className="space-y-6">
          {/* 搜索统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                {t('searchResults')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('totalResults')}</span>
                  <span className="font-medium">{stats.totalResults.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('searchTime')}</span>
                  <span className="font-medium">{stats.searchTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('query')}</span>
                  <span className="font-medium truncate ml-2">"{query}"</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 内容类型筛选 */}
          {stats.facets.contentTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contentTypes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.facets.contentTypes.map(facet => {
                    const IconComponent = contentTypeIcons[facet.type as keyof typeof contentTypeIcons]
                    return (
                      <button
                        key={facet.type}
                        onClick={() => onFacetClick?.('contentTypes', facet.type)}
                        className="w-full flex items-center justify-between p-2 text-sm hover:bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {t(`contentTypes.${facet.type}`)}
                        </div>
                        <Badge variant="secondary">{facet.count}</Badge>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 分类筛选 */}
          {stats.facets.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('categories')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.facets.categories.slice(0, 8).map(facet => (
                    <button
                      key={facet.category}
                      onClick={() => onFacetClick?.('categories', facet.category)}
                      className="w-full flex items-center justify-between p-2 text-sm hover:bg-muted rounded"
                    >
                      <span className="truncate">{facet.category}</span>
                      <Badge variant="secondary">{facet.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 热门标签 */}
          {stats.facets.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('popularTags')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {stats.facets.tags.slice(0, 12).map(facet => (
                    <Badge
                      key={facet.tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => onFacetClick?.('tags', facet.tag)}
                    >
                      {facet.tag} ({facet.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 主要结果区域 */}
        <div className="lg:col-span-3">
          {/* 结果头部 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {t('showingResultsCount', {
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, stats.totalResults),
                  total: stats.totalResults
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* 排序 */}
              <div className="flex items-center gap-2">
                {sortOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSortChange?.(option.value)}
                  >
                    <option.icon className="w-4 h-4 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* 视图切换 */}
              <div className="flex items-center">
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange?.('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange?.('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 搜索结果 */}
          {results.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{t('noResults')}</p>
                <p className="text-muted-foreground mb-4">
                  {t('noResultsDesc', { query })}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('suggestions')}:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('suggestion1')}</li>
                    <li>• {t('suggestion2')}</li>
                    <li>• {t('suggestion3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={cn(
              "gap-6",
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2" 
                : "flex flex-col"
            )}>
              {results.map((result) => (
                <ResultItem key={result.id} result={result} />
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                {t('previous')}
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                {t('next')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}