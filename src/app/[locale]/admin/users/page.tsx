import { Metadata } from 'next';
import UserManager from '@/components/admin/UserManager';

export const metadata: Metadata = {
  title: '用户管理 - 后台管理系统 | LiTong',
  description: '管理系统用户，配置权限和访问控制',
  robots: {
    index: false,
    follow: false
  }
};

export default function UserManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
            <p className="text-gray-600 mt-2">
              管理系统用户、配置权限和访问控制，确保系统安全
            </p>
          </div>
          
          <UserManager />
        </div>
      </div>
    </div>
  );
}