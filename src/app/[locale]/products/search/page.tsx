import { ProductSearch } from '@/components/search/ProductSearch'

export default function ProductSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">产品搜索</h1>
        <p className="text-lg text-gray-600">
          快速找到您需要的电子元器件
        </p>
      </div>

      {/* 搜索组件 */}
      <ProductSearch />
    </div>
  )
}