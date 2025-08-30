export async function generateStaticParams() {
  return [{ index: [] }]
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sanity CMS 管理后台
        </h1>
        <p className="text-gray-600 mb-6">
          由于静态导出限制，请使用开发环境访问完整的 Sanity Studio。
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            开发环境中访问: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/admin</code>
          </p>
          <p className="text-sm text-gray-500">
            或者直接访问: <a 
              href="https://litong.sanity.studio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              https://litong.sanity.studio
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}