'use client';

import Link from 'next/link';

import {
  MessageCircle,
  FileSpreadsheet,
  Send,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  HeadphonesIcon
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InquiryGuide() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            专业B2B询价平台
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            智能询价系统
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            多种询价方式，满足不同需求。从快速询价到详细BOM导入，为您提供专业的电子元器件采购服务。
          </p>
        </div>

        {/* 询价方式卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* 快速询价 */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                快速询价
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                在产品页面点击"快速询价"按钮，填写基本信息即可快速提交询价需求。
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>1分钟完成</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>实时响应</span>
              </div>
            </CardContent>
          </Card>

          {/* BOM批量询价 */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                BOM批量询价
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                上传Excel/CSV格式的BOM清单，系统自动解析并生成完整的询价单。
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>支持Excel/CSV</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>智能解析</span>
              </div>
            </CardContent>
          </Card>

          {/* 详细询价 */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full flex items-center justify-center">
              <Send className="h-6 w-6 text-purple-600" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5 text-purple-600" />
                详细询价
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                完整的分步骤询价流程，包含公司信息、项目详情和技术要求。
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>项目管理</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>技术支持</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 服务流程 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            服务流程
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">提交询价</h4>
              <p className="text-sm text-gray-600">选择合适的询价方式提交需求</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">专业分析</h4>
              <p className="text-sm text-gray-600">技术团队分析并匹配供应商</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">快速报价</h4>
              <p className="text-sm text-gray-600">24小时内提供详细报价方案</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">持续服务</h4>
              <p className="text-sm text-gray-600">专属客服全程跟进服务</p>
            </div>
          </div>
        </div>

        {/* 服务特色 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">24小时响应</h4>
            <p className="text-sm text-gray-600">快速响应您的询价需求，提供专业技术支持</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">信息安全</h4>
            <p className="text-sm text-gray-600">严格保护企业信息，绝不泄露给第三方</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">专业服务</h4>
            <p className="text-sm text-gray-600">资深工程师团队，提供技术咨询和方案优化</p>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/inquiry">
                <Send className="h-5 w-5 mr-2" />
                立即询价
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                浏览产品
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            已有 <span className="font-semibold text-blue-600">10,000+</span> 家企业选择我们的询价服务
          </p>
        </div>
      </div>
    </section>
  );
}
