'use client';

import { useState, useEffect, useRef } from 'react';

interface Article {
  id: string;
  title: string;
  category: 'selection-guide' | 'application-note' | 'troubleshooting' | 'product-review';
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
  brand?: string; // 添加品牌字段
  featured?: boolean;
  readTime?: number;
}

const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'STM32选型指南：如何选择合适的微控制器',
    category: 'selection-guide',
    content: '在选择STM32微控制器时，需要考虑多个因素...',
    excerpt: '详细介绍STM32系列微控制器的选型要点，帮助工程师做出正确的选择。',
    tags: ['STM32', '选型', '微控制器'],
    author: 'FAE团队',
    publishedAt: '2024-11-15',
    status: 'published',
    brand: 'stmicroelectronics'
  },
  {
    id: '2',
    title: '电源管理IC应用笔记：TPS54360使用详解',
    category: 'application-note',
    content: 'TPS54360是一款高效的同步降压转换器...',
    excerpt: '详细介绍TPS54360的应用电路设计和使用注意事项。',
    tags: ['TPS54360', '电源管理', '降压转换器'],
    author: '李工程师',
    publishedAt: '2024-11-12',
    status: 'published',
    brand: 'ti'
  }
];

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    { value: 'all', label: '所有分类' },
    { value: 'selection-guide', label: '选型指南' },
    { value: 'application-note', label: '应用笔记' },
    { value: 'troubleshooting', label: '问题排查' },
    { value: 'product-review', label: '新品评测' }
  ];

  // 品牌列表
  const brands = [
    { value: '', label: '通用文章' },
    { value: 'stmicroelectronics', label: 'STMicroelectronics' },
    { value: 'ti', label: 'Texas Instruments' },
    { value: 'infineon', label: 'Infineon' },
    { value: 'microchip', label: 'Microchip' },
    { value: 'analog-devices', label: 'Analog Devices' },
    { value: 'maxim', label: 'Maxim Integrated' },
    { value: 'nxp', label: 'NXP' },
    { value: 'renesas', label: 'Renesas' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      if (editingArticle) {
        // Update existing article
        setArticles(prev => prev.map(article => 
          article.id === editingArticle.id 
            ? { ...article, ...articleData, readTime: calculateReadTime(articleData.content || '') }
            : article
        ));
        setMessage({ type: 'success', text: '文章更新成功！' });
      } else {
        // Create new article
        const newArticle: Article = {
          id: Date.now().toString(),
          title: articleData.title || '',
          category: articleData.category || 'application-note',
          content: articleData.content || '',
          excerpt: articleData.excerpt || '',
          tags: articleData.tags || [],
          author: articleData.author || 'FAE团队',
          publishedAt: new Date().toISOString().split('T')[0],
          status: articleData.status || 'draft',
          brand: articleData.brand || '',
          featured: articleData.featured || false,
          readTime: calculateReadTime(articleData.content || '')
        };
        setArticles(prev => [...prev, newArticle]);
        setMessage({ type: 'success', text: '文章创建成功！' });
      }
      
      setIsModalOpen(false);
      setEditingArticle(null);
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败，请重试！' });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').length;
    return Math.max(1, Math.ceil(textLength / wordsPerMinute));
  };

  const deleteArticle = (articleId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">已发布</span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">草稿</span>;
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setMessage(null)}
                  className={`inline-flex p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    message.type === 'success' 
                      ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                      : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">文章管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理技术支持文章，包括选型指南、应用笔记等
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingArticle(null);
              setIsModalOpen(true);
            }}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? '处理中...' : '新建文章'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">搜索文章</label>
          <input
            type="text"
            placeholder="输入标题或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">文章分类</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">
            共 {filteredArticles.length} 篇文章
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <li key={article.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-indigo-600 truncate">
                        {article.title}
                      </p>
                      {getStatusBadge(article.status)}
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            {getCategoryLabel(article.category)}
                          </span>
                          {article.author}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-4">
                        <div className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {article.publishedAt}
                        </div>
                        {article.readTime && (
                          <div className="flex items-center">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {article.readTime} 分钟阅读
                          </div>
                        )}
                        {article.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            ⭐ 推荐
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{article.excerpt}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingArticle(article);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
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

      {/* Article Modal */}
      {isModalOpen && (
        <ArticleModal
          article={editingArticle}
          categories={categories.filter(cat => cat.value !== 'all')}
          brands={brands}
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

// Article Modal Component
interface ArticleModalProps {
  article: Article | null;
  categories: { value: string; label: string }[];
  brands: { value: string; label: string }[];
  onSave: (article: Partial<Article>) => void;
  onClose: () => void;
}

function ArticleModal({ article, categories, brands, onSave, onClose }: ArticleModalProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    category: article?.category || 'application-note',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    tags: article?.tags.join(', ') || '',
    author: article?.author || 'FAE团队',
    status: article?.status || 'draft',
    brand: article?.brand || '',
    featured: article?.featured || false
  });

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const beforeText = formData.content.substring(0, startPos);
    const afterText = formData.content.substring(endPos);
    const newText = beforeText + textToInsert + afterText;
    
    setFormData({ ...formData, content: newText });
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length);
      textarea.focus();
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {article ? '编辑文章' : '新建文章'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">文章标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">关联品牌</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {brands.map(brand => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">摘要</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">标签 (用逗号分隔)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="例如: STM32, 选型, 微控制器"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <div className="mt-1 border border-gray-300 rounded-md">
              <div className="border-b border-gray-300 px-3 py-2 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('**加粗文字**')}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white"
                    title="加粗"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('*斜体文字*')}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white"
                    title="斜体"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('[链接文字](http://example.com)')}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white"
                    title="插入链接"
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('`代码`')}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white"
                    title="代码"
                  >
                    &lt;/&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n> 引用文字\n')}
                    className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white"
                    title="引用"
                  >
                    " "
                  </button>
                </div>
              </div>
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full p-3 border-0 focus:ring-0 resize-none outline-none"
                placeholder="支持Markdown格式：
**粗体** *斜体* `代码` [链接](url)
> 引用

## 标题
- 列表项
1. 数字列表

```
代码块
```"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>支持Markdown格式</span>
              <span>字数: {formData.content.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>

            <div className="flex items-center h-full">
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  设为推荐文章
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