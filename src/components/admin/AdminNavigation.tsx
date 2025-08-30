'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
}

export default function AdminNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string || 'zh';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const navigation: NavItem[] = [
    { 
      name: '仪表板', 
      href: `/${locale}/admin/dashboard`, 
      icon: '📊', 
      description: '系统概览和统计数据' 
    },
    { 
      name: '产品管理', 
      href: `/${locale}/admin/products`, 
      icon: '📦', 
      description: '产品信息管理和批量导入' 
    },
    { 
      name: '品牌管理', 
      href: `/${locale}/admin/brands`, 
      icon: '🏷️', 
      description: '品牌信息配置和管理' 
    },
    { 
      name: '文章管理', 
      href: `/${locale}/admin/articles`, 
      icon: '📝', 
      description: '技术文章和内容管理' 
    },
    { 
      name: '解决方案', 
      href: `/${locale}/admin/solutions`, 
      icon: '💡', 
      description: '解决方案案例管理' 
    },
    { 
      name: '新闻管理', 
      href: `/${locale}/admin/news`, 
      icon: '📰', 
      description: '新闻资讯发布管理' 
    },
    { 
      name: '用户管理', 
      href: `/${locale}/admin/users`, 
      icon: '👥', 
      description: '系统用户和权限管理' 
    },
    { 
      name: '系统设置', 
      href: `/${locale}/admin/settings`, 
      icon: '⚙️', 
      description: '系统配置和参数设置' 
    },
    { 
      name: 'Sanity管理', 
      href: `/${locale}/admin/sanity`, 
      icon: '☁️', 
      description: 'Sanity CMS内容管理' 
    }
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/admin/dashboard`) {
      return pathname === `/${locale}/admin` || pathname === `/${locale}/admin/dashboard`;
    }
    return pathname?.startsWith(href);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render toggle functionality until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="w-64 bg-white shadow-lg transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                LT
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">LiTong</h1>
                <p className="text-xs text-gray-500">管理系统</p>
              </div>
            </div>
            <button
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="ml-3">
                <div>{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">管</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">管理员</p>
              <p className="text-xs text-gray-500">admin@litong.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              LT
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">LiTong</h1>
                <p className="text-xs text-gray-500">管理系统</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isSidebarOpen && (
              <div className="ml-3">
                <div>{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">管</span>
          </div>
          {isSidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">管理员</p>
              <p className="text-xs text-gray-500">admin@litong.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}