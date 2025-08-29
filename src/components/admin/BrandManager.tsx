'use client';

import { useState, useCallback, useEffect } from 'react';
import { getBrands } from '../../../lib/sanity';

interface Brand {
  id: string;
  name: string;
  nameEn: string;
  logo?: string;
  description: string;
  website: string;
  country: string;
  founded?: string;
  products: string[];
  isActive: boolean;
  sort: number;
}

export default function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const countries = [
    '美国', '中国', '日本', '德国', '韩国', '台湾', '新加坡', '荷兰', '瑞士', '英国', '法国', '意大利'
  ];

  // 加载品牌数据
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      const data = await getBrands();
      setBrands(data || []);
    } catch (error) {
      setMessage({ type: 'error', text: '加载品牌数据失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country.includes(searchTerm)
  );

  const handleSaveBrand = async (brandData: Partial<Brand>) => {
    try {
      if (editingBrand) {
        // 更新品牌
        setBrands(prev => prev.map(brand =>
          brand.id === editingBrand.id
            ? { ...brand, ...brandData }
            : brand
        ));
        setMessage({ type: 'success', text: '品牌更新成功！' });
      } else {
        // 新建品牌
        const newBrand: Brand = {
          id: Date.now().toString(),
          name: brandData.name || '',
          nameEn: brandData.nameEn || '',
          description: brandData.description || '',
          website: brandData.website || '',
          country: brandData.country || '美国',
          founded: brandData.founded || '',
          products: brandData.products || [],
          isActive: brandData.isActive ?? true,
          sort: brandData.sort || 0
        };
        setBrands(prev => [...prev, newBrand]);
        setMessage({ type: 'success', text: '品牌创建成功！' });
      }

      setIsModalOpen(false);
      setEditingBrand(null);
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试！' });
    }
  };

  const deleteBrand = (brandId: string) => {
    if (confirm('确定要删除这个品牌吗？')) {
      setBrands(prev => prev.filter(brand => brand.id !== brandId));
      setMessage({ type: 'success', text: '品牌删除成功！' });
    }
  };

  const toggleBrandStatus = (brandId: string) => {
    setBrands(prev => prev.map(brand =>
      brand.id === brandId
        ? { ...brand, isActive: !brand.isActive }
        : brand
    ));
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
      {/* 消息提示 */}
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

      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">品牌管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理品牌信息，配置品牌页面和产品关联
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingBrand(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            新增品牌
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">搜索品牌</label>
          <input
            type="text"
            placeholder="输入品牌名称或国家..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">
            共 {filteredBrands.length} 个品牌
          </div>
        </div>
      </div>

      {/* 品牌列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredBrands.map((brand) => (
            <li key={brand.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {brand.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-primary-600">
                            {brand.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {brand.nameEn} • {brand.country}
                            {brand.founded && ` • 成立于 ${brand.founded}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          brand.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.isActive ? '活跃' : '停用'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {brand.products.length} 个产品
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{brand.description}</p>
                      {brand.website && (
                        <p className="text-sm text-primary-600 mt-1">
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {brand.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => toggleBrandStatus(brand.id)}
                      className={`text-sm font-medium ${
                        brand.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {brand.isActive ? '停用' : '启用'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingBrand(brand);
                        setIsModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 品牌编辑模态框 */}
      {isModalOpen && (
        <BrandModal
          brand={editingBrand}
          countries={countries}
          onSave={handleSaveBrand}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBrand(null);
          }}
        />
      )}
    </div>
  );
}

// 品牌编辑模态框组件
interface BrandModalProps {
  brand: Brand | null;
  countries: string[];
  onSave: (brand: Partial<Brand>) => void;
  onClose: () => void;
}

function BrandModal({ brand, countries, onSave, onClose }: BrandModalProps) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    nameEn: brand?.nameEn || '',
    description: brand?.description || '',
    website: brand?.website || '',
    country: brand?.country || '美国',
    founded: brand?.founded || '',
    isActive: brand?.isActive ?? true,
    sort: brand?.sort || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {brand ? '编辑品牌' : '新增品牌'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">品牌名称（中文）</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">品牌名称（英文）</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">品牌描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">官方网站</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">国家/地区</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">成立年份</label>
              <input
                type="text"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="例如: 1985"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">排序权重</label>
              <input
                type="number"
                value={formData.sort}
                onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
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
                  启用品牌
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