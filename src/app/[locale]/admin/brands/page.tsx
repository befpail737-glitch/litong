import { Metadata } from 'next';

// 强制静态生成
export const dynamic = 'force-static';
import BrandManager from '@/components/admin/BrandManager';

export const metadata: Metadata = {
  title: '品牌管理 - 后台管理系统 | LiTong',
  description: '管理品牌信息，配置品牌页面和产品关联',
  robots: {
    index: false,
    follow: false
  }
};

export default function BrandManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">品牌管理</h1>
            <p className="text-gray-600 mt-2">
              管理品牌信息、配置品牌页面和产品关联
            </p>
          </div>
          
          <BrandManager />
        </div>
      </div>
    </div>
  );
}