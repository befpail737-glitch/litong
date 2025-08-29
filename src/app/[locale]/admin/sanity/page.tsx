import { Metadata } from 'next';
import SanityUploadManager from '@/components/admin/SanityUploadManager';

export const metadata: Metadata = {
  title: 'Sanity数据管理 - 后台管理系统 | LiTong',
  description: '上传产品数据到Sanity CMS，管理产品分类和文章内容',
  robots: {
    index: false,
    follow: false
  }
};

export default function SanityManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sanity数据管理</h1>
            <p className="text-gray-600 mt-2">
              管理Sanity CMS中的产品数据、分类和文章内容
            </p>
          </div>
          
          <SanityUploadManager />
        </div>
      </div>
    </div>
  );
}