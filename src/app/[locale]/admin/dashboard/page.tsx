import { Metadata } from 'next';
import DashboardStats from '@/components/admin/DashboardStats';

// 强制静态生成
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '仪表板 - 后台管理系统 | LiTong',
  description: '管理系统概览和统计数据',
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardPage() {
  return (
    <div>
      <DashboardStats />
    </div>
  );
}