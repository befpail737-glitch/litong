'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  History, 
  GitBranch, 
  Tag, 
  Download, 
  Upload, 
  Eye, 
  Copy,
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  FileText,
  User
} from 'lucide-react'
import { useLocale } from 'next-intl'

interface VersionChange {
  field: string
  changeType: 'added' | 'modified' | 'removed'
  oldValue?: string
  newValue?: string
  description?: string
}

interface ContentVersion {
  id: string
  title: string
  contentId: string
  contentType: string
  version: string
  versionType: 'major' | 'minor' | 'patch'
  status: 'draft' | 'active' | 'archived' | 'deprecated'
  isCurrentVersion: boolean
  changes: VersionChange[]
  changelog: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  parentVersion?: {
    version: string
    title: string
  }
  tags: string[]
  branches: Array<{
    name: string
    description: string
    createdBy: string
    createdAt: string
  }>
  contentSnapshot: {
    data: string
    schema: string
  }
}

const mockVersions: ContentVersion[] = [
  {
    id: '1',
    title: 'STM32H743 Product Update',
    contentId: 'stm32-h743',
    contentType: 'product',
    version: '2.1.0',
    versionType: 'minor',
    status: 'active',
    isCurrentVersion: true,
    changes: [
      {
        field: 'specifications.memory',
        changeType: 'modified',
        oldValue: '2MB Flash',
        newValue: '2MB Flash, 1MB RAM',
        description: 'Added RAM specification'
      },
      {
        field: 'applications',
        changeType: 'added',
        newValue: 'Industrial IoT',
        description: 'Added new application category'
      }
    ],
    changelog: 'Updated memory specifications and added Industrial IoT applications. Fixed pricing display issues.',
    author: {
      name: 'Zhang San',
      avatar: '/avatars/zhang-san.jpg'
    },
    createdAt: '2025-01-15T10:00:00Z',
    parentVersion: {
      version: '2.0.0',
      title: 'Major Feature Release'
    },
    tags: ['release', 'feature'],
    branches: [
      {
        name: 'feature/iot-applications',
        description: 'Adding IoT specific features',
        createdBy: 'Zhang San',
        createdAt: '2025-01-14T09:00:00Z'
      }
    ],
    contentSnapshot: {
      data: '{"title":"STM32H743","specifications":{"memory":"2MB Flash, 1MB RAM"}}',
      schema: 'product-v2'
    }
  },
  {
    id: '2',
    title: 'STM32H743 Baseline',
    contentId: 'stm32-h743',
    contentType: 'product',
    version: '2.0.0',
    versionType: 'major',
    status: 'archived',
    isCurrentVersion: false,
    changes: [
      {
        field: 'pricing',
        changeType: 'modified',
        oldValue: '$15.00',
        newValue: '$14.50',
        description: 'Price adjustment'
      },
      {
        field: 'documentation',
        changeType: 'added',
        newValue: 'datasheet-v2.pdf',
        description: 'Added new datasheet'
      }
    ],
    changelog: 'Major release with updated pricing and new documentation format.',
    author: {
      name: 'Li Wei',
      avatar: '/avatars/li-wei.jpg'
    },
    createdAt: '2025-01-10T15:30:00Z',
    tags: ['release', 'major'],
    branches: [],
    contentSnapshot: {
      data: '{"title":"STM32H743","pricing":"$14.50"}',
      schema: 'product-v2'
    }
  }
]

