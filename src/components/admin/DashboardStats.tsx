'use client';

import { useState, useEffect } from 'react';

interface StatData {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description?: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function DashboardStats() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const stats: StatData[] = [
    {
      name: '产品总数',
      value: '8,432',
      change: '+12%',
      changeType: 'increase',
      description: '较上月增长',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: '活跃品牌',
      value: '25',
      change: '+3',
      changeType: 'increase',
      description: '新增品牌',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      name: '技术文章',
      value: '156',
      change: '+8',
      changeType: 'increase',
      description: '本月发布',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: '系统用户',
      value: '18',
      change: '+2',
      changeType: 'increase',
      description: '活跃用户',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    }
  ];

  const categoryStats: ChartData[] = [
    { name: '微控制器', value: 3420 },
    { name: '传感器', value: 1680 },
    { name: '电源管理', value: 980 },
    { name: '通信模块', value: 760 },
    { name: '开发工具', value: 520 },
    { name: '其他', value: 1072 }
  ];

  const brandStats: ChartData[] = [
    { name: 'STMicroelectronics', value: 2890 },
    { name: 'Texas Instruments', value: 2120 },
    { name: 'Infineon', value: 1450 },
    { name: 'NXP', value: 980 },
    { name: 'Analog Devices', value: 760 },
    { name: '其他品牌', value: 232 }
  ];

  const performanceMetrics = [
    { name: '系统响应时间', value: '245ms', status: 'good', target: '< 300ms' },
    { name: 'API 成功率', value: '99.8%', status: 'excellent', target: '> 99.5%' },
    { name: '存储使用率', value: '68%', status: 'good', target: '< 85%' },
    { name: '日访问量', value: '12,340', status: 'good', target: '> 10,000' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'product',
      message: '新增产品 STM32H743VIT6',
      time: '2小时前',
      icon: '📦'
    },
    {
      id: 2,
      type: 'article',
      message: '发布技术文章《STM32CubeMX使用指南》',
      time: '4小时前',
      icon: '📝'
    },
    {
      id: 3,
      type: 'brand',
      message: '更新品牌信息 Texas Instruments',
      time: '6小时前',
      icon: '🏷️'
    },
    {
      id: 4,
      type: 'solution',
      message: '新增解决方案《智能家居控制系统》',
      time: '1天前',
      icon: '💡'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">仪表板</h1>
          <p className="mt-2 text-sm text-gray-700">LiTong Electronics 管理系统概览</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                    {stat.description && (
                      <dd className="text-xs text-gray-400 mt-1">{stat.description}</dd>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              产品类别分布
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categoryStats.map((category, index) => {
                const total = categoryStats.reduce((sum, item) => sum + item.value, 0);
                const percentage = ((category.value / total) * 100).toFixed(1);
                return (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ 
                          backgroundColor: `hsl(${(index * 360) / categoryStats.length}, 70%, 50%)` 
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              热门品牌
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {brandStats.map((brand, index) => {
                const total = brandStats.reduce((sum, item) => sum + item.value, 0);
                const percentage = ((brand.value / total) * 100).toFixed(1);
                return (
                  <div key={brand.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {brand.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            系统性能指标
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                  <div className="text-xs text-gray-500 mt-1">目标: {metric.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            最近活动
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            快速操作
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">添加产品</p>
                <p className="text-sm text-gray-500">新增单个产品</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3 3-3M12 12l-3 3 3 3 3-3-3-3z" />
              </svg>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">批量导入</p>
                <p className="text-sm text-gray-500">Excel文件导入</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">写文章</p>
                <p className="text-sm text-gray-500">技术支持文章</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}