'use client';

import { useState, useEffect } from 'react';

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo?: string;
  favicon?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  features: {
    enableRegistration: boolean;
    enableComments: boolean;
    enableNewsletter: boolean;
    enableMultiLanguage: boolean;
    enableSEO: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
  };
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    fromEmail: string;
    fromName: string;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
    backupLocation: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    compressionEnabled: boolean;
    imageOptimization: boolean;
  };
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState<SystemConfig>({
    siteName: 'LiTong Electronics',
    siteDescription: '专业的电子元器件分销商，提供优质的IC、传感器、开发板等电子产品',
    contactEmail: 'info@litong.com',
    contactPhone: '+86-400-123-4567',
    address: '上海市浦东新区科技园区123号',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b'
    },
    features: {
      enableRegistration: true,
      enableComments: true,
      enableNewsletter: true,
      enableMultiLanguage: true,
      enableSEO: true
    },
    seo: {
      metaTitle: 'LiTong Electronics - 专业电子元器件分销',
      metaDescription: '专业的电子元器件分销商，提供STM32、Arduino、传感器等优质电子产品',
      keywords: '电子元器件,STM32,Arduino,传感器,IC芯片,开发板'
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      username: '',
      password: '',
      secure: false,
      fromEmail: 'noreply@litong.com',
      fromName: 'LiTong Electronics'
    },
    backup: {
      autoBackup: true,
      backupInterval: 'daily',
      retentionDays: 30,
      backupLocation: '/var/backups'
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 1440,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true
    },
    performance: {
      cacheEnabled: true,
      cacheTTL: 3600,
      compressionEnabled: true,
      imageOptimization: true
    }
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'general', name: '基本设置', icon: '⚙️' },
    { id: 'appearance', name: '外观设置', icon: '🎨' },
    { id: 'features', name: '功能设置', icon: '🔧' },
    { id: 'seo', name: 'SEO设置', icon: '🔍' },
    { id: 'email', name: '邮件设置', icon: '📧' },
    { id: 'backup', name: '备份设置', icon: '💾' },
    { id: 'security', name: '安全设置', icon: '🔒' },
    { id: 'performance', name: '性能设置', icon: '⚡' }
  ];

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: '设置保存成功！' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试！' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置为默认设置吗？此操作不可恢复。')) {
      // 重置逻辑
      setMessage({ type: 'success', text: '已重置为默认设置！' });
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">网站名称</label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">联系邮箱</label>
          <input
            type="email"
            value={config.contactEmail}
            onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">联系电话</label>
          <input
            type="tel"
            value={config.contactPhone}
            onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">公司地址</label>
          <input
            type="text"
            value={config.address}
            onChange={(e) => setConfig({ ...config, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">网站描述</label>
        <textarea
          value={config.siteDescription}
          onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">主色调</label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              value={config.theme.primaryColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, primaryColor: e.target.value }
              })}
              className="h-10 w-20 rounded border border-gray-300"
            />
            <input
              type="text"
              value={config.theme.primaryColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, primaryColor: e.target.value }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">辅助色</label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              value={config.theme.secondaryColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, secondaryColor: e.target.value }
              })}
              className="h-10 w-20 rounded border border-gray-300"
            />
            <input
              type="text"
              value={config.theme.secondaryColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, secondaryColor: e.target.value }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">强调色</label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              value={config.theme.accentColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, accentColor: e.target.value }
              })}
              className="h-10 w-20 rounded border border-gray-300"
            />
            <input
              type="text"
              value={config.theme.accentColor}
              onChange={(e) => setConfig({
                ...config,
                theme: { ...config.theme, accentColor: e.target.value }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatureSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config.features).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                {key === 'enableRegistration' && '允许用户注册'}
                {key === 'enableComments' && '启用评论功能'}
                {key === 'enableNewsletter' && '启用邮件订阅'}
                {key === 'enableMultiLanguage' && '多语言支持'}
                {key === 'enableSEO' && 'SEO优化'}
              </label>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setConfig({
                ...config,
                features: { ...config.features, [key]: e.target.checked }
              })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">SEO标题</label>
        <input
          type="text"
          value={config.seo.metaTitle}
          onChange={(e) => setConfig({
            ...config,
            seo: { ...config.seo, metaTitle: e.target.value }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">SEO描述</label>
        <textarea
          value={config.seo.metaDescription}
          onChange={(e) => setConfig({
            ...config,
            seo: { ...config.seo, metaDescription: e.target.value }
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">关键词（用逗号分隔）</label>
        <input
          type="text"
          value={config.seo.keywords}
          onChange={(e) => setConfig({
            ...config,
            seo: { ...config.seo, keywords: e.target.value }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">启用双因素认证</label>
            <p className="text-xs text-gray-500">为管理员账户启用2FA验证</p>
          </div>
          <input
            type="checkbox"
            checked={config.security.enableTwoFactor}
            onChange={(e) => setConfig({
              ...config,
              security: { ...config.security, enableTwoFactor: e.target.checked }
            })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">会话超时（分钟）</label>
          <input
            type="number"
            value={config.security.sessionTimeout}
            onChange={(e) => setConfig({
              ...config,
              security: { ...config.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">最大登录尝试次数</label>
          <input
            type="number"
            value={config.security.maxLoginAttempts}
            onChange={(e) => setConfig({
              ...config,
              security: { ...config.security, maxLoginAttempts: parseInt(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">密码最小长度</label>
          <input
            type="number"
            value={config.security.passwordMinLength}
            onChange={(e) => setConfig({
              ...config,
              security: { ...config.security, passwordMinLength: parseInt(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'features': return renderFeatureSettings();
      case 'seo': return renderSEOSettings();
      case 'security': return renderSecuritySettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">系统设置</h1>
          <p className="mt-2 text-sm text-gray-700">
            配置系统参数，管理安全设置和性能优化
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            重置默认
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}