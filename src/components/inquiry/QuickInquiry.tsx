'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { MessageCircle, Send, X, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInquiry } from '@/contexts/InquiryContext';

interface QuickInquiryProps {
  productId?: string
  productName?: string
  className?: string
}

export function QuickInquiry({ productId, productName, className }: QuickInquiryProps) {
  const router = useRouter();
  const { addProduct, updateCompanyInfo, setCurrentStep } = useInquiry();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    partNumber: productName || '',
    quantity: 1,
    contactName: '',
    phone: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 添加产品到询价系统
      if (formData.partNumber) {
        const product = {
          id: `product_${Date.now()}`,
          productId: productId || formData.partNumber,
          name: formData.partNumber,
          model: formData.partNumber,
          brand: '待确认',
          manufacturer: '待确认',
          category: '电子元器件',
          quantity: formData.quantity,
          urgency: 'standard' as const,
          specifications: {}
        };
        addProduct(product);
      }

      // 更新公司信息（如果提供）
      if (formData.contactName || formData.phone || formData.email || formData.company) {
        updateCompanyInfo({
          companyName: formData.company || '',
          contactPerson: formData.contactName || '',
          email: formData.email || '',
          phone: formData.phone || ''
        });
      }

      // 设置当前步骤并跳转到询价页面
      if (formData.contactName && formData.phone) {
        // 如果基本联系信息已填写，跳到项目信息步骤
        setCurrentStep('project');
      } else {
        // 否则跳到公司信息步骤
        setCurrentStep('company');
      }

      // 跳转到询价页面
      router.push('/inquiry');
    } catch (error) {
      console.error('快速询价处理错误:', error);
      alert('处理失败，请重试');
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const handleDetailedInquiry = () => {
    // 如果有产品信息，添加到询价系统
    if (formData.partNumber) {
      const product = {
        id: `product_${Date.now()}`,
        productId: productId || formData.partNumber,
        name: formData.partNumber,
        model: formData.partNumber,
        brand: '待确认',
        manufacturer: '待确认',
        category: '电子元器件',
        quantity: formData.quantity,
        urgency: 'standard' as const,
        specifications: {}
      };
      addProduct(product);
    }

    // 跳转到询价页面
    setCurrentStep('products');
    router.push('/inquiry');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        size="sm"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        快速询价
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            快速询价
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          {productName && (
            <Badge variant="outline" className="w-fit">
              {productName}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品型号 <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.partNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                placeholder="请输入产品型号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                需求数量 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                placeholder="例如：100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                联系人 <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                placeholder="请输入姓名"
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
                邮箱
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱（选填）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                公司名称
              </label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="请输入公司名称（选填）"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    快速提交
                  </>
                )}
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDetailedInquiry}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  详细询价
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                快速提交直接发送询价，详细询价进入完整表单
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
