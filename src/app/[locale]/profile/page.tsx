'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  User,
  Settings,
  ShoppingCart,
  FileText,
  Heart,
  Bell,
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';

import { InquiryHistory } from '@/components/inquiry/InquiryHistory';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { orders, getOrderStatusText } = useOrder();

  // 为了向后兼容，保留updateProfile别名
  const updateProfile = updateUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">需要登录</h2>
            <p className="text-gray-600 mb-4">请先登录以查看个人中心</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              前往登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile(editData);
      if (result.success) {
        setMessage({ type: 'success', text: '个人信息更新成功' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      name: user.name,
      email: user.email,
      company: user.company || '',
      phone: user.phone || ''
    });
    setIsEditing(false);
    setMessage(null);
  };

  // 使用真实订单数据而不是mockOrders

  const mockWishlist = [
    {
      id: '1',
      name: 'Arduino Uno R3',
      price: '¥89.00',
      stock: '有现货'
    },
    {
      id: '2',
      name: 'Raspberry Pi 4B',
      price: '¥399.00',
      stock: '预订中'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-600 mt-2">管理您的账户信息和订单</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 用户信息卡片 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {user.role === 'admin' ? '管理员' : '客户'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">邮箱：</span>{user.email}</p>
                  {user.company && <p><span className="font-medium">公司：</span>{user.company}</p>}
                  {user.phone && <p><span className="font-medium">电话：</span>{user.phone}</p>}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={logout}
                >
                  退出登录
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {message && (
              <Alert className={`mb-6 ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}>
                {message.text}
              </Alert>
            )}

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  基本信息
                </TabsTrigger>
                <TabsTrigger value="inquiries" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  询价历史
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  订单管理
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  收藏夹
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  设置
                </TabsTrigger>
              </TabsList>

              {/* 基本信息 */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>基本信息</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? '保存中...' : '保存'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          取消
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          value={isEditing ? editData.name : user.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">邮箱地址</Label>
                        <Input
                          id="email"
                          type="email"
                          value={isEditing ? editData.email : user.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">公司名称</Label>
                        <Input
                          id="company"
                          value={isEditing ? editData.company : (user.company || '')}
                          onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                          placeholder="请输入公司名称"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">联系电话</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={isEditing ? editData.phone : (user.phone || '')}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                          placeholder="请输入联系电话"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 询价历史 */}
              <TabsContent value="inquiries">
                <InquiryHistory />
              </TabsContent>

              {/* 订单管理 */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>订单管理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">订单 {order.orderNumber}</h4>
                              <Badge variant="default">{getOrderStatusText(order.status)}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              总金额：¥{order.totalAmount.toFixed(2)} ({order.items.length}个商品)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              下单时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>
                              查看详情
                            </Link>
                          </Button>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          暂无订单记录
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 收藏夹 */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>我的收藏</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockWishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-lg font-semibold text-blue-600 mb-1">{item.price}</p>
                          <p className="text-sm text-gray-600 mb-3">{item.stock}</p>
                          <Button size="sm" className="w-full">
                            加入询价车
                          </Button>
                        </div>
                      ))}
                      {mockWishlist.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          暂无收藏商品
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 设置 */}
              <TabsContent value="settings">
                <SettingsTab user={user} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置标签组件
function SettingsTab({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: { ...user.preferences.notifications },
    language: user.preferences.language,
    currency: user.preferences.currency
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePreferenceChange = (key: 'language' | 'currency', value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateUser({
        preferences: {
          ...user.preferences,
          language: settings.language,
          currency: settings.currency,
          notifications: settings.notifications
        }
      });

      if (result.success) {
        setMessage({ type: 'success', text: '设置已保存' });
      } else {
        setMessage({ type: 'error', text: result.error || '保存失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${
          message.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {message.text}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>账户设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              通知设置
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <span className="ml-2 text-sm">邮件通知</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
                <span className="ml-2 text-sm">短信通知</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={settings.notifications.marketing}
                  onChange={() => handleNotificationChange('marketing')}
                />
                <span className="ml-2 text-sm">营销推广</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">偏好设置</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language">语言</Label>
                <select
                  id="language"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={settings.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value as 'zh' | 'en')}
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency">货币</Label>
                <select
                  id="currency"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={settings.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value as 'CNY' | 'USD')}
                >
                  <option value="CNY">人民币 (CNY)</option>
                  <option value="USD">美元 (USD)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存设置'}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-800"
            >
              修改密码
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
