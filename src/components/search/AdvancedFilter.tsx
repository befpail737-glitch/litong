'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { X, Filter, RotateCcw } from 'lucide-react'

interface FilterState {
  // 价格筛选
  priceRange: [number, number]
  currency: string
  
  // 分类筛选
  categories: string[]
  subcategories: string[]
  
  // 品牌筛选
  brands: string[]
  
  // 库存状态
  stockStatus: string[]
  
  // 产品状态
  isNew: boolean
  isFeatured: boolean
  isOnSale: boolean
  
  // 规格筛选
  packageTypes: string[]
  operatingVoltage: string
  operatingTemp: string
  
  // 认证标准
  certifications: string[]
}

interface AdvancedFilterProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
  onReset: () => void
  initialFilters?: Partial<FilterState>
}

const defaultFilters: FilterState = {
  priceRange: [0, 1000],
  currency: 'CNY',
  categories: [],
  subcategories: [],
  brands: [],
  stockStatus: [],
  isNew: false,
  isFeatured: false,
  isOnSale: false,
  packageTypes: [],
  operatingVoltage: '',
  operatingTemp: '',
  certifications: [],
}

// 筛选选项数据
const filterOptions = {
  categories: [
    { value: 'microcontrollers', label: '微控制器' },
    { value: 'sensors', label: '传感器' },
    { value: 'power-management', label: '电源管理' },
    { value: 'analog-ic', label: '模拟IC' },
    { value: 'digital-ic', label: '数字IC' },
    { value: 'wireless-modules', label: '无线模块' },
    { value: 'connectors', label: '连接器' },
    { value: 'passive-components', label: '无源器件' },
  ],
  brands: [
    { value: 'stmicroelectronics', label: 'STMicroelectronics' },
    { value: 'texas-instruments', label: 'Texas Instruments' },
    { value: 'infineon', label: 'Infineon' },
    { value: 'espressif', label: 'Espressif' },
    { value: 'microchip', label: 'Microchip' },
    { value: 'nordic', label: 'Nordic Semiconductor' },
    { value: 'analog-devices', label: 'Analog Devices' },
    { value: 'maxim', label: 'Maxim Integrated' },
  ],
  stockStatus: [
    { value: 'in_stock', label: '现货' },
    { value: 'low_stock', label: '库存紧张' },
    { value: 'pre_order', label: '预订' },
    { value: 'custom_order', label: '定制' },
  ],
  packageTypes: [
    { value: 'dip', label: 'DIP' },
    { value: 'sop', label: 'SOP' },
    { value: 'qfp', label: 'QFP' },
    { value: 'bga', label: 'BGA' },
    { value: 'lqfp', label: 'LQFP' },
    { value: 'tqfp', label: 'TQFP' },
    { value: 'soic', label: 'SOIC' },
    { value: 'ssop', label: 'SSOP' },
  ],
  certifications: [
    { value: 'ce', label: 'CE认证' },
    { value: 'fcc', label: 'FCC认证' },
    { value: 'rohs', label: 'RoHS认证' },
    { value: 'reach', label: 'REACH认证' },
    { value: 'ul', label: 'UL认证' },
    { value: 'ccc', label: 'CCC认证' },
  ],
}

export function AdvancedFilter({ 
  isOpen, 
  onClose, 
  onApply, 
  onReset,
  initialFilters = {} 
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    onReset()
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.stockStatus.length > 0) count++
    if (filters.packageTypes.length > 0) count++
    if (filters.certifications.length > 0) count++
    if (filters.isNew || filters.isFeatured || filters.isOnSale) count++
    if (filters.operatingVoltage || filters.operatingTemp) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++
    return count
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">高级筛选</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="default" className="ml-2">
                {getActiveFiltersCount()} 个筛选条件
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 价格范围 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">价格范围</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                    max={1000}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>¥{filters.priceRange[0]}</span>
                  <span>¥{filters.priceRange[1]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="最低价格"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  />
                  <Input
                    type="number"
                    placeholder="最高价格"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 产品分类 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">产品分类</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterOptions.categories.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={filters.categories.includes(category.value)}
                        onCheckedChange={() => toggleArrayFilter('categories', category.value)}
                      />
                      <label 
                        htmlFor={`category-${category.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 品牌 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">品牌</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterOptions.brands.map((brand) => (
                    <div key={brand.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand.value}`}
                        checked={filters.brands.includes(brand.value)}
                        onCheckedChange={() => toggleArrayFilter('brands', brand.value)}
                      />
                      <label 
                        htmlFor={`brand-${brand.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 库存状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">库存状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterOptions.stockStatus.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`stock-${status.value}`}
                        checked={filters.stockStatus.includes(status.value)}
                        onCheckedChange={() => toggleArrayFilter('stockStatus', status.value)}
                      />
                      <label 
                        htmlFor={`stock-${status.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 产品状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">产品状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-new"
                      checked={filters.isNew}
                      onCheckedChange={(checked) => updateFilter('isNew', checked)}
                    />
                    <label htmlFor="is-new" className="text-sm font-medium">新品</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-featured"
                      checked={filters.isFeatured}
                      onCheckedChange={(checked) => updateFilter('isFeatured', checked)}
                    />
                    <label htmlFor="is-featured" className="text-sm font-medium">推荐产品</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-on-sale"
                      checked={filters.isOnSale}
                      onCheckedChange={(checked) => updateFilter('isOnSale', checked)}
                    />
                    <label htmlFor="is-on-sale" className="text-sm font-medium">促销商品</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 封装类型 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">封装类型</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterOptions.packageTypes.map((packageType) => (
                    <div key={packageType.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`package-${packageType.value}`}
                        checked={filters.packageTypes.includes(packageType.value)}
                        onCheckedChange={() => toggleArrayFilter('packageTypes', packageType.value)}
                      />
                      <label 
                        htmlFor={`package-${packageType.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {packageType.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 工作参数 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">工作参数</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工作电压
                  </label>
                  <Select 
                    value={filters.operatingVoltage} 
                    onValueChange={(value) => updateFilter('operatingVoltage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择工作电压" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部</SelectItem>
                      <SelectItem value="1.8V">1.8V</SelectItem>
                      <SelectItem value="3.3V">3.3V</SelectItem>
                      <SelectItem value="5V">5V</SelectItem>
                      <SelectItem value="12V">12V</SelectItem>
                      <SelectItem value="24V">24V</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工作温度
                  </label>
                  <Select 
                    value={filters.operatingTemp} 
                    onValueChange={(value) => updateFilter('operatingTemp', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择工作温度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部</SelectItem>
                      <SelectItem value="commercial">商业级 (0°C ~ 70°C)</SelectItem>
                      <SelectItem value="industrial">工业级 (-40°C ~ 85°C)</SelectItem>
                      <SelectItem value="automotive">汽车级 (-40°C ~ 125°C)</SelectItem>
                      <SelectItem value="military">军用级 (-55°C ~ 125°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 认证标准 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">认证标准</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterOptions.certifications.map((cert) => (
                    <div key={cert.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${cert.value}`}
                        checked={filters.certifications.includes(cert.value)}
                        onCheckedChange={() => toggleArrayFilter('certifications', cert.value)}
                      />
                      <label 
                        htmlFor={`cert-${cert.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cert.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={handleReset} size="sm" className="w-full sm:w-auto">
            <RotateCcw className="h-4 w-4 mr-2" />
            重置筛选
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} size="sm" className="flex-1 sm:flex-none">
              取消
            </Button>
            <Button onClick={handleApply} size="sm" className="flex-1 sm:flex-none">
              应用筛选 {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}