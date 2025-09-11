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
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Calendar,
  MessageCircle,
  Edit,
  Eye,
  Filter,
  Search,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import { useLocale } from 'next-intl'

interface ReviewComment {
  id: string
  message: string
  type: 'general' | 'suggestion' | 'issue' | 'approval' | 'rejection'
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  resolved: boolean
}

interface ChecklistItem {
  id: string
  item: string
  checked: boolean
  required: boolean
  notes?: string
}

interface WorkflowStep {
  id: string
  step: string
  assignee?: {
    name: string
    avatar?: string
  }
  completed: boolean
  completedAt?: string
  required: boolean
}

interface ContentReview {
  id: string
  title: string
  contentId: string
  contentType: string
  status: 'draft' | 'pendingReview' | 'inReview' | 'revisionRequired' | 'approved' | 'published' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedReviewer?: {
    name: string
    avatar?: string
  }
  submittedBy: {
    name: string
    avatar?: string
  }
  submittedAt: string
  reviewedAt?: string
  publishedAt?: string
  dueDate?: string
  reviewComments: ReviewComment[]
  checklist: ChecklistItem[]
  workflow: {
    steps: WorkflowStep[]
    currentStep: number
  }
  metadata: {
    version: string
    changesSummary: string
    revisionCount: number
  }
}

const mockReviews: ContentReview[] = [
  {
    id: '1',
    title: 'STM32 Product Page Update',
    contentId: 'stm32-h743',
    contentType: 'product',
    status: 'inReview',
    priority: 'high',
    assignedReviewer: {
      name: 'Li Wei',
      avatar: '/avatars/li-wei.jpg'
    },
    submittedBy: {
      name: 'Zhang San',
      avatar: '/avatars/zhang-san.jpg'
    },
    submittedAt: '2025-01-15T09:00:00Z',
    dueDate: '2025-01-18T17:00:00Z',
    reviewComments: [
      {
        id: '1',
        message: 'Please update the technical specifications section with the latest datasheet information.',
        type: 'issue',
        author: { name: 'Li Wei', avatar: '/avatars/li-wei.jpg' },
        createdAt: '2025-01-15T10:30:00Z',
        resolved: false
      }
    ],
    checklist: [
      { id: '1', item: 'Technical accuracy verified', checked: true, required: true },
      { id: '2', item: 'Images optimized and properly sized', checked: false, required: true },
      { id: '3', item: 'SEO metadata complete', checked: true, required: true },
      { id: '4', item: 'Links verified', checked: false, required: false }
    ],
    workflow: {
      steps: [
        { id: '1', step: 'Technical Review', assignee: { name: 'Li Wei' }, completed: false, required: true },
        { id: '2', step: 'Content Review', assignee: { name: 'Wang Wu' }, completed: false, required: true },
        { id: '3', step: 'Final Approval', assignee: { name: 'Liu Manager' }, completed: false, required: true }
      ],
      currentStep: 0
    },
    metadata: {
      version: '2.1.0',
      changesSummary: 'Updated product specifications and added new application examples',
      revisionCount: 2
    }
  }
]

