'use client'

import { useState } from 'react'
import { useInquiry, InquiryProduct } from '@/contexts/InquiryContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Search, 
  Package,
  AlertCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react'

export function ProductsStep() {
  const { state, addProduct, removeProduct, updateProduct, importBOM } = useInquiry()
  const { currentInquiry, favoriteProducts, isLoading } = state
  const { products } = currentInquiry

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [bomFile, setBomFile] = useState<File | null>(null)
  const [bomParseResult, setBomParseResult] = useState<any>(null)

  // 新产品表单状态
  const [newProduct, setNewProduct] = useState<Partial<InquiryProduct>>({
    name: '',
    model: '',
    brand: '',
    manufacturer: '',
    category: '电子元器件',
    quantity: 1,
    urgency: 'standard',
    description: ''
  })

  // 处理添加产品
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.model) {
      alert('请填写产品名称和型号')
      return
    }

    const product: InquiryProduct = {
      id: `product_${Date.now()}`,
      productId: newProduct.model || '',
      name: newProduct.name || '',
      model: newProduct.model || '',
      brand: newProduct.brand || '待确认',
      manufacturer: newProduct.manufacturer || newProduct.brand || '待确认',
      category: newProduct.category || '电子元器件',
      quantity: newProduct.quantity || 1,
      urgency: (newProduct.urgency as any) || 'standard',
      description: newProduct.description,
      specifications: {}
    }

    addProduct(product)
    
    // 重置表单
    setNewProduct({
      name: '',
      model: '',
      brand: '',
      manufacturer: '',
      category: '电子元器件',
      quantity: 1,
      urgency: 'standard',
      description: ''
    })
    setShowAddForm(false)
  }

  // 处理BOM文件上传
  const handleBOMUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setBomFile(file)
    
    try {
      const result = await importBOM(file)
      setBomParseResult(result)
      
      if (result.success) {
        alert(`成功导入 ${result.products.length} 个产品`)
      } else {
        alert(`导入失败: ${result.errors.map(e => e.message).join(', ')}`)
      }
    } catch (error) {
      alert('BOM文件解析失败')
    } finally {
      // 清空文件输入
      event.target.value = ''
    }
  }

  // 紧急程度选项
  const urgencyOptions = [
    { value: 'standard', label: '标准', color: 'bg-gray-100 text-gray-800' },
    { value: 'urgent', label: '紧急', color: 'bg-orange-100 text-orange-800' },
    { value: 'very_urgent', label: '非常紧急', color: 'bg-red-100 text-red-800' }
  ]

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">添加询价产品</h3>
        </div>
        <p className="text-sm text-blue-700">
          请添加需要询价的产品信息，支持单个添加或批量导入BOM表
        </p>
      </div>

      {/* 操作按钮区 */}
      <div className="flex gap-3">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex-1 sm:flex-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加产品
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleBOMUpload}
            className="hidden"
            id="bom-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('bom-upload')?.click()}
            disabled={isLoading}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {isLoading ? '解析中...' : '导入BOM'}
          </Button>
        </div>

        {favoriteProducts.length > 0 && (
          <Button variant="outline" className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            常用产品
          </Button>
        )}
      </div>

      {/* BOM导入结果提示 */}
      {bomParseResult && (
        <Alert className={`${bomParseResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="font-medium">
              {bomParseResult.success ? '导入成功' : '导入失败'}
            </p>
            <div className="text-sm mt-1">
              <p>成功: {bomParseResult.products.length} 个产品</p>
              {bomParseResult.errors.length > 0 && (
                <p>错误: {bomParseResult.errors.length} 个</p>
              )}
              {bomParseResult.warnings.length > 0 && (
                <p>警告: {bomParseResult.warnings.length} 个</p>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* 添加产品表单 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">添加新产品</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-name">产品名称 *</Label>
                <Input
                  id="product-name"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="例：STM32F103C8T6"
                />
              </div>
              
              <div>
                <Label htmlFor="product-model">产品型号 *</Label>
                <Input
                  id="product-model"
                  value={newProduct.model || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                  placeholder="例：STM32F103C8T6"
                />
              </div>
              
              <div>
                <Label htmlFor="product-brand">品牌</Label>
                <Input
                  id="product-brand"
                  value={newProduct.brand || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  placeholder="例：STMicroelectronics"
                />
              </div>
              
              <div>
                <Label htmlFor="product-manufacturer">制造商</Label>
                <Input
                  id="product-manufacturer"
                  value={newProduct.manufacturer || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                  placeholder="例：STMicroelectronics"
                />
              </div>
              
              <div>
                <Label htmlFor="product-quantity">数量</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  min="1"
                  value={newProduct.quantity || 1}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              
              <div>
                <Label htmlFor="product-urgency">紧急程度</Label>
                <Select 
                  value={newProduct.urgency} 
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="product-description">产品描述</Label>
              <Textarea
                id="product-description"
                value={newProduct.description || ''}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="产品用途、规格要求等详细信息"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                添加产品
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 产品列表 */}
      {products.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">询价产品列表</h3>
            <Badge variant="secondary">{products.length} 个产品</Badge>
          </div>
          
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <Badge 
                        className={urgencyOptions.find(u => u.value === product.urgency)?.color}
                      >
                        {urgencyOptions.find(u => u.value === product.urgency)?.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">型号:</span> {product.model}</p>
                      <p><span className="font-medium">品牌:</span> {product.brand}</p>
                      <p><span className="font-medium">数量:</span> {product.quantity}</p>
                      {product.description && (
                        <p><span className="font-medium">描述:</span> {product.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(product.id)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无询价产品</h3>
            <p className="text-gray-600 mb-4">请添加需要询价的产品信息</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              添加第一个产品
            </Button>
          </CardContent>
        </Card>
      )}

      {/* BOM模板下载提示 */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          不知道如何准备BOM文件？
        </p>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          下载BOM模板
        </Button>
      </div>
    </div>
  )
}