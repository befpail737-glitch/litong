'use client'

import { useInquiry } from '@/contexts/InquiryContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  FolderOpen, 
  Target, 
  Calendar, 
  DollarSign,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react'

export function ProjectStep() {
  const { state, updateProjectInfo } = useInquiry()
  const { currentInquiry } = state
  const { projectInfo } = currentInquiry

  // 认证要求选项
  const certificationOptions = [
    { id: 'rohs', label: 'RoHS认证', description: '限制使用某些有害物质指令' },
    { id: 'ce', label: 'CE认证', description: '欧盟强制性认证标志' },
    { id: 'fcc', label: 'FCC认证', description: '美国联邦通信委员会认证' },
    { id: 'ul', label: 'UL认证', description: '美国保险商试验所认证' },
    { id: 'iso9001', label: 'ISO 9001', description: '质量管理体系认证' },
    { id: 'iso14001', label: 'ISO 14001', description: '环境管理体系认证' },
    { id: 'iatf16949', label: 'IATF 16949', description: '汽车行业质量管理体系' },
    { id: 'mil', label: 'MIL标准', description: '军用标准认证' }
  ]

  // 时间线选项
  const timelineOptions = [
    '1周内',
    '2周内',
    '1个月内',
    '2-3个月',
    '3-6个月',
    '6个月以上',
    '持续供货'
  ]

  // 预算范围选项
  const budgetOptions = [
    '1万元以下',
    '1-5万元',
    '5-10万元',
    '10-50万元',
    '50-100万元',
    '100万元以上'
  ]

  // 应用领域选项
  const applicationOptions = [
    '消费电子',
    '汽车电子',
    '工业控制',
    '通信设备',
    '医疗设备',
    '航空航天',
    '军工国防',
    '新能源',
    '物联网',
    '人工智能',
    '其他'
  ]

  // 更新认证要求
  const updateCertifications = (certId: string, checked: boolean) => {
    const current = projectInfo.certificationRequirements || []
    const updated = checked 
      ? [...current, certId]
      : current.filter(c => c !== certId)
    updateProjectInfo({ certificationRequirements: updated })
  }

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FolderOpen className="h-5 w-5 text-orange-600" />
          <h3 className="font-medium text-orange-900">项目详细信息</h3>
        </div>
        <p className="text-sm text-orange-700">
          提供项目信息有助于我们为您匹配更合适的产品和价格方案（可选）
        </p>
      </div>

      {/* 项目基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            项目基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-name">项目名称</Label>
            <Input
              id="project-name"
              value={projectInfo.projectName || ''}
              onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
              placeholder="请输入项目名称"
            />
          </div>
          
          <div>
            <Label htmlFor="project-description">项目描述</Label>
            <Textarea
              id="project-description"
              value={projectInfo.projectDescription || ''}
              onChange={(e) => updateProjectInfo({ projectDescription: e.target.value })}
              placeholder="请简要描述项目的用途、技术要求等"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="application">应用领域</Label>
            <select
              id="application"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectInfo.application || ''}
              onChange={(e) => updateProjectInfo({ application: e.target.value })}
            >
              <option value="">请选择应用领域</option>
              {applicationOptions.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 商务信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            商务信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected-volume">预期用量</Label>
              <div className="relative">
                <Input
                  id="expected-volume"
                  type="number"
                  value={projectInfo.expectedVolume || ''}
                  onChange={(e) => updateProjectInfo({ expectedVolume: parseInt(e.target.value) || undefined })}
                  placeholder="预计总用量"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  PCS
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="target-price">目标单价</Label>
              <div className="relative">
                <Input
                  id="target-price"
                  type="number"
                  step="0.01"
                  value={projectInfo.targetPrice || ''}
                  onChange={(e) => updateProjectInfo({ targetPrice: parseFloat(e.target.value) || undefined })}
                  placeholder="目标采购单价"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  元
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline">交付时间要求</Label>
              <select
                id="timeline"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectInfo.timeline || ''}
                onChange={(e) => updateProjectInfo({ timeline: e.target.value })}
              >
                <option value="">请选择时间要求</option>
                {timelineOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="budget">项目预算范围</Label>
              <select
                id="budget"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectInfo.budget || ''}
                onChange={(e) => updateProjectInfo({ budget: e.target.value })}
              >
                <option value="">请选择预算范围</option>
                {budgetOptions.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 认证要求 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            认证要求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificationOptions.map(cert => (
              <div key={cert.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={cert.id}
                  checked={(projectInfo.certificationRequirements || []).includes(cert.id)}
                  onCheckedChange={(checked) => updateCertifications(cert.id, !!checked)}
                />
                <div className="flex-1">
                  <Label htmlFor={cert.id} className="font-medium cursor-pointer">
                    {cert.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {(projectInfo.certificationRequirements?.length || 0) > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">已选择的认证要求：</p>
              <div className="flex flex-wrap gap-2">
                {(projectInfo.certificationRequirements || []).map(certId => {
                  const cert = certificationOptions.find(c => c.id === certId)
                  return cert ? (
                    <Badge key={certId} variant="secondary" className="bg-blue-100 text-blue-800">
                      {cert.label}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 其他要求 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            其他要求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="additional-requirements">补充说明</Label>
            <Textarea
              id="additional-requirements"
              value={projectInfo.additionalRequirements || ''}
              onChange={(e) => updateProjectInfo({ additionalRequirements: e.target.value })}
              placeholder="如有其他特殊要求或说明，请在此填写..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">提供项目信息的好处</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 获得更精准的产品推荐和替代方案</li>
              <li>• 享受批量采购的优惠价格</li>
              <li>• 获得专业的技术支持和解决方案</li>
              <li>• 建立长期合作关系，享受优先服务</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}