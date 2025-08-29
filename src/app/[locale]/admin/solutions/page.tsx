// 强制静态生成
export const dynamic = 'force-static';
import { Metadata } from 'next';
import SolutionManager from '@/components/admin/SolutionManager';

export const metadata: Metadata = {
  title: '解决方案管理 - 后台管理系统 | LiTong',
  description: '管理技术解决方案，展示成功案例和技术应用',
  robots: {
    index: false,
    follow: false
  }
};

export default function SolutionManagerPage() {
  return (
    <div>
      <SolutionManager />
    </div>
  );
}