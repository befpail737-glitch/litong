'use client'

import { useInquiry } from '@/contexts/InquiryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  Package,
  Building,
  FolderOpen,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export function ReviewStep() {
  const { state, setCurrentStep } = useInquiry()
  const { currentInquiry } = state
  const { products, companyInfo, projectInfo } = currentInquiry

  // 紧急程度配置
  const urgencyConfig = {
    standard: { label: '标准', color: 'bg-gray-100 text-gray-800' },
    urgent: { label: '紧急', color: 'bg-orange-100 text-orange-800' },
    very_urgent: { label: '非常紧急', color: 'bg-red-100 text-red-800' }
  }

  // 公司规模标签
  const companySizeLabels = {
    startup: '创业公司 (1-10人)',
    small: '小型企业 (11-50人)',
    medium: '中型企业 (51-200人)',
    large: '大型企业 (201-1000人)',
    enterprise: '集团企业 (1000人以上)'
  }

  // 检查完整性
  const isProductsComplete = products.length > 0
  const isCompanyComplete = !!(companyInfo.companyName && companyInfo.contactPerson && companyInfo.email && companyInfo.phone)
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-green-900">确认询价信息</h3>
        </div>
        <p className="text-sm text-green-700">
          请仔细核对询价信息，确认无误后即可提交
        </p>
      </div>

      {/* 完整性检查 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            信息完整性检查
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">产品信息</p>
                  <p className="text-sm text-gray-600">{products.length} 个产品，共 {totalProducts} 件</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={isProductsComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {isProductsComplete ? '已完成' : '待完善'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep('products')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">公司信息</p>
                  <p className="text-sm text-gray-600">
                    {companyInfo.companyName || '待填写'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={isCompanyComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {isCompanyComplete ? '已完成' : '待完善'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep('company')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">项目信息</p>
                  <p className="text-sm text-gray-600">
                    {projectInfo.projectName || '未填写（可选）'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">可选</Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep('project')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {!isProductsComplete || !isCompanyComplete ? (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  请完善必填信息后再提交询价
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 产品信息预览 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              产品清单 ({products.length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentStep('products')}
            >
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge className={urgencyConfig[product.urgency].color}>
                        {urgencyConfig[product.urgency].label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4 gap-y-1">
                      <p><span className="font-medium">型号:</span> {product.model}</p>
                      <p><span className="font-medium">品牌:</span> {product.brand}</p>
                      <p><span className="font-medium">数量:</span> {product.quantity} 件</p>
                      <p><span className="font-medium">分类:</span> {product.category}</p>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">描述:</span> {product.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 公司信息预览 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              公司信息
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentStep('company')}
            >
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{companyInfo.companyName || '待填写'}</p>
                  <p className="text-sm text-gray-600">
                    {companyInfo.industry || '未指定行业'}
                    {companyInfo.companySize && companySizeLabels[companyInfo.companySize as keyof typeof companySizeLabels] && 
                      ` · ${companySizeLabels[companyInfo.companySize as keyof typeof companySizeLabels]}`
                    }
                  </p>
                </div>
              </div>
              
              {companyInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">{companyInfo.address}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{companyInfo.contactPerson || '待填写'}</p>
                  <p className="text-sm text-gray-600">{companyInfo.position || '未指定职位'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <p className="text-sm">{companyInfo.email || '待填写'}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-sm">{companyInfo.phone || '待填写'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目信息预览 */}
      {(projectInfo.projectName || projectInfo.projectDescription || projectInfo.expectedVolume) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                项目信息
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentStep('project')}
              >
                <Edit className="h-4 w-4 mr-1" />
                编辑
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectInfo.projectName && (
                <div>
                  <p className="font-medium text-gray-700">项目名称</p>
                  <p className="text-sm">{projectInfo.projectName}</p>
                </div>
              )}
              
              {projectInfo.projectDescription && (
                <div>
                  <p className="font-medium text-gray-700">项目描述</p>
                  <p className="text-sm">{projectInfo.projectDescription}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {projectInfo.expectedVolume && (
                  <div>
                    <p className="font-medium text-gray-700 text-sm">预期用量</p>
                    <p className="text-sm">{projectInfo.expectedVolume.toLocaleString()} PCS</p>
                  </div>
                )}
                
                {projectInfo.targetPrice && (
                  <div>
                    <p className="font-medium text-gray-700 text-sm">目标单价</p>
                    <p className="text-sm">¥{projectInfo.targetPrice}</p>
                  </div>
                )}
                
                {projectInfo.timeline && (
                  <div>
                    <p className="font-medium text-gray-700 text-sm">交付时间</p>
                    <p className="text-sm">{projectInfo.timeline}</p>
                  </div>
                )}
                
                {projectInfo.budget && (
                  <div>
                    <p className="font-medium text-gray-700 text-sm">预算范围</p>
                    <p className="text-sm">{projectInfo.budget}</p>
                  </div>
                )}
              </div>
              
              {projectInfo.certificationRequirements && projectInfo.certificationRequirements.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">认证要求</p>
                  <div className="flex flex-wrap gap-2">
                    {projectInfo.certificationRequirements.map(cert => (
                      <Badge key={cert} variant="secondary" className="bg-blue-100 text-blue-800">
                        {cert.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 服务承诺 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            服务承诺
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">24小时</div>
              <p className="text-sm text-blue-700">快速响应</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">专业</div>
              <p className="text-sm text-green-700">技术支持</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">优质</div>
              <p className="text-sm text-purple-700">供应链服务</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}