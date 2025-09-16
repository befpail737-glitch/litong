import { MainLayout } from '@/components/layout/MainLayout';

export default function SearchPage() {
  return (
    <MainLayout>
      {/* Search Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">搜索结果</h1>

            {/* Search Form */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="搜索产品、品牌、型号..."
                className="w-full px-4 py-3 pl-12 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <div className="absolute left-4 top-3.5">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="absolute right-3 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                搜索
              </button>
            </div>

            {/* Search Filters */}
            <div className="flex flex-wrap gap-3">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>所有分类</option>
                <option>微控制器</option>
                <option>传感器</option>
                <option>电源管理</option>
                <option>模拟IC</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>所有品牌</option>
                <option>STMicroelectronics</option>
                <option>Texas Instruments</option>
                <option>Analog Devices</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>排序方式</option>
                <option>相关性</option>
                <option>价格由低到高</option>
                <option>价格由高到低</option>
                <option>最新上架</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-gray-600">
                搜索结果: 正在加载中...
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">显示方式:</div>
                <div className="flex border border-gray-300 rounded-md">
                  <button className="p-2 bg-blue-600 text-white rounded-l-md">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-r-md">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* No Results / Loading State */}
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">开始搜索</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                在上方搜索框中输入产品型号、品牌名称或关键词来查找您需要的产品
              </p>
            </div>

            {/* Search Suggestions */}
            <div className="bg-white rounded-xl p-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">热门搜索</h3>
              <div className="flex flex-wrap gap-3">
                {['STM32', 'ESP32', 'Arduino', '传感器', '电源芯片', 'MCU', 'MOSFET', '运放'].map((term, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="bg-blue-50 rounded-xl p-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">搜索技巧</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">精确搜索</h4>
                  <p className="text-gray-600">使用完整的产品型号可以获得最精确的搜索结果</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">关键词搜索</h4>
                  <p className="text-gray-600">使用产品功能或应用场景关键词扩大搜索范围</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">品牌筛选</h4>
                  <p className="text-gray-600">选择特定品牌可以快速缩小搜索范围</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">分类筛选</h4>
                  <p className="text-gray-600">根据产品分类筛选可以找到相关产品</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}