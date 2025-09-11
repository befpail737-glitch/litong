'use client';

import { useState } from 'react';

import { FileText, Search, Eye, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InquiryItem {
  id: string
  date: string
  products: Array<{
    name: string
    model: string
    quantity: number
    specifications?: string
  }>
  status: 'pending' | 'responded' | 'quoted' | 'closed'
  totalItems: number
  estimatedValue?: string
  notes?: string
  response?: {
    date: string
    message: string
    quotedPrice?: string
    deliveryTime?: string
  }
}

const mockInquiries: InquiryItem[] = [
  {
    id: 'INQ-2024-001',
    date: '2024-01-15',
    products: [
      { name: 'STM32F401RET6', model: 'STM32F401RET6', quantity: 100, specifications: 'LQFP64封装' },
      { name: 'ESP32-WROOM-32D', model: 'ESP32-WROOM-32D', quantity: 50, specifications: '4MB Flash' }
    ],
    status: 'responded',
    totalItems: 2,
    estimatedValue: '¥2,850.00',
    notes: '用于IoT项目开发，需要尽快报价',
    response: {
      date: '2024-01-16',
      message: '您好，我们已经为您准备了详细报价，请查看附件。交期约为2-3个工作日。',
      quotedPrice: '¥2,750.00',
      deliveryTime: '2-3个工作日'
    }
  },
  {
    id: 'INQ-2024-002',
    date: '2024-01-10',
    products: [
      { name: 'STC89C52RC', model: 'STC89C52RC-40I-PDIP40', quantity: 200 }
    ],
    status: 'quoted',
    totalItems: 1,
    estimatedValue: '¥560.00',
    response: {
      date: '2024-01-11',
      message: '感谢您的询价，报价如下，有效期7天。',
      quotedPrice: '¥520.00',
      deliveryTime: '现货，当天发货'
    }
  },
  {
    id: 'INQ-2024-003',
    date: '2024-01-08',
    products: [
      { name: 'Arduino UNO R3', model: 'A000066', quantity: 10 },
      { name: 'Raspberry Pi 4B', model: 'RPI4-MODBP-4GB', quantity: 5 }
    ],
    status: 'pending',
    totalItems: 2,
    notes: '教学项目采购，需要原装正品'
  }
];

const statusConfig = {
  pending: { label: '待回复', color: 'secondary', icon: Clock },
  responded: { label: '已回复', color: 'default', icon: MessageCircle },
  quoted: { label: '已报价', color: 'default', icon: CheckCircle },
  closed: { label: '已关闭', color: 'secondary', icon: AlertCircle }
};

export function InquiryHistory() {
  const [inquiries] = useState<InquiryItem[]>(mockInquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
  };

  if (selectedInquiry) {
    return (
      <InquiryDetails
        inquiry={selectedInquiry}
        onBack={() => setSelectedInquiry(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            询价历史
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索询价单号或产品名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待回复</SelectItem>
                <SelectItem value="responded">已回复</SelectItem>
                <SelectItem value="quoted">已报价</SelectItem>
                <SelectItem value="closed">已关闭</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 询价列表 */}
          <div className="space-y-4">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || statusFilter !== 'all' ? '没有找到匹配的询价记录' : '暂无询价记录'}
              </div>
            ) : (
              filteredInquiries.map((inquiry) => {
                const StatusIcon = statusConfig[inquiry.status].icon;
                return (
                  <div key={inquiry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{inquiry.id}</h3>
                        <Badge variant={statusConfig[inquiry.status].color as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[inquiry.status].label}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(inquiry)}>
                        <Eye className="h-4 w-4 mr-2" />
                        查看详情
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">提交时间：</span>
                        <p className="font-medium">{inquiry.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">产品数量：</span>
                        <p className="font-medium">{inquiry.totalItems} 个产品</p>
                      </div>
                      {inquiry.estimatedValue && (
                        <div>
                          <span className="text-gray-600">预估价值：</span>
                          <p className="font-medium text-blue-600">{inquiry.estimatedValue}</p>
                        </div>
                      )}
                      {inquiry.response?.quotedPrice && (
                        <div>
                          <span className="text-gray-600">报价金额：</span>
                          <p className="font-medium text-green-600">{inquiry.response.quotedPrice}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <span className="text-gray-600">产品列表：</span>
                      <p className="text-sm">
                        {inquiry.products.map(p => `${p.name} (${p.quantity}pcs)`).join('、')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InquiryDetails({ inquiry, onBack }: { inquiry: InquiryItem, onBack: () => void }) {
  const StatusIcon = statusConfig[inquiry.status].icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← 返回列表
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              询价详情 - {inquiry.id}
              <Badge variant={statusConfig[inquiry.status].color as any}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[inquiry.status].label}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">询价信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">询价单号：</span>
                  <span className="font-medium">{inquiry.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">提交时间：</span>
                  <span className="font-medium">{inquiry.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">产品数量：</span>
                  <span className="font-medium">{inquiry.totalItems} 个产品</span>
                </div>
                {inquiry.estimatedValue && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">预估价值：</span>
                    <span className="font-medium text-blue-600">{inquiry.estimatedValue}</span>
                  </div>
                )}
              </div>
            </div>

            {inquiry.response && (
              <div>
                <h4 className="font-medium mb-3">回复信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">回复时间：</span>
                    <span className="font-medium">{inquiry.response.date}</span>
                  </div>
                  {inquiry.response.quotedPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">报价金额：</span>
                      <span className="font-medium text-green-600">{inquiry.response.quotedPrice}</span>
                    </div>
                  )}
                  {inquiry.response.deliveryTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">交货期：</span>
                      <span className="font-medium">{inquiry.response.deliveryTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 产品列表 */}
          <div>
            <h4 className="font-medium mb-3">询价产品</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">产品名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">型号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">数量</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">规格要求</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiry.products.map((product, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-gray-600">{product.model}</td>
                      <td className="px-4 py-3">{product.quantity} pcs</td>
                      <td className="px-4 py-3 text-gray-600">{product.specifications || '无特殊要求'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 备注和回复 */}
          {(inquiry.notes || inquiry.response?.message) && (
            <div className="space-y-4">
              {inquiry.notes && (
                <div>
                  <h4 className="font-medium mb-2">询价备注</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {inquiry.notes}
                  </div>
                </div>
              )}

              {inquiry.response?.message && (
                <div>
                  <h4 className="font-medium mb-2">供应商回复</h4>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
                    {inquiry.response.message}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t">
            <Button>
              重新询价
            </Button>
            <Button variant="outline">
              下载PDF
            </Button>
            {inquiry.response?.quotedPrice && (
              <Button variant="outline">
                接受报价
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
