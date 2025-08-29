import { ShieldCheckIcon, DocumentCheckIcon, UserGroupIcon, TruckIcon } from '../ui/icons';

interface QualityFeature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  details: string[];
}

const qualityFeatures: QualityFeature[] = [
  {
    icon: ShieldCheckIcon,
    title: '正品保证',
    description: '所有产品均为正品原装，提供品质保障',
    details: [
      '与原厂直接合作',
      '严格的供应商筛选',
      '完善的防伪验证',
      '质量问题包退换'
    ]
  },
  {
    icon: DocumentCheckIcon,
    title: '认证齐全',
    description: '通过多项国际质量认证标准',
    details: [
      'ISO9001质量管理体系',
      'ISO14001环境管理体系',
      'OHSAS18001职业健康安全',
      '各类产品认证证书'
    ]
  },
  {
    icon: UserGroupIcon,
    title: '专业团队',
    description: '拥有经验丰富的专业技术团队',
    details: [
      '资深工程师团队',
      '专业技术支持',
      '快速响应服务',
      '定制化解决方案'
    ]
  },
  {
    icon: TruckIcon,
    title: '物流保障',
    description: '完善的物流体系，确保货品安全',
    details: [
      '专业包装防护',
      '多种物流选择',
      '实时跟踪查询',
      '损坏包赔服务'
    ]
  }
];

export default function QualityAssurance() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">质量保证</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            严格的质量管理体系，确保每一件产品都符合最高标准
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Quality Metrics */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">质量数据</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">产品合格率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-gray-600">技术响应时间</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">质量投诉</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}