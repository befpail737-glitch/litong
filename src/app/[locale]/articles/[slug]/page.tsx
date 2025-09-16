import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  FileText,
  ChevronRight,
  Calendar,
  User,
  Clock,
  Download,
  ExternalLink,
  MessageCircle,
  BookOpen,
  ArrowLeft,
  Share2,
  Tag
} from 'lucide-react';

import { getArticleBySlug, getAllArticles } from '@/lib/sanity/articles';
import { urlFor } from '@/lib/sanity/client';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href={`/${params.locale}`} className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${params.locale}/articles`} className="hover:text-blue-600">技术文章</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{article.title}</span>
      </div>

      {/* Back to Articles */}
      <div className="mb-6">
        <Link
          href={`/${params.locale}/articles`}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回技术文章</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-8 lg:p-12">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {article.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category.name}
              </span>
            )}
            {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
              article.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {typeof tag === 'string' ? tag : String(tag)}
                </span>
              ))
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

          {article.summary && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6">{article.summary}</p>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            {article.author && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
            {article.publishedAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
              </div>
            )}
            {article.readingTime && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} 分钟阅读</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>分享文章</span>
            </button>
            <Link
              href={`/${params.locale}/inquiry`}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>技术咨询</span>
            </Link>
          </div>
        </div>

        {/* Article Image */}
        {article.featuredImage && (
          <div className="h-64 lg:h-80 bg-gray-100">
            <Image
              src={urlFor(article.featuredImage).width(800).height(400).url()}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="prose max-w-none">
              {article.content && typeof article.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : article.content && Array.isArray(article.content) ? (
                <div>
                  {article.content.map((block: any, index: number) => (
                    <div key={index}>
                      {typeof block === 'string' ? block : JSON.stringify(block)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">文章内容正在完善中</h3>
                  <p className="text-gray-500 mb-6">
                    文章详细内容正在整理中，如需了解更多信息请联系我们
                  </p>
                  <Link
                    href={`/${params.locale}/inquiry`}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>联系我们</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              相关文章
            </h3>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">相关文章功能即将推出</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                获取支持
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/${params.locale}/inquiry`}
                  className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
                >
                  技术咨询
                </Link>
                <Link
                  href={`/${params.locale}/contact`}
                  className="w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium block"
                >
                  联系专家
                </Link>
              </div>
            </div>

            {/* Article Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文章信息</h3>
              <div className="space-y-3">
                {article.category && (
                  <div>
                    <span className="text-sm text-gray-500">分类</span>
                    <p className="font-medium">{article.category.name}</p>
                  </div>
                )}
                {article.author && (
                  <div>
                    <span className="text-sm text-gray-500">作者</span>
                    <p className="font-medium">{article.author}</p>
                  </div>
                )}
                {article.publishedAt && (
                  <div>
                    <span className="text-sm text-gray-500">发布日期</span>
                    <p className="font-medium">
                      {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                )}
                {article.readingTime && (
                  <div>
                    <span className="text-sm text-gray-500">阅读时间</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{article.readingTime} 分钟</span>
                    </div>
                  </div>
                )}
                {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">标签</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          <Tag className="h-3 w-3 inline mr-1" />
                          {typeof tag === 'string' ? tag : String(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关链接</h3>
              <div className="space-y-2">
                <Link
                  href={`/${params.locale}/articles`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  所有技术文章
                </Link>
                <Link
                  href={`/${params.locale}/products`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  相关产品
                </Link>
                <Link
                  href={`/${params.locale}/solutions`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  解决方案
                </Link>
                <Link
                  href={`/${params.locale}/inquiry`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  获取报价
                </Link>
              </div>
            </div>

            {/* Download Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                相关资源
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">技术白皮书</p>
                    <p className="text-sm text-gray-500">详细技术说明文档</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">应用案例</p>
                    <p className="text-sm text-gray-500">实际应用示例文档</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const articles = await getAllArticles();

    const dynamicParams = articles
      .filter(article => article.isActive && (article.slug || article._id))
      .map(article => ({
        slug: article.slug || article._id
      }));

    // Return only valid dynamic params to avoid build errors
    console.log(`🔧 [articles/[slug]] Generated ${dynamicParams.length} static params from real data`);

    return dynamicParams;
  } catch (error) {
    console.error('Error generating static params for article detail:', error);
    // Return empty array on error to prevent build failures
    console.log(`🔧 [articles/[slug]] Returning empty params due to error`);
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: '技术文章未找到 - 力通电子',
      description: '技术文章页面不存在或已被删除。'
    };
  }

  return {
    title: `${article.title} - 力通电子技术文章`,
    description: article.summary || article.content || `${article.title} - 力通电子提供的专业技术文章`,
    keywords: `${article.title}, 技术文章, ${article.category?.name || ''}, ${article.tags?.join(', ') || ''}, 力通电子`,
  };
}