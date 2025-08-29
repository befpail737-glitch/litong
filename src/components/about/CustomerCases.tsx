import Image from 'next/image';

interface CustomerCase {
  id: number;
  company: string;
  industry: string;
  logo: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
}

const customerCases: CustomerCase[] = [
  {
    id: 1,
    company: '华为技术',
    industry: '通信设备',
    logo: '/images/customers/huawei.png',
    description: '全球领先的信息与通信技术解决方案供应商',
    challenge: '需要大量高质量的通信芯片，对供货稳定性要求极高',
    solution: '建立专门的供应链团队，提供定制化采购方案',
    result: '连续3年零断货，助力客户产品按时交付'
  },
  {
    id: 2,
    company: '比亚迪',
    industry: '新能源汽车',
    logo: '/images/customers/byd.png',
    description: '全球领先的新能源汽车制造商',
    challenge: '汽车电子元件需求量大，对质量要求严苛',
    solution: '建立汽车级元件供应体系，提供全程质量追溯',
    result: '成为比亚迪重要供应商，年供货额超千万'
  },
  {
    id: 3,
    company: '小米科技',
    industry: '智能设备',
    logo: '/images/customers/xiaomi.png',
    description: '全球领先的智能手机和IoT设备制造商',
    challenge: '产品迭代快，需要快速响应的供应链支持',
    solution: '建立快速响应机制，提供样品和小批量供货',
    result: '支持客户新品快速上市，建立长期合作关系'
  }
];

export default function CustomerCases() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">客户案例</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            我们为众多知名企业提供专业的电子元件供应服务，赢得了客户的信任与认可
          </p>
        </div>

        <div className="space-y-12">
          {customerCases.map((customerCase, index) => (
            <div key={customerCase.id} className={`flex flex-col lg:flex-row items-center gap-8 ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Customer Info */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {customerCase.company.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{customerCase.company}</h3>
                    <p className="text-blue-600 font-medium">{customerCase.industry}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-lg">{customerCase.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">挑战</h4>
                    <p className="text-red-700 text-sm">{customerCase.challenge}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">解决方案</h4>
                    <p className="text-blue-700 text-sm">{customerCase.solution}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">成果</h4>
                    <p className="text-green-700 text-sm">{customerCase.result}</p>
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="flex-shrink-0">
                <div className="w-80 h-60 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-md">
                      <span className="text-3xl font-bold text-blue-600">
                        {customerCase.company.charAt(0)}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{customerCase.company}</h4>
                    <p className="text-gray-600">{customerCase.industry}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Logos */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">合作伙伴</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {['华为', '比亚迪', '小米', '联想', '海康', '大疆'].map((partner, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-gray-600">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}