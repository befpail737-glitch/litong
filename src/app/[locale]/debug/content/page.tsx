import { getArticles, getSolutions } from '@/lib/sanity/queries';
import { safeImageUrl, safeFileUrl, getFileInfo } from '@/lib/sanity/client';
import PortableText from '@/components/PortableText';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Lightbulb, Image as ImageIcon, Download } from 'lucide-react';

interface ContentDebugPageProps {
  params: {
    locale: string;
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  // 仅为主要语言环境生成调试页面，减少构建时间和页面数量
  return [
    { locale: 'zh-CN' },
    { locale: 'en' }
  ];
}

export default async function ContentDebugPage({ params }: ContentDebugPageProps) {
  const { locale } = params;

  try {
    // 获取文章样本
    const articlesResult = await getArticles({
      limit: 3,
      featured: false
    });

    // 获取解决方案样本
    const solutionsResult = await getSolutions({
      limit: 3,
      featured: false
    });

    const articles = articlesResult?.articles || [];
    const solutions = solutionsResult?.solutions || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">内容渲染调试页面</h1>
            </div>
            <p className="text-gray-600 mt-2">测试后台内容的显示和富文本渲染</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold">技术文章</h3>
                  <p className="text-3xl font-bold text-blue-600">{articles.length}</p>
                  <p className="text-sm text-gray-600">已获取样本</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold">解决方案</h3>
                  <p className="text-3xl font-bold text-green-600">{solutions.length}</p>
                  <p className="text-sm text-gray-600">已获取样本</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold">内容类型</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {articles.length + solutions.length}
                  </p>
                  <p className="text-sm text-gray-600">总计内容</p>
                </div>
              </div>
            </div>
          </div>

          {/* 数据结构调试 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Download className="h-6 w-6" />
              数据结构和文件处理调试
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">查询结果统计</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">技术文章</span>
                    <span className="text-sm font-medium text-blue-600">{articles.length} 篇</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">解决方案</span>
                    <span className="text-sm font-medium text-green-600">{solutions.length} 个</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">内容总数</span>
                    <span className="text-sm font-medium text-purple-600">{articles.length + solutions.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">文件URL测试</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-mono text-xs text-blue-600 mb-2">示例PDF文件引用:</p>
                    <code className="text-xs">file-550e8400-e29b-41d4-a716-446655440000-pdf</code>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-mono text-xs text-green-600 mb-2">生成的URL:</p>
                    <code className="text-xs break-all">
                      {safeFileUrl({ _ref: 'file-550e8400-e29b-41d4-a716-446655440000-pdf' })}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">文件处理状态</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">safeFileUrl</span>
                    <span className="text-sm font-medium text-green-600">✅ 已修复</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PortableText</span>
                    <span className="text-sm font-medium text-green-600">✅ 增强</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">查询调试</span>
                    <span className="text-sm font-medium text-green-600">✅ 启用</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 原始数据展示 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">原始数据结构</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">文章数据样本 (前2个):</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(articles.slice(0, 2), null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">解决方案数据样本 (前2个):</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(solutions.slice(0, 2), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 技术文章调试 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              技术文章内容测试
            </h2>

            {articles.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">❌ 没有找到已发布的技术文章</p>
                <p className="text-yellow-600 text-sm mt-2">
                  请检查 Sanity 后台是否有文章设置为 isPublished = true
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <div key={article._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {article.title || '无标题'}
                          </h3>

                          {/* 文章元信息 */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span>作者: {article.author?.name || '未知'}</span>
                            <span>难度: {article.difficulty || '未设置'}</span>
                            <span>类型: {article.articleType || '未设置'}</span>
                            {article.relatedBrands?.length > 0 && (
                              <span>品牌: {article.relatedBrands.map(b => b.name).join(', ')}</span>
                            )}
                          </div>

                          {/* 摘要 */}
                          {article.excerpt && (
                            <p className="text-gray-700 mb-4">{article.excerpt}</p>
                          )}
                        </div>

                        {/* 封面图片测试 */}
                        {article.image && (
                          <div className="ml-6 flex-shrink-0">
                            <div className="w-32 h-24 relative">
                              <Image
                                src={safeImageUrl(article.image, { width: 200, height: 150, fallback: '/images/placeholder.jpg' })}
                                alt={article.image.alt || '文章封面'}
                                fill
                                className="object-cover rounded-lg"
                                sizes="200px"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">封面图片</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 富文本内容测试 */}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">富文本内容渲染测试:</h4>

                      {article.content && article.content.length > 0 ? (
                        <div className="space-y-4">
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <PortableText content={article.content} />
                          </div>

                          {/* PDF文件调试信息 */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900 mb-2">PDF文件调试信息:</p>
                            <div className="space-y-2 text-xs text-blue-800">
                              {article.content.map((block: any, idx: number) => {
                                if (block._type === 'pdf' && block.asset) {
                                  const fileUrl = safeFileUrl(block.asset);
                                  const fileInfo = getFileInfo(block.asset);
                                  return (
                                    <div key={idx} className="p-2 bg-white rounded border">
                                      <p><strong>PDF #{idx + 1}:</strong></p>
                                      <p>原始引用: {block.asset._ref || '未知'}</p>
                                      <p>生成URL: {fileUrl}</p>
                                      <p>文件信息: {JSON.stringify(fileInfo)}</p>
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        测试下载链接
                                      </a>
                                    </div>
                                  );
                                }
                                return null;
                              }).filter(Boolean)}
                              {!article.content.some((block: any) => block._type === 'pdf') && (
                                <p className="text-gray-600">该文章中没有PDF文件</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800">⚠️ 该文章没有富文本内容</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 解决方案调试 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              解决方案内容测试
            </h2>

            {solutions.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">❌ 没有找到已发布的解决方案</p>
                <p className="text-yellow-600 text-sm mt-2">
                  请检查 Sanity 后台是否有解决方案设置为 isPublished = true
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {solutions.map((solution, index) => (
                  <div key={solution._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {solution.title || '无标题'}
                          </h3>

                          {/* 解决方案元信息 */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span>目标市场: {solution.targetMarket || '未设置'}</span>
                            <span>复杂度: {solution.complexity || '未设置'}</span>
                            {solution.primaryBrand && (
                              <span>主品牌: {solution.primaryBrand.name}</span>
                            )}
                            <span>浏览次数: {solution.viewCount || 0}</span>
                          </div>

                          {/* 简介 */}
                          {solution.summary && (
                            <p className="text-gray-700 mb-4">{solution.summary}</p>
                          )}
                        </div>

                        {/* 封面图片测试 */}
                        {solution.coverImage && (
                          <div className="ml-6 flex-shrink-0">
                            <div className="w-32 h-24 relative">
                              <Image
                                src={safeImageUrl(solution.coverImage, { width: 200, height: 150, fallback: '/images/placeholder.jpg' })}
                                alt={solution.coverImage.alt || '解决方案封面'}
                                fill
                                className="object-cover rounded-lg"
                                sizes="200px"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">封面图片</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 富文本内容测试 */}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">富文本内容渲染测试:</h4>

                      {solution.description && solution.description.length > 0 ? (
                        <div className="space-y-4">
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <PortableText content={solution.description} />
                          </div>

                          {/* PDF文件调试信息 */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-green-900 mb-2">PDF文件调试信息:</p>
                            <div className="space-y-2 text-xs text-green-800">
                              {solution.description.map((block: any, idx: number) => {
                                if (block._type === 'pdf' && block.asset) {
                                  const fileUrl = safeFileUrl(block.asset);
                                  const fileInfo = getFileInfo(block.asset);
                                  return (
                                    <div key={idx} className="p-2 bg-white rounded border">
                                      <p><strong>PDF #{idx + 1}:</strong></p>
                                      <p>原始引用: {block.asset._ref || '未知'}</p>
                                      <p>生成URL: {fileUrl}</p>
                                      <p>文件信息: {JSON.stringify(fileInfo)}</p>
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:underline"
                                      >
                                        测试下载链接
                                      </a>
                                    </div>
                                  );
                                }
                                return null;
                              }).filter(Boolean)}
                              {!solution.description.some((block: any) => block._type === 'pdf') && (
                                <p className="text-gray-600">该解决方案中没有PDF文件</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800">⚠️ 该解决方案没有富文本内容</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 调试信息 */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">调试信息</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>PDF显示问题已修复:</strong> 统一文件URL处理函数 safeFileUrl() 和 getFileInfo()</p>
              <p>• <strong>PortableText组件:</strong> 已更新PDF渲染逻辑，支持调试信息显示</p>
              <p>• <strong>文档组件:</strong> document-list.tsx, document-detail.tsx 等已更新</p>
              <p>• <strong>测试方法:</strong> 上传PDF到Sanity后台，查看此页面的调试信息</p>
              <p>• <strong>检查要点:</strong> PDF文件引用格式、生成的URL、下载链接是否正常</p>
              <p>• 访问路径: /{locale}/debug/content</p>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('❌ [ContentDebugPage] Error:', error);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md">
          <h1 className="text-xl font-semibold text-red-600 mb-4">调试页面错误</h1>
          <p className="text-gray-700 mb-4">无法加载调试页面内容</p>
          <p className="text-sm text-gray-600">错误: {error.message}</p>
          <Link
            href={`/${locale}`}
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }
}