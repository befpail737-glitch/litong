'use client';

import { useState, useEffect } from 'react';

interface Solution {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  author: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedProducts: string[];
}

const solutionCategories = [
  { value: 'iot', label: '物联网解决方案' },
  { value: 'industrial', label: '工业自动化' },
  { value: 'automotive', label: '汽车电子' },
  { value: 'consumer', label: '消费电子' },
  { value: 'medical', label: '医疗设备' },
  { value: 'energy', label: '新能源' },
  { value: 'communication', label: '通信设备' },
  { value: 'aerospace', label: '航空航天' }
];

export default function SolutionManager() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 模拟数据
  const sampleSolutions: Solution[] = [
    {
      id: '1',
      title: '智能家居控制系统',
      titleEn: 'Smart Home Control System',
      summary: '基于STM32和ESP32的完整智能家居解决方案，支持语音控制、远程监控和自动化场景',
      content: '详细的技术方案内容...',
      category: 'iot',
      tags: ['STM32', 'ESP32', 'WiFi', '语音识别', '传感器'],
      coverImage: '/images/solutions/smart-home-cover.jpg',
      images: ['/images/solutions/smart-home-1.jpg', '/images/solutions/smart-home-2.jpg'],
      isPublished: true,
      isFeatured: true,
      author: '技术部',
      publishDate: '2024-01-15',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      seoTitle: '智能家居控制系统解决方案 | LiTong Electronics',
      seoDescription: '提供完整的智能家居控制系统解决方案，基于STM32和ESP32平台',
      relatedProducts: ['STM32F407VGT6', 'ESP32-WROOM-32']
    },
    {
      id: '2',
      title: '工业设备远程监控方案',
      titleEn: 'Industrial Equipment Remote Monitoring',
      summary: '适用于工业4.0的设备远程监控解决方案，支持实时数据采集和预测性维护',
      content: '工业监控方案详细内容...',
      category: 'industrial',
      tags: ['4G/5G', 'CAN总线', '云平台', '数据采集', '预测维护'],
      coverImage: '/images/solutions/industrial-monitor-cover.jpg',
      images: [],
      isPublished: true,
      isFeatured: false,
      author: '工程部',
      publishDate: '2024-01-20',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
      relatedProducts: ['TPS54360DDA']
    }
  ];

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setSolutions(sampleSolutions);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveSolution = async (solutionData: Partial<Solution>) => {
    try {
      if (editingSolution) {
        setSolutions(prev => prev.map(solution =>
          solution.id === editingSolution.id
            ? { ...solution, ...solutionData, updatedAt: new Date().toISOString().split('T')[0] }
            : solution
        ));
        setMessage({ type: 'success', text: '解决方案更新成功！' });
      } else {
        const newSolution: Solution = {
          id: Date.now().toString(),
          title: solutionData.title || '',
          titleEn: solutionData.titleEn || '',
          summary: solutionData.summary || '',
          content: solutionData.content || '',
          category: solutionData.category || 'iot',
          tags: solutionData.tags || [],
          images: solutionData.images || [],
          isPublished: solutionData.isPublished ?? false,
          isFeatured: solutionData.isFeatured ?? false,
          author: solutionData.author || '管理员',
          publishDate: solutionData.publishDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          relatedProducts: solutionData.relatedProducts || []
        };
        setSolutions(prev => [...prev, newSolution]);
        setMessage({ type: 'success', text: '解决方案创建成功！' });
      }

      setIsModalOpen(false);
      setEditingSolution(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteSolution = (solutionId: string) => {
    if (confirm('确定要删除这个解决方案吗？此操作不可恢复。')) {
      setSolutions(prev => prev.filter(solution => solution.id !== solutionId));
      setMessage({ type: 'success', text: '解决方案删除成功！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const togglePublishStatus = (solutionId: string) => {
    setSolutions(prev => prev.map(solution =>
      solution.id === solutionId
        ? { ...solution, isPublished: !solution.isPublished }
        : solution
    ));
  };

  const toggleFeaturedStatus = (solutionId: string) => {
    setSolutions(prev => prev.map(solution =>
      solution.id === solutionId
        ? { ...solution, isFeatured: !solution.isFeatured }
        : solution
    ));
  };

  const getCategoryLabel = (category: string) => {
    return solutionCategories.find(cat => cat.value === category)?.label || category;
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
          <h1 className="text-2xl font-semibold text-gray-900">解决方案管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理技术解决方案，展示成功案例和技术应用
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingSolution(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            新增解决方案
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">搜索解决方案</label>
          <input
            type="text"
            placeholder="输入方案标题、标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">解决方案类别</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">所有类别</option>
            {solutionCategories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 解决方案列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredSolutions.map((solution) => (
            <li key={solution.id}>
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {solution.coverImage && (
                          <img 
                            src={solution.coverImage} 
                            alt={solution.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-primary-600">
                            {solution.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {solution.titleEn} • {getCategoryLabel(solution.category)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {solution.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            推荐
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          solution.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {solution.isPublished ? '已发布' : '草稿'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{solution.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {solution.tags.slice(0, 5).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {solution.tags.length > 5 && (
                          <span className="text-xs text-gray-500">+{solution.tags.length - 5} 更多</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>作者: {solution.author}</span>
                        <span className="mx-2">•</span>
                        <span>发布: {solution.publishDate}</span>
                        <span className="mx-2">•</span>
                        <span>更新: {solution.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                    <button
                      onClick={() => toggleFeaturedStatus(solution.id)}
                      className={`text-sm font-medium ${
                        solution.isFeatured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'
                      }`}
                    >
                      {solution.isFeatured ? '取消推荐' : '推荐'}
                    </button>
                    <button
                      onClick={() => togglePublishStatus(solution.id)}
                      className={`text-sm font-medium ${
                        solution.isPublished ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {solution.isPublished ? '下线' : '发布'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSolution(solution);
                        setIsModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteSolution(solution.id)}
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

      {/* 解决方案编辑模态框 */}
      {isModalOpen && (
        <SolutionModal
          solution={editingSolution}
          categories={solutionCategories}
          onSave={handleSaveSolution}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSolution(null);
          }}
        />
      )}
    </div>
  );
}

// 解决方案编辑模态框组件
interface SolutionModalProps {
  solution: Solution | null;
  categories: typeof solutionCategories;
  onSave: (solution: Partial<Solution>) => void;
  onClose: () => void;
}

function SolutionModal({ solution, categories, onSave, onClose }: SolutionModalProps) {
  const [formData, setFormData] = useState({
    title: solution?.title || '',
    titleEn: solution?.titleEn || '',
    summary: solution?.summary || '',
    content: solution?.content || '',
    category: solution?.category || 'iot',
    tags: solution?.tags?.join(', ') || '',
    author: solution?.author || '',
    publishDate: solution?.publishDate || new Date().toISOString().split('T')[0],
    isPublished: solution?.isPublished ?? false,
    isFeatured: solution?.isFeatured ?? false,
    seoTitle: solution?.seoTitle || '',
    seoDescription: solution?.seoDescription || '',
    relatedProducts: solution?.relatedProducts?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      relatedProducts: formData.relatedProducts.split(',').map(product => product.trim()).filter(product => product)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {solution ? '编辑解决方案' : '新增解决方案'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">方案标题（中文）*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">方案标题（英文）</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">方案摘要*</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="简要描述解决方案的核心特点和应用场景"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">详细内容*</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="详细描述技术方案、实现方式、技术特点等"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">解决方案类别*</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">作者</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">技术标签</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="用逗号分隔，如：STM32, WiFi, 传感器"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">相关产品</label>
              <input
                type="text"
                value={formData.relatedProducts}
                onChange={(e) => setFormData({ ...formData, relatedProducts: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="用逗号分隔产品型号"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SEO标题</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="搜索引擎显示的标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">发布日期</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SEO描述</label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="搜索引擎显示的描述信息"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                立即发布
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                设为推荐方案
              </label>
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