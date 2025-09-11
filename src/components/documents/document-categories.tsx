'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FolderOpen, FileText, Search, Download, TrendingUp, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 分类类型定义
interface DocumentCategory {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  description?: Record<Locale, string>
  color?: string
  icon?: {
    asset: any
    alt: string
  }
  documentCount: number
  latestDocument?: {
    title: Record<Locale, string>
    publishedAt: string
  }
}

interface DocumentCategoriesProps {
  categories: DocumentCategory[]
  locale: Locale
  viewMode?: 'grid' | 'list'
  showSearch?: boolean
  className?: string
}

export function DocumentCategories({
  categories,
  locale,
  viewMode = 'grid',
  showSearch = true,
  className
}: DocumentCategoriesProps) {
  const t = useTranslations('documents')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'recent'>('name')

  // 搜索和排序逻辑
  const filteredAndSortedCategories = categories
    .filter(category => {
      if (!searchTerm) return true
      const title = getLocalizedValue(category.title, locale).toLowerCase()
      const description = category.description 
        ? getLocalizedValue(category.description, locale).toLowerCase()
        : ''
      const search = searchTerm.toLowerCase()
      return title.includes(search) || description.includes(search)
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'count':
          return b.documentCount - a.documentCount
        case 'recent':
          const aDate = a.latestDocument?.publishedAt || '0'
          const bDate = b.latestDocument?.publishedAt || '0'
          return new Date(bDate).getTime() - new Date(aDate).getTime()
        case 'name':
        default:
          const aTitle = getLocalizedValue(a.title, locale)
          const bTitle = getLocalizedValue(b.title, locale)
          return aTitle.localeCompare(bTitle)
      }
    })

  // 统计信息
  const totalDocuments = categories.reduce((sum, cat) => sum + cat.documentCount, 0)
  const activeCategories = categories.filter(cat => cat.documentCount > 0).length

  const CategoryCard = ({ category }: { category: DocumentCategory }) => {
    const title = getLocalizedValue(category.title, locale)
    const description = category.description 
      ? getLocalizedValue(category.description, locale) 
      : ''

    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer",
        viewMode === 'list' && "flex flex-row"
      )}>
        <Link href={`/documents?category=${category.slug.current}`}>
          {/* 图标或颜色指示器 */}
          <div className={cn(
            "relative",
            viewMode === 'grid' 
              ? "h-24 flex items-center justify-center" 
              : "w-16 h-16 flex-shrink-0 flex items-center justify-center m-4"
          )}>
            {category.icon?.asset ? (
              <Image
                src={category.icon.asset.url}
                alt={category.icon.alt || title}
                width={48}
                height={48}
                className="rounded-lg"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: category.color || '#6B7280' }}
              >
                <FolderOpen className="w-6 h-6" />
              </div>
            )}
            
            {/* 文档数量徽章 */}
            <Badge 
              className="absolute -top-1 -right-1 min-w-6 h-6 flex items-center justify-center text-xs"
              variant="secondary"
            >
              {category.documentCount}
            </Badge>
          </div>

          <div className="flex-1">
            <CardHeader className={cn(viewMode === 'list' && "py-4")}>
              <CardTitle className="group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="line-clamp-2">
                  {description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className={cn(viewMode === 'list' && "py-0 pb-4")}>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {category.documentCount} {t('documents')}
                  </span>
                  
                  {category.latestDocument && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(category.latestDocument.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {category.documentCount > 0 && (
                  <Button variant="ghost" size="sm">
                    {t('browse')} →
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* 头部统计 */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">{t('totalCategories')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDocuments}</p>
                  <p className="text-sm text-muted-foreground">{t('totalDocuments')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCategories}</p>
                  <p className="text-sm text-muted-foreground">{t('activeCategories')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和过滤器 */}
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('searchCategories')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <TabsList>
                <TabsTrigger value="name">{t('sortByName')}</TabsTrigger>
                <TabsTrigger value="count">{t('sortByCount')}</TabsTrigger>
                <TabsTrigger value="recent">{t('sortByRecent')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* 分类列表 */}
      {filteredAndSortedCategories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-2">{t('noCategoriesFound')}</p>
                <p className="text-muted-foreground">{t('tryDifferentSearch')}</p>
              </div>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>
                  {t('clearSearch')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "flex flex-col"
        )}>
          {filteredAndSortedCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}

      {/* 热门分类 */}
      {categories.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('popularCategories')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories
              .sort((a, b) => b.documentCount - a.documentCount)
              .slice(0, 6)
              .map((category) => (
                <Link
                  key={category._id}
                  href={`/documents?category=${category.slug.current}`}
                  className="group"
                >
                  <div className="text-center p-4 rounded-lg border hover:bg-muted transition-colors">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    >
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {getLocalizedValue(category.title, locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.documentCount} {t('documents')}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}