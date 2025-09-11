'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus, Send, ShoppingCart, User, Mail, Phone, Building } from 'lucide-react'

interface BulkInquiryProduct {
  id: string
  partNumber: string
  title: string
  brand: string
  quantity: number
  targetPrice?: number
  urgency: 'normal' | 'urgent' | 'asap'
  notes?: string
}

interface BulkInquiryProps {
  initialProducts?: BulkInquiryProduct[]
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

// 模拟产品数据
const mockProductsData = {
  '1': {
    id: '1',
    partNumber: 'STM32F401RET6',
    title: 'STM32F401RET6 ARM Cortex-M4 微控制器',
    brand: { name: 'STMicroelectronics' },
    pricing: { tiers: [{ price: 25.50 }] }
  },
  '2': {
    id: '2', 
    partNumber: 'STM32F103C8T6',
    title: 'STM32F103C8T6 ARM Cortex-M3 微控制器',
    brand: { name: 'STMicroelectronics' },
    pricing: { tiers: [{ price: 18.80 }] }
  },
  '3': {
    id: '3',
    partNumber: 'ESP32-WROOM-32', 
    title: 'ESP32-WROOM-32 WiFi+蓝牙模块',
    brand: { name: 'Espressif' },
    pricing: { tiers: [{ price: 32.00 }] }
  }
}

export function BulkInquiry({ initialProducts = [], onSubmit, onCancel }: BulkInquiryProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    // 联系信息
    contactName: '',
    company: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    
    // 询价信息
    inquiryType: 'bulk', // bulk, quote, sample
    projectName: '',
    estimatedVolume: '',
    targetDate: '',
    budgetRange: '',
    
    // 其他要求
    requiresCertification: false,
    requiresCustomPackaging: false,
    requiresTechnicalSupport: false,
    additionalRequirements: '',
  })

  const [products, setProducts] = useState<BulkInquiryProduct[]>([])

  useEffect(() => {
    // 从URL参数或props获取产品
    const productParams = searchParams.get('products')?.split(',') || []
    const urlProducts = productParams
      .map(id => {
        const product = mockProductsData[id as keyof typeof mockProductsData]
        if (product) {
          return {
            id: product.id,
            partNumber: product.partNumber,
            title: product.title,
            brand: product.brand.name,
            quantity: 1,
            urgency: 'normal' as const,
            notes: ''
          }
        }
        return null
      })
      .filter(Boolean) as BulkInquiryProduct[]

    if (urlProducts.length > 0) {
      setProducts(urlProducts)
    } else if (initialProducts.length > 0) {
      setProducts(initialProducts)
    } else {
      // 默认添加一个空产品行
      setProducts([{
        id: Date.now().toString(),
        partNumber: '',
        title: '',
        brand: '',
        quantity: 1,
        urgency: 'normal',
        notes: ''
      }])
    }
  }, [searchParams, initialProducts])

  const addProduct = () => {
    const newProduct: BulkInquiryProduct = {
      id: Date.now().toString(),
      partNumber: '',
      title: '',
      brand: '',
      quantity: 1,
      urgency: 'normal',
      notes: ''
    }
    setProducts(prev => [...prev, newProduct])
  }

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateProduct = (id: string, field: keyof BulkInquiryProduct, value: any) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      products,
      totalItems: products.reduce((sum, p) => sum + p.quantity, 0),
      submittedAt: new Date().toISOString()
    }
    
    onSubmit?.(submissionData)
    
    // 模拟提交成功
    alert('批量询价单提交成功！我们将在24小时内回复您。')
    
    // 可以跳转到提交成功页面
    router.push('/inquiry/success')
  }

  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0)
  const estimatedTotal = products.reduce((sum, product) => {
    const productData = mockProductsData[product.id as keyof typeof mockProductsData]
    const price = productData?.pricing?.tiers[0]?.price || 0
    return sum + (price * product.quantity)
  }, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 页面标题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            批量询价单
            <Badge variant="default" className="ml-2">
              {products.length} 个产品，共 {totalQuantity} 件
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* 左侧 - 产品列表 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 产品清单 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>产品清单</CardTitle>
                  <Button type="button" onClick={addProduct} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    添加产品
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <Card key={product.id} className="relative border border-gray-200">
                      <CardContent className="pt-4">
                        {products.length > 1 && (
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
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                              #{index + 1}
                            </span>
                            产品信息
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                品牌
                              </label>
                              <Input
                                value={product.brand}
                                onChange={(e) => updateProduct(product.id, 'brand', e.target.value)}
                                placeholder="例如：STMicroelectronics"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              产品描述
                            </label>
                            <Input
                              value={product.title}
                              onChange={(e) => updateProduct(product.id, 'title', e.target.value)}
                              placeholder="产品详细描述"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                数量 <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="number"
                                min="1"
                                required
                                value={product.quantity}
                                onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                目标单价 (¥)
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                value={product.targetPrice || ''}
                                onChange={(e) => updateProduct(product.id, 'targetPrice', parseFloat(e.target.value) || undefined)}
                                placeholder="期望单价"
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
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              备注
                            </label>
                            <Textarea
                              value={product.notes || ''}
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
              </CardContent>
            </Card>

            {/* 项目信息 */}
            <Card>
              <CardHeader>
                <CardTitle>项目信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                      预计月用量
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      预算范围
                    </label>
                    <Input
                      value={formData.budgetRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                      placeholder="例如：1-5万元"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    补充说明
                  </label>
                  <Textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                    placeholder="请详细说明您的特殊要求、技术规格或其他需求..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧 - 联系信息和汇总 */}
          <div className="space-y-6">
            {/* 联系信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  联系信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* 询价汇总 */}
            <Card>
              <CardHeader>
                <CardTitle>询价汇总</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">产品种类:</span>
                    <span className="font-semibold">{products.length} 种</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">总数量:</span>
                    <span className="font-semibold">{totalQuantity} 件</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">估算金额:</span>
                    <span className="font-semibold text-blue-600">¥{estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="certification"
                        checked={formData.requiresCertification}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          requiresCertification: checked as boolean 
                        }))}
                      />
                      <label htmlFor="certification" className="text-sm">
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
                      <label htmlFor="packaging" className="text-sm">
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
                      <label htmlFor="support" className="text-sm">
                        需要技术支持
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="space-y-3">
              {onCancel && (
                <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                  取消
                </Button>
              )}
              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                提交批量询价单
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}