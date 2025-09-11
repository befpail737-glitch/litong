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
  Download, 
  FileText, 
  File, 
  FileSpreadsheet,
  Presentation,
  Search, 
  Filter,
  Eye,
  Calendar,
  Globe,
  Lock,
  Unlock,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 文档类型定义
interface DocumentItem {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  description: Record<Locale, string>
  documentType: 'pdf' | 'doc' | 'excel' | 'ppt' | 'manual' | 'datasheet' | 'guide' | 'whitepaper' | 'case-study' | 'other'
  category: {
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }
  file: {
    asset: {
      url: string
      originalFilename: string
    }
  }
  preview?: {
    asset: any
    alt: string
  }
  tags: string[]
  fileSize: number
  pageCount?: number
  language: string
  version?: string
  accessLevel: 'public' | 'registered' | 'member' | 'internal'
  publishedAt: string
  downloadCount: number
  relatedProducts?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
}

interface DocumentListProps {
  documents: DocumentItem[]
  categories: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }>
  locale: Locale
  totalCount: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onDownload?: (document: DocumentItem) => void
  className?: string
}

export function DocumentList({
  documents,
  categories,
  locale,
  totalCount,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  onDownload,
  className
}: DocumentListProps) {
  const t = useTranslations('documents')
  const { dateShort, fileSize } = useFormatters()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedAccess, setSelectedAccess] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 文档类型映射
  const documentTypeMap = {
    pdf: { label: 'PDF', icon: FileText, color: 'text-red-600' },
    doc: { label: 'Word', icon: FileText, color: 'text-blue-600' },
    excel: { label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600' },
    ppt: { label: 'PPT', icon: Presentation, color: 'text-orange-600' },
    manual: { label: t('types.manual'), icon: File, color: 'text-purple-600' },
    datasheet: { label: t('types.datasheet'), icon: File, color: 'text-indigo-600' },
    guide: { label: t('types.guide'), icon: File, color: 'text-teal-600' },
    whitepaper: { label: t('types.whitepaper'), icon: File, color: 'text-slate-600' },
    'case-study': { label: t('types.caseStudy'), icon: File, color: 'text-pink-600' },
    other: { label: t('types.other'), icon: File, color: 'text-gray-600' }
  }

  // 访问权限映射
  const accessLevelMap = {
    public: { label: t('access.public'), icon: Unlock, color: 'bg-green-100 text-green-800' },
    registered: { label: t('access.registered'), icon: Users, color: 'bg-blue-100 text-blue-800' },
    member: { label: t('access.member'), icon: Users, color: 'bg-purple-100 text-purple-800' },
    internal: { label: t('access.internal'), icon: Lock, color: 'bg-red-100 text-red-800' }
  }

  // 语言映射
  const languageMap = {
    'zh-CN': '中文',
    'zh-TW': '繁体中文', 
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'ru': 'Русский',
    'ar': 'العربية',
    'multi': t('language.multi')
  }

  // 过滤文档
  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      const title = getLocalizedValue(document.title, locale).toLowerCase()
      const description = getLocalizedValue(document.description, locale).toLowerCase()
      const search = searchTerm.toLowerCase()
      
      const matchesSearch = !searchTerm || 
        title.includes(search) || 
        description.includes(search) ||
        document.tags.some(tag => tag.toLowerCase().includes(search))
      
      const matchesCategory = selectedCategory === 'all' || document.category?.slug.current === selectedCategory
      const matchesType = selectedType === 'all' || document.documentType === selectedType
      const matchesLanguage = selectedLanguage === 'all' || document.language === selectedLanguage
      const matchesAccess = selectedAccess === 'all' || document.accessLevel === selectedAccess
      
      return matchesSearch && matchesCategory && matchesType && matchesLanguage && matchesAccess
    })
  }, [documents, searchTerm, selectedCategory, selectedType, selectedLanguage, selectedAccess, locale])

  // 分页计算
  const totalPages = Math.ceil(filteredDocuments.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + pageSize)

  const DocumentCard = ({ document }: { document: DocumentItem }) => {
    const title = getLocalizedValue(document.title, locale)
    const description = getLocalizedValue(document.description, locale)
    const categoryTitle = getLocalizedValue(document.category.title, locale)
    const typeInfo = documentTypeMap[document.documentType]
    const accessInfo = accessLevelMap[document.accessLevel]
    const IconComponent = typeInfo.icon

    const handleDownload = () => {
      onDownload?.(document)
      // 在实际应用中，这里会调用API更新下载次数
      window.open(document.file.asset.url, '_blank')
    }

    return (
      <Card className={cn("group hover:shadow-lg transition-all duration-300", viewMode === 'list' && "flex flex-row")}>
        <div className={cn("relative", viewMode === 'grid' ? "aspect-video" : "w-48 flex-shrink-0")}>
          {document.preview?.asset ? (
            <Image
              src={document.preview.asset.url}
              alt={document.preview.alt || title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
              <IconComponent className={cn("w-12 h-12", typeInfo.color)} />
            </div>
          )}
          
          <Badge className={cn("absolute top-2 right-2", accessInfo.color)}>
            <accessInfo.icon className="w-3 h-3 mr-1" />
            {accessInfo.label}
          </Badge>
        </div>
        
        <div className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: document.category.color,
                  color: document.category.color 
                }}
              >
                {categoryTitle}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <IconComponent className="w-3 h-3" />
                {typeInfo.label}
              </Badge>
              {document.language && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {languageMap[document.language] || document.language}
                </Badge>
              )}
            </div>
            
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/documents/${document.slug.current}`}>
                {title}
              </Link>
            </CardTitle>
            
            {description && (
              <CardDescription className="line-clamp-2">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {/* 标签 */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {document.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{document.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            {/* 文档信息 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-4">
                {document.fileSize && (
                  <span>{fileSize(document.fileSize)}</span>
                )}
                {document.pageCount && (
                  <span>{document.pageCount} {t('pages')}</span>
                )}
                {document.version && (
                  <span>{document.version}</span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {dateShort(new Date(document.publishedAt))}
              </div>
            </div>
            
            {/* 下载统计和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {document.downloadCount} {t('downloads')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/documents/${document.slug.current}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    {t('preview')}
                  </Link>
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" />
                  {t('download')}
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.slug.current}>
                    {getLocalizedValue(category.title, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                {Object.entries(documentTypeMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allLanguages')}</SelectItem>
                {Object.entries(languageMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedAccess} onValueChange={setSelectedAccess}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('selectAccess')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allAccess')}</SelectItem>
                {Object.entries(accessLevelMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 视图切换和结果统计 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('showingResults', { 
              count: filteredDocuments.length, 
              total: totalCount 
            })}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              {t('gridView')}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              {t('listView')}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* 文档列表 */}
      {paginatedDocuments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('noDocumentsFound')}</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedType('all')
              setSelectedLanguage('all')
              setSelectedAccess('all')
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
          {paginatedDocuments.map((document) => (
            <DocumentCard key={document._id} document={document} />
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
  )
}