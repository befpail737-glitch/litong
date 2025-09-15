'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Lightbulb,
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  Users,
  Eye,
  Heart,
  Share2,
  Download,
  FileText,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Award,
  MessageCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PortableTextRenderer } from '@/components/rich-text/portable-text-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormatters } from '@/hooks/use-formatters';
import type { Locale } from '@/i18n';
import { getLocalizedValue, getLocalizedRichText } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 解决方案详情类型定义
interface SolutionDetail {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  summary: Record<Locale, string>
  description: Record<Locale, any[]>
  coverImage: {
    asset: any
    alt: string
    caption?: string
  }
  gallery?: Array<{
    asset: any
    alt: string
    caption?: string
  }>
  industries: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  applications: string[]
  features: Array<{
    title: Record<Locale, string>
    description: Record<Locale, string>
    icon?: { asset: any }
  }>
  advantages: Array<{
    title: Record<Locale, string>
    description: Record<Locale, string>
    metrics?: Array<{
      label: string
      value: string
      unit: string
    }>
  }>
  bomList?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  caseStudies?: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    coverImage?: { asset: any }
    customer?: { name: string }
  }>
  relatedProducts?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
    image?: { asset: any }
    price?: { amount: number; currency: string }
  }>
  targetMarket: string
  complexity: string
  developmentCycle: number
  costRange: {
    min: number
    max: number
    currency: string
  }
  status: string
  publishedAt: string
  isFeatured: boolean
  viewCount: number
  inquiryCount: number
  favoriteCount: number
  downloads?: Array<{
    title: string
    description: string
    file: { asset: { url: string } }
    type: string
  }>
}

interface SolutionDetailProps {
  solution: SolutionDetail
  relatedSolutions?: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    summary: Record<Locale, string>
    coverImage?: { asset: any; alt: string }
    targetMarket: string
    complexity: string
  }>
  locale: Locale
  onInquiry?: () => void
  onFavorite?: () => void
  onShare?: () => void
  className?: string
}

