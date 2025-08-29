import { Metadata } from 'next';
import ArticleManager from '@/components/admin/ArticleManager';

export const metadata: Metadata = {
  title: '文章管理 - 后台管理系统 | LiTong',
  description: '管理技术文章、新闻资讯和产品案例，支持富文本编辑器',
  robots: {
    index: false,
    follow: false
  }
};

export default function ArticleManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
            <p className="text-gray-600 mt-2">
              创建和管理技术文章、新闻资讯、产品案例，支持富文本编辑、图片上传、表格和PDF嵌入
            </p>
          </div>
          
          <ArticleManager />
        </div>
      </div>
    </div>
  );
}