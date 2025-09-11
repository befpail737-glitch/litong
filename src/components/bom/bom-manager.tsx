'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  ShoppingCart,
  Plus,
  Copy,
  Save,
  Download,
  Upload,
  History,
  Settings,
  FileText,
  Calculator,
  TrendingUp,
  Users,
  Clock,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/hooks/use-formatters'
import { getLocalizedValue } from '@/lib/sanity-i18n'
import { BOMTable } from './bom-table'
import type { Locale } from '@/i18n'
import Link from 'next/link'

// BOM模板类型定义
interface BOMTemplate {
  _id: string
  name: Record<Locale, string>
  description: Record<Locale, string>
  version: string
  complexity: 'simple' | 'medium' | 'complex' | 'high-complex'
  totalCost: { amount: number; currency: string }
  itemCount: number
  createdAt: string
  updatedAt: string
  usageCount: number
  isActive: boolean
  items: Array<{
    _id: string
    product: {
      _id: string
      name: Record<Locale, string>
      slug: { current: string }
      image?: { asset: any }
    }
    quantity: number
    unitPrice: number
    currency: string
    category: string
    isOptional: boolean
  }>
}

// BOM版本历史
interface BOMVersion {
  _id: string
  version: string
  description: string
  createdAt: string
  createdBy: string
  changes: Array<{
    type: 'add' | 'remove' | 'update'
    item: string
    description: string
  }>
}

interface BOMManagerProps {
  templates: BOMTemplate[]
  currentBOM?: BOMTemplate
  versions?: BOMVersion[]
  locale: Locale
  onTemplateSelect?: (template: BOMTemplate) => void
  onTemplateCreate?: (template: Omit<BOMTemplate, '_id'>) => void
  onTemplateUpdate?: (templateId: string, updates: Partial<BOMTemplate>) => void
  onTemplateDelete?: (templateId: string) => void
  onVersionCreate?: (version: Omit<BOMVersion, '_id'>) => void
  onExport?: (format: 'csv' | 'excel' | 'pdf', templateId?: string) => void
  className?: string
}

