'use client';

import { useState, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  BookOpen,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Award,
  Users,
  Clock,
  Target,
  CheckCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useFormatters } from '@/hooks/use-formatters';
import type { Locale } from '@/i18n';
import { getLocalizedValue } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 案例研究类型定义
interface CaseStudy {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  summary: Record<Locale, string>
  coverImage: {
    asset: any
    alt: string
    caption?: string
  }
  customer: {
    name: string
    industry: string
    location: string
    logo?: { asset: any }
    confidential: boolean
  }
  project: {
    name: Record<Locale, string>
    startDate: string
    endDate: string
    duration: number
    teamSize: number
    budget: number
    currency: string
  }
  industries: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
  applications: string[]
  tags: string[]
  caseType: 'product-development' | 'system-integration' | 'technology-upgrade' | 'cost-optimization' | 'performance-improvement' | 'problem-solving'
  complexity: 'simple' | 'medium' | 'complex' | 'high-complex'
  publishedAt: string
  isFeatured: boolean
  viewCount: number
  challenges: Array<{
    title: Record<Locale, string>
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  results: {
    metrics: Array<{
      metric: string
      before: string
      after: string
      improvement: string
    }>
    roi?: number
  }
  testimonials?: Array<{
    author: string
    position: string
    company: string
    rating: number
  }>
}

interface CaseStudyListProps {
  cases: CaseStudy[]
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

export function CaseStudyList({
  cases,
  industries,
  locale,
  totalCount,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  className
}: CaseStudyListProps) {
  const t = useTranslations('caseStudies');
  const { dateShort, currency } = useFormatters();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured' | 'roi'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 案例类型映射
  const caseTypeMap = {
    'product-development': { label: t('caseTypes.productDevelopment'), color: 'bg-blue-100 text-blue-800', icon: '🚀' },
    'system-integration': { label: t('caseTypes.systemIntegration'), color: 'bg-green-100 text-green-800', icon: '🔗' },
    'technology-upgrade': { label: t('caseTypes.technologyUpgrade'), color: 'bg-purple-100 text-purple-800', icon: '⬆️' },
    'cost-optimization': { label: t('caseTypes.costOptimization'), color: 'bg-orange-100 text-orange-800', icon: '💰' },
    'performance-improvement': { label: t('caseTypes.performanceImprovement'), color: 'bg-red-100 text-red-800', icon: '📈' },
    'problem-solving': { label: t('caseTypes.problemSolving'), color: 'bg-yellow-100 text-yellow-800', icon: '🔧' }
  };

  // 复杂度映射
  const complexityMap = {
    simple: { label: t('complexity.simple'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('complexity.medium'), color: 'bg-blue-100 text-blue-800' },
    complex: { label: t('complexity.complex'), color: 'bg-orange-100 text-orange-800' },
    'high-complex': { label: t('complexity.highComplex'), color: 'bg-red-100 text-red-800' }
  };

  // 严重程度映射
  const severityMap = {
    low: { label: t('severity.low'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('severity.medium'), color: 'bg-yellow-100 text-yellow-800' },
    high: { label: t('severity.high'), color: 'bg-orange-100 text-orange-800' },
    critical: { label: t('severity.critical'), color: 'bg-red-100 text-red-800' }
  };

  // 过滤案例
  const filteredCases = useMemo(() => {
    return cases.filter(caseStudy => {
      const title = getLocalizedValue(caseStudy.title, locale).toLowerCase();
      const summary = getLocalizedValue(caseStudy.summary, locale).toLowerCase();
      const customerName = caseStudy.customer.name.toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = !searchTerm ||
        title.includes(search) ||
        summary.includes(search) ||
        customerName.includes(search) ||
        caseStudy.applications?.some(app => app.toLowerCase().includes(search)) ||
        caseStudy.tags?.some(tag => tag.toLowerCase().includes(search));

      const matchesIndustry = selectedIndustry === 'all' ||
        caseStudy.industries?.some(industry => industry._id === selectedIndustry);

      const matchesType = selectedType === 'all' || caseStudy.caseType === selectedType;
      const matchesComplexity = selectedComplexity === 'all' || caseStudy.complexity === selectedComplexity;

      return matchesSearch && matchesIndustry && matchesType && matchesComplexity;
    });
  }, [cases, searchTerm, selectedIndustry, selectedType, selectedComplexity, locale]);

  // 排序案例
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.viewCount - a.viewCount;
        case 'featured':
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'roi':
          const aROI = a.results?.roi || 0;
          const bROI = b.results?.roi || 0;
          return bROI - aROI;
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
  }, [filteredCases, sortBy]);

  // 分页计算
  const totalPages = Math.ceil(sortedCases.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCases = sortedCases.slice(startIndex, startIndex + pageSize);

  const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
    const title = getLocalizedValue(caseStudy.title, locale);
    const summary = getLocalizedValue(caseStudy.summary, locale);
    const projectName = getLocalizedValue(caseStudy.project.name, locale);
    const typeInfo = caseTypeMap[caseStudy.caseType];
    const complexityInfo = complexityMap[caseStudy.complexity];

    // 计算项目持续时间
    const duration = caseStudy.project.duration ||
      Math.ceil((new Date(caseStudy.project.endDate).getTime() - new Date(caseStudy.project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));

    // 获取最高严重程度的挑战
    const highestSeverity = caseStudy.challenges?.reduce((max, challenge) => {
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      return severityOrder[challenge.severity] > severityOrder[max] ? challenge.severity : max;
    }, 'low' as keyof typeof severityMap);

    // 平均评分
    const avgRating = caseStudy.testimonials?.length
      ? caseStudy.testimonials.reduce((sum, t) => sum + t.rating, 0) / caseStudy.testimonials.length
      : 0;

    return (
      <Card className={cn(
        'group hover:shadow-lg transition-all duration-300',
        viewMode === 'list' && 'flex flex-row'
      )}>
        <div className={cn(
          'relative',
          viewMode === 'grid' ? 'aspect-video' : 'w-64 flex-shrink-0'
        )}>
          {caseStudy.coverImage?.asset && (
            <Image
              src={caseStudy.coverImage.asset.url}
              alt={caseStudy.coverImage.alt || title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* 特色标识 */}
          {caseStudy.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              {t('featured')}
            </Badge>
          )}

          {/* 复杂度标识 */}
          <Badge className={cn('absolute top-3 right-3', complexityInfo.color)}>
            {complexityInfo.label}
          </Badge>

          {/* 挑战严重程度 */}
          {highestSeverity && highestSeverity !== 'low' && (
            <Badge className={cn('absolute bottom-3 left-3', severityMap[highestSeverity].color)}>
              {severityMap[highestSeverity].label}
            </Badge>
          )}

          {/* ROI指示器 */}
          {caseStudy.results?.roi && caseStudy.results.roi > 0 && (
            <div className="absolute bottom-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
              ROI: {caseStudy.results.roi}%
            </div>
          )}
        </div>

        <div className="flex-1">
          <CardHeader className={cn(viewMode === 'list' && 'py-4')}>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={typeInfo.color}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>

              {caseStudy.industries && caseStudy.industries.length > 0 && (
                <Badge variant="outline">
                  {getLocalizedValue(caseStudy.industries[0].name, locale)}
                  {caseStudy.industries.length > 1 && ` +${caseStudy.industries.length - 1}`}
                </Badge>
              )}
            </div>

            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/cases/${caseStudy.slug.current}`}>
                {title}
              </Link>
            </CardTitle>

            {summary && (
              <CardDescription className="line-clamp-3">
                {summary}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className={cn(viewMode === 'list' && 'py-0 pb-4')}>
            {/* 客户信息 */}
            <div className="flex items-center gap-3 mb-4">
              {caseStudy.customer.logo?.asset && (
                <Image
                  src={caseStudy.customer.logo.asset.url}
                  alt={caseStudy.customer.name}
                  width={32}
                  height={32}
                  className="rounded border"
                />
              )}
              <div>
                <p className="font-medium text-sm">
                  {caseStudy.customer.confidential ? t('confidentialClient') : caseStudy.customer.name}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {caseStudy.customer.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {caseStudy.customer.location}
                  </span>
                </div>
              </div>
            </div>

            {/* 项目信息 */}
            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {projectName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {duration} {t('months')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {caseStudy.project.teamSize} {t('people')}
                </span>
                {caseStudy.project.budget > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {currency(caseStudy.project.budget)} {caseStudy.project.currency}
                  </span>
                )}
              </div>
            </div>

            {/* 关键成果指标 */}
            {caseStudy.results?.metrics && caseStudy.results.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {caseStudy.results.metrics.slice(0, 2).map((metric, index) => (
                  <div key={index} className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">{metric.metric}</p>
                    <p className="font-bold text-green-600">{metric.improvement}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 标签和评分 */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {caseStudy.tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {caseStudy.tags && caseStudy.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{caseStudy.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{avgRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{caseStudy.viewCount || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

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

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                {Object.entries(caseTypeMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.icon} {value.label}
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
          </div>
        </div>

        {/* 排序和视图切换 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('showingResults', {
              count: sortedCases.length,
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
                <SelectItem value="roi">{t('sortBy.roi')}</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* 视图切换 */}
            <div className="flex items-center">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
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

      {/* 案例列表 */}
      {paginatedCases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">{t('noCasesFound')}</p>
            <p className="text-muted-foreground mb-4">{t('tryAdjustingFilters')}</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedIndustry('all');
              setSelectedType('all');
              setSelectedComplexity('all');
            }}>
              {t('clearFilters')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          'gap-6',
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            : 'flex flex-col'
        )}>
          {paginatedCases.map((caseStudy) => (
            <CaseStudyCard key={caseStudy._id} caseStudy={caseStudy} />
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
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
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
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sortedCases.length}</p>
                <p className="text-sm text-muted-foreground">{t('totalCases')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sortedCases.filter(c => c.isFeatured).length}
                </p>
                <p className="text-sm text-muted-foreground">{t('featuredCases')}</p>
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
                  {sortedCases.reduce((sum, c) => sum + (c.viewCount || 0), 0).toLocaleString()}
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
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(sortedCases
                    .filter(c => c.results?.roi)
                    .reduce((sum, c) => sum + (c.results?.roi || 0), 0) /
                    sortedCases.filter(c => c.results?.roi).length || 0
                  ).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">{t('avgROI')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
