'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ShoppingCart,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import type { Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

// BOM项目类型定义
interface BOMItem {
  _id: string
  product: {
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
    image?: { asset: any }
    category?: { name: Record<Locale, string> }
    brand?: { name: string }
    specifications?: Record<string, string>
  }
  quantity: number
  unitPrice: number
  currency: string
  supplier?: string
  leadTime?: number
  minimumOrderQuantity: number
  category: 'mcu' | 'power' | 'sensor' | 'communication' | 'display' | 'memory' | 'passive' | 'connector' | 'mechanical' | 'others'
  notes?: string
  isOptional: boolean
  alternatives?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
  }>
}

// BOM表格属性
interface BOMTableProps {
  items: BOMItem[]
  locale: Locale
  editable?: boolean
  showPricing?: boolean
  showAlternatives?: boolean
  onItemUpdate?: (itemId: string, updates: Partial<BOMItem>) => void
  onItemAdd?: (item: Omit<BOMItem, '_id'>) => void
  onItemRemove?: (itemId: string) => void
  onQuantityChange?: (itemId: string, quantity: number) => void
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void
  onImport?: (file: File) => void
  className?: string
}

export function BOMTable({
  items,
  locale,
  editable = false,
  showPricing = true,
  showAlternatives = true,
  onItemUpdate,
  onItemAdd,
  onItemRemove,
  onQuantityChange,
  onExport,
  onImport,
  className
}: BOMTableProps) {
  const t = useTranslations('bom')
  const { currency, fileSize } = useFormatters()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showOptional, setShowOptional] = useState(true)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // 分类映射
  const categoryMap = {
    mcu: { label: t('categories.mcu'), color: 'bg-blue-100 text-blue-800', icon: '🧠' },
    power: { label: t('categories.power'), color: 'bg-green-100 text-green-800', icon: '⚡' },
    sensor: { label: t('categories.sensor'), color: 'bg-purple-100 text-purple-800', icon: '📡' },
    communication: { label: t('categories.communication'), color: 'bg-orange-100 text-orange-800', icon: '📶' },
    display: { label: t('categories.display'), color: 'bg-cyan-100 text-cyan-800', icon: '🖥️' },
    memory: { label: t('categories.memory'), color: 'bg-pink-100 text-pink-800', icon: '💾' },
    passive: { label: t('categories.passive'), color: 'bg-yellow-100 text-yellow-800', icon: '🔌' },
    connector: { label: t('categories.connector'), color: 'bg-indigo-100 text-indigo-800', icon: '🔗' },
    mechanical: { label: t('categories.mechanical'), color: 'bg-gray-100 text-gray-800', icon: '⚙️' },
    others: { label: t('categories.others'), color: 'bg-slate-100 text-slate-800', icon: '📦' }
  }

  // 过滤项目
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const productName = getLocalizedValue(item.product.name, locale).toLowerCase()
      const supplier = item.supplier?.toLowerCase() || ''
      const notes = item.notes?.toLowerCase() || ''
      const search = searchTerm.toLowerCase()
      
      const matchesSearch = !searchTerm || 
        productName.includes(search) || 
        supplier.includes(search) || 
        notes.includes(search)
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesOptional = showOptional || !item.isOptional
      
      return matchesSearch && matchesCategory && matchesOptional
    })
  }, [items, searchTerm, selectedCategory, showOptional, locale])

  // 计算总计
  const totals = useMemo(() => {
    const selectedTotal = filteredItems
      .filter(item => selectedItems.has(item._id))
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    
    const grandTotal = filteredItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const requiredTotal = filteredItems
      .filter(item => !item.isOptional)
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const optionalTotal = filteredItems
      .filter(item => item.isOptional)
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    
    return {
      selected: selectedTotal,
      grand: grandTotal,
      required: requiredTotal,
      optional: optionalTotal
    }
  }, [filteredItems, selectedItems])

  // 供应商统计
  const suppliers = useMemo(() => {
    const supplierMap = new Map<string, number>()
    filteredItems.forEach(item => {
      if (item.supplier) {
        supplierMap.set(item.supplier, (supplierMap.get(item.supplier) || 0) + 1)
      }
    })
    return Array.from(supplierMap.entries()).sort((a, b) => b[1] - a[1])
  }, [filteredItems])

  // 处理选择
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map(item => item._id)))
    } else {
      setSelectedItems(new Set())
    }
  }, [filteredItems])

  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }, [selectedItems])

  // 处理数量变化
  const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
    if (quantity > 0) {
      onQuantityChange?.(itemId, quantity)
      if (onItemUpdate) {
        const item = items.find(i => i._id === itemId)
        if (item) {
          onItemUpdate(itemId, { quantity })
        }
      }
    }
  }, [items, onQuantityChange, onItemUpdate])

  // 获取交货期状态
  const getLeadTimeStatus = (leadTime?: number) => {
    if (!leadTime) return { color: 'bg-gray-100 text-gray-800', icon: Clock }
    if (leadTime <= 7) return { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    if (leadTime <= 30) return { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    return { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('bomTable')}
              </CardTitle>
              <CardDescription>
                {t('itemsCount', { count: filteredItems.length, total: items.length })}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {editable && (
                <Button onClick={() => onItemAdd?.({} as any)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addItem')}
                </Button>
              )}
              
              <Button variant="outline" onClick={() => onExport?.('excel')}>
                <Download className="w-4 h-4 mr-2" />
                {t('export')}
              </Button>
              
              {editable && (
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('import')}
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onImport?.(file)
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              )}
            </div>
          </div>

          {/* 搜索和过滤器 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('searchItems')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {Object.entries(categoryMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.icon} {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showOptional"
                checked={showOptional}
                onCheckedChange={setShowOptional}
              />
              <Label htmlFor="showOptional" className="text-sm">
                {t('showOptional')}
              </Label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t('totalItems')}</p>
                    <p className="text-lg font-bold">{filteredItems.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{t('totalCost')}</p>
                    <p className="text-lg font-bold">{currency(totals.grand)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{t('requiredCost')}</p>
                    <p className="text-lg font-bold">{currency(totals.required)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">{t('optionalCost')}</p>
                    <p className="text-lg font-bold">{currency(totals.optional)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BOM表格 */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t('image')}</TableHead>
                  <TableHead>{t('product')}</TableHead>
                  <TableHead>{t('category')}</TableHead>
                  <TableHead className="text-center">{t('quantity')}</TableHead>
                  {showPricing && (
                    <>
                      <TableHead className="text-right">{t('unitPrice')}</TableHead>
                      <TableHead className="text-right">{t('totalPrice')}</TableHead>
                    </>
                  )}
                  <TableHead>{t('supplier')}</TableHead>
                  <TableHead className="text-center">{t('leadTime')}</TableHead>
                  <TableHead className="text-center">{t('moq')}</TableHead>
                  {showAlternatives && <TableHead>{t('alternatives')}</TableHead>}
                  <TableHead>{t('notes')}</TableHead>
                  {editable && <TableHead className="text-center">{t('actions')}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const categoryInfo = categoryMap[item.category]
                  const leadTimeStatus = getLeadTimeStatus(item.leadTime)
                  const LeadTimeIcon = leadTimeStatus.icon
                  
                  return (
                    <TableRow key={item._id} className={cn(
                      item.isOptional && "bg-muted/30",
                      selectedItems.has(item._id) && "bg-primary/5"
                    )}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item._id)}
                          onCheckedChange={(checked) => handleSelectItem(item._id, !!checked)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        {item.product.image?.asset ? (
                          <Image
                            src={item.product.image.asset.url}
                            alt={getLocalizedValue(item.product.name, locale)}
                            width={40}
                            height={40}
                            className="rounded border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded border flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <Link
                            href={`/products/${item.product.slug.current}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {getLocalizedValue(item.product.name, locale)}
                          </Link>
                          {item.product.brand && (
                            <p className="text-xs text-muted-foreground">
                              {item.product.brand.name}
                            </p>
                          )}
                          {item.isOptional && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {t('optional')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={cn("text-xs", categoryInfo.color)}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {editable ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                              className="w-16 h-6 text-center text-xs"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium">{item.quantity}</span>
                        )}
                      </TableCell>
                      
                      {showPricing && (
                        <>
                          <TableCell className="text-right">
                            {currency(item.unitPrice)} {item.currency}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currency(item.quantity * item.unitPrice)} {item.currency}
                          </TableCell>
                        </>
                      )}
                      
                      <TableCell>
                        {item.supplier || (
                          <span className="text-muted-foreground text-sm">{t('noSupplier')}</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {item.leadTime ? (
                          <Badge className={cn("text-xs", leadTimeStatus.color)}>
                            <LeadTimeIcon className="w-3 h-3 mr-1" />
                            {item.leadTime}d
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {item.minimumOrderQuantity > 1 ? (
                          <span className="text-xs">{item.minimumOrderQuantity}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">1</span>
                        )}
                      </TableCell>
                      
                      {showAlternatives && (
                        <TableCell>
                          {item.alternatives && item.alternatives.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.alternatives.slice(0, 2).map((alt) => (
                                <Badge key={alt._id} variant="outline" className="text-xs">
                                  {getLocalizedValue(alt.name, locale)}
                                </Badge>
                              ))}
                              {item.alternatives.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.alternatives.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      )}
                      
                      <TableCell>
                        {item.notes ? (
                          <div className="max-w-32">
                            <p className="text-xs line-clamp-2" title={item.notes}>
                              {item.notes}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      
                      {editable && (
                        <TableCell className="text-center">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item._id)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onItemRemove?.(item._id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* 选中项目摘要 */}
          {selectedItems.size > 0 && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t('selectedItems', { count: selectedItems.size })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('selectedTotal')}: <span className="font-medium">{currency(totals.selected)}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    {t('bulkQuote')}
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('addToCart')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 供应商统计 */}
          {suppliers.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">{t('supplierBreakdown')}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suppliers.slice(0, 8).map(([supplier, count]) => (
                  <div key={supplier} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium truncate" title={supplier}>
                      {supplier}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {count} {t('items')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}