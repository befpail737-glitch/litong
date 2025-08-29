'use client';

const advantages = [
  {
    title: '库存深度',
    description: '超过10万种现货库存，满足各种紧急需求',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    stats: '100,000+'
  },
  {
    title: '技术支持团队',
    description: '专业FAE团队提供选型指导和技术咨询',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    stats: '50+'
  },
  {
    title: '物流能力',
    description: '全球仓储布局，快速响应客户交付需求',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    stats: '24H'
  },
  {
    title: '质量保证',
    description: '数字证书追踪，每个产品都有报关单',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    stats: '100%'
  }
];

export default function CompanyProfile() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Company Introduction */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              公司简介
            </h2>
            <div className="mt-8 prose prose-lg text-gray-600">
              <p>
                力通电子成立于2004年，是一家专注于<strong>电子元件代理</strong>的专业公司。
                20年来，我们专注于为客户提供高质量的电子元器件产品和专业的技术支持服务。
              </p>
              <p>
                作为多家知名半导体厂商的授权代理商，我们与STMicroelectronics、Texas Instruments、
                Maxim Integrated、Infineon Technologies等全球顶级厂商建立了长期稳定的合作关系，
                确保为客户提供<strong>正品原装现货</strong>。
              </p>
              <p>
                我们的使命是通过专业的产品知识、优质的客户服务和可靠的供应链管理，
                为客户的产品设计和生产提供强有力的支持，助力客户在激烈的市场竞争中获得成功。
              </p>
            </div>
            
            {/* Key Numbers */}
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600">20+</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">年行业经验</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">1000+</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">服务客户</div>
              </div>
            </div>
          </div>
          
          {/* Company Image Placeholder */}
          <div className="mt-12 lg:mt-0">
            <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
              <svg className="w-32 h-32 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Company Advantages */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              公司优势
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              多年的行业经验和专业积累，为客户提供全方位的服务保障
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                  {advantage.icon}
                </div>
                <div className="mt-6">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {advantage.stats}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {advantage.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mt-24 bg-gray-50 rounded-2xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">企业愿景</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                成为客户最信赖的<strong>电子元件代理</strong>伙伴，通过专业的服务和优质的产品，
                推动电子行业的创新发展，为构建智能化数字化的未来贡献力量。
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">企业使命</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                专注<strong>芯片现货</strong>供应，提供专业技术支持，为客户创造价值，
                通过可靠的供应链和优质的服务，助力客户产品成功，共同推动行业进步。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}