'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  BookOpen,
  ArrowLeft,
  Star,
  Building,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  MessageCircle,
  Globe,
  FileText,
  Zap
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PortableTextRenderer } from '@/components/rich-text/portable-text-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormatters } from '@/hooks/use-formatters';
import type { Locale } from '@/i18n';
import { getLocalizedValue, getLocalizedRichText } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 案例研究详情类型定义
interface CaseStudyDetail {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  summary: Record<Locale, string>
  content: Record<Locale, any[]>
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
  customer: {
    name: string
    industry: string
    location: string
    website?: string
    logo?: { asset: any }
    description?: string
    confidential: boolean
  }
  project: {
    name: Record<Locale, string>
    description: Record<Locale, string>
    startDate: string
    endDate: string
    duration: number
    teamSize: number
    budget?: number
    currency: string
  }
  challenges: Array<{
    title: Record<Locale, string>
    description: Record<Locale, string>
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  solutions: Array<{
    title: Record<Locale, string>
    description: Record<Locale, any[]>
    products?: Array<{
      _id: string
      name: Record<Locale, string>
      slug: { current: string }
      image?: { asset: any }
    }>
    technologies: string[]
  }>
  technicalSpecs: Array<{
    category: string
    specification: string
    value: string
    unit: string
    notes?: string
  }>
  results: {
    metrics: Array<{
      metric: string
      before: string
      after: string
      improvement: string
      unit: string
    }>
    achievements: Record<Locale, any[]>
    roi?: number
  }
  testimonials: Array<{
    quote: Record<Locale, any[]>
    author: string
    position: string
    company: string
    avatar?: { asset: any }
    rating: number
  }>
  relatedSolutions?: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
  }>
  products?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
    image?: { asset: any }
    price?: { amount: number; currency: string }
  }>
  industries: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  applications: string[]
  tags: string[]
  caseType: string
  complexity: string
  publishedAt: string
  isFeatured: boolean
  viewCount: number
  downloads?: Array<{
    title: string
    description: string
    file: { asset: { url: string } }
    type: string
  }>
}

interface CaseStudyDetailProps {
  caseStudy: CaseStudyDetail
  relatedCases?: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    summary: Record<Locale, string>
    coverImage?: { asset: any; alt: string }
    customer: { name: string; confidential: boolean }
    caseType: string
  }>
  locale: Locale
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}

