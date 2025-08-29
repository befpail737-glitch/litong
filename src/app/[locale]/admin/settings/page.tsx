// 强制静态生成
export const dynamic = 'force-static';
import { Metadata } from 'next';
import SystemSettings from '@/components/admin/SystemSettings';

export const metadata: Metadata = {
  title: '系统设置 - 后台管理系统 | LiTong',
  description: '配置系统参数、安全设置、性能优化和外观主题',
  robots: {
    index: false,
    follow: false
  }
};

export default function SystemSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
            <p className="text-gray-600 mt-2">
              配置系统基础参数、安全策略、性能优化和外观主题
            </p>
          </div>
          
          <SystemSettings />
        </div>
      </div>
    </div>
  );
}