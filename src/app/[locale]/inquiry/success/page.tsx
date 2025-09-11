import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, Phone, Mail } from 'lucide-react'

export default function InquirySuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-16">
            <div className="mb-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">询价单提交成功！</h1>
              <p className="text-lg text-gray-600">
                感谢您的询价，我们的专业团队将在 <span className="font-semibold text-blue-600">24小时内</span> 与您联系
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">接下来会发生什么？</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">技术团队评估</p>
                    <p className="text-sm text-gray-600">我们的工程师将详细评估您的需求</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">方案定制</p>
                    <p className="text-sm text-gray-600">为您定制最适合的产品方案和价格</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">专人联系</p>
                    <p className="text-sm text-gray-600">销售工程师将主动联系您详细沟通</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">急需帮助？</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-md">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">电话咨询</p>
                    <p className="text-sm text-blue-600">400-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-md">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">邮件联系</p>
                    <p className="text-sm text-blue-600">sales@litong.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/products" className="flex items-center gap-2">
                  继续浏览产品
                </Link>
              </Button>
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}