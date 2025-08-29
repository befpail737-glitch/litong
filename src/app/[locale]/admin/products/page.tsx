// 强制静态生成
export const dynamic = 'force-static';
import { Metadata } from 'next';
import ProductManager from '@/components/admin/ProductManager';

export const metadata: Metadata = {
  title: '产品管理 - 后台管理系统 | LiTong',
  description: '管理产品数据，上传Excel文件，配置产品筛选参数',
  robots: {
    index: false,
    follow: false
  }
};

export default function ProductManagerPage() {
  return (
    <div>
      <ProductManager />
    </div>
  );
}