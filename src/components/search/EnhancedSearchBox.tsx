'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchSuggestion {
  id: string;
  type: 'product' | 'brand' | 'category' | 'recent';
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
}

interface EnhancedSearchBoxProps {
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

const RECENT_SEARCHES_KEY = 'litong_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function EnhancedSearchBox({
  placeholder = '搜索产品、品牌或型号...',
  showSuggestions = true,
  onSearch,
  className = ''
}: EnhancedSearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 从localStorage加载最近搜索
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('加载最近搜索失败:', error);
    }
  }, []);

  // 保存最近搜索到localStorage
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    try {
      const newRecentSearches = [
        searchTerm,
        ...recentSearches.filter(s => s !== searchTerm)
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(newRecentSearches);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));
    } catch (error) {
      console.error('保存最近搜索失败:', error);
    }
  }, [recentSearches]);

  // 模拟搜索建议API（实际应用中应调用真实API）
  const fetchSuggestions = useCallback(async (searchTerm: string): Promise<SearchSuggestion[]> => {
    if (!searchTerm.trim()) return [];

    setIsLoading(true);

    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      // 模拟搜索结果
      const mockSuggestions: SearchSuggestion[] = [
        // 产品建议
        {
          id: 'prod-1',
          type: 'product',
          title: 'C3M0065090D SiC MOSFET',
          subtitle: 'Cree - 650V 90mΩ 功率MOSFET',
          url: '/zh-CN/products/c3m0065090d',
          image: '/images/products/sic-mosfet.jpg'
        },
        {
          id: 'prod-2',
          type: 'product',
          title: 'LA 25-P 电流传感器',
          subtitle: 'LEM - ±25A 霍尔效应传感器',
          url: '/zh-CN/products/la25-p',
          image: '/images/products/current-sensor.jpg'
        },
        // 品牌建议
        {
          id: 'brand-1',
          type: 'brand',
          title: 'Wolfspeed (Cree)',
          subtitle: 'SiC功率半导体领导者',
          url: '/zh-CN/brands/cree',
          image: '/images/brands/cree-logo.png'
        },
        {
          id: 'brand-2',
          type: 'brand',
          title: 'LEM',
          subtitle: '电流电压传感器专家',
          url: '/zh-CN/brands/lem',
          image: '/images/brands/lem-logo.png'
        },
        // 分类建议
        {
          id: 'cat-1',
          type: 'category',
          title: 'SiC功率器件',
          subtitle: '碳化硅MOSFET和二极管',
          url: '/zh-CN/categories/sic-power-devices'
        },
        {
          id: 'cat-2',
          type: 'category',
          title: '电流传感器',
          subtitle: '霍尔效应和分流器传感器',
          url: '/zh-CN/categories/current-sensors'
        }
      ];

      // 根据搜索词过滤建议
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filtered.slice(0, 6);
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 当搜索词变化时获取建议
  useEffect(() => {
    if (debouncedQuery && showSuggestions) {
      fetchSuggestions(debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, showSuggestions, fetchSuggestions]);

  // 处理搜索提交
  const handleSearch = useCallback((searchTerm?: string) => {
    const finalQuery = searchTerm || query;
    if (!finalQuery.trim()) return;

    saveRecentSearch(finalQuery);
    setIsOpen(false);

    if (onSearch) {
      onSearch(finalQuery);
    } else {
      router.push(`/zh-CN/search?q=${encodeURIComponent(finalQuery)}`);
    }
  }, [query, onSearch, router, saveRecentSearch]);

  // 处理建议点击
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.title);
    setIsOpen(false);
    router.push(suggestion.url);
  }, [router, saveRecentSearch]);

  // 处理清除最近搜索
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘导航处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [handleSearch]);

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'brand':
        return <div className="h-4 w-4 bg-blue-500 rounded-full" />;
      case 'category':
        return <div className="h-4 w-4 bg-green-500 rounded-sm" />;
      default:
        return <div className="h-4 w-4 bg-orange-500 rounded-sm" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg bg-white shadow-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                     transition-all duration-200"
          />

          {/* 右侧按钮组 */}
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-full transition-colors ${
                showFilters
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleSearch()}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700
                       transition-colors font-medium"
            >
              搜索
            </button>
          </div>
        </div>
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200
                      rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">

          {/* 加载状态 */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
              搜索中...
            </div>
          )}

          {/* 搜索建议 */}
          {!isLoading && suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                搜索建议
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50
                           text-left transition-colors"
                >
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    getSuggestionIcon(suggestion.type)
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  <TrendingUp className="h-4 w-4 text-gray-300" />
                </button>
              ))}
            </div>
          )}

          {/* 最近搜索 */}
          {!isLoading && !query && recentSearches.length > 0 && (
            <div className="py-2 border-t border-gray-100">
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  最近搜索
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  清除
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50
                           text-left transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* 无结果 */}
          {!isLoading && query && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>未找到相关建议</p>
              <p className="text-sm mt-1">尝试搜索产品型号或品牌名称</p>
            </div>
          )}
        </div>
      )}

      {/* 快速筛选器（可选） */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-white border border-gray-200
                      rounded-lg shadow-lg z-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-600">
              功率器件
            </button>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-600">
              传感器
            </button>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-600">
              电容器
            </button>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-600">
              微控制器
            </button>
          </div>
        </div>
      )}
    </div>
  );
}