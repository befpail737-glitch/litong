import { MainLayout } from '@/components/layout/MainLayout';
import { getProductCategories } from '@/lib/sanity/queries';

export default async function CategoriesPage() {
  // 从Sanity CMS获取产品分类数据
  let categories = [];
  try {
    categories = await getProductCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // 如果获取失败，categories将保持为空数组
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-green-100 text-green-800">
              产品分类
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              完整的产品分类体系
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              力通电子提供全面的电子元器件产品分类，涵盖半导体、被动器件、连接器等多个领域，
              帮助您快速找到所需的产品。
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索产品分类..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-3.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无分类数据</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                产品分类信息正在维护中，请稍后再查看或联系我们获取更多信息。
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {category.icon ? (
                          <div className="text-white text-xl">
                            {/* 这里可以根据icon类型渲染对应的图标 */}
                            📦
                          </div>
                        ) : (
                          <div className="text-white font-bold text-sm">
                            {category.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                        查看产品 →
                      </button>
                      <div className="text-gray-400 text-xs">
                        分类级别: {category.level || 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                热门产品分类
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                最受欢迎的产品分类，涵盖主流电子元器件类型
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['微控制器', '传感器', '电源管理', '模拟IC', '数字IC', '连接器', '被动器件', '开发板'].map((categoryName, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl">
                      {index === 0 && '🔧'}
                      {index === 1 && '📡'}
                      {index === 2 && '⚡'}
                      {index === 3 && '🔄'}
                      {index === 4 && '💻'}
                      {index === 5 && '🔌'}
                      {index === 6 && '🎛️'}
                      {index === 7 && '🛠️'}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {categoryName}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            找不到需要的产品分类？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们拥有更全面的产品库存，欢迎联系我们的技术团队获取定制化解决方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              联系技术支持
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              提交需求
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}