export function VersionControl() {
  const locale = useLocale()
  const [versions, setVersions] = useState<ContentVersion[]>(mockVersions)
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<ContentVersion | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showComparison, setShowComparison] = useState(false)
  
  const statusConfig = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: FileText },
    active: { label: '活跃', color: 'bg-green-500', icon: CheckCircle },
    archived: { label: '已归档', color: 'bg-gray-400', icon: Archive },
    deprecated: { label: '已废弃', color: 'bg-red-500', icon: XCircle }
  }
  
  const versionTypeConfig = {
    major: { label: '主版本', color: 'bg-red-100 text-red-800' },
    minor: { label: '次版本', color: 'bg-blue-100 text-blue-800' },
    patch: { label: '补丁', color: 'bg-green-100 text-green-800' }
  }
  
  const changeTypeConfig = {
    added: { label: '新增', color: 'text-green-600', icon: '➕' },
    modified: { label: '修改', color: 'text-blue-600', icon: '✏️' },
    removed: { label: '删除', color: 'text-red-600', icon: '➖' }
  }
  
  const filteredVersions = versions.filter(version => {
    const matchesStatus = filterStatus === 'all' || version.status === filterStatus
    const matchesType = filterType === 'all' || version.versionType === filterType
    const matchesSearch = !searchQuery || 
      version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.version.includes(searchQuery) ||
      version.changelog.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  })
  
  const handleRollback = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (version) {
      // Set as current version and mark others as not current
      setVersions(versions.map(v => ({
        ...v,
        isCurrentVersion: v.id === versionId,
        status: v.id === versionId ? 'active' : v.status
      })))
    }
  }
  
  const handleArchive = (versionId: string) => {
    setVersions(versions.map(v => 
      v.id === versionId ? { ...v, status: 'archived' } : v
    ))
  }
  
  const compareVersions = (version1: ContentVersion, version2: ContentVersion) => {
    const data1 = JSON.parse(version1.contentSnapshot.data)
    const data2 = JSON.parse(version2.contentSnapshot.data)
    
    const differences = []
    
    // Compare all keys from both objects
    const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)])
    
    for (const key of allKeys) {
      if (data1[key] !== data2[key]) {
        differences.push({
          field: key,
          oldValue: data1[key] || '(未设置)',
          newValue: data2[key] || '(已删除)'
        })
      }
    }
    
    return differences
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">版本控制系统</h1>
        <p className="text-gray-600">管理内容版本历史和变更跟踪</p>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索版本..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">活跃</SelectItem>
            <SelectItem value="archived">已归档</SelectItem>
            <SelectItem value="deprecated">已废弃</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="major">主版本</SelectItem>
            <SelectItem value="minor">次版本</SelectItem>
            <SelectItem value="patch">补丁</SelectItem>
          </SelectContent>
        </Select>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建版本
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建新版本</DialogTitle>
            </DialogHeader>
            {/* New version form would go here */}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6">
        {filteredVersions.map((version) => {
          const StatusIcon = statusConfig[version.status].icon
          
          return (
            <Card key={version.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">v{version.version}</CardTitle>
                          {version.isCurrentVersion && (
                            <Badge className="bg-green-500 text-xs">当前版本</Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{version.title}</span>
                          <span>•</span>
                          <Badge variant="outline">{version.contentType}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig[version.status].color}>
                      {statusConfig[version.status].label}
                    </Badge>
                    <Badge className={versionTypeConfig[version.versionType].color}>
                      {versionTypeConfig[version.versionType].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span className="text-sm text-gray-600">作者: {version.author.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        创建时间: {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {version.parentVersion && (
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-4 w-4" />
                        <span className="text-sm text-gray-600">
                          基于版本: v{version.parentVersion.version}
                        </span>
                      </div>
                    )}
                    
                    {version.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4" />
                        {version.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">变更摘要</h4>
                      <p className="text-sm text-gray-600">{version.changelog}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">主要变更</h4>
                      <div className="space-y-1">
                        {version.changes.slice(0, 3).map((change, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className={changeTypeConfig[change.changeType].color}>
                              {changeTypeConfig[change.changeType].icon}
                            </span>
                            <span className="truncate">{change.field}</span>
                            <span className="text-gray-500 text-xs">
                              {changeTypeConfig[change.changeType].label}
                            </span>
                          </div>
                        ))}
                        {version.changes.length > 3 && (
                          <div className="text-sm text-gray-500">
                            还有 {version.changes.length - 3} 项变更...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVersion(version)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCompareVersion(version)
                        setShowComparison(true)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      比较
                    </Button>
                    
                    {!version.isCurrentVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(version.id)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        回滚
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(version.id)}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      归档
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      导出
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {filteredVersions.length === 0 && (
          <div className="text-center py-12">
            <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无版本记录</h3>
            <p className="text-gray-600">没有找到符合条件的版本记录</p>
          </div>
        )}
      </div>
      
      {/* Version Detail Dialog */}
      {selectedVersion && (
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <History className="h-5 w-5" />
                版本 v{selectedVersion.version} - {selectedVersion.title}
                {selectedVersion.isCurrentVersion && (
                  <Badge className="bg-green-500">当前版本</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="changes" className="mt-6">
              <TabsList>
                <TabsTrigger value="changes">变更记录</TabsTrigger>
                <TabsTrigger value="content">内容快照</TabsTrigger>
                <TabsTrigger value="branches">分支信息</TabsTrigger>
              </TabsList>
              
              <TabsContent value="changes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>变更摘要</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedVersion.changelog}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>详细变更</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedVersion.changes.map((change, index) => (
                        <div key={index} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={changeTypeConfig[change.changeType].color}>
                              {changeTypeConfig[change.changeType].icon}
                            </span>
                            <span className="font-medium">{change.field}</span>
                            <Badge variant="outline" className="text-xs">
                              {changeTypeConfig[change.changeType].label}
                            </Badge>
                          </div>
                          
                          {change.description && (
                            <p className="text-sm text-gray-600 mb-2">{change.description}</p>
                          )}
                          
                          {change.changeType === 'modified' && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-red-600 font-medium">- 旧值:</span>
                                <div className="bg-red-50 p-2 rounded mt-1">{change.oldValue}</div>
                              </div>
                              <div>
                                <span className="text-green-600 font-medium">+ 新值:</span>
                                <div className="bg-green-50 p-2 rounded mt-1">{change.newValue}</div>
                              </div>
                            </div>
                          )}
                          
                          {change.changeType === 'added' && (
                            <div className="text-sm">
                              <span className="text-green-600 font-medium">+ 新增:</span>
                              <div className="bg-green-50 p-2 rounded mt-1">{change.newValue}</div>
                            </div>
                          )}
                          
                          {change.changeType === 'removed' && (
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">- 删除:</span>
                              <div className="bg-red-50 p-2 rounded mt-1">{change.oldValue}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>内容快照</CardTitle>
                    <CardDescription>此版本的完整内容数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>数据结构版本</Label>
                        <div className="text-sm text-gray-600">{selectedVersion.contentSnapshot.schema}</div>
                      </div>
                      
                      <div>
                        <Label>内容数据</Label>
                        <ScrollArea className="h-64 w-full border rounded p-4">
                          <pre className="text-sm">
                            {JSON.stringify(JSON.parse(selectedVersion.contentSnapshot.data), null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="branches" className="space-y-4">
                <div className="space-y-4">
                  {selectedVersion.branches.map((branch, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3 mb-2">
                          <GitBranch className="h-4 w-4" />
                          <span className="font-medium">{branch.name}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{branch.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>创建者: {branch.createdBy}</span>
                          <span>创建时间: {new Date(branch.createdAt).toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {selectedVersion.branches.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      暂无分支信息
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Version Comparison Dialog */}
      {showComparison && compareVersion && (
        <Dialog open={showComparison} onOpenChange={setShowComparison}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>版本比较</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">选择版本 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select 
                      value={compareVersion.id}
                      onValueChange={(value) => {
                        const version = versions.find(v => v.id === value)
                        if (version) setCompareVersion(version)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            v{version.version} - {version.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">选择版本 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select 
                      value={selectedVersion?.id || ''}
                      onValueChange={(value) => {
                        const version = versions.find(v => v.id === value)
                        if (version) setSelectedVersion(version)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            v{version.version} - {version.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
              
              {selectedVersion && compareVersion && (
                <Card>
                  <CardHeader>
                    <CardTitle>差异对比</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {compareVersions(compareVersion, selectedVersion).map((diff, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="font-medium mb-2">{diff.field}</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-red-600 font-medium">v{compareVersion.version}:</span>
                              <div className="bg-red-50 p-2 rounded mt-1">{diff.oldValue}</div>
                            </div>
                            <div>
                              <span className="text-green-600 font-medium">v{selectedVersion.version}:</span>
                              <div className="bg-green-50 p-2 rounded mt-1">{diff.newValue}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {compareVersions(compareVersion, selectedVersion).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          这两个版本没有差异
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}