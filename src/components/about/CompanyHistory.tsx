import { useTranslations } from 'next-intl';

interface HistoryItem {
  year: string;
  title: string;
  description: string;
}

const historyData: HistoryItem[] = [
  {
    year: '2004',
    title: '公司成立',
    description: '力通电子在深圳成立，专注电子元件代理业务'
  },
  {
    year: '2008',
    title: '业务扩展',
    description: '扩展产品线，建立稳定的供应链体系'
  },
  {
    year: '2012',
    title: '质量认证',
    description: '通过ISO9001质量管理体系认证'
  },
  {
    year: '2016',
    title: '技术升级',
    description: '引入先进的库存管理系统和在线交易平台'
  },
  {
    year: '2020',
    title: '数字化转型',
    description: '全面数字化转型，提升客户服务体验'
  },
  {
    year: '2024',
    title: '持续发展',
    description: '20年专业经验，服务客户遍布全球'
  }
];

export default function CompanyHistory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">发展历程</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            二十年来，我们始终坚持专业、诚信的经营理念，与客户携手共创美好未来
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

          <div className="space-y-12">
            {historyData.map((item, index) => (
              <div key={item.year} className={`relative flex items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl font-bold text-blue-600 mr-3">{item.year}</span>
                      <div className="flex-1 h-px bg-gray-200 md:hidden"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}