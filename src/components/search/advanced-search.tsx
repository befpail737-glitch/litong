'use client';

import { useState, useEffect, useMemo } from 'react';

import {
  Search,
  Filter,
  X,
  Calendar,
  FileText,
  Tag,
  User,
  Clock,
  TrendingUp,
  History,
  Bookmark,
  Download,
  Eye,
  Star,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import type { Locale } from '@/i18n';
import { getLocalizedValue } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 搜索过滤器类型
interface SearchFilters {
  query: string
  contentTypes: string[]
  categories: string[]
  tags: string[]
  authors: string[]
  dateRange: {
    start?: Date
    end?: Date
  }
  readTimeRange: [number, number]
  difficulty: string[]
  languages: string[]
  sortBy: 'relevance' | 'date' | 'popularity' | 'title' | 'readTime'
  sortOrder: 'asc' | 'desc'
  includeContent: boolean
  fuzzySearch: boolean
}

// 搜索建议类型
interface SearchSuggestion {
  type: 'query' | 'tag' | 'category' | 'author'
  value: string
  count?: number
  recent?: boolean
}

// 搜索结果类型
interface SearchResult {
  id: string
  type: 'article' | 'document' | 'product'
  title: string
  excerpt: string
  url: string
  score: number
  highlights: string[]
  metadata: {
    author?: string
    category?: string
    publishedAt?: string
    readTime?: number
    downloadCount?: number
    tags?: string[]
  }
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onResultClick?: (result: SearchResult) => void
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  popularSearches?: string[]
  savedSearches?: Array<{ name: string; filters: SearchFilters }>
  locale: Locale
  className?: string
}

export function AdvancedSearch({
  onSearch,
  onResultClick,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  savedSearches = [],
  locale,
  className
}: AdvancedSearchProps) {
  const t = useTranslations('search');

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    contentTypes: [],
    categories: [],
    tags: [],
    authors: [],
    dateRange: {},
    readTimeRange: [0, 60],
    difficulty: [],
    languages: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
    includeContent: true,
    fuzzySearch: true
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; value: string; label: string }>>([]);

  // 内容类型选项
  const contentTypeOptions = [
    { value: 'article', label: t('contentTypes.article'), icon: FileText },
    { value: 'document', label: t('contentTypes.document'), icon: Download },
    { value: 'product', label: t('contentTypes.product'), icon: Star }
  ];

  // 难度级别选项
  const difficultyOptions = [
    { value: 'beginner', label: t('difficulty.beginner') },
    { value: 'intermediate', label: t('difficulty.intermediate') },
    { value: 'advanced', label: t('difficulty.advanced') },
    { value: 'expert', label: t('difficulty.expert') }
  ];

  // 语言选项
  const languageOptions = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ];

  // 排序选项
  const sortOptions = [
    { value: 'relevance', label: t('sortBy.relevance') },
    { value: 'date', label: t('sortBy.date') },
    { value: 'popularity', label: t('sortBy.popularity') },
    { value: 'title', label: t('sortBy.title') },
    { value: 'readTime', label: t('sortBy.readTime') }
  ];

  // 更新过滤器
  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 切换数组过滤器
  const toggleArrayFilter = <K extends keyof Pick<SearchFilters, 'contentTypes' | 'categories' | 'tags' | 'authors' | 'difficulty' | 'languages'>>(
    key: K,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  // 处理搜索
  const handleSearch = () => {
    onSearch(filters);
    // 添加到搜索历史
    if (filters.query.trim()) {
      // 这里可以调用API保存搜索历史
    }
  };

  // 清除过滤器
  const clearFilters = () => {
    setFilters({
      query: '',
      contentTypes: [],
      categories: [],
      tags: [],
      authors: [],
      dateRange: {},
      readTimeRange: [0, 60],
      difficulty: [],
      languages: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
      includeContent: true,
      fuzzySearch: true
    });
  };

  // 移除单个过滤器
  const removeFilter = (key: string, value?: string) => {
    if (value) {
      toggleArrayFilter(key as any, value);
    } else {
      updateFilter(key as any, key === 'dateRange' ? {} : key === 'readTimeRange' ? [0, 60] : '');
    }
  };

  // 计算活跃过滤器
  useEffect(() => {
    const active: Array<{ key: string; value: string; label: string }> = [];

    if (filters.contentTypes.length > 0) {
      filters.contentTypes.forEach(type => {
        const option = contentTypeOptions.find(opt => opt.value === type);
        if (option) {
          active.push({ key: 'contentTypes', value: type, label: option.label });
        }
      });
    }

    if (filters.difficulty.length > 0) {
      filters.difficulty.forEach(diff => {
        const option = difficultyOptions.find(opt => opt.value === diff);
        if (option) {
          active.push({ key: 'difficulty', value: diff, label: option.label });
        }
      });
    }

    if (filters.languages.length > 0) {
      filters.languages.forEach(lang => {
        const option = languageOptions.find(opt => opt.value === lang);
        if (option) {
          active.push({ key: 'languages', value: lang, label: option.label });
        }
      });
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      active.push({
        key: 'dateRange',
        value: '',
        label: `${filters.dateRange.start?.toLocaleDateString()} - ${filters.dateRange.end?.toLocaleDateString()}`
      });
    }

    if (filters.readTimeRange[0] > 0 || filters.readTimeRange[1] < 60) {
      active.push({
        key: 'readTimeRange',
        value: '',
        label: `${t('readTime')}: ${filters.readTimeRange[0]}-${filters.readTimeRange[1]} min`
      });
    }

    setActiveFilters(active);
  }, [filters, t]);

  // 搜索建议
  const filteredSuggestions = useMemo(() => {
    if (!filters.query.trim()) return [];

    return suggestions
      .filter(suggestion =>
        suggestion.value.toLowerCase().includes(filters.query.toLowerCase())
      )
      .slice(0, 8);
  }, [suggestions, filters.query]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('advancedSearch')}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t('filters')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 主搜索框 */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-12 pr-12 text-lg h-12"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10"
              >
                {t('search')}
              </Button>
            </div>

            {/* 搜索建议 */}
            {showSuggestions && (filteredSuggestions.length > 0 || recentSearches.length > 0 || popularSearches.length > 0) && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-2">
                <CardContent className="p-0">
                  {filteredSuggestions.length > 0 && (
                    <div className="p-3 border-b">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        {t('suggestions')}
                      </h4>
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            updateFilter('query', suggestion.value);
                            setShowSuggestions(false);
                          }}
                          className="block w-full text-left p-2 text-sm hover:bg-muted rounded"
                        >
                          <div className="flex items-center justify-between">
                            <span>{suggestion.value}</span>
                            {suggestion.count && (
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.count}
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {recentSearches.length > 0 && (
                    <div className="p-3 border-b">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <History className="w-4 h-4" />
                        {t('recentSearches')}
                      </h4>
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            updateFilter('query', search);
                            setShowSuggestions(false);
                          }}
                          className="block w-full text-left p-2 text-sm hover:bg-muted rounded"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  )}

                  {popularSearches.length > 0 && (
                    <div className="p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {t('popularSearches')}
                      </h4>
                      {popularSearches.slice(0, 5).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            updateFilter('query', search);
                            setShowSuggestions(false);
                          }}
                          className="block w-full text-left p-2 text-sm hover:bg-muted rounded"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* 活跃过滤器 */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm">{t('activeFilters')}:</Label>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-2">
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.key, filter.value)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('clearAll')}
              </Button>
            </div>
          )}

          {/* 高级过滤器 */}
          {showAdvancedFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('advancedFilters')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 内容类型 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">{t('contentType')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {contentTypeOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${option.value}`}
                          checked={filters.contentTypes.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('contentTypes', option.value)}
                        />
                        <Label
                          htmlFor={`type-${option.value}`}
                          className="text-sm flex items-center gap-2 cursor-pointer"
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 难度级别 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">{t('difficulty')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diff-${option.value}`}
                          checked={filters.difficulty.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('difficulty', option.value)}
                        />
                        <Label htmlFor={`diff-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 语言 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">{t('language')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${option.value}`}
                          checked={filters.languages.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('languages', option.value)}
                        />
                        <Label htmlFor={`lang-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 日期范围 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('dateFrom')}</Label>
                    <DatePicker
                      value={filters.dateRange.start}
                      onChange={(date) => updateFilter('dateRange', { ...filters.dateRange, start: date })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('dateTo')}</Label>
                    <DatePicker
                      value={filters.dateRange.end}
                      onChange={(date) => updateFilter('dateRange', { ...filters.dateRange, end: date })}
                    />
                  </div>
                </div>

                {/* 阅读时长 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    {t('readTime')}: {filters.readTimeRange[0]} - {filters.readTimeRange[1]} {t('minutes')}
                  </Label>
                  <Slider
                    value={filters.readTimeRange}
                    onValueChange={(value) => updateFilter('readTimeRange', value as [number, number])}
                    max={60}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* 排序 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('sortBy')}</Label>
                    <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('sortOrder')}</Label>
                    <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">{t('descending')}</SelectItem>
                        <SelectItem value="asc">{t('ascending')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 搜索选项 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeContent"
                      checked={filters.includeContent}
                      onCheckedChange={(checked) => updateFilter('includeContent', !!checked)}
                    />
                    <Label htmlFor="includeContent" className="text-sm cursor-pointer">
                      {t('searchInContent')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fuzzySearch"
                      checked={filters.fuzzySearch}
                      onCheckedChange={(checked) => updateFilter('fuzzySearch', !!checked)}
                    />
                    <Label htmlFor="fuzzySearch" className="text-sm cursor-pointer">
                      {t('fuzzySearch')}
                    </Label>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button onClick={handleSearch} className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    {t('applyFilters')}
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('reset')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 保存的搜索 */}
          {savedSearches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  {t('savedSearches')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedSearches.map((savedSearch, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => setFilters(savedSearch.filters)}
                      className="justify-start w-full"
                    >
                      {savedSearch.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
