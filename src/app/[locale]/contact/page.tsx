import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Users,
  Award,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          联系我们
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          力通电子致力于为客户提供专业的电子元器件采购服务，欢迎随时联系我们获取报价和技术支持。
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 联系信息 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 总部信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                总部地址
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">深圳总部</p>
                  <p className="text-gray-600 text-sm">
                    广东省深圳市南山区科技园南区<br/>
                    高新南七道16号德维森大厦15楼
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">+86-755-8888-9999</p>
                  <p className="text-gray-600 text-sm">销售热线</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">sales@litong-electronics.com</p>
                  <p className="text-gray-600 text-sm">销售邮箱</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">营业时间</p>
                  <p className="text-gray-600 text-sm">
                    周一至周五: 9:00-18:00<br/>
                    周六: 9:00-12:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分支机构 */}
          <Card>
            <CardHeader>
              <CardTitle>分支机构</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">上海分公司</h4>
                <p className="text-sm text-gray-600">上海市浦东新区张江高科技园区</p>
                <p className="text-sm text-gray-600">电话: +86-21-6888-9999</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">北京分公司</h4>
                <p className="text-sm text-gray-600">北京市海淀区中关村科技园</p>
                <p className="text-sm text-gray-600">电话: +86-10-8888-9999</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">成都分公司</h4>
                <p className="text-sm text-gray-600">四川省成都市高新区天府软件园</p>
                <p className="text-sm text-gray-600">电话: +86-28-8888-9999</p>
              </div>
            </CardContent>
          </Card>

          {/* 服务优势 */}
          <Card>
            <CardHeader>
              <CardTitle>服务优势</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm">15年行业经验</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm">专业技术团队</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-600" />
                <span className="text-sm">全球供应链网络</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm">24小时快速响应</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 联系表单 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>在线咨询</CardTitle>
              <p className="text-gray-600">
                填写下方表单，我们的专业团队将在24小时内与您联系。
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公司名称 *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址 *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    咨询类型
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>产品询价</option>
                    <option>技术支持</option>
                    <option>供应商合作</option>
                    <option>代理申请</option>
                    <option>其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细需求 *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="请详细描述您的需求，包括产品型号、数量、技术要求等..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
                    我已阅读并同意 <a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  提交咨询
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>深圳总部位置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="mx-auto h-12 w-12 mb-4" />
                <p className="font-medium">地图加载区域</p>
                <p className="text-sm">广东省深圳市南山区科技园南区高新南七道16号</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷联系方式 */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">电话咨询</h3>
            <p className="text-gray-600 text-sm mb-4">
              专业销售团队为您提供产品报价和技术咨询
            </p>
            <Button variant="outline" className="w-full">
              立即拨打
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Mail className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">邮件咨询</h3>
            <p className="text-gray-600 text-sm mb-4">
              发送邮件描述您的需求，我们将及时回复
            </p>
            <Button variant="outline" className="w-full">
              发送邮件
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Building2 className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">实地访问</h3>
            <p className="text-gray-600 text-sm mb-4">
              欢迎到我们的展厅了解产品和解决方案
            </p>
            <Button variant="outline" className="w-full">
              预约参观
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// SEO元数据
export const metadata = {
  title: '联系我们 - 专业电子元器件供应商 | 力通电子',
  description: '联系力通电子获取专业的电子元器件采购服务。深圳总部及全国分支机构，提供24小时技术支持和快速报价服务。',
  keywords: '联系力通电子,电子元器件供应商,深圳电子元件,技术支持,产品报价',
};
