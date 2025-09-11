'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Lightbulb,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 解决方案类型定义
interface Solution {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  summary: Record<Locale, string>
  coverImage: {
    asset: any
    alt: string
    caption?: string
  }
  industries: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  applications: string[]
  targetMarket: 'consumer-electronics' | 'industrial-automation' | 'automotive' | 'communications' | 'medical' | 'power-energy' | 'aerospace' | 'others'
  complexity: 'simple' | 'medium' | 'complex' | 'high-complex'
  developmentCycle: number
  costRange: {
    min: number
    max: number
    currency: string
  }
  features: Array<{
    title: Record<Locale, string>
    description: Record<Locale, string>
    icon?: { asset: any }
  }>
  status: 'development' | 'testing' | 'released' | 'deprecated'
  publishedAt: string
  isFeatured: boolean
  viewCount: number
  inquiryCount: number
  favoriteCount: number
}

interface SolutionListProps {
  solutions: Solution[]
  industries: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  locale: Locale
  totalCount: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  className?: string
}

export function SolutionList({
  solutions,
  industries,
  locale,
  totalCount,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  className
}: SolutionListProps) {
  const t = useTranslations('solutions')
  const { dateShort, currency } = useFormatters()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedMarket, setSelectedMarket] = useState<string>('all')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured' | 'complexity'>('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 目标市场映射
  const targetMarketMap = {
    'consumer-electronics': { label: t('markets.consumerElectronics'), color: 'bg-blue-100 text-blue-800' },
    'industrial-automation': { label: t('markets.industrialAutomation'), color: 'bg-green-100 text-green-800' },
    'automotive': { label: t('markets.automotive'), color: 'bg-red-100 text-red-800' },
    'communications': { label: t('markets.communications'), color: 'bg-purple-100 text-purple-800' },
    'medical': { label: t('markets.medical'), color: 'bg-pink-100 text-pink-800' },
    'power-energy': { label: t('markets.powerEnergy'), color: 'bg-orange-100 text-orange-800' },
    'aerospace': { label: t('markets.aerospace'), color: 'bg-indigo-100 text-indigo-800' },
    'others': { label: t('markets.others'), color: 'bg-gray-100 text-gray-800' }
  }

  // 复杂度映射
  const complexityMap = {
    simple: { label: t('complexity.simple'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('complexity.medium'), color: 'bg-blue-100 text-blue-800' },
    complex: { label: t('complexity.complex'), color: 'bg-orange-100 text-orange-800' },
    'high-complex': { label: t('complexity.highComplex'), color: 'bg-red-100 text-red-800' }
  }

  // 状态映射
  const statusMap = {
    development: { label: t('status.development'), color: 'bg-yellow-100 text-yellow-800' },
    testing: { label: t('status.testing'), color: 'bg-blue-100 text-blue-800' },
    released: { label: t('status.released'), color: 'bg-green-100 text-green-800' },
    deprecated: { label: t('status.deprecated'), color: 'bg-gray-100 text-gray-800' }
  }

  // 过滤解决方案
  const filteredSolutions = useMemo(() => {
    return solutions.filter(solution => {
      const title = getLocalizedValue(solution.title, locale).toLowerCase()
      const summary = getLocalizedValue(solution.summary, locale).toLowerCase()
      const search = searchTerm.toLowerCase()
      
      const matchesSearch = !searchTerm || 
        title.includes(search) || 
        summary.includes(search) ||
        solution.applications?.some(app => app.toLowerCase().includes(search))
      
      const matchesIndustry = selectedIndustry === 'all' || 
        solution.industries?.some(industry => industry._id === selectedIndustry)
      
      const matchesMarket = selectedMarket === 'all' || solution.targetMarket === selectedMarket
      const matchesComplexity = selectedComplexity === 'all' || solution.complexity === selectedComplexity
      const matchesStatus = selectedStatus === 'all' || solution.status === selectedStatus
      
      return matchesSearch && matchesIndustry && matchesMarket && matchesComplexity && matchesStatus
    })
  }, [solutions, searchTerm, selectedIndustry, selectedMarket, selectedComplexity, selectedStatus, locale])

  // 排序解决方案
  const sortedSolutions = useMemo(() => {
    return [...filteredSolutions].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.viewCount + b.inquiryCount) - (a.viewCount + a.inquiryCount)
        case 'featured':
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'complexity':
          const complexityOrder = { simple: 1, medium: 2, complex: 3, 'high-complex': 4 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })
  }, [filteredSolutions, sortBy])

  // 分页计算
  const totalPages = Math.ceil(sortedSolutions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedSolutions = sortedSolutions.slice(startIndex, startIndex + pageSize)

  const SolutionCard = ({ solution }: { solution: Solution }) => {
    const title = getLocalizedValue(solution.title, locale)
    const summary = getLocalizedValue(solution.summary, locale)
    const marketInfo = targetMarketMap[solution.targetMarket]
    const complexityInfo = complexityMap[solution.complexity]
    const statusInfo = statusMap[solution.status]

    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-300",
        viewMode === 'list' && "flex flex-row"
      )}>
        <div className={cn(
          "relative",
          viewMode === 'grid' ? "aspect-video" : "w-64 flex-shrink-0"
        )}>
          {solution.coverImage?.asset && (
            <Image
              src={solution.coverImage.asset.url}
              alt={solution.coverImage.alt || title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* 特色标识 */}
          {solution.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              {t('featured')}
            </Badge>
          )}

          {/* 状态标识 */}
          <Badge className={cn("absolute top-3 right-3", statusInfo.color)}>
            {statusInfo.label}
          </Badge>

          {/* 复杂度指示 */}
          <div className="absolute bottom-3 left-3">
            <Badge className={cn("text-xs", complexityInfo.color)}>
              {complexityInfo.label}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1">
          <CardHeader className={cn(viewMode === 'list' && "py-4")}>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={marketInfo.color}>
                {marketInfo.label}
              </Badge>
              
              {solution.industries && solution.industries.length > 0 && (
                <Badge variant="outline">
                  {getLocalizedValue(solution.industries[0].name, locale)}
                  {solution.industries.length > 1 && ` +${solution.industries.length - 1}`}
                </Badge>
              )}
            </div>
            
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/solutions/${solution.slug.current}`}>
                {title}
              </Link>
            </CardTitle>
            
            {summary && (
              <CardDescription className="line-clamp-3">
                {summary}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className={cn(viewMode === 'list' && "py-0 pb-4")}>
            {/* 技术特性 */}
            {solution.features && solution.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {solution.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getLocalizedValue(feature.title, locale)}
                  </Badge>
                ))}
                {solution.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{solution.features.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 项目信息 */}
            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
              {solution.developmentCycle && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{solution.developmentCycle} {t('days')}</span>
                </div>
              )}
              
              {solution.costRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {currency(solution.costRange.min)} - {currency(solution.costRange.max)} {solution.costRange.currency}
                  </span>
                </div>
              )}
            </div>

            {/* 统计信息和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {solution.viewCount || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {solution.inquiryCount || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {solution.favoriteCount || 0}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/solutions/${solution.slug.current}`}>
                    {t('viewDetails')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* 搜索和过滤器 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* 过滤器 */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('selectIndustry')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allIndustries')}</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry._id} value={industry._id}>
                    {getLocalizedValue(industry.name, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('selectMarket')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allMarkets')}</SelectItem>
                {Object.entries(targetMarketMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('selectComplexity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allComplexity')}</SelectItem>
                {Object.entries(complexityMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatus')}</SelectItem>
                {Object.entries(statusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 排序和视图切换 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('showingResults', { 
              count: sortedSolutions.length, 
              total: totalCount 
            })}
          </p>
          
          <div className="flex items-center gap-4">
            {/* 排序 */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t('sortBy.latest')}</SelectItem>
                <SelectItem value="popular">{t('sortBy.popular')}</SelectItem>
                <SelectItem value="featured">{t('sortBy.featured')}</SelectItem>
                <SelectItem value="complexity">{t('sortBy.complexity')}</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* 视图切换 */}
            <div className="flex items-center">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* 解决方案列表 */}
      {paginatedSolutions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">{t('noSolutionsFound')}</p>
            <p className="text-muted-foreground mb-4">{t('tryAdjustingFilters')}</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedIndustry('all')
              setSelectedMarket('all')
              setSelectedComplexity('all')
              setSelectedStatus('all')
            }}>
              {t('clearFilters')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
            : "flex flex-col"
        )}>
          {paginatedSolutions.map((solution) => (
            <SolutionCard key={solution._id} solution={solution} />
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

      {/* 统计信息 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sortedSolutions.length}</p>
                <p className="text-sm text-muted-foreground">{t('totalSolutions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sortedSolutions.filter(s => s.isFeatured).length}
                </p>
                <p className="text-sm text-muted-foreground">{t('featuredSolutions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sortedSolutions.reduce((sum, s) => sum + (s.viewCount || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{t('totalViews')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sortedSolutions.reduce((sum, s) => sum + (s.inquiryCount || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{t('totalInquiries')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}