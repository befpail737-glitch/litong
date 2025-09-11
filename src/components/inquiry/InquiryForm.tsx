'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus, Send, User, Mail, Phone, Building, MapPin } from 'lucide-react'

interface InquiryProduct {
  id: string
  partNumber: string
  title: string
  brand: string
  quantity: number
  targetPrice?: number
  urgency: 'normal' | 'urgent' | 'asap'
  notes?: string
}

interface InquiryFormProps {
  initialProducts?: InquiryProduct[]
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export function InquiryForm({ initialProducts = [], onSubmit, onCancel }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    // 联系信息
    contactName: '',
    company: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    
    // 询价信息
    inquiryType: 'quote', // quote, sample, bulk
    projectName: '',
    estimatedVolume: '',
    targetDate: '',
    budgetRange: '',
    
    // 其他要求
    requiresCertification: false,
    requiresCustomPackaging: false,
    requiresTechnicalSupport: false,
    additionalRequirements: '',
    
    // 产品列表
    products: initialProducts.length > 0 ? initialProducts : [{
      id: '1',
      partNumber: '',
      title: '',
      brand: '',
      quantity: 1,
      targetPrice: undefined,
      urgency: 'normal' as const,
      notes: ''
    }]
  })

  const addProduct = () => {
    const newProduct: InquiryProduct = {
      id: Date.now().toString(),
      partNumber: '',
      title: '',
      brand: '',
      quantity: 1,
      urgency: 'normal',
      notes: ''
    }
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }))
  }

  const removeProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }))
  }

  const updateProduct = (id: string, field: keyof InquiryProduct, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            产品询价单
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 联系信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                联系信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系人 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    公司名称 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="请输入公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱地址 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    职位
                  </label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="请输入职位"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入公司地址"
                  />
                </div>
              </div>
            </div>

            {/* 询价信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">询价信息</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    询价类型
                  </label>
                  <Select 
                    value={formData.inquiryType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">正式报价</SelectItem>
                      <SelectItem value="sample">样品申请</SelectItem>
                      <SelectItem value="bulk">批量采购</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    项目名称
                  </label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="请输入项目名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预计用量
                  </label>
                  <Input
                    value={formData.estimatedVolume}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedVolume: e.target.value }))}
                    placeholder="例如：1000pcs/月"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    目标交期
                  </label>
                  <Input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* 产品列表 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">产品清单</h3>
                <Button type="button" onClick={addProduct} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  添加产品
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.products.map((product, index) => (
                  <Card key={product.id} className="relative">
                    <CardContent className="pt-6">
                      {formData.products.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            产品型号 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            value={product.partNumber}
                            onChange={(e) => updateProduct(product.id, 'partNumber', e.target.value)}
                            placeholder="例如：STM32F401RET6"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            数量 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            min="1"
                            required
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            紧急程度
                          </label>
                          <Select 
                            value={product.urgency} 
                            onValueChange={(value) => updateProduct(product.id, 'urgency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">正常</SelectItem>
                              <SelectItem value="urgent">紧急</SelectItem>
                              <SelectItem value="asap">加急</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            备注
                          </label>
                          <Textarea
                            value={product.notes}
                            onChange={(e) => updateProduct(product.id, 'notes', e.target.value)}
                            placeholder="特殊要求或备注信息..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 其他要求 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">其他要求</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="certification"
                    checked={formData.requiresCertification}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      requiresCertification: checked as boolean 
                    }))}
                  />
                  <label htmlFor="certification" className="text-sm font-medium">
                    需要产品认证文件
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="packaging"
                    checked={formData.requiresCustomPackaging}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      requiresCustomPackaging: checked as boolean 
                    }))}
                  />
                  <label htmlFor="packaging" className="text-sm font-medium">
                    需要定制包装
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="support"
                    checked={formData.requiresTechnicalSupport}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      requiresTechnicalSupport: checked as boolean 
                    }))}
                  />
                  <label htmlFor="support" className="text-sm font-medium">
                    需要技术支持
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    补充说明
                  </label>
                  <Textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                    placeholder="请详细说明您的特殊要求..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-6 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  取消
                </Button>
              )}
              <Button type="submit" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                提交询价单
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}