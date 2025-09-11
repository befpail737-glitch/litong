'use client';

import { useState, useEffect, useMemo } from 'react';

import Link from 'next/link';

import {
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  User,
  Tag,
  BookOpen,
  TrendingUp,
  History
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Locale } from '@/i18n';
import { getLocalizedValue } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 搜索结果类型
interface SearchResult {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  author: { name: string; slug: { current: string } }
  category: {
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  readTime: number
  publishedAt: string
  relevanceScore?: number
  highlightedTitle?: string
  highlightedExcerpt?: string
}

// 搜索过滤器类型
interface SearchFilters {
  categories: string[]
  authors: string[]
  tags: string[]
  difficulty: string[]
  dateRange: {
    from?: string
    to?: string
  }
  readTimeRange: [number, number]
}

// 热门搜索词和标签
interface PopularItem {
  term: string
  count: number
  trend?: 'up' | 'down' | 'stable'
}

interface ArticleSearchProps {
  results: SearchResult[]
  categories: Array<{
    _id: string
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }>
  authors: Array<{
    _id: string
    name: string
    slug: { current: string }
  }>
  popularTags: PopularItem[]
  popularSearches: PopularItem[]
  searchHistory?: string[]
  locale: Locale
  onSearch: (query: string, filters: SearchFilters) => void
  isLoading?: boolean
  totalCount: number
  className?: string
}

export function ArticleSearch({
  results,
  categories,
  authors,
  popularTags,
  popularSearches,
  searchHistory = [],
  locale,
  onSearch,
  isLoading = false,
  totalCount,
  className
}: ArticleSearchProps) {
  const t = useTranslations('articles');

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    authors: [],
    tags: [],
    difficulty: [],
    dateRange: {},
    readTimeRange: [0, 60]
  });

  // 难度选项
  const difficultyOptions = [
    { value: 'beginner', label: t('difficulty.beginner') },
    { value: 'intermediate', label: t('difficulty.intermediate') },
    { value: 'advanced', label: t('difficulty.advanced') },
    { value: 'expert', label: t('difficulty.expert') }
  ];

  // 应用搜索
  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  // 快速搜索（热门词汇）
  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    onSearch(term, filters);
  };

  // 清除所有过滤器
  const clearFilters = () => {
    setFilters({
      categories: [],
      authors: [],
      tags: [],
      difficulty: [],
      dateRange: {},
      readTimeRange: [0, 60]
    });
  };

  // 活跃过滤器数量
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.authors.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.difficulty.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.readTimeRange[0] > 0 || filters.readTimeRange[1] < 60) count++;
    return count;
  }, [filters]);

  // 搜索建议
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const suggestions = [];

    // 从分类中匹配
    categories.forEach(category => {
      const title = getLocalizedValue(category.title, locale);
      if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({ type: 'category', label: title, value: title });
      }
    });

    // 从作者中匹配
    authors.forEach(author => {
      if (author.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({ type: 'author', label: author.name, value: author.name });
      }
    });

    // 从标签中匹配
    popularTags.forEach(tag => {
      if (tag.term.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({ type: 'tag', label: tag.term, value: tag.term });
      }
    });

    return suggestions.slice(0, 5);
  }, [searchQuery, categories, authors, popularTags, locale]);

  // 搜索结果高亮
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className={className}>
      {/* 搜索框 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* 主搜索框 */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? t('searching') : t('search')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t('filters')}
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 min-w-5 h-5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* 搜索建议 */}
              {searchSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 z-10 mt-1">
                  <CardContent className="p-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(suggestion.value)}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center gap-2"
                      >
                        {suggestion.type === 'category' && <BookOpen className="w-4 h-4" />}
                        {suggestion.type === 'author' && <User className="w-4 h-4" />}
                        {suggestion.type === 'tag' && <Tag className="w-4 h-4" />}
                        {suggestion.label}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {t(suggestion.type)}
                        </Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 快速搜索 */}
            <Tabs defaultValue="popular" className="w-full">
              <TabsList>
                <TabsTrigger value="popular">{t('popularSearches')}</TabsTrigger>
                <TabsTrigger value="tags">{t('popularTags')}</TabsTrigger>
                {searchHistory.length > 0 && (
                  <TabsTrigger value="history">{t('searchHistory')}</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="popular" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 8).map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(item.term)}
                      className="flex items-center gap-1"
                    >
                      {item.term}
                      {item.trend === 'up' && (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tags" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 12).map((tag, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(tag.term)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.term}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {tag.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              {searchHistory.length > 0 && (
                <TabsContent value="history" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 6).map((term, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickSearch(term)}
                      >
                        <History className="w-3 h-3 mr-1" />
                        {term}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* 高级过滤器 */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('advancedFilters')}
              </CardTitle>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    {t('clearFilters')}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 分类过滤 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">{t('categories')}</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={filters.categories.includes(category.slug.current)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              categories: [...prev.categories, category.slug.current]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category.slug.current)
                            }));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`category-${category._id}`}
                        className="text-sm cursor-pointer"
                      >
                        {getLocalizedValue(category.title, locale)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 难度过滤 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">{t('difficulty')}</Label>
                <div className="space-y-2">
                  {difficultyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${option.value}`}
                        checked={filters.difficulty.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              difficulty: [...prev.difficulty, option.value]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              difficulty: prev.difficulty.filter(d => d !== option.value)
                            }));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`difficulty-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 阅读时长 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  {t('readTime')}: {filters.readTimeRange[0]}-{filters.readTimeRange[1]} {t('minutes')}
                </Label>
                <Slider
                  value={filters.readTimeRange}
                  onValueChange={(value) => setFilters(prev => ({
                    ...prev,
                    readTimeRange: value as [number, number]
                  }))}
                  min={0}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 搜索结果 */}
      <div>
        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {searchQuery ? (
              t('searchResults', { query: searchQuery, count: totalCount })
            ) : (
              t('totalArticles', { count: totalCount })
            )}
          </p>
        </div>

        {/* 结果列表 */}
        {results.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">{t('noResultsFound')}</p>
                  <p className="text-muted-foreground">{t('tryDifferentKeywords')}</p>
                </div>
                <Button onClick={clearFilters}>
                  {t('clearAllFilters')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const title = getLocalizedValue(result.title, locale);
              const excerpt = getLocalizedValue(result.excerpt, locale);

              return (
                <Card key={result._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: result.category.color,
                              color: result.category.color
                            }}
                          >
                            {getLocalizedValue(result.category.title, locale)}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.readTime} min
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                          <Link
                            href={`/articles/${result.slug.current}`}
                            className="hover:text-primary transition-colors"
                            dangerouslySetInnerHTML={{
                              __html: result.highlightedTitle || highlightText(title, searchQuery)
                            }}
                          />
                        </h3>

                        <p
                          className="text-muted-foreground mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: result.highlightedExcerpt || highlightText(excerpt, searchQuery)
                          }}
                        />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {result.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(result.publishedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {result.relevanceScore && (
                            <Badge variant="outline">
                              {Math.round(result.relevanceScore * 100)}% {t('relevance')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
