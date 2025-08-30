import { Metadata } from 'next';
import NewsManager from '@/components/admin/NewsManager';

export const metadata: Metadata = {
  title: '新闻管理 - 后台管理系统 | LiTong',
  description: '管理公司新闻、行业动态和产品资讯发布',
  robots: {
    index: false,
    follow: false
  }
};

export default function NewsManagerPage() {
  return (
    <div>
      <NewsManager />
    </div>
  );
}