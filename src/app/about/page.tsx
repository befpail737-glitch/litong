export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">关于力通电子</h1>
            <p className="text-xl text-green-100">
              15年专业电子元器件分销经验，您值得信赖的供应链合作伙伴
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">公司简介</h2>
              <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  深圳市力通电子有限公司成立于2009年，专注于电子元器件的分销与技术服务。
                  经过15年的发展，我们已成为华南地区领先的电子元器件供应商之一。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  公司秉承"诚信经营、质量第一、服务至上"的经营理念，与全球多家知名半导体厂商建立了
                  深度合作关系，为客户提供从产品选型、技术支持到供应链管理的一站式解决方案。
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">2009</div>
                    <div className="text-gray-600">成立年份</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                    <div className="text-gray-600">行业经验</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">企业使命</h3>
                  <p className="text-green-100 mb-6">
                    成为客户最信赖的电子元器件供应链服务商，通过专业的技术支持和
                    优质的产品服务，助力客户实现商业成功。
                  </p>
                  <div className="space-y-3">
                    {['专业服务', '诚信经营', '持续创新', '客户至上'].map((value, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="h-5 w-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">发展成果</h2>
            <p className="text-lg text-gray-600">用数据说话的企业实力</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '10,000+',
                label: '服务客户',
                description: '遍布全国各行业',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: 'blue'
              },
              {
                number: '174K+',
                label: '产品型号',
                description: '覆盖多个品类',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                color: 'green'
              },
              {
                number: '50+',
                label: '合作品牌',
                description: '全球知名厂商',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                ),
                color: 'purple'
              },
              {
                number: '98%',
                label: '客户满意度',
                description: '优质服务保障',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                color: 'red'
              }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${stat.color}-100 text-${stat.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}</div>
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">专业团队</h2>
            <p className="text-lg text-gray-600">经验丰富的专业人才是我们的核心竞争力</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                department: '技术支持团队',
                description: '拥有丰富的电子工程背景，为客户提供专业的技术咨询和选型建议',
                members: '12人',
                experience: '平均8年经验'
              },
              {
                department: '销售服务团队',
                description: '深入了解市场需求，为客户提供最适合的产品解决方案',
                members: '18人',
                experience: '平均6年经验'
              },
              {
                department: '供应链团队',
                description: '专业的采购和物流团队，确保产品供应的及时性和稳定性',
                members: '8人',
                experience: '平均7年经验'
              }
            ].map((team, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{team.department}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{team.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{team.members}</div>
                    <div className="text-gray-500 text-sm">团队规模</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{team.experience}</div>
                    <div className="text-gray-500 text-sm">行业经验</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-lg text-gray-600">期待与您的合作</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">公司信息</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: '公司全称',
                      value: '深圳市力通电子有限公司',
                      icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )
                    },
                    {
                      label: '办公地址',
                      value: '深圳市南山区科技园南区科苑路15号科兴科学园B栋3楼',
                      icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )
                    },
                    {
                      label: '联系电话',
                      value: '+86-755-8888-8888',
                      icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    {
                      label: '邮箱地址',
                      value: 'info@litongtech.com',
                      icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                    }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-green-600 mr-3 mt-1">
                        {contact.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">{contact.label}</div>
                        <div className="text-gray-600">{contact.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">营业时间</h3>
                <div className="space-y-4">
                  {[
                    { day: '周一至周五', time: '上午 9:00 - 下午 6:00' },
                    { day: '周六', time: '上午 9:00 - 下午 5:00' },
                    { day: '周日', time: '休息' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">紧急联系</h4>
                  <p className="text-green-700 text-sm">
                    如有紧急技术支持需求，请拨打24小时服务热线：
                    <br />
                    <span className="font-medium">+86-755-8888-9999</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">开始我们的合作</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            让力通电子成为您可靠的电子元器件供应链合作伙伴
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
              立即咨询
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-medium transition-colors">
              下载资料
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}