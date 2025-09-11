'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Calendar,
  TrendingUp,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';

// 模拟数据
const dashboardStats = [
  {
    title: '总访问量',
    value: '24,567',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: BarChart3
  },
  {
    title: '产品查询',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: ShoppingCart
  },
  {
    title: '新用户',
    value: '456',
    change: '+23.1%',
    changeType: 'positive' as const,
    icon: Users
  },
  {
    title: '询价消息',
    value: '89',
    change: '-5.4%',
    changeType: 'negative' as const,
    icon: MessageSquare
  }
];

const recentContent = [
  {
    id: 1,
    type: 'news',
    title: 'STM32新品发布会成功举办',
    author: '管理员',
    date: '2024-01-15',
    status: 'published'
  },
  {
    id: 2,
    type: 'solution',
    title: '汽车网关解决方案更新',
    author: '技术团队',
    date: '2024-01-14',
    status: 'draft'
  },
  {
    id: 3,
    type: 'product',
    title: 'TI电源管理新品上线',
    author: '产品经理',
    date: '2024-01-13',
    status: 'published'
  }
];

const quickActions = [
  { name: '内容管理 (Sanity)', href: '/studio', icon: FileText, color: 'bg-blue-500' },
  { name: '产品管理', href: '/admin/products', icon: Package, color: 'bg-green-500' },
  { name: '用户管理', href: '/admin/users', icon: Users, color: 'bg-purple-500' },
  { name: '系统设置', href: '/admin/settings', icon: Settings, color: 'bg-orange-500' }
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* 侧边栏 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col relative`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">力通后台</span>
                <span className="text-xs text-gray-500">管理系统</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm">
              <LayoutDashboard className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">仪表盘</span>}
            </Link>

            <div className="pt-6">
              {sidebarOpen && <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">内容管理</p>}
              <div className="space-y-1">
                <Link href="/studio" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  <FileText className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">Sanity Studio</span>}
                </Link>
                <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  <Package className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">产品管理</span>}
                </Link>
              </div>
            </div>

            <div className="pt-6">
              {sidebarOpen && <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">用户数据</p>}
              <div className="space-y-1">
                <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  <Users className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">用户管理</span>}
                </Link>
                <Link href="/admin/analytics" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  <BarChart3 className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">数据分析</span>}
                </Link>
              </div>
            </div>

            <div className="pt-6">
              {sidebarOpen && <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">系统</p>}
              <div className="space-y-1">
                <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  <Settings className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">系统设置</span>}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-900"
            title={sidebarOpen ? '收起侧栏' : '展开侧栏'}
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">仪表盘</h1>
                <p className="text-gray-600 mt-1">欢迎回到力通电子后台管理系统</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索功能..."
                  className="pl-10 pr-4 py-3 w-64 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">管</span>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                    <div className="mt-3 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stat.changeType === 'positive'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">较上月</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${
                    stat.changeType === 'positive' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 快速操作和最近内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 快速操作 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">快速操作</h3>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                  >
                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-gray-700">{action.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 最近内容 */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-gray-900">最近内容</h3>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {recentContent.length}
                  </span>
                </div>
                <Link href="/admin/content" className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                  查看全部
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          item.type === 'news' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'solution' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type === 'news' ? '新闻' : item.type === 'solution' ? '方案' : '产品'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.author} · {item.date}</p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
