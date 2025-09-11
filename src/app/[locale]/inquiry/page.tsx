'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Upload, 
  FileSpreadsheet, 
  MessageCircle, 
  CheckCircle2, 
  Building
} from 'lucide-react'

interface QuickInquiryForm {
  productName: string
  quantity: string
  targetPrice: string
  urgent: boolean
  contactName: string
  company: string
  email: string
  phone: string
  message: string
}

export default function InquiryPage() {
  const [activeTab, setActiveTab] = useState('quick')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()

  // 快速询价表单状态
  const [quickForm, setQuickForm] = useState<QuickInquiryForm>({
    productName: '',
    quantity: '',
    targetPrice: '',
    urgent: false,
    contactName: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  })

  // 快速询价提交
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟API调用
      setSubmitSuccess(true)
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            询价提交成功！
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            我们已经收到您的询价需求，专业团队将在24小时内与您联系。
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/')}>
              返回首页
            </Button>
            <Button variant="outline" onClick={() => setSubmitSuccess(false)}>
              继续询价
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          专业询价服务
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          选择适合您的询价方式，我们的专业团队将为您提供最具竞争力的报价和技术支持。
        </p>
      </div>

      {/* 询价方式选择 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            快速询价
          </TabsTrigger>
          <TabsTrigger value="bom" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            BOM批量询价
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            详细询价
          </TabsTrigger>
        </TabsList>

        {/* 快速询价 */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                快速询价
              </CardTitle>
              <p className="text-gray-600">
                适用于单一产品的快速价格咨询，1分钟即可完成提交。
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuickSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 产品信息 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">产品信息</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        产品型号 *
                      </label>
                      <input
                        type="text"
                        required
                        value={quickForm.productName}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, productName: e.target.value }))}
                        placeholder="例如: STM32F401RET6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        需求数量 *
                      </label>
                      <input
                        type="text"
                        required
                        value={quickForm.quantity}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="例如: 1000pcs"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        目标价格 (可选)
                      </label>
                      <input
                        type="text"
                        value={quickForm.targetPrice}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, targetPrice: e.target.value }))}
                        placeholder="例如: ¥15.00/pcs"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="urgent"
                        checked={quickForm.urgent}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, urgent: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                        紧急询价 (24小时内回复)
                      </label>
                    </div>
                  </div>

                  {/* 联系信息 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">联系信息</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系人 *
                      </label>
                      <input
                        type="text"
                        required
                        value={quickForm.contactName}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, contactName: e.target.value }))}
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
                        value={quickForm.company}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱地址 *
                      </label>
                      <input
                        type="email"
                        required
                        value={quickForm.email}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, email: e.target.value }))}
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
                        value={quickForm.phone}
                        onChange={(e) => setQuickForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 备注信息 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    补充说明 (可选)
                  </label>
                  <textarea
                    rows={4}
                    value={quickForm.message}
                    onChange={(e) => setQuickForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="请描述您的具体需求、技术要求、交期要求等..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 提交按钮 */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        提交询价
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push('/')}>
                    返回首页
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOM批量询价 */}
        <TabsContent value="bom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                BOM批量询价
              </CardTitle>
              <p className="text-gray-600">
                上传Excel/CSV格式的BOM清单，系统自动解析并生成批量询价单。
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 文件上传区域 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  上传BOM文件
                </h3>
                <p className="text-gray-600 mb-4">
                  支持.xlsx, .xls, .csv格式，文件大小不超过10MB
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  选择文件
                </Button>
              </div>

              {/* BOM模板下载 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">BOM模板下载</h4>
                    <p className="text-sm text-blue-700">
                      下载标准BOM模板，按照格式填写后上传
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    下载模板
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 详细询价 */}
        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                详细询价
              </CardTitle>
              <p className="text-gray-600">
                完整的项目信息和技术要求，获得最精准的报价和专业技术支持。
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 公司信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    公司信息
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系人 *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
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
                </div>

                {/* 项目信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">项目信息</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        项目名称 *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        预计数量
                      </label>
                      <input
                        type="text"
                        placeholder="例如: 10K/年"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    项目描述
                  </label>
                  <textarea
                    rows={4}
                    placeholder="请详细描述您的项目需求、技术要求、质量标准等..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 提交按钮 */}
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    提交详细询价
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push('/')}>
                    返回首页
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}