export function CaseStudyDetail({
  caseStudy,
  relatedCases = [],
  locale,
  onShare,
  onBookmark,
  className
}: CaseStudyDetailProps) {
  const t = useTranslations('caseStudies');
  const { dateShort, currency } = useFormatters();
  const [selectedImage, setSelectedImage] = useState(0);

  const title = getLocalizedValue(caseStudy.title, locale);
  const summary = getLocalizedValue(caseStudy.summary, locale);
  const content = getLocalizedRichText(caseStudy.content, locale);
  const projectName = getLocalizedValue(caseStudy.project.name, locale);
  const projectDescription = getLocalizedValue(caseStudy.project.description, locale);
  const achievements = getLocalizedRichText(caseStudy.results.achievements, locale);

  // 案例类型映射
  const caseTypeMap: Record<string, { label: string; color: string; icon: string }> = {
    'product-development': { label: t('caseTypes.productDevelopment'), color: 'bg-blue-100 text-blue-800', icon: '🚀' },
    'system-integration': { label: t('caseTypes.systemIntegration'), color: 'bg-green-100 text-green-800', icon: '🔗' },
    'technology-upgrade': { label: t('caseTypes.technologyUpgrade'), color: 'bg-purple-100 text-purple-800', icon: '⬆️' },
    'cost-optimization': { label: t('caseTypes.costOptimization'), color: 'bg-orange-100 text-orange-800', icon: '💰' },
    'performance-improvement': { label: t('caseTypes.performanceImprovement'), color: 'bg-red-100 text-red-800', icon: '📈' },
    'problem-solving': { label: t('caseTypes.problemSolving'), color: 'bg-yellow-100 text-yellow-800', icon: '🔧' }
  };

  const complexityMap: Record<string, { label: string; color: string }> = {
    simple: { label: t('complexity.simple'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('complexity.medium'), color: 'bg-blue-100 text-blue-800' },
    complex: { label: t('complexity.complex'), color: 'bg-orange-100 text-orange-800' },
    'high-complex': { label: t('complexity.highComplex'), color: 'bg-red-100 text-red-800' }
  };

  const severityMap = {
    low: { label: t('severity.low'), color: 'bg-green-100 text-green-800', icon: CheckCircle },
    medium: { label: t('severity.medium'), color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    high: { label: t('severity.high'), color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    critical: { label: t('severity.critical'), color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  };

  const typeInfo = caseTypeMap[caseStudy.caseType];
  const complexityInfo = complexityMap[caseStudy.complexity];

  // 计算项目持续时间
  const projectDuration = caseStudy.project.duration ||
    Math.ceil((new Date(caseStudy.project.endDate).getTime() - new Date(caseStudy.project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));

  // 图片列表（封面图 + 画廊）
  const images = [
    caseStudy.coverImage,
    ...(caseStudy.gallery || [])
  ].filter(Boolean);

  // 平均评分
  const avgRating = caseStudy.testimonials?.length
    ? caseStudy.testimonials.reduce((sum, t) => sum + t.rating, 0) / caseStudy.testimonials.length
    : 0;

  return (
    <div className={className}>
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/cases">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToCases')}
          </Link>
        </Button>
      </div>

      {/* 案例头部 */}
      <Card className="mb-8">
        <CardHeader>
          {/* 标签区域 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {typeInfo && (
              <Badge className={typeInfo.color}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>
            )}

            {complexityInfo && (
              <Badge className={complexityInfo.color}>
                {complexityInfo.label}
              </Badge>
            )}

            {caseStudy.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                {t('featured')}
              </Badge>
            )}

            {caseStudy.industries && caseStudy.industries.length > 0 && (
              <Badge variant="outline">
                {getLocalizedValue(caseStudy.industries[0].name, locale)}
                {caseStudy.industries.length > 1 && ` +${caseStudy.industries.length - 1}`}
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

          {/* 客户和项目信息 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 pt-4 border-t gap-4">
            <div className="flex items-center gap-4">
              {caseStudy.customer.logo?.asset && (
                <Image
                  src={caseStudy.customer.logo.asset.url}
                  alt={caseStudy.customer.name}
                  width={48}
                  height={48}
                  className="rounded border"
                />
              )}
              <div>
                <h3 className="font-semibold">
                  {caseStudy.customer.confidential ? t('confidentialClient') : caseStudy.customer.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {caseStudy.customer.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {caseStudy.customer.location}
                  </span>
                  {caseStudy.customer.website && (
                    <a
                      href={caseStudy.customer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {t('website')}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                {t('bookmark')}
              </Button>
              <Button variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('share')}
              </Button>
              <Button>
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('contact')}
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
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="challenges">{t('tabs.challenges')}</TabsTrigger>
              <TabsTrigger value="solutions">{t('tabs.solutions')}</TabsTrigger>
              <TabsTrigger value="results">{t('tabs.results')}</TabsTrigger>
              <TabsTrigger value="testimonials">{t('tabs.testimonials')}</TabsTrigger>
              <TabsTrigger value="resources">{t('tabs.resources')}</TabsTrigger>
            </TabsList>

            {/* 概览 */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* 项目信息 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t('projectInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">{projectName}</h4>
                        <p className="text-muted-foreground mb-4">{projectDescription}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{t('startDate')}</p>
                              <p className="text-muted-foreground">
                                {dateShort(new Date(caseStudy.project.startDate))}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{t('endDate')}</p>
                              <p className="text-muted-foreground">
                                {dateShort(new Date(caseStudy.project.endDate))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{projectDuration}</p>
                          <p className="text-sm text-muted-foreground">{t('months')}</p>
                        </div>

                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{caseStudy.project.teamSize}</p>
                          <p className="text-sm text-muted-foreground">{t('teamMembers')}</p>
                        </div>

                        {caseStudy.project.budget && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg col-span-2">
                            <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">
                              {currency(caseStudy.project.budget)} {caseStudy.project.currency}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('projectBudget')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 案例内容 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-slate max-w-none">
                      <PortableTextRenderer value={content} />
                    </div>

                    {/* 应用领域和标签 */}
                    <div className="mt-8 pt-6 border-t space-y-4">
                      {caseStudy.applications && caseStudy.applications.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">{t('applications')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.applications.map((app, index) => (
                              <Badge key={index} variant="outline">
                                {app}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {caseStudy.tags && caseStudy.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">{t('tags')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 技术挑战 */}
            <TabsContent value="challenges">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {t('technicalChallenges')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {caseStudy.challenges && caseStudy.challenges.length > 0 ? (
                    <div className="space-y-6">
                      {caseStudy.challenges.map((challenge, index) => {
                        const severityInfo = severityMap[challenge.severity];
                        const SeverityIcon = severityInfo.icon;

                        return (
                          <div key={index} className="border-l-4 border-primary pl-4">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-lg">
                                {getLocalizedValue(challenge.title, locale)}
                              </h4>
                              <Badge className={cn('ml-2', severityInfo.color)}>
                                <SeverityIcon className="w-3 h-3 mr-1" />
                                {severityInfo.label}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {getLocalizedValue(challenge.description, locale)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noChallengesDocumented')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 解决方案 */}
            <TabsContent value="solutions">
              <div className="space-y-6">
                {caseStudy.solutions && caseStudy.solutions.length > 0 ? (
                  caseStudy.solutions.map((solution, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          {getLocalizedValue(solution.title, locale)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-slate max-w-none mb-6">
                          <PortableTextRenderer
                            value={getLocalizedRichText(solution.description, locale)}
                          />
                        </div>

                        {/* 使用的产品 */}
                        {solution.products && solution.products.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium mb-3">{t('productsUsed')}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {solution.products.map((product) => (
                                <div key={product._id} className="flex items-center gap-3 p-3 border rounded-lg">
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
                                      className="font-medium hover:text-primary transition-colors"
                                    >
                                      {getLocalizedValue(product.name, locale)}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 技术栈 */}
                        {solution.technologies && solution.technologies.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-3">{t('technologies')}</h5>
                            <div className="flex flex-wrap gap-2">
                              {solution.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8 text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noSolutionsDocumented')}</p>
                    </CardContent>
                  </Card>
                )}

                {/* 技术规格 */}
                {caseStudy.technicalSpecs && caseStudy.technicalSpecs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {t('technicalSpecifications')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="border border-border p-3 text-left font-semibold">
                                {t('category')}
                              </th>
                              <th className="border border-border p-3 text-left font-semibold">
                                {t('specification')}
                              </th>
                              <th className="border border-border p-3 text-left font-semibold">
                                {t('value')}
                              </th>
                              <th className="border border-border p-3 text-left font-semibold">
                                {t('notes')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {caseStudy.technicalSpecs.map((spec, index) => (
                              <tr key={index} className="hover:bg-muted/30 transition-colors">
                                <td className="border border-border p-3">{spec.category}</td>
                                <td className="border border-border p-3">{spec.specification}</td>
                                <td className="border border-border p-3">
                                  {spec.value} {spec.unit}
                                </td>
                                <td className="border border-border p-3">
                                  {spec.notes || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 项目成果 */}
            <TabsContent value="results">
              <div className="space-y-6">
                {/* 关键指标 */}
                {caseStudy.results?.metrics && caseStudy.results.metrics.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t('keyMetrics')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {caseStudy.results.metrics.map((metric, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">{metric.metric}</h5>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm text-muted-foreground">{t('before')}</p>
                                <p className="text-lg font-bold text-red-600">
                                  {metric.before} {metric.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{t('after')}</p>
                                <p className="text-lg font-bold text-green-600">
                                  {metric.after} {metric.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{t('improvement')}</p>
                                <p className="text-lg font-bold text-primary">
                                  {metric.improvement}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ROI */}
                {caseStudy.results?.roi && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        {t('returnOnInvestment')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-8">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                          {caseStudy.results.roi}%
                        </div>
                        <p className="text-muted-foreground">
                          {t('roiDescription')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 主要成就 */}
                {achievements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t('keyAchievements')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-slate max-w-none">
                        <PortableTextRenderer value={achievements} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 客户反馈 */}
            <TabsContent value="testimonials">
              <div className="space-y-6">
                {caseStudy.testimonials && caseStudy.testimonials.length > 0 ? (
                  caseStudy.testimonials.map((testimonial, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          {testimonial.avatar?.asset && (
                            <Image
                              src={testimonial.avatar.asset.url}
                              alt={testimonial.author}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <div className="prose prose-slate max-w-none mb-4">
                              <PortableTextRenderer
                                value={getLocalizedRichText(testimonial.quote, locale)}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{testimonial.author}</p>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.position} • {testimonial.company}
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      'w-4 h-4',
                                      i < testimonial.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    )}
                                  />
                                ))}
                                <span className="ml-1 text-sm text-muted-foreground">
                                  {testimonial.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>{t('noTestimonialsAvailable')}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 下载资源 */}
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t('downloadResources')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {caseStudy.downloads && caseStudy.downloads.length > 0 ? (
                    <div className="space-y-4">
                      {caseStudy.downloads.map((download, index) => (
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
                      <p>{t('noResourcesAvailable')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 案例统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('caseStats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('publishedAt')}</span>
                <span>{dateShort(new Date(caseStudy.publishedAt))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('views')}</span>
                <span>{caseStudy.viewCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('complexity')}</span>
                <Badge className={complexityInfo?.color}>
                  {complexityInfo?.label}
                </Badge>
              </div>
              {avgRating > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('rating')}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{avgRating.toFixed(1)}/5</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 相关产品 */}
          {caseStudy.products && caseStudy.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('productsUsed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseStudy.products.slice(0, 3).map((product) => (
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
                  {caseStudy.products.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      {t('viewMore')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 相关解决方案 */}
          {caseStudy.relatedSolutions && caseStudy.relatedSolutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('relatedSolutions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseStudy.relatedSolutions.map((solution) => (
                    <Link
                      key={solution._id}
                      href={solution.primaryBrand?.slug
                        ? `/brands/${encodeURIComponent(solution.primaryBrand.slug)}/solutions/${solution.slug.current}`
                        : `/solutions/${solution.slug.current}`
                      }
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm line-clamp-2">
                        {getLocalizedValue(solution.title, locale)}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 相关案例 */}
      {relatedCases.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {t('relatedCases')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCases.slice(0, 3).map((relatedCase) => (
              <Card key={relatedCase._id} className="group hover:shadow-lg transition-all duration-300">
                {relatedCase.coverImage?.asset && (
                  <div className="relative aspect-video">
                    <Image
                      src={relatedCase.coverImage.asset.url}
                      alt={relatedCase.coverImage.alt || getLocalizedValue(relatedCase.title, locale)}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/cases/${relatedCase.slug.current}`}>
                      {getLocalizedValue(relatedCase.title, locale)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {getLocalizedValue(relatedCase.summary, locale)}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {relatedCase.customer.confidential
                        ? t('confidentialClient')
                        : relatedCase.customer.name
                      }
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {caseTypeMap[relatedCase.caseType]?.label}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
