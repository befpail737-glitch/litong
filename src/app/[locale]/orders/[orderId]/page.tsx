'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Package,
  MapPin,
  CreditCard,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  ArrowLeft,
  Phone,
  Download
} from 'lucide-react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import type { Order } from '@/contexts/OrderContext';

interface OrderPageProps {
  params: {
    orderId: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    getOrder,
    updateOrderStatus,
    cancelOrder,
    processPayment,
    getOrderStatusText,
    getPaymentStatusText
  } = useOrder();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrder(params.orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [params.orderId, getOrder]);

  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/orders/' + params.orderId);
    }
  }, [user, router, params.orderId]);

  const handlePayment = async () => {
    if (!order) return;

    setIsProcessing(true);
    try {
      const result = await processPayment(order.id, order.paymentMethod || 'alipay');
      if (result.success) {
        // 重新加载订单数据
        const updatedOrder = await getOrder(order.id);
        setOrder(updatedOrder);
      } else {
        alert(result.error || '支付失败，请重试');
      }
    } catch (error) {
      alert('支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    setIsProcessing(true);
    try {
      const result = await cancelOrder(order.id, cancelReason);
      if (result.success) {
        const updatedOrder = await getOrder(order.id);
        setOrder(updatedOrder);
        setShowCancelDialog(false);
        setCancelReason('');
      } else {
        alert(result.error || '取消订单失败，请重试');
      }
    } catch (error) {
      alert('取消订单失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      // 这里可以添加一个Toast提示
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      refunded: 'secondary'
    };
    return colorMap[status] || 'secondary';
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive',
      refunded: 'secondary'
    };
    return colorMap[status] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载订单信息...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">订单不存在</h2>
            <p className="text-gray-600 mb-4">找不到订单信息，可能已被删除或不存在</p>
            <Button onClick={() => router.back()}>
              返回上一页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>

        {/* 订单状态卡片 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">订单详情</h1>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                  <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>订单号：{order.orderNumber}</span>
                  <Button variant="ghost" size="sm" onClick={copyOrderNumber}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  下单时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>

              <div className="flex gap-2">
                {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                  <Button onClick={handlePayment} disabled={isProcessing}>
                    立即支付
                  </Button>
                )}
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isProcessing}
                  >
                    取消订单
                  </Button>
                )}
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  联系客服
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 物流信息 */}
        {order.status === 'shipped' || order.status === 'delivered' ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                物流信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {order.status === 'delivered' ? '已送达' : '运输中'}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      运单号：{order.trackingNumber}
                    </p>
                  )}
                  {order.estimatedDelivery && (
                    <p className="text-sm text-gray-600">
                      预计送达：{order.estimatedDelivery}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  查看物流
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 商品信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  商品信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">暂无图片</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">型号：{item.model}</p>
                        {item.specifications && (
                          <p className="text-sm text-gray-600">规格：{item.specifications}</p>
                        )}
                        {item.brand && (
                          <p className="text-sm text-gray-600">品牌：{item.brand}</p>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-600">
                            单价：¥{item.unitPrice.toFixed(2)} × {item.quantity}
                          </span>
                          <span className="font-semibold text-red-600">
                            ¥{item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 收货信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  收货信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.shippingAddress.recipientName}</span>
                    <span className="text-gray-600">{order.shippingAddress.phone}</span>
                  </div>
                  <p className="text-gray-600">
                    {order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.district}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.detailAddress}
                  </p>
                  {order.shippingAddress.company && (
                    <p className="text-gray-500 text-sm">
                      公司：{order.shippingAddress.company}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 支付信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  支付信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">支付方式</p>
                    <p className="font-medium">
                      {order.paymentMethod === 'alipay' && '支付宝'}
                      {order.paymentMethod === 'wechat' && '微信支付'}
                      {order.paymentMethod === 'bank_transfer' && '银行转账'}
                      {order.paymentMethod === 'credit_card' && '信用卡'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">支付状态</p>
                    <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </Badge>
                  </div>
                </div>

                {order.paymentStatus === 'failed' && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <div className="text-red-800 text-sm">
                      支付失败，请重新支付或更换支付方式
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* 发票信息 */}
            {order.invoiceInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    发票信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">发票类型</p>
                      <p className="font-medium">
                        {order.invoiceInfo.type === 'personal' ? '个人发票' : '企业发票'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">发票抬头</p>
                      <p className="font-medium">{order.invoiceInfo.title}</p>
                    </div>
                    {order.invoiceInfo.taxNumber && (
                      <div>
                        <p className="text-sm text-gray-600">纳税人识别号</p>
                        <p className="font-medium">{order.invoiceInfo.taxNumber}</p>
                      </div>
                    )}
                    {order.invoiceInfo.email && (
                      <div>
                        <p className="text-sm text-gray-600">发票邮箱</p>
                        <p className="font-medium">{order.invoiceInfo.email}</p>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        下载发票
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 订单备注 */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    订单备注
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧订单摘要 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品小计</span>
                    <span>¥{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className={order.shippingFee === 0 ? 'text-green-600' : ''}>
                      {order.shippingFee === 0 ? '免运费' : `¥${order.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">优惠</span>
                      <span className="text-green-600">-¥{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>总计</span>
                      <span className="text-red-600">¥{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 订单状态时间线 */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">订单状态</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>订单创建</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    {order.confirmedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>订单确认</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(order.confirmedAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    )}
                    {order.shippedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>已发货</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(order.shippedAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    )}
                    {order.deliveredAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>已送达</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(order.deliveredAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span>订单取消</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 取消订单对话框 */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>取消订单</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">请选择取消原因：</p>
                <div className="space-y-2 mb-4">
                  {[
                    '不想要了',
                    '价格变化',
                    '找到更优惠的',
                    '收货地址有误',
                    '其他原因'
                  ].map((reason) => (
                    <label key={reason} className="flex items-center">
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="mr-2"
                      />
                      {reason}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason || isProcessing}
                    variant="destructive"
                  >
                    {isProcessing ? '处理中...' : '确认取消'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                    disabled={isProcessing}
                  >
                    关闭
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
