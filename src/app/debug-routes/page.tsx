export default function DebugRoutesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">路由调试信息</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">测试链接</h2>
          <div className="space-y-2">
            <div>
              <a href="/brands/MediaTek" className="text-blue-600 hover:underline">
                /brands/MediaTek (无斜杠)
              </a>
            </div>
            <div>
              <a href="/brands/MediaTek/" className="text-blue-600 hover:underline">
                /brands/MediaTek/ (有斜杠)
              </a>
            </div>
            <div>
              <a href="/brands/MediaTek/products" className="text-blue-600 hover:underline">
                /brands/MediaTek/products (产品页)
              </a>
            </div>
            <div>
              <a href="/brands/MediaTek/products/" className="text-blue-600 hover:underline">
                /brands/MediaTek/products/ (产品页有斜杠)
              </a>
            </div>
            <div>
              <a href="/brands/英飞凌/" className="text-blue-600 hover:underline">
                /brands/英飞凌/ (中文品牌)
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">当前页面信息</h2>
          <div className="space-y-2 text-sm">
            <div>URL: {typeof window !== 'undefined' ? window.location.href : '服务器端渲染'}</div>
            <div>路径: {typeof window !== 'undefined' ? window.location.pathname : '服务器端渲染'}</div>
            <div>时间: {new Date().toLocaleString('zh-CN')}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">预期路由结构</h2>
          <div className="text-sm space-y-1">
            <div>✓ /debug-routes - 调试页面</div>
            <div>? /brands/[slug] - 品牌主页</div>
            <div>? /brands/[slug]/products - 品牌产品页</div>
            <div>? /brands/[slug]/solutions - 品牌解决方案页</div>
            <div>? /brands/[slug]/support - 品牌技术支持页</div>
          </div>
        </div>
      </div>
    </div>
  );
}