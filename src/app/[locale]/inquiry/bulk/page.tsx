import { BulkInquiry } from '@/components/inquiry/BulkInquiry'

export default function BulkInquiryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">批量询价</h1>
        <p className="text-lg text-gray-600">
          一次询价多个产品，专业团队为您提供最优方案和价格
        </p>
      </div>

      {/* 批量询价表单 */}
      <BulkInquiry 
        onSubmit={(data) => {
          console.log('批量询价单提交:', data)
          // 这里会处理批量询价单提交逻辑
        }}
      />
    </div>
  )
}