import { MainLayout } from '@/components/layout/MainLayout';

export default function InquiryPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-blue-100 text-blue-800">
              获取报价
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              快速获取产品报价
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              填写以下表单，我们的专业团队将在24小时内为您提供准确的产品报价和技术支持。
              所有询价信息将严格保密。
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">询价表单</h2>

                  <form className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入您的姓名"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          公司名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入公司名称"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          邮箱地址 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入邮箱地址"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          联系电话 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入联系电话"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        产品型号/品牌 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入需要询价的产品型号、品牌和规格，每行一个产品"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          需求数量
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="例如：1000pcs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          期望交期
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">请选择期望交期</option>
                          <option value="urgent">紧急（1-3天）</option>
                          <option value="normal">常规（1-2周）</option>
                          <option value="flexible">灵活（1个月内）</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        应用场景
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例如：消费电子、工业控制、汽车电子等"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        补充说明
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入其他需求或特殊要求"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors duration-200"
                      >
                        提交询价
                      </button>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        点击提交表示您同意我们的<span className="text-blue-600 hover:underline cursor-pointer">隐私政策</span>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">

                {/* Response Time */}
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">快速响应</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    我们承诺在收到询价后24小时内回复，紧急需求可在2小时内响应。
                  </p>
                </div>

                {/* Professional Service */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">专业服务</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    专业的技术团队为您提供产品选型建议和技术支持服务。
                  </p>
                </div>

                {/* Competitive Price */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">优惠价格</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    直接与原厂合作，为您提供具有竞争力的价格优势。
                  </p>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">联系方式</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">400-123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">inquiry@elec-distributor.com</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-gray-600">
                        <div>工作时间：</div>
                        <div>周一至周五 9:00-18:00</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              常见问题
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Q: 询价后多久能收到报价？</h3>
                <p className="text-gray-600">A: 我们承诺在收到完整询价信息后24小时内回复，对于紧急项目可在2小时内提供初步报价。</p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Q: 是否提供样品？</h3>
                <p className="text-gray-600">A: 是的，我们可以为客户提供产品样品用于测试验证，具体样品政策请联系我们的销售团队。</p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Q: 最小订购量是多少？</h3>
                <p className="text-gray-600">A: 不同产品的最小订购量不同，我们会在报价中明确标注MOQ信息。对于小批量需求也欢迎咨询。</p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Q: 如何保证产品质量？</h3>
                <p className="text-gray-600">A: 我们只销售原装正品，所有产品均来自官方授权渠道，并提供相应的质量保证和技术支持。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}