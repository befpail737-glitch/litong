'use client'

import { useState } from 'react'
import { useInquiry } from '@/contexts/InquiryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Send, 
  CheckCircle2, 
  Clock,
  Shield,
  HeadphonesIcon,
  FileText,
  Mail,
  Phone
} from 'lucide-react'

export function SubmitStep() {
  const { state } = useInquiry()
  const { currentInquiry, isLoading } = state
  const { products, companyInfo, projectInfo } = currentInquiry

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    contact: true
  })

  // 生成询价单号预览
  const inquiryNumber = `INQ-${Date.now().toString().slice(-8)}`
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0)

  const allAgreementsChecked = agreements.terms && agreements.privacy

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Send className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">准备提交询价</h3>
        </div>
        <p className="text-blue-700 mb-4">
          您的询价信息已准备就绪，提交后我们将在24小时内为您提供专业报价
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border">
          <FileText className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-900">询价单号: {inquiryNumber}</span>
        </div>
      </div>

      {/* 询价概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            询价概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
              <p className="text-sm text-blue-700 font-medium">产品种类</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalProducts}</div>
              <p className="text-sm text-green-700 font-medium">总数量</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <p className="text-sm text-purple-700 font-medium">响应时间</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">公司名称:</span>
                <span className="ml-2">{companyInfo.companyName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">联系人:</span>
                <span className="ml-2">{companyInfo.contactPerson}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">邮箱:</span>
                <span className="ml-2">{companyInfo.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">电话:</span>
                <span className="ml-2">{companyInfo.phone}</span>
              </div>
              {projectInfo.projectName && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">项目:</span>
                  <span className="ml-2">{projectInfo.projectName}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 服务流程 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            接下来的服务流程
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">询价确认</h4>
                <p className="text-sm text-gray-600">收到您的询价后，我们将在1小时内确认收到并开始处理</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">专业分析</h4>
                <p className="text-sm text-gray-600">技术团队分析产品规格，为您匹配最优质的供应商资源</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">报价回复</h4>
                <p className="text-sm text-gray-600">24小时内提供详细报价单，包含价格、交期、认证等信息</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-orange-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">持续跟进</h4>
                <p className="text-sm text-gray-600">专属客户经理全程跟进，确保您的采购需求得到完美解决</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 协议确认 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            服务协议
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, terms: !!checked }))
              }
            />
            <div>
              <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                我已阅读并同意《询价服务条款》
              </label>
              <p className="text-xs text-gray-500 mt-1">
                包含报价有效期、产品规格确认、交付条款等重要信息
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={agreements.privacy}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, privacy: !!checked }))
              }
            />
            <div>
              <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                我同意《隐私政策》
              </label>
              <p className="text-xs text-gray-500 mt-1">
                我们承诺保护您的企业信息和个人隐私，不会泄露给第三方
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="contact"
              checked={agreements.contact}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, contact: !!checked }))
              }
            />
            <div>
              <label htmlFor="contact" className="text-sm font-medium cursor-pointer">
                同意接收相关的报价和技术支持信息
              </label>
              <p className="text-xs text-gray-500 mt-1">
                我们将通过邮件和电话为您提供专业的产品信息和技术支持
              </p>
            </div>
          </div>
          
          {!allAgreementsChecked && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                请确认同意服务条款和隐私政策后再提交询价
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            需要帮助？
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">客服电话</p>
                <p className="text-sm text-gray-600">400-123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">客服邮箱</p>
                <p className="text-sm text-gray-600">inquiry@litong.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>专业提示：</strong>
              如果您的产品有特殊规格要求或技术疑问，可在提交后直接联系我们的技术支持团队，
              我们将为您提供更精准的产品匹配和技术方案。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 提交按钮在父组件中渲染 */}
    </div>
  )
}