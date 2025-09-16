'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { Heart, User, LogOut, ShoppingCart } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useSearch } from '@/contexts/SearchContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useOrder();
  const { searchQuery, setSearchQuery, search, searchSuggestions, updateSearchSuggestions } = useSearch();
  const wishlistCount = 0; // 临时设置为0，后续会从Context获取

  // 从当前路径中提取locale
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    const supportedLocales = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'ar'];
    const locale = segments[1];
    return supportedLocales.includes(locale) ? locale : 'zh-CN';
  };

  const currentLocale = getCurrentLocale();

  // 动态构建导航配置，包含locale前缀
  const navigation = [
    { name: '首页', href: `/${currentLocale}` },
    { name: '品牌中心', href: `/${currentLocale}/brands` },
    { name: '产品分类', href: `/${currentLocale}/categories` },
    { name: '关于我们', href: `/${currentLocale}/about` },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery.trim());
      router.push(`/${currentLocale}/search`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">力</span>
            </div>
            <span className="text-xl font-bold text-gray-900">力通电子</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateSearchSuggestions(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="搜索产品..."
                  className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        search(suggestion);
                        router.push(`/${currentLocale}/search`);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {suggestion}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" asChild className="relative">
              <Link href={`/${currentLocale}/cart`}>
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild className="relative">
              <Link href={`/${currentLocale}/wishlist`}>
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button size="sm" asChild>
              <Link href={`/${currentLocale}/inquiry`}>
                获取报价
              </Link>
            </Button>

            {/* 用户认证区域 */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${currentLocale}/profile`} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${currentLocale}/auth/login`}>登录</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/${currentLocale}/auth/register`}>注册</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索产品..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
              </div>
              <div className="px-3 space-y-3">
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href={`/${currentLocale}/cart`} className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    购物车 ({cartCount})
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href={`/${currentLocale}/wishlist`} className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    心愿单 ({wishlistCount})
                  </Link>
                </Button>
                <Button className="w-full" size="sm" asChild>
                  <Link href={`/${currentLocale}/inquiry`}>
                    获取报价
                  </Link>
                </Button>

                {/* 移动端用户认证 */}
                <div className="border-t pt-3 mt-3">
                  {user ? (
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                        <Link href={`/${currentLocale}/profile`} className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {user.name}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start text-red-600 hover:text-red-800"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        退出登录
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/${currentLocale}/auth/login`} onClick={() => setIsMenuOpen(false)}>
                          登录
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="w-full">
                        <Link href={`/${currentLocale}/auth/register`} onClick={() => setIsMenuOpen(false)}>
                          注册
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
