'use client'

import { useInquiry, CompanyInfo } from '@/contexts/InquiryContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Bookmark,
  UserPlus
} from 'lucide-react'

export function CompanyStep() {
  const { state, updateCompanyInfo } = useInquiry()
  const { currentInquiry, companyTemplates } = state
  const { companyInfo } = currentInquiry

  // 公司规模选项
  const companySizeOptions = [
    { value: 'startup', label: '创业公司 (1-10人)' },
    { value: 'small', label: '小型企业 (11-50人)' },
    { value: 'medium', label: '中型企业 (51-200人)' },
    { value: 'large', label: '大型企业 (201-1000人)' },
    { value: 'enterprise', label: '集团企业 (1000人以上)' }
  ]

  // 年采购量选项
  const annualVolumeOptions = [
    { value: 'under_10k', label: '1万元以下' },
    { value: '10k_50k', label: '1-5万元' },
    { value: '50k_100k', label: '5-10万元' },
    { value: '100k_500k', label: '10-50万元' },
    { value: '500k_1m', label: '50-100万元' },
    { value: 'over_1m', label: '100万元以上' }
  ]

  // 行业选项
  const industryOptions = [
    '电子制造',
    '汽车电子',
    '通信设备',
    '医疗设备',
    '工业自动化',
    '消费电子',
    '航空航天',
    '军工国防',
    '新能源',
    '物联网',
    '其他'
  ]

  // 使用公司模板
  const useCompanyTemplate = (template: CompanyInfo) => {
    updateCompanyInfo(template)
  }

  // 检查表单完整性
  const isFormValid = () => {
    return !!(
      companyInfo.companyName &&
      companyInfo.contactPerson &&
      companyInfo.email &&
      companyInfo.phone
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">公司联系信息</h3>
        </div>
        <p className="text-sm text-blue-700">
          请填写准确的公司信息，以便我们为您提供专业的报价服务
        </p>
      </div>

      {/* 公司模板快捷选择 */}
      {companyTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              快速填写
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companyTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => useCompanyTemplate(template)}
                  className="h-auto p-3 justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{template.companyName}</div>
                    <div className="text-xs text-gray-500">{template.contactPerson}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name" className="flex items-center gap-1">
                公司名称
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company-name"
                value={companyInfo.companyName || ''}
                onChange={(e) => updateCompanyInfo({ companyName: e.target.value })}
                placeholder="请输入完整的公司名称"
              />
            </div>
            
            <div>
              <Label htmlFor="website">公司网站</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  type="url"
                  className="pl-10"
                  value={companyInfo.website || ''}
                  onChange={(e) => updateCompanyInfo({ website: e.target.value })}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="company-address">公司地址</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="company-address"
                className="pl-10"
                value={companyInfo.address || ''}
                onChange={(e) => updateCompanyInfo({ address: e.target.value })}
                placeholder="请输入详细的公司地址"
                rows={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">所属行业</Label>
              <Select 
                value={companyInfo.industry} 
                onValueChange={(value) => updateCompanyInfo({ industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择行业" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="company-size">公司规模</Label>
              <Select 
                value={companyInfo.companySize} 
                onValueChange={(value: any) => updateCompanyInfo({ companySize: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择公司规模" />
                </SelectTrigger>
                <SelectContent>
                  {companySizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="annual-volume">年采购金额预期</Label>
            <Select 
              value={companyInfo.annualVolume} 
              onValueChange={(value) => updateCompanyInfo({ annualVolume: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择年采购金额范围" />
              </SelectTrigger>
              <SelectContent>
                {annualVolumeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 联系人信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            联系人信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-person" className="flex items-center gap-1">
                联系人姓名
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="contact-person"
                  className="pl-10"
                  value={companyInfo.contactPerson || ''}
                  onChange={(e) => updateCompanyInfo({ contactPerson: e.target.value })}
                  placeholder="请输入联系人姓名"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="position">职位</Label>
              <Input
                id="position"
                value={companyInfo.position || ''}
                onChange={(e) => updateCompanyInfo({ position: e.target.value })}
                placeholder="如：采购经理、技术总监等"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1">
                邮箱地址
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={companyInfo.email || ''}
                  onChange={(e) => updateCompanyInfo({ email: e.target.value })}
                  placeholder="example@company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1">
                联系电话
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={companyInfo.phone || ''}
                  onChange={(e) => updateCompanyInfo({ phone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 表单验证状态 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {isFormValid() ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">必填信息已完整</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-700">请完善必填信息</span>
            </>
          )}
        </div>
        <Badge variant={isFormValid() ? "default" : "secondary"}>
          {isFormValid() ? "已完成" : "进行中"}
        </Badge>
      </div>

      {/* 隐私说明 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>🔒 我们承诺严格保护您的企业信息和隐私数据，仅用于本次询价服务，不会泄露给第三方。</p>
      </div>
    </div>
  )
}