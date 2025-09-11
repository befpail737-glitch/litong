'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Download,
  FileText,
  File,
  FileSpreadsheet,
  Presentation,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Trash2,
  Package,
  Globe,
  Calendar,
  HardDrive,
  Eye,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 文档类型定义（复用前面的定义）
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
  isFeatured?: boolean
}

interface DownloadCenterProps {
  documents: DocumentItem[]
  categories: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }>
  locale: Locale
  userAccessLevel?: 'public' | 'registered' | 'member' | 'internal'
  onDownload?: (documents: DocumentItem[]) => void
  className?: string
}

interface DownloadProgress {
  documentId: string
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
}

export function DocumentDownloadCenter({
  documents,
  categories,
  locale,
  userAccessLevel = 'public',
  onDownload,
  className
}: DownloadCenterProps) {
  const t = useTranslations('documents')
  const { fileSize } = useFormatters()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [showOnlyAccessible, setShowOnlyAccessible] = useState(true)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  
  // 下载购物车
  const [downloadCart, setDownloadCart] = useState<Set<string>>(new Set())
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({})

  // 文档类型和访问权限映射（复用前面的定义）
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

  // 检查用户访问权限
  const hasAccess = (documentAccessLevel: string) => {
    const accessLevels = ['public', 'registered', 'member', 'internal']
    const userLevel = accessLevels.indexOf(userAccessLevel)
    const docLevel = accessLevels.indexOf(documentAccessLevel)
    return userLevel >= docLevel
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
      const matchesAccess = !showOnlyAccessible || hasAccess(document.accessLevel)
      const matchesFeatured = !showOnlyFeatured || document.isFeatured
      
      return matchesSearch && matchesCategory && matchesType && matchesLanguage && matchesAccess && matchesFeatured
    })
  }, [documents, searchTerm, selectedCategory, selectedType, selectedLanguage, showOnlyAccessible, showOnlyFeatured, locale, userAccessLevel])

  // 购物车操作
  const toggleCart = (documentId: string) => {
    const newCart = new Set(downloadCart)
    if (newCart.has(documentId)) {
      newCart.delete(documentId)
    } else {
      newCart.add(documentId)
    }
    setDownloadCart(newCart)
  }

  const clearCart = () => {
    setDownloadCart(new Set())
  }

  const selectAll = () => {
    const accessibleDocs = filteredDocuments.filter(doc => hasAccess(doc.accessLevel))
    setDownloadCart(new Set(accessibleDocs.map(doc => doc._id)))
  }

  // 批量下载
  const handleBatchDownload = async () => {
    const selectedDocs = documents.filter(doc => downloadCart.has(doc._id))
    if (selectedDocs.length === 0) return

    // 模拟下载进度
    for (const doc of selectedDocs) {
      setDownloadProgress(prev => ({
        ...prev,
        [doc._id]: { documentId: doc._id, progress: 0, status: 'downloading' }
      }))

      // 模拟下载过程
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setDownloadProgress(prev => ({
          ...prev,
          [doc._id]: { ...prev[doc._id], progress }
        }))
      }

      setDownloadProgress(prev => ({
        ...prev,
        [doc._id]: { ...prev[doc._id], status: 'completed' }
      }))

      // 实际下载文件
      window.open(doc.file.asset.url, '_blank')
    }

    onDownload?.(selectedDocs)
  }

  // 计算购物车统计
  const cartDocuments = documents.filter(doc => downloadCart.has(doc._id))
  const totalSize = cartDocuments.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)

  const DocumentCard = ({ document }: { document: DocumentItem }) => {
    const title = getLocalizedValue(document.title, locale)
    const description = getLocalizedValue(document.description, locale)
    const categoryTitle = getLocalizedValue(document.category.title, locale)
    const typeInfo = documentTypeMap[document.documentType]
    const IconComponent = typeInfo.icon
    const isSelected = downloadCart.has(document._id)
    const isAccessible = hasAccess(document.accessLevel)
    const progress = downloadProgress[document._id]

    return (
      <Card className={cn(
        "group relative transition-all duration-300",
        isSelected && "ring-2 ring-primary",
        !isAccessible && "opacity-60"
      )}>
        {/* 选择复选框 */}
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => isAccessible && toggleCart(document._id)}
            disabled={!isAccessible}
          />
        </div>

        {/* 特色标识 */}
        {document.isFeatured && (
          <Badge className="absolute top-3 right-3 z-10 bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            {t('featured')}
          </Badge>
        )}

        <div className="relative aspect-video">
          {document.preview?.asset ? (
            <Image
              src={document.preview.asset.url}
              alt={document.preview.alt || title}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
              <IconComponent className={cn("w-12 h-12", typeInfo.color)} />
            </div>
          )}

          {/* 下载进度覆盖 */}
          {progress && progress.status === 'downloading' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <div className="text-center text-white">
                <div className="mb-2">{t('downloading')}</div>
                <Progress value={progress.progress} className="w-32" />
                <div className="text-sm mt-1">{progress.progress}%</div>
              </div>
            </div>
          )}

          {progress && progress.status === 'completed' && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-t-lg">
              <div className="text-center text-white">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">{t('downloaded')}</div>
              </div>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
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
          
          <CardTitle className="line-clamp-2 text-sm">
            {title}
          </CardTitle>
          
          {description && (
            <CardDescription className="line-clamp-2 text-xs">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 文档信息 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              {document.fileSize && (
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {fileSize(document.fileSize)}
                </span>
              )}
              {document.pageCount && (
                <span>{document.pageCount}页</span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {document.downloadCount}
            </span>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/documents/${document.slug.current}`}>
                <Eye className="w-3 h-3 mr-1" />
                {t('preview')}
              </Link>
            </Button>
            
            {isAccessible ? (
              <Button
                size="sm"
                onClick={() => window.open(document.file.asset.url, '_blank')}
                disabled={progress?.status === 'downloading'}
              >
                <Download className="w-3 h-3 mr-1" />
                {t('download')}
              </Button>
            ) : (
              <Button size="sm" disabled>
                {t('accessRestricted')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* 过滤器栏 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('filters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 过滤器 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessible"
                  checked={showOnlyAccessible}
                  onCheckedChange={setShowOnlyAccessible}
                />
                <label htmlFor="accessible" className="text-sm">
                  {t('onlyAccessible')}
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={showOnlyFeatured}
                  onCheckedChange={setShowOnlyFeatured}
                />
                <label htmlFor="featured" className="text-sm">
                  {t('onlyFeatured')}
                </label>
              </div>
            </div>
          </div>

          {/* 批量操作 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                {t('selectAll')}
              </Button>
              <Button variant="outline" size="sm" onClick={clearCart}>
                <XCircle className="w-4 h-4 mr-1" />
                {t('clearSelection')}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('showingResults', { 
                count: filteredDocuments.length, 
                total: documents.length 
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 文档列表 */}
        <div className="lg:col-span-3">
          {filteredDocuments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">{t('noDocumentsFound')}</p>
                <Button onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedType('all')
                  setSelectedLanguage('all')
                  setShowOnlyAccessible(false)
                  setShowOnlyFeatured(false)
                }}>
                  {t('clearFilters')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document._id} document={document} />
              ))}
            </div>
          )}
        </div>

        {/* 下载购物车侧边栏 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('downloadCart')} ({downloadCart.size})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {downloadCart.size === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  {t('cartEmpty')}
                </p>
              ) : (
                <div className="space-y-3">
                  {/* 购物车统计 */}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>{t('totalFiles')}</span>
                      <span>{downloadCart.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('totalSize')}</span>
                      <span>{fileSize(totalSize)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* 购物车文档列表 */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cartDocuments.map((doc) => {
                      const title = getLocalizedValue(doc.title, locale)
                      const typeInfo = documentTypeMap[doc.documentType]
                      const IconComponent = typeInfo.icon
                      
                      return (
                        <div key={doc._id} className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                          <IconComponent className={cn("w-4 h-4 flex-shrink-0", typeInfo.color)} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{title}</p>
                            <p className="text-muted-foreground">
                              {doc.fileSize && fileSize(doc.fileSize)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCart(doc._id)}
                            className="flex-shrink-0 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  
                  <Separator />
                  
                  {/* 下载操作 */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={handleBatchDownload}
                      disabled={downloadCart.size === 0}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {t('downloadAll')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={clearCart}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('clearCart')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 下载提示 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('downloadTips')}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• {t('tip1')}</p>
              <p>• {t('tip2')}</p>
              <p>• {t('tip3')}</p>
              <p>• {t('tip4')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}