export function ReviewWorkflow() {
  const locale = useLocale()
  const [reviews, setReviews] = useState<ContentReview[]>(mockReviews)
  const [selectedReview, setSelectedReview] = useState<ContentReview | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const statusConfig = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: FileText },
    pendingReview: { label: '待审核', color: 'bg-yellow-500', icon: Clock },
    inReview: { label: '审核中', color: 'bg-blue-500', icon: Eye },
    revisionRequired: { label: '需修改', color: 'bg-orange-500', icon: Edit },
    approved: { label: '已批准', color: 'bg-green-500', icon: CheckCircle },
    published: { label: '已发布', color: 'bg-purple-500', icon: CheckCircle },
    archived: { label: '已归档', color: 'bg-gray-400', icon: XCircle }
  }
  
  const priorityConfig = {
    low: { label: '低', color: 'bg-gray-100 text-gray-800' },
    medium: { label: '中', color: 'bg-blue-100 text-blue-800' },
    high: { label: '高', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: '紧急', color: 'bg-red-100 text-red-800' }
  }
  
  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus
    const matchesPriority = filterPriority === 'all' || review.priority === filterPriority
    const matchesSearch = !searchQuery || 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.contentType.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })
  
  const handleStatusChange = (reviewId: string, newStatus: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus as ContentReview['status'] }
        : review
    ))
  }
  
  const handleAddComment = (reviewId: string, comment: Omit<ReviewComment, 'id' | 'createdAt'>) => {
    const newComment: ReviewComment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, reviewComments: [...review.reviewComments, newComment] }
        : review
    ))
  }
  
  const handleChecklistToggle = (reviewId: string, itemId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            checklist: review.checklist.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          }
        : review
    ))
  }
  
  const getProgressPercentage = (checklist: ChecklistItem[]) => {
    const completed = checklist.filter(item => item.checked).length
    return checklist.length > 0 ? (completed / checklist.length) * 100 : 0
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">内容审核工作流</h1>
        <p className="text-gray-600">管理和跟踪内容审核流程</p>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索审核项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pendingReview">待审核</SelectItem>
            <SelectItem value="inReview">审核中</SelectItem>
            <SelectItem value="revisionRequired">需修改</SelectItem>
            <SelectItem value="approved">已批准</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新建审核
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建新审核项目</DialogTitle>
            </DialogHeader>
            {/* New review form would go here */}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6">
        {filteredReviews.map((review) => {
          const StatusIcon = statusConfig[review.status].icon
          const progress = getProgressPercentage(review.checklist)
          
          return (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{review.contentType}</Badge>
                        <span>•</span>
                        <span>v{review.metadata.version}</span>
                        <span>•</span>
                        <span>{review.metadata.revisionCount} 次修改</span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig[review.status].color}>
                      {statusConfig[review.status].label}
                    </Badge>
                    <Badge className={priorityConfig[review.priority].color}>
                      {priorityConfig[review.priority].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm text-gray-600">提交者:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={review.submittedBy.avatar} />
                          <AvatarFallback>{review.submittedBy.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{review.submittedBy.name}</span>
                      </div>
                    </div>
                    
                    {review.assignedReviewer && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm text-gray-600">审核者:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={review.assignedReviewer.avatar} />
                            <AvatarFallback>{review.assignedReviewer.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{review.assignedReviewer.name}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        提交时间: {new Date(review.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {review.dueDate && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm text-gray-600">
                          截止时间: {new Date(review.dueDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">检查清单</span>
                        <span className="text-sm text-gray-500">
                          {review.checklist.filter(item => item.checked).length}/{review.checklist.length}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        {review.reviewComments.length} 条评论
                        {review.reviewComments.filter(c => !c.resolved).length > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {review.reviewComments.filter(c => !c.resolved).length} 未解决
                          </Badge>
                        )}
                      </span>
                    </div>
                    
                    {review.metadata.changesSummary && (
                      <div className="text-sm text-gray-600">
                        <strong>变更摘要:</strong> {review.metadata.changesSummary}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      查看详情
                    </Button>
                    
                    <Select 
                      value={review.status} 
                      onValueChange={(value) => handleStatusChange(review.id, value)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendingReview">待审核</SelectItem>
                        <SelectItem value="inReview">审核中</SelectItem>
                        <SelectItem value="revisionRequired">需修改</SelectItem>
                        <SelectItem value="approved">已批准</SelectItem>
                        <SelectItem value="published">已发布</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      工作流: 第 {review.workflow.currentStep + 1}/{review.workflow.steps.length} 步
                    </div>
                    <Progress 
                      value={(review.workflow.currentStep / review.workflow.steps.length) * 100} 
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无审核项目</h3>
            <p className="text-gray-600">没有找到符合条件的审核项目</p>
          </div>
        )}
      </div>
      
      {/* Review Detail Dialog */}
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                {selectedReview.title}
                <Badge className={statusConfig[selectedReview.status].color}>
                  {statusConfig[selectedReview.status].label}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList>
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="checklist">检查清单</TabsTrigger>
                <TabsTrigger value="comments">评论</TabsTrigger>
                <TabsTrigger value="workflow">工作流</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div><strong>内容ID:</strong> {selectedReview.contentId}</div>
                      <div><strong>内容类型:</strong> {selectedReview.contentType}</div>
                      <div><strong>版本:</strong> v{selectedReview.metadata.version}</div>
                      <div><strong>优先级:</strong> 
                        <Badge className={`ml-2 ${priorityConfig[selectedReview.priority].color}`}>
                          {priorityConfig[selectedReview.priority].label}
                        </Badge>
                      </div>
                      <div><strong>修改次数:</strong> {selectedReview.metadata.revisionCount}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>时间信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div><strong>提交时间:</strong> {new Date(selectedReview.submittedAt).toLocaleString()}</div>
                      {selectedReview.dueDate && (
                        <div><strong>截止时间:</strong> {new Date(selectedReview.dueDate).toLocaleString()}</div>
                      )}
                      {selectedReview.reviewedAt && (
                        <div><strong>审核时间:</strong> {new Date(selectedReview.reviewedAt).toLocaleString()}</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {selectedReview.metadata.changesSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>变更摘要</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{selectedReview.metadata.changesSummary}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="checklist" className="space-y-4">
                <div className="space-y-2">
                  {selectedReview.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        checked={item.checked}
                        onCheckedChange={() => handleChecklistToggle(selectedReview.id, item.id)}
                      />
                      <div className="flex-1">
                        <span className={item.checked ? 'line-through text-gray-500' : ''}>
                          {item.item}
                        </span>
                        {item.required && (
                          <Badge variant="outline" className="ml-2 text-xs">必需</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-4">
                <div className="space-y-4">
                  {selectedReview.reviewComments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{comment.author.name}</span>
                              <Badge variant="outline">{comment.type}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                              {comment.resolved && (
                                <Badge variant="outline" className="text-green-600">已解决</Badge>
                              )}
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>添加评论</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea placeholder="输入评论内容..." />
                      <div className="flex items-center gap-4">
                        <Select defaultValue="general">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">一般</SelectItem>
                            <SelectItem value="suggestion">建议</SelectItem>
                            <SelectItem value="issue">问题</SelectItem>
                            <SelectItem value="approval">通过</SelectItem>
                            <SelectItem value="rejection">拒绝</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button>发布评论</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workflow" className="space-y-4">
                <div className="space-y-4">
                  {selectedReview.workflow.steps.map((step, index) => (
                    <Card key={step.id} className={index === selectedReview.workflow.currentStep ? 'border-blue-500' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500 text-white' : 
                            index === selectedReview.workflow.currentStep ? 'bg-blue-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{step.step}</span>
                              {step.required && (
                                <Badge variant="outline" className="text-xs">必需</Badge>
                              )}
                              {index === selectedReview.workflow.currentStep && (
                                <Badge className="bg-blue-500">当前步骤</Badge>
                              )}
                            </div>
                            
                            {step.assignee && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-3 w-3" />
                                <span>负责人: {step.assignee.name}</span>
                              </div>
                            )}
                            
                            {step.completed && step.completedAt && (
                              <div className="text-sm text-gray-600">
                                完成时间: {new Date(step.completedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}