export function SolutionDetail({
  solution,
  relatedSolutions = [],
  locale,
  onInquiry,
  onFavorite,
  onShare,
  className
}: SolutionDetailProps) {
  const t = useTranslations('solutions');
  const { dateShort, currency } = useFormatters();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const title = getLocalizedValue(solution.title, locale);
  const summary = getLocalizedValue(solution.summary, locale);
  const description = getLocalizedRichText(solution.description, locale);

  // 目标市场映射
  const targetMarketMap: Record<string, { label: string; color: string }> = {
    'consumer-electronics': { label: t('markets.consumerElectronics'), color: 'bg-blue-100 text-blue-800' },
    'industrial-automation': { label: t('markets.industrialAutomation'), color: 'bg-green-100 text-green-800' },
    'automotive': { label: t('markets.automotive'), color: 'bg-red-100 text-red-800' },
    'communications': { label: t('markets.communications'), color: 'bg-purple-100 text-purple-800' },
    'medical': { label: t('markets.medical'), color: 'bg-pink-100 text-pink-800' },
    'power-energy': { label: t('markets.powerEnergy'), color: 'bg-orange-100 text-orange-800' },
    'aerospace': { label: t('markets.aerospace'), color: 'bg-indigo-100 text-indigo-800' },
    'others': { label: t('markets.others'), color: 'bg-gray-100 text-gray-800' }
  };

  const complexityMap: Record<string, { label: string; color: string }> = {
    simple: { label: t('complexity.simple'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('complexity.medium'), color: 'bg-blue-100 text-blue-800' },
    complex: { label: t('complexity.complex'), color: 'bg-orange-100 text-orange-800' },
    'high-complex': { label: t('complexity.highComplex'), color: 'bg-red-100 text-red-800' }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    development: { label: t('status.development'), color: 'bg-yellow-100 text-yellow-800' },
    testing: { label: t('status.testing'), color: 'bg-blue-100 text-blue-800' },
    released: { label: t('status.released'), color: 'bg-green-100 text-green-800' },
    deprecated: { label: t('status.deprecated'), color: 'bg-gray-100 text-gray-800' }
  };

  const marketInfo = targetMarketMap[solution.targetMarket];
  const complexityInfo = complexityMap[solution.complexity];
  const statusInfo = statusMap[solution.status];

  // 图片列表（封面图 + 画廊）
  const images = [
    solution.coverImage,
    ...(solution.gallery || [])
  ].filter(Boolean);

  return (
    <div className={className}>
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/solutions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToSolutions')}
          </Link>
        </Button>
      </div>

      {/* 方案头部 */}
      <Card className="mb-8">
        <CardHeader>
          {/* 标签区域 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {marketInfo && (
              <Badge className={marketInfo.color}>
                {marketInfo.label}
              </Badge>
            )}

            {complexityInfo && (
              <Badge className={complexityInfo.color}>
                {complexityInfo.label}
              </Badge>
            )}

            {statusInfo && (
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            )}

            {solution.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                {t('featured')}
              </Badge>
            )}

            {solution.industries && solution.industries.length > 0 && (
              <Badge variant="outline">
                {getLocalizedValue(solution.industries[0].name, locale)}
                {solution.industries.length > 1 && ` +${solution.industries.length - 1}`}
              </Badge>
            )}
          </div>

          {/* 标题和摘要 */}
          <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </CardTitle>

          {summary && (
            <CardDescription className="text-lg mt-4">
              {summary}
            </CardDescription>
          )}

          {/* 关键信息和操作 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 pt-4 border-t gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
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

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{solution.viewCount || 0} {t('views')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{solution.inquiryCount || 0} {t('inquiries')}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onFavorite}>
                <Heart className="w-4 h-4 mr-2" />
                {solution.favoriteCount || 0}
              </Button>
              <Button variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('share')}
              </Button>
              <Button onClick={onInquiry}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('inquiry')}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 图片展示区 */}
        {images.length > 0 && (
          <div className="px-6 pb-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={images[selectedImage]?.asset?.url}
                alt={images[selectedImage]?.alt || title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 图片缩略图 */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-16 rounded border-2 overflow-hidden flex-shrink-0',
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    )}
                  >
                    <Image
                      src={image.asset.url}
                      alt={image.alt || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {images[selectedImage]?.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {images[selectedImage].caption}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="features">{t('tabs.features')}</TabsTrigger>
              <TabsTrigger value="bom">{t('tabs.bom')}</TabsTrigger>
              <TabsTrigger value="cases">{t('tabs.cases')}</TabsTrigger>
              <TabsTrigger value="downloads">{t('tabs.downloads')}</TabsTrigger>
            </TabsList>

            {/* 概览 */}
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-slate max-w-none">
                    <PortableTextRenderer value={description} />
                  </div>

                  {/* 应用场景标签 */}
                  {solution.applications && solution.applications.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-medium mb-3">{t('applications')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.applications.map((app, index) => (
                          <Badge key={index} variant="outline">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 技术特性 */}
            <TabsContent value="features">
              <div className="space-y-6">
                {/* 特性列表 */}
                {solution.features && solution.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {t('technicalFeatures')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {solution.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-4">
                            {feature.icon?.asset ? (
                              <Image
                                src={feature.icon.asset.url}
                                alt=""
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-medium mb-1">
                                {getLocalizedValue(feature.title, locale)}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {getLocalizedValue(feature.description, locale)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 技术优势 */}
                {solution.advantages && solution.advantages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        {t('technicalAdvantages')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {solution.advantages.map((advantage, index) => (
                          <div key={index}>
                            <h5 className="font-medium mb-2">
                              {getLocalizedValue(advantage.title, locale)}
                            </h5>
                            <p className="text-muted-foreground mb-4">
                              {getLocalizedValue(advantage.description, locale)}
                            </p>

                            {/* 性能指标 */}
                            {advantage.metrics && advantage.metrics.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {advantage.metrics.map((metric, metricIndex) => (
                                  <div key={metricIndex} className="text-center p-4 bg-muted/50 rounded-lg">
                                    <p className="text-2xl font-bold text-primary">
                                      {metric.value}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {metric.unit}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                      {metric.label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {index < solution.advantages.length - 1 && (
                              <Separator className="mt-6" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* BOM清单 */}
            <TabsContent value="bom">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {t('bomList')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {solution.bomList && solution.bomList.length > 0 ? (
                    <div className="space-y-4">
                      {solution.bomList.map((bom) => (
                        <div key={bom._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-medium">
                              {getLocalizedValue(bom.name, locale)}
                            </h5>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/bom/${bom.slug.current}`}>
                              {t('viewBOM')}
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noBOMAvailable')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 应用案例 */}
            <TabsContent value="cases">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {t('applicationCases')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {solution.caseStudies && solution.caseStudies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {solution.caseStudies.map((caseStudy) => (
                        <Card key={caseStudy._id} className="group hover:shadow-lg transition-all duration-300">
                          {caseStudy.coverImage?.asset && (
                            <div className="relative aspect-video">
                              <Image
                                src={caseStudy.coverImage.asset.url}
                                alt={getLocalizedValue(caseStudy.title, locale)}
                                fill
                                className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                              <Link href={`/cases/${caseStudy.slug.current}`}>
                                {getLocalizedValue(caseStudy.title, locale)}
                              </Link>
                            </CardTitle>
                            {caseStudy.customer?.name && (
                              <CardDescription>
                                {t('customer')}: {caseStudy.customer.name}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noCasesAvailable')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 下载资源 */}
            <TabsContent value="downloads">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t('downloadResources')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {solution.downloads && solution.downloads.length > 0 ? (
                    <div className="space-y-4">
                      {solution.downloads.map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-medium">{download.title}</h5>
                            <p className="text-sm text-muted-foreground">{download.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {download.type}
                            </Badge>
                          </div>
                          <Button asChild>
                            <a href={download.file.asset.url} download target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              {t('download')}
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Download className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noDownloadsAvailable')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={onInquiry}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('requestQuote')}
              </Button>
              <Button variant="outline" className="w-full" onClick={onFavorite}>
                <Heart className="w-4 h-4 mr-2" />
                {t('addToFavorites')}
              </Button>
              <Button variant="outline" className="w-full" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareSolution')}
              </Button>
            </CardContent>
          </Card>

          {/* 方案信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('solutionInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('publishedAt')}</span>
                <span>{dateShort(new Date(solution.publishedAt))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('complexity')}</span>
                <Badge className={complexityInfo?.color}>
                  {complexityInfo?.label}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('status')}</span>
                <Badge className={statusInfo?.color}>
                  {statusInfo?.label}
                </Badge>
              </div>
              {solution.developmentCycle && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('developmentCycle')}</span>
                  <span>{solution.developmentCycle} {t('days')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 相关产品 */}
          {solution.relatedProducts && solution.relatedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('relatedProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {solution.relatedProducts.slice(0, 3).map((product) => (
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
                      <div className="flex-1">
                        <Link
                          href={`/products/${product.slug.current}`}
                          className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {getLocalizedValue(product.name, locale)}
                        </Link>
                        {product.price && (
                          <p className="text-xs text-muted-foreground">
                            {currency(product.price.amount)} {product.price.currency}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {solution.relatedProducts.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      {t('viewMore')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 相关解决方案 */}
      {relatedSolutions.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {t('relatedSolutions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedSolutions.slice(0, 3).map((relatedSolution) => {
              const relatedMarketInfo = targetMarketMap[relatedSolution.targetMarket];
              const relatedComplexityInfo = complexityMap[relatedSolution.complexity];

              return (
                <Card key={relatedSolution._id} className="group hover:shadow-lg transition-all duration-300">
                  {relatedSolution.coverImage?.asset && (
                    <div className="relative aspect-video">
                      <Image
                        src={relatedSolution.coverImage.asset.url}
                        alt={relatedSolution.coverImage.alt || getLocalizedValue(relatedSolution.title, locale)}
                        fill
                        className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {relatedMarketInfo && (
                        <Badge className={relatedMarketInfo.color}>
                          {relatedMarketInfo.label}
                        </Badge>
                      )}
                      {relatedComplexityInfo && (
                        <Badge className={relatedComplexityInfo.color}>
                          {relatedComplexityInfo.label}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={relatedSolution.primaryBrand?.slug
                        ? `/brands/${encodeURIComponent(relatedSolution.primaryBrand.slug)}/solutions/${relatedSolution.slug.current}`
                        : `/solutions/${relatedSolution.slug.current}`
                      }>
                        {getLocalizedValue(relatedSolution.title, locale)}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {getLocalizedValue(relatedSolution.summary, locale)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
