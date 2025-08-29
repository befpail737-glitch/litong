import type { Metadata } from 'next';
import AdminNavigation from '@/components/admin/AdminNavigation';
import '../../globals.css';

export const metadata: Metadata = {
  title: '后台管理系统 | LiTong Electronics',
  description: 'LiTong Electronics 后台管理系统',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">
      <AdminNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}