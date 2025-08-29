'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
}

const ROLES = [
  { value: 'admin', label: '管理员', description: '完全访问权限' },
  { value: 'editor', label: '编辑者', description: '可编辑内容' },
  { value: 'viewer', label: '查看者', description: '只读权限' }
] as const;

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // 模拟数据
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@litong.com',
          role: 'admin',
          isActive: true,
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        {
          id: '2',
          username: 'editor1',
          email: 'editor@litong.com',
          role: 'editor',
          isActive: true,
          lastLogin: '2024-01-14T15:20:00Z',
          createdAt: '2023-03-15T00:00:00Z'
        },
        {
          id: '3',
          username: 'viewer1',
          email: 'viewer@litong.com',
          role: 'viewer',
          isActive: false,
          lastLogin: '2024-01-10T09:15:00Z',
          createdAt: '2023-06-20T00:00:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      setMessage({ type: 'error', text: '加载用户数据失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        setUsers(prev => prev.map(user =>
          user.id === editingUser.id
            ? { ...user, ...userData }
            : user
        ));
        setMessage({ type: 'success', text: '用户更新成功！' });
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          username: userData.username || '',
          email: userData.email || '',
          role: userData.role || 'viewer',
          isActive: userData.isActive ?? true,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        setMessage({ type: 'success', text: '用户创建成功！' });
      }

      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试！' });
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setMessage({ type: 'success', text: '用户删除成功！' });
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getRoleInfo = (role: User['role']) => {
    return ROLES.find(r => r.value === role) || ROLES[2];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">用户管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系统用户，配置权限和访问控制
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            新增用户
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">搜索用户</label>
          <input
            type="text"
            placeholder="输入用户名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">角色筛选</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">全部角色</option>
            {ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">
            共 {filteredUsers.length} 个用户
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => {
            const roleInfo = getRoleInfo(user.role);
            return (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="h-12 w-12 rounded-full" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-primary-600">
                            {user.username}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'editor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {roleInfo.label}
                          </span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? '活跃' : '停用'}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <span>注册时间: {formatDate(user.createdAt)}</span>
                            {user.lastLogin && (
                              <span className="ml-4">最后登录: {formatDate(user.lastLogin)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-sm font-medium ${
                          user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? '停用' : '启用'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                        disabled={user.role === 'admin'}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          roles={ROLES}
          onSave={handleSaveUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

interface UserModalProps {
  user: User | null;
  roles: typeof ROLES;
  onSave: (user: Partial<User>) => void;
  onClose: () => void;
}

function UserModal({ user, roles, onSave, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'viewer' as const,
    isActive: user?.isActive ?? true,
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!user) {
      if (!formData.password) {
        newErrors.password = '密码不能为空';
      } else if (formData.password.length < 6) {
        newErrors.password = '密码至少6个字符';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次密码不一致';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {user ? '编辑用户' : '新增用户'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 sm:text-sm ${
                  errors.username ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                }`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 sm:text-sm ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 sm:text-sm ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">确认密码</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 sm:text-sm ${
                    errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                  }`}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">用户角色</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center h-full">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  启用用户
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}