export function BOMManager({
  templates,
  currentBOM,
  versions = [],
  locale,
  onTemplateSelect,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onVersionCreate,
  onExport,
  className
}: BOMManagerProps) {
  const t = useTranslations('bomManager')
  const { currency, dateShort } = useFormatters()
  
  const [selectedTemplate, setSelectedTemplate] = useState<BOMTemplate | null>(currentBOM || null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all')
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDescription, setNewTemplateDescription] = useState('')
  const [newVersionDescription, setNewVersionDescription] = useState('')

  // 复杂度映射
  const complexityMap = {
    simple: { label: t('complexity.simple'), color: 'bg-green-100 text-green-800' },
    medium: { label: t('complexity.medium'), color: 'bg-blue-100 text-blue-800' },
    complex: { label: t('complexity.complex'), color: 'bg-orange-100 text-orange-800' },
    'high-complex': { label: t('complexity.highComplex'), color: 'bg-red-100 text-red-800' }
  }

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const name = getLocalizedValue(template.name, locale).toLowerCase()
    const description = getLocalizedValue(template.description, locale).toLowerCase()
    const search = searchTerm.toLowerCase()
    
    const matchesSearch = !searchTerm || name.includes(search) || description.includes(search)
    const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity
    
    return matchesSearch && matchesComplexity && template.isActive
  })

  // 创建新模板
  const handleCreateTemplate = useCallback(() => {
    if (!newTemplateName.trim()) return
    
    const newTemplate: Omit<BOMTemplate, '_id'> = {
      name: { 'zh-CN': newTemplateName, 'en': newTemplateName } as Record<Locale, string>,
      description: { 'zh-CN': newTemplateDescription, 'en': newTemplateDescription } as Record<Locale, string>,
      version: '1.0',
      complexity: 'medium',
      totalCost: { amount: 0, currency: 'CNY' },
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      isActive: true,
      items: []
    }
    
    onTemplateCreate?.(newTemplate)
    setNewTemplateName('')
    setNewTemplateDescription('')
    setIsCreateDialogOpen(false)
  }, [newTemplateName, newTemplateDescription, onTemplateCreate])

  // 复制模板
  const handleCopyTemplate = useCallback((template: BOMTemplate) => {
    const copiedTemplate: Omit<BOMTemplate, '_id'> = {
      ...template,
      name: { 
        ...template.name,
        'zh-CN': getLocalizedValue(template.name, locale) + ' (副本)',
        'en': getLocalizedValue(template.name, locale) + ' (Copy)'
      },
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }
    
    onTemplateCreate?.(copiedTemplate)
  }, [locale, onTemplateCreate])

  // 创建版本
  const handleCreateVersion = useCallback(() => {
    if (!selectedTemplate || !newVersionDescription.trim()) return
    
    const newVersion: Omit<BOMVersion, '_id'> = {
      version: `${parseFloat(selectedTemplate.version) + 0.1}`,
      description: newVersionDescription,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User', // 实际应用中从用户上下文获取
      changes: []
    }
    
    onVersionCreate?.(newVersion)
    setNewVersionDescription('')
    setIsVersionDialogOpen(false)
  }, [selectedTemplate, newVersionDescription, onVersionCreate])

  // 统计信息
  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.isActive).length,
    totalCost: templates.reduce((sum, t) => sum + t.totalCost.amount, 0),
    totalItems: templates.reduce((sum, t) => sum + t.itemCount, 0)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模板列表 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('bomTemplates')}
                </CardTitle>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('create')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('createNewTemplate')}</DialogTitle>
                      <DialogDescription>
                        {t('createTemplateDescription')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="templateName">{t('templateName')}</Label>
                        <Input
                          id="templateName"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          placeholder={t('enterTemplateName')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="templateDescription">{t('description')}</Label>
                        <Textarea
                          id="templateDescription"
                          value={newTemplateDescription}
                          onChange={(e) => setNewTemplateDescription(e.target.value)}
                          placeholder={t('enterDescription')}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          {t('cancel')}
                        </Button>
                        <Button onClick={handleCreateTemplate}>
                          {t('create')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 搜索和过滤 */}
              <div className="space-y-3">
                <Input
                  placeholder={t('searchTemplates')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectComplexity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allComplexity')}</SelectItem>
                    {Object.entries(complexityMap).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredTemplates.map((template) => {
                const complexityInfo = complexityMap[template.complexity]
                const isSelected = selectedTemplate?._id === template._id
                
                return (
                  <Card 
                    key={template._id} 
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      isSelected && "ring-2 ring-primary"
                    )}
                    onClick={() => {
                      setSelectedTemplate(template)
                      onTemplateSelect?.(template)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium line-clamp-1">
                          {getLocalizedValue(template.name, locale)}
                        </h4>
                        <Badge className={cn("text-xs", complexityInfo.color)}>
                          {complexityInfo.label}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {getLocalizedValue(template.description, locale)}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <p>{t('version')} {template.version}</p>
                          <p>{template.itemCount} {t('items')}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">
                            {currency(template.totalCost.amount)}
                          </p>
                          <p>{template.usageCount} {t('uses')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyTemplate(template)
                          }}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {t('copy')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onExport?.('excel', template._id)
                          }}
                          className="h-6 px-2"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {t('export')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{t('noTemplatesFound')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 统计信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('totalTemplates')}</span>
                <span className="font-medium">{stats.totalTemplates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('activeTemplates')}</span>
                <span className="font-medium">{stats.activeTemplates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('totalValue')}</span>
                <span className="font-medium">{currency(stats.totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('totalItems')}</span>
                <span className="font-medium">{stats.totalItems}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Tabs defaultValue="items">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="items">{t('items')}</TabsTrigger>
                  <TabsTrigger value="analysis">{t('analysis')}</TabsTrigger>
                  <TabsTrigger value="history">{t('history')}</TabsTrigger>
                  <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <History className="w-4 h-4 mr-2" />
                        {t('newVersion')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('createNewVersion')}</DialogTitle>
                        <DialogDescription>
                          {t('createVersionDescription')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="versionDescription">{t('versionDescription')}</Label>
                          <Textarea
                            id="versionDescription"
                            value={newVersionDescription}
                            onChange={(e) => setNewVersionDescription(e.target.value)}
                            placeholder={t('enterVersionDescription')}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsVersionDialogOpen(false)}
                          >
                            {t('cancel')}
                          </Button>
                          <Button onClick={handleCreateVersion}>
                            {t('create')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {t('save')}
                  </Button>
                </div>
              </div>

              {/* BOM项目 */}
              <TabsContent value="items">
                <BOMTable
                  items={selectedTemplate.items}
                  locale={locale}
                  editable={true}
                  showPricing={true}
                  showAlternatives={true}
                  onExport={onExport}
                />
              </TabsContent>

              {/* 成本分析 */}
              <TabsContent value="analysis">
                <div className="space-y-6">
                  {/* 成本概览 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        {t('costAnalysis')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary">
                            {currency(selectedTemplate.totalCost.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('totalCost')}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {currency(selectedTemplate.totalCost.amount / selectedTemplate.itemCount)}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('avgItemCost')}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedTemplate.items.filter(i => !i.isOptional).length}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('requiredItems')}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {selectedTemplate.items.filter(i => i.isOptional).length}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('optionalItems')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 分类分析 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t('categoryBreakdown')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(
                          selectedTemplate.items.reduce((acc, item) => {
                            const category = item.category
                            acc[category] = (acc[category] || 0) + (item.quantity * item.unitPrice)
                            return acc
                          }, {} as Record<string, number>)
                        ).map(([category, cost]) => (
                          <div key={category} className="text-center p-3 border rounded-lg">
                            <p className="font-medium">{t(`categories.${category}`)}</p>
                            <p className="text-lg font-bold text-primary">
                              {currency(cost)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {((cost / selectedTemplate.totalCost.amount) * 100).toFixed(1)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 批量定价 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {t('quantityPricing')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 10, 100, 1000].map(qty => (
                          <div key={qty} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{qty} {t('units')}</p>
                              <p className="text-sm text-muted-foreground">
                                {t('unitCost')}: {currency(selectedTemplate.totalCost.amount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {currency(selectedTemplate.totalCost.amount * qty)}
                              </p>
                              <p className="text-sm text-green-600">
                                {qty > 1 ? t('bulkDiscount') : t('regularPrice')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 版本历史 */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      {t('versionHistory')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {versions.length > 0 ? (
                      <div className="space-y-4">
                        {versions.map((version) => (
                          <div key={version._id} className="border-l-2 border-primary pl-4 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {t('version')} {version.version}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {dateShort(new Date(version.createdAt))} • {version.createdBy}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                {t('restore')}
                              </Button>
                            </div>
                            <p className="text-sm mb-2">{version.description}</p>
                            
                            {version.changes.length > 0 && (
                              <div className="space-y-1">
                                {version.changes.map((change, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {t(`changeTypes.${change.type}`)}
                                    </Badge>
                                    <span>{change.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">{t('noVersionHistory')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 设置 */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      {t('templateSettings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>{t('templateName')}</Label>
                      <Input
                        value={getLocalizedValue(selectedTemplate.name, locale)}
                        onChange={(e) => {
                          const updates = {
                            name: {
                              ...selectedTemplate.name,
                              [locale]: e.target.value
                            }
                          }
                          onTemplateUpdate?.(selectedTemplate._id, updates)
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label>{t('description')}</Label>
                      <Textarea
                        value={getLocalizedValue(selectedTemplate.description, locale)}
                        onChange={(e) => {
                          const updates = {
                            description: {
                              ...selectedTemplate.description,
                              [locale]: e.target.value
                            }
                          }
                          onTemplateUpdate?.(selectedTemplate._id, updates)
                        }}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label>{t('complexity')}</Label>
                      <Select 
                        value={selectedTemplate.complexity}
                        onValueChange={(value) => {
                          onTemplateUpdate?.(selectedTemplate._id, { 
                            complexity: value as BOMTemplate['complexity']
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(complexityMap).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="font-medium text-red-600">{t('dangerZone')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('deleteTemplateWarning')}
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          if (confirm(t('confirmDelete'))) {
                            onTemplateDelete?.(selectedTemplate._id)
                            setSelectedTemplate(null)
                          }
                        }}
                      >
                        {t('deleteTemplate')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">{t('selectTemplate')}</p>
                <p className="text-sm">{t('selectTemplateDescription')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}