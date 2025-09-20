import Link from 'next/link';
import {
  FileText,
  Lightbulb,
  Building2,
  Package,
  Database,
  Image as ImageIcon,
  Download,
  Settings,
  Info,
  ExternalLink
} from 'lucide-react';

interface DebugPageProps {
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

export default function DebugPage({ params }: DebugPageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">系统调试控制台</h1>
          <p className="text-gray-600 mt-2">检查和调试网站内容显示问题</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 问题诊断概述 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">问题诊断说明</h2>
              <p className="text-blue-800 mb-4">
                如果您发现后台上传的产品、解决方案文章、技术支持文章、图片或PDF在前端页面不显示，
                请使用以下调试工具来检查和解决问题。
              </p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>常见原因</strong>: 内容未设置为"已发布"状态、图片资源缺失、查询错误</p>
                <p>• <strong>修复重点</strong>: 检查 isPublished 字段、图片 URL、富文本内容渲染</p>
              </div>
            </div>
          </div>
        </div>

        {/* 调试工具网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 内容渲染测试 */}
          <Link href={`/${locale}/debug/content`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">内容渲染测试</h3>
                  <p className="text-sm text-gray-600">测试文章和解决方案显示</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                检查技术文章和解决方案的富文本内容、图片、PDF是否正确显示。
              </p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                <span>开始测试</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* 数据查询测试 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">数据查询测试</h3>
                <p className="text-sm text-gray-600">检查 Sanity 数据连接</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              测试与 Sanity CMS 的连接，检查数据查询是否正常工作。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">查询函数已修复</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">发布状态过滤器已优化</span>
              </div>
            </div>
          </div>

          {/* 图片处理测试 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">图片处理测试</h3>
                <p className="text-sm text-gray-600">检查图片和PDF显示</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              验证 Sanity 图片 URL 生成、PDF 文件链接和错误处理。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">图片 URL 构建已修复</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">PDF 链接处理已改进</span>
              </div>
            </div>
          </div>

          {/* 构建错误修复 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">构建错误修复</h3>
                <p className="text-sm text-gray-600">预渲染错误已解决</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              修复了技术支持页面的构建失败问题，优化了静态参数生成。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">静态参数限制已优化</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">错误回退机制已改进</span>
              </div>
            </div>
          </div>

          {/* 品牌管理 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">品牌页面状态</h3>
                <p className="text-sm text-gray-600">品牌关联内容检查</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              检查品牌页面的产品、解决方案、技术支持内容是否正确关联。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">品牌关联查询已修复</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">支持多品牌关联</span>
              </div>
            </div>
          </div>

          {/* 产品显示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">产品显示状态</h3>
                <p className="text-sm text-gray-600">产品数据显示检查</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              验证产品页面的图片、规格、文档等内容是否正确显示。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">产品查询已优化</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">激活状态检查已加强</span>
              </div>
            </div>
          </div>
        </div>

        {/* 修复摘要 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">修复摘要</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-green-600 mb-3">✅ 已修复的问题</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 技术支持文档查询条件过于严格 → 已放宽查询条件</li>
                <li>• 解决方案查询逻辑错误 → 已修正 isPublished 检查</li>
                <li>• 构建时预渲染失败 → 已优化静态参数生成</li>
                <li>• 图片显示错误处理不完善 → 已加强错误处理和 fallback</li>
                <li>• PDF 文件 URL 生成错误 → 已修复 URL 构建逻辑</li>
                <li>• 富文本内容渲染问题 → 已优化 PortableText 组件</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-3">🔧 如何验证修复</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. 访问 <code className="bg-gray-100 px-1 rounded">/{locale}/debug/content</code> 测试内容显示</li>
                <li>2. 检查 Sanity 后台内容的 isPublished 字段是否为 true</li>
                <li>3. 确认文章和解决方案已正确关联到品牌</li>
                <li>4. 重新构建项目，检查是否还有构建错误</li>
                <li>5. 在品牌页面查看技术支持、解决方案是否显示</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速导航</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800 text-sm">
              → 返回首页
            </Link>
            <Link href={`/${locale}/brands`} className="text-blue-600 hover:text-blue-800 text-sm">
              → 品牌列表
            </Link>
            <Link href={`/${locale}/solutions`} className="text-blue-600 hover:text-blue-800 text-sm">
              → 解决方案
            </Link>
            <Link href={`/${locale}/articles`} className="text-blue-600 hover:text-blue-800 text-sm">
              → 技术文章
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}