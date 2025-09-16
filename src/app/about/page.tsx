import { MainLayout } from '@/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-orange-100 text-orange-800">
              关于我们
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              专业的电子元器件供应链服务商
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              力通电子成立15年来，始终专注于为全球客户提供高品质的电子元器件产品和专业技术支持，
              是值得信赖的供应链合作伙伴。
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">年行业经验</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">12+</div>
                <div className="text-gray-600">合作品牌</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">174K+</div>
                <div className="text-gray-600">产品型号</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">10,000+</div>
                <div className="text-gray-600">客户信赖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  我们的故事
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    力通电子成立于2009年，从一家小型电子元器件贸易公司发展成为今天的专业供应链服务商。
                    我们始终坚持以客户需求为中心，以品质为生命线的经营理念。
                  </p>
                  <p>
                    经过15年的发展，我们建立了完善的供应链体系，与全球多家知名半导体制造商建立了长期稳定的合作关系，
                    为客户提供从选型到交付的一站式服务。
                  </p>
                  <p>
                    今天，力通电子已成为行业内备受信赖的合作伙伴，我们将继续秉承专业、诚信、创新的价值观，
                    为推动电子行业发展贡献力量。
                  </p>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <div className="text-xl font-semibold text-gray-700">力通电子总部</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                核心价值观
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                我们的价值观指引着我们的每一个决策和行动
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-2xl">🎯</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">专业</h3>
                <p className="text-gray-600 leading-relaxed">
                  凭借深厚的行业知识和丰富的实践经验，为客户提供最专业的产品选型和技术支持服务。
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-2xl">🤝</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">诚信</h3>
                <p className="text-gray-600 leading-relaxed">
                  诚实守信是我们立足之本，我们坚持原装正品，透明定价，言出必行的经营原则。
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-2xl">💡</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">创新</h3>
                <p className="text-gray-600 leading-relaxed">
                  持续优化服务流程，引入新技术和新模式，为客户创造更大价值。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                专业团队
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                我们拥有一支经验丰富、专业敬业的团队
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white font-bold text-xl">技</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">技术团队</h3>
                <p className="text-sm text-gray-600">资深工程师提供专业技术支持</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white font-bold text-xl">销</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">销售团队</h3>
                <p className="text-sm text-gray-600">专业销售顾问提供定制化解决方案</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white font-bold text-xl">供</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">供应链团队</h3>
                <p className="text-sm text-gray-600">高效的采购和库存管理</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white font-bold text-xl">质</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">质量团队</h3>
                <p className="text-sm text-gray-600">严格的质量控制和检测体系</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                资质认证
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                完善的质量管理体系和行业认证
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🏆</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ISO9001</h3>
                <p className="text-sm text-gray-600">质量管理体系认证</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">✅</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">原厂授权</h3>
                <p className="text-sm text-gray-600">多家品牌官方授权代理商</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🔒</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">信息安全</h3>
                <p className="text-sm text-gray-600">完善的数据保护体系</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🌱</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">环保认证</h3>
                <p className="text-sm text-gray-600">绿色环保合规认证</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            期待与您合作
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            让我们成为您可信赖的供应链合作伙伴，共同推动您的项目成功
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              联系我们
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              申请合作
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}