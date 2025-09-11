'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Download,
  FileText,
  File,
  FileSpreadsheet,
  Presentation,
  Share2,
  ArrowLeft,
  Calendar,
  Globe,
  HardDrive,
  FileStack,
  Tag,
  Lock,
  Unlock,
  Users,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// 文档详情类型定义
interface DocumentDetail {
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
    image?: { asset: any }
  }>
}

// 相关文档类型
interface RelatedDocument {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  description: Record<Locale, string>
  documentType: string
  preview?: { asset: any; alt: string }
  downloadCount: number
  publishedAt: string
}

interface DocumentDetailProps {
  document: DocumentDetail
  relatedDocuments?: RelatedDocument[]
  locale: Locale
  onDownload?: () => void
  onShare?: () => void
  className?: string
}

export function DocumentDetail({
  document,
  relatedDocuments = [],
  locale,
  onDownload,
  onShare,
  className
}: DocumentDetailProps) {
  const t = useTranslations('documents')
  const { dateShort, fileSize } = useFormatters()
  
  const title = getLocalizedValue(document.title, locale)
  const description = getLocalizedValue(document.description, locale)
  const categoryTitle = getLocalizedValue(document.category.title, locale)

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

  const typeInfo = documentTypeMap[document.documentType]
  const accessInfo = accessLevelMap[document.accessLevel]
  const IconComponent = typeInfo.icon

  const handleDownload = () => {
    onDownload?.()
    window.open(document.file.asset.url, '_blank')
  }

  return (
    <div className={className}>
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/documents">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToDocuments')}
          </Link>
        </Button>
      </div>

      {/* 文档头部 */}
      <Card className="mb-8">
        <CardHeader>
          {/* 分类和类型标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
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
            <Badge className={cn(accessInfo.color)}>
              <accessInfo.icon className="w-3 h-3 mr-1" />
              {accessInfo.label}
            </Badge>
            {document.language && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {languageMap[document.language] || document.language}
              </Badge>
            )}
          </div>

          {/* 标题和描述 */}
          <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </CardTitle>
          
          {description && (
            <CardDescription className="text-lg mt-4">
              {description}
            </CardDescription>
          )}

          {/* 文档信息和操作 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {dateShort(new Date(document.publishedAt))}
              </div>
              
              {document.fileSize && (
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  {fileSize(document.fileSize)}
                </div>
              )}
              
              {document.pageCount && (
                <div className="flex items-center gap-2">
                  <FileStack className="w-4 h-4" />
                  {document.pageCount} {t('pages')}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {document.downloadCount} {t('downloads')}
              </div>
              
              {document.version && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {document.version}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('share')}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t('download')}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 预览图片 */}
        {document.preview?.asset && (
          <div className="px-6 pb-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={document.preview.asset.url}
                alt={document.preview.alt || title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t('documentPreview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* PDF预览或其他文档类型的预览 */}
              {document.documentType === 'pdf' ? (
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">{t('pdfPreviewNotAvailable')}</p>
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('downloadToView')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <IconComponent className={cn("w-16 h-16 mx-auto mb-4", typeInfo.color)} />
                    <p className="text-muted-foreground mb-4">
                      {t('documentPreviewNotSupported', { type: typeInfo.label })}
                    </p>
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('downloadToView')}
                    </Button>
                  </div>
                </div>
              )}

              {/* 标签 */}
              {document.tags && document.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t('tags')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 文档信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('documentInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('fileName')}</span>
                  <span className="text-sm font-medium">{document.file.asset.originalFilename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('fileType')}</span>
                  <span className="text-sm font-medium">{typeInfo.label}</span>
                </div>
                {document.fileSize && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('fileSize')}</span>
                    <span className="text-sm font-medium">{fileSize(document.fileSize)}</span>
                  </div>
                )}
                {document.pageCount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('pageCount')}</span>
                    <span className="text-sm font-medium">{document.pageCount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('language')}</span>
                  <span className="text-sm font-medium">
                    {languageMap[document.language] || document.language}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('publishedAt')}</span>
                  <span className="text-sm font-medium">
                    {dateShort(new Date(document.publishedAt))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 相关产品 */}
          {document.relatedProducts && document.relatedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('relatedProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {document.relatedProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="flex items-center gap-3">
                      {product.image?.asset && (
                        <Image
                          src={product.image.asset.url}
                          alt={getLocalizedValue(product.name, locale)}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div>
                        <Link 
                          href={`/products/${product.slug.current}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {getLocalizedValue(product.name, locale)}
                        </Link>
                      </div>
                    </div>
                  ))}
                  {document.relatedProducts.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      {t('viewMore')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 下载操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('downloadActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t('downloadDocument')}
              </Button>
              <Button variant="outline" className="w-full" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareDocument')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 相关文档 */}
      {relatedDocuments.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-bold mb-6">{t('relatedDocuments')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDocuments.slice(0, 3).map((relatedDoc) => (
              <Card key={relatedDoc._id} className="group hover:shadow-lg transition-all duration-300">
                {relatedDoc.preview?.asset && (
                  <div className="relative aspect-video">
                    <Image
                      src={relatedDoc.preview.asset.url}
                      alt={relatedDoc.preview.alt || getLocalizedValue(relatedDoc.title, locale)}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/documents/${relatedDoc.slug.current}`}>
                      {getLocalizedValue(relatedDoc.title, locale)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {getLocalizedValue(relatedDoc.description, locale)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {relatedDoc.downloadCount}
                    </span>
                    <span>{dateShort(new Date(relatedDoc.publishedAt))}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}