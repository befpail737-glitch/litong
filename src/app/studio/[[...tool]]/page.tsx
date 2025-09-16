/**
 * Studio page with multiple access options
 */

export async function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPageAccess() {
  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sanity Studio 后台管理</h1>

      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ 当前可用访问方式</h2>
          <p className="text-green-700 mb-3">本地开发环境Studio正在运行</p>
          <a
            href="http://localhost:3333/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            打开本地Studio (localhost:3333)
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔧 生产环境Studio</h2>
          <p className="text-yellow-700 mb-3">生产环境Studio正在配置中</p>
          <a
            href="https://litong-electronics.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            尝试访问生产环境Studio
          </a>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">📋 管理功能</h2>
          <div className="text-blue-700 text-sm">
            <p>• 品牌管理 (Brand Management)</p>
            <p>• 产品管理 (Product Management)</p>
            <p>• 分类管理 (Category Management)</p>
            <p>• 文章管理 (Article Management)</p>
            <p>• 媒体库管理 (Media Library)</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>项目ID: oquvb2bs | 数据集: production</p>
        <p>如需技术支持，请联系系统管理员</p>
      </div>
    </div>
  )
}