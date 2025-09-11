'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面错误</h1>
        <p className="text-gray-600 mb-6">
          当前页面遇到了一些问题，请尝试刷新页面或返回首页。
        </p>
        <button
          onClick={reset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  )
}