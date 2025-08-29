'use client';

import { useState, useEffect } from 'react';

interface NewsArticle {
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
  isTopStory: boolean;
  author: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  source?: string;
}

const newsCategories = [
  { value: 'company', label: '公司新闻' },
  { value: 'industry', label: '行业动态' },
  { value: 'product', label: '产品发布' },
  { value: 'technology', label: '技术资讯' },
  { value: 'events', label: '活动展会' },
  { value: 'partnership', label: '合作伙伴' },
  { value: 'awards', label: '荣誉奖项' },
  { value: 'research', label: '研发成果' }
];

export default function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 模拟数据
  const sampleArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'LiTong Electronics荣获"2024年度优秀电子元器件分销商"奖',
      titleEn: 'LiTong Electronics Wins Outstanding Electronic Components Distributor Award 2024',
      summary: '在刚刚结束的2024年中国电子元器件行业大会上，LiTong Electronics凭借卓越的服务质量和技术支持能力，荣获"2024年度优秀电子元器件分销商"奖项。',
      content: '详细的新闻内容...',
      category: 'awards',
      tags: ['奖项', '行业认可', '分销商', '2024'],
      coverImage: '/images/news/award-2024.jpg',
      images: ['/images/news/award-ceremony.jpg'],
      isPublished: true,
      isTopStory: true,
      author: '市场部',
      publishDate: '2024-01-25',
      createdAt: '2024-01-24',
      updatedAt: '2024-01-25',
      seoTitle: 'LiTong Electronics荣获2024年度优秀分销商奖 | 行业新闻',
      seoDescription: 'LiTong Electronics在2024年中国电子元器件行业大会上荣获优秀分销商奖项',
      viewCount: 1250,
      source: 'LiTong Electronics'
    },
    {
      id: '2',
      title: '新品发布：高性能STM32H7系列微控制器现货供应',
      titleEn: 'New Product Launch: High-Performance STM32H7 Series Microcontrollers In Stock',
      summary: '我们很高兴地宣布，STM32H7系列高性能微控制器现已大量现货供应。该系列产品具有出色的处理性能和丰富的外设接口，适用于高端工业应用。',
      content: '产品详细信息...',
      category: 'product',
      tags: ['STM32H7', '微控制器', '新品发布', '现货'],
      isPublished: true,
      isTopStory: false,
      author: '产品部',
      publishDate: '2024-01-20',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
      viewCount: 890,
      source: 'LiTong Electronics'
    },
    {
      id: '3',
      title: '5G时代的RF解决方案：新技术趋势与应用展望',
      titleEn: '5G Era RF Solutions: New Technology Trends and Application Prospects',
      summary: '随着5G技术的快速发展，RF射频解决方案面临新的机遇和挑战。本文深入分析了5G时代RF技术的发展趋势和应用前景。',
      content: '技术分析内容...',
      category: 'technology',
      tags: ['5G', 'RF', '射频', '技术趋势'],
      isPublished: false,
      isTopStory: false,
      author: '技术部',
      publishDate: '2024-01-30',
      createdAt: '2024-01-28',
      updatedAt: '2024-01-29',
      viewCount: 0,
      source: 'LiTong Electronics'
    }
  ];

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setArticles(sampleArticles);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveArticle = async (articleData: Partial<NewsArticle>) => {
    try {
      if (editingArticle) {
        setArticles(prev => prev.map(article =>
          article.id === editingArticle.id
            ? { ...article, ...articleData, updatedAt: new Date().toISOString().split('T')[0] }
            : article
        ));
        setMessage({ type: 'success', text: '新闻文章更新成功！' });
      } else {
        const newArticle: NewsArticle = {
          id: Date.now().toString(),
          title: articleData.title || '',
          titleEn: articleData.titleEn || '',
          summary: articleData.summary || '',
          content: articleData.content || '',
          category: articleData.category || 'company',
          tags: articleData.tags || [],
          images: articleData.images || [],
          isPublished: articleData.isPublished ?? false,
          isTopStory: articleData.isTopStory ?? false,
          author: articleData.author || '管理员',
          publishDate: articleData.publishDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          viewCount: 0,
          source: articleData.source || 'LiTong Electronics'
        };
        setArticles(prev => [...prev, newArticle]);
        setMessage({ type: 'success', text: '新闻文章创建成功！' });
      }

      setIsModalOpen(false);
      setEditingArticle(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteArticle = (articleId: string) => {
    if (confirm('确定要删除这篇新闻文章吗？此操作不可恢复。')) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
      setMessage({ type: 'success', text: '新闻文章删除成功！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const togglePublishStatus = (articleId: string) => {
    setArticles(prev => prev.map(article =>
      article.id === articleId
        ? { ...article, isPublished: !article.isPublished }
        : article
    ));
  };

  const toggleTopStoryStatus = (articleId: string) => {
    setArticles(prev => prev.map(article =>
      article.id === articleId
        ? { ...article, isTopStory: !article.isTopStory }
        : article
    ));
  };

  const getCategoryLabel = (category: string) => {
    return newsCategories.find(cat => cat.value === category)?.label || category;
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
          <h1 className="text-2xl font-semibold text-gray-900">新闻管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理公司新闻、行业动态和产品资讯发布
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingArticle(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            新增新闻
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">搜索新闻</label>
          <input
            type="text"
            placeholder="输入新闻标题、标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">新闻类别</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">所有类别</option>
            {newsCategories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">
            共 {filteredArticles.length} 篇新闻
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <li key={article.id}>
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {article.coverImage && (
                          <img 
                            src={article.coverImage} 
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-primary-600">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {article.titleEn} • {getCategoryLabel(article.category)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {article.isTopStory && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            头条
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.isPublished ? '已发布' : '草稿'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.viewCount} 浏览
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {article.tags.slice(0, 5).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 5 && (
                          <span className="text-xs text-gray-500">+{article.tags.length - 5} 更多</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>作者: {article.author}</span>
                        <span className="mx-2">•</span>
                        <span>发布: {article.publishDate}</span>
                        <span className="mx-2">•</span>
                        <span>更新: {article.updatedAt}</span>
                        {article.source && (
                          <>
                            <span className="mx-2">•</span>
                            <span>来源: {article.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                    <button
                      onClick={() => toggleTopStoryStatus(article.id)}
                      className={`text-sm font-medium ${
                        article.isTopStory ? 'text-red-600 hover:text-red-900' : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      {article.isTopStory ? '取消头条' : '设为头条'}
                    </button>
                    <button
                      onClick={() => togglePublishStatus(article.id)}
                      className={`text-sm font-medium ${
                        article.isPublished ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {article.isPublished ? '下线' : '发布'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingArticle(article);
                        setIsModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
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

      {/* 新闻编辑模态框 */}
      {isModalOpen && (
        <NewsModal
          article={editingArticle}
          categories={newsCategories}
          onSave={handleSaveArticle}
          onClose={() => {
            setIsModalOpen(false);
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
}

// 新闻编辑模态框组件
interface NewsModalProps {
  article: NewsArticle | null;
  categories: typeof newsCategories;
  onSave: (article: Partial<NewsArticle>) => void;
  onClose: () => void;
}

function NewsModal({ article, categories, onSave, onClose }: NewsModalProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    titleEn: article?.titleEn || '',
    summary: article?.summary || '',
    content: article?.content || '',
    category: article?.category || 'company',
    tags: article?.tags?.join(', ') || '',
    author: article?.author || '',
    publishDate: article?.publishDate || new Date().toISOString().split('T')[0],
    isPublished: article?.isPublished ?? false,
    isTopStory: article?.isTopStory ?? false,
    seoTitle: article?.seoTitle || '',
    seoDescription: article?.seoDescription || '',
    source: article?.source || 'LiTong Electronics'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {article ? '编辑新闻' : '新增新闻'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">新闻标题（中文）*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">新闻标题（英文）</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">新闻摘要*</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="简要描述新闻要点和关键信息"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">新闻内容*</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="详细的新闻内容"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">新闻类别*</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">新闻来源</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标签</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="用逗号分隔，如：产品发布, STM32, 新品"
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
              <label className="block text-sm font-medium text-gray-700">SEO描述</label>
              <input
                type="text"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="搜索引擎显示的描述"
              />
            </div>
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
                id="isTopStory"
                name="isTopStory"
                type="checkbox"
                checked={formData.isTopStory}
                onChange={(e) => setFormData({ ...formData, isTopStory: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isTopStory" className="ml-2 block text-sm text-gray-900">
                设为头条新闻
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