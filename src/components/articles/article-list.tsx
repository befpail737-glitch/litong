'use client';

import { useState, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { CalendarDays, Clock, User, Tag, Star, Search, Filter } from 'lucide-react';
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

// 文章类型定义
interface Article {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  image: {
    asset: any
    alt: string
    caption?: string
  }
  author: {
    name: string
    slug: { current: string }
    image?: { asset: any }
  }
  category: {
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  readTime: number
  publishedAt: string
  isFeatured: boolean
}

interface ArticleListProps {
  articles: Article[]
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
  className?: string
}

export function ArticleList({
  articles,
  categories,
  locale,
  totalCount,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  className
}: ArticleListProps) {
  const t = useTranslations('articles');
  const { dateShort } = useFormatters();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 难度级别映射
  const difficultyMap = {
    beginner: { label: t('difficulty.beginner'), color: 'bg-green-100 text-green-800' },
    intermediate: { label: t('difficulty.intermediate'), color: 'bg-blue-100 text-blue-800' },
    advanced: { label: t('difficulty.advanced'), color: 'bg-orange-100 text-orange-800' },
    expert: { label: t('difficulty.expert'), color: 'bg-red-100 text-red-800' }
  };

  // 过滤文章
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = getLocalizedValue(article.title, locale).toLowerCase();
      const excerpt = getLocalizedValue(article.excerpt, locale).toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = !searchTerm || title.includes(search) || excerpt.includes(search);
      const matchesCategory = selectedCategory === 'all' || article.category?.slug.current === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [articles, searchTerm, selectedCategory, selectedDifficulty, locale]);

  // 分页计算
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);

  const ArticleCard = ({ article }: { article: Article }) => {
    const title = getLocalizedValue(article.title, locale);
    const excerpt = getLocalizedValue(article.excerpt, locale);
    const categoryTitle = getLocalizedValue(article.category.title, locale);

    return (
      <Card className={cn('group hover:shadow-lg transition-all duration-300', viewMode === 'list' && 'flex flex-row')}>
        <div className={cn('relative', viewMode === 'grid' ? 'aspect-video' : 'w-48 flex-shrink-0')}>
          {article.image?.asset && (
            <Image
              src={article.image.asset.url}
              alt={article.image.alt || title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {article.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              {t('featured')}
            </Badge>
          )}
          <Badge
            className={cn('absolute top-2 right-2', difficultyMap[article.difficulty].color)}
          >
            {difficultyMap[article.difficulty].label}
          </Badge>
        </div>

        <div className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                style={{
                  borderColor: article.category.color,
                  color: article.category.color
                }}
              >
                {categoryTitle}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime} {t('minRead')}
              </Badge>
            </div>

            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/articles/${article.slug.current}`}>
                {title}
              </Link>
            </CardTitle>

            {excerpt && (
              <CardDescription className="line-clamp-3">
                {excerpt}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {/* 标签 */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 作者和日期 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {article.author.image?.asset && (
                  <Image
                    src={article.author.image.asset.url}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <User className="w-4 h-4" />
                <Link
                  href={`/authors/${article.author.slug.current}`}
                  className="hover:text-primary transition-colors"
                >
                  {article.author.name}
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {dateShort(new Date(article.publishedAt))}
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
        <div className="flex flex-col sm:flex-row gap-4">
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

          {/* 分类过滤 */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
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

          {/* 难度过滤 */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('selectDifficulty')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allDifficulties')}</SelectItem>
              {Object.entries(difficultyMap).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 视图切换和结果统计 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('showingResults', {
              count: filteredArticles.length,
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

      {/* 文章列表 */}
      {paginatedArticles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('noArticlesFound')}</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
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
          {paginatedArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
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
    </div>
  );
}
