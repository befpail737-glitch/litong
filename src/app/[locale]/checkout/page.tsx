'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  CreditCard,
  MapPin,
  Truck,
  FileText,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import type { ShippingAddress, PaymentMethod } from '@/contexts/OrderContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    cartTotal,
    addresses,
    addAddress,
    createOrder,
    clearCart
  } = useOrder();

  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay');
  const [orderNotes, setOrderNotes] = useState('');
  const [invoiceType, setInvoiceType] = useState<'none' | 'personal' | 'company'>('none');
  const [invoiceInfo, setInvoiceInfo] = useState({
    title: '',
    taxNumber: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    postalCode: '',
    isDefault: false
  });

  // 如果没有购物车商品，重定向到购物车页面
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    // 自动选择默认地址
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [cartItems.length, addresses, router]);

  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, router]);

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const shippingFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleAddAddress = async () => {
    const result = await addAddress({
      ...newAddress,
      isDefault: addresses.length === 0 || newAddress.isDefault
    });

    if (result.success) {
      setShowAddressForm(false);
      setNewAddress({
        recipientName: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        postalCode: '',
        isDefault: false
      });
      // 刷新地址列表会通过OrderContext自动处理
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems,
        shippingAddress: selectedAddress,
        paymentMethod,
        notes: orderNotes || undefined,
        invoiceInfo: invoiceType !== 'none' ? {
          type: invoiceType as 'personal' | 'company',
          title: invoiceInfo.title,
          taxNumber: invoiceType === 'company' ? invoiceInfo.taxNumber : undefined,
          email: invoiceInfo.email || undefined
        } : undefined
      };

      const result = await createOrder(orderData);

      if (result.success && result.orderId) {
        // 清空购物车
        clearCart();
        // 跳转到订单详情页
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.error || '创建订单失败，请重试');
      }
    } catch (error) {
      alert('创建订单失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: 'alipay', label: '支付宝', icon: '💳' },
    { value: 'wechat', label: '微信支付', icon: '💚' },
    { value: 'bank_transfer', label: '银行转账', icon: '🏦' },
    { value: 'credit_card', label: '信用卡', icon: '💳' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            订单结算
          </h1>
          <p className="text-gray-600 mt-2">确认订单信息并完成支付</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 收货地址 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  收货地址
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">您还没有收货地址</p>
                    <Button onClick={() => setShowAddressForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加收货地址
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.recipientName}</span>
                              <span className="text-gray-600">{address.phone}</span>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">默认</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.province} {address.city} {address.district} {address.detailAddress}
                            </p>
                            {address.company && (
                              <p className="text-gray-500 text-sm">公司：{address.company}</p>
                            )}
                          </div>
                          {selectedAddress?.id === address.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加新地址
                    </Button>
                  </div>
                )}

                {/* 添加地址表单 */}
                {showAddressForm && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4">添加收货地址</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recipientName">收货人姓名 *</Label>
                        <Input
                          id="recipientName"
                          value={newAddress.recipientName}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, recipientName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">联系电话 *</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">省份 *</Label>
                        <Input
                          id="province"
                          value={newAddress.province}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, province: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">城市 *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="detailAddress">详细地址 *</Label>
                        <Input
                          id="detailAddress"
                          value={newAddress.detailAddress}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, detailAddress: e.target.value }))}
                          placeholder="街道、楼号、房间号等"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddAddress}>保存地址</Button>
                      <Button variant="outline" onClick={() => setShowAddressForm(false)}>取消</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 支付方式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  支付方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div key={method.value}>
                        <RadioGroupItem
                          value={method.value}
                          id={method.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={method.value}
                          className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                        >
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-medium">{method.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* 发票信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  发票信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={invoiceType} onValueChange={(value) => setInvoiceType(value as typeof invoiceType)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">不需要发票</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal">个人发票</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">企业发票</Label>
                    </div>
                  </div>
                </RadioGroup>

                {invoiceType !== 'none' && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <Label htmlFor="invoiceTitle">发票抬头 *</Label>
                      <Input
                        id="invoiceTitle"
                        value={invoiceInfo.title}
                        onChange={(e) => setInvoiceInfo(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={invoiceType === 'personal' ? '个人' : '请输入公司名称'}
                        required
                      />
                    </div>
                    {invoiceType === 'company' && (
                      <div>
                        <Label htmlFor="taxNumber">纳税人识别号 *</Label>
                        <Input
                          id="taxNumber"
                          value={invoiceInfo.taxNumber}
                          onChange={(e) => setInvoiceInfo(prev => ({ ...prev, taxNumber: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="invoiceEmail">发票邮箱</Label>
                      <Input
                        id="invoiceEmail"
                        type="email"
                        value={invoiceInfo.email}
                        onChange={(e) => setInvoiceInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="用于接收电子发票"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 订单备注 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  订单备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="如有特殊要求，请在此说明（可选）"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* 右侧订单摘要 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  订单详情
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 商品列表 */}
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">暂无</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.model}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">x{item.quantity}</span>
                          <span className="text-sm font-medium text-red-600">
                            ¥{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 价格汇总 */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品小计</span>
                    <span>¥{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className="text-green-600">
                      {shippingFee === 0 ? '免运费' : `¥${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal >= 500 && (
                    <div className="text-xs text-green-600">满500元免运费</div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>合计</span>
                    <span className="text-red-600">¥{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* 配送信息 */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">配送信息</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    预计2-3个工作日送达
                  </p>
                  {selectedAddress && (
                    <p className="text-xs text-blue-700 mt-1">
                      送至：{selectedAddress.city} {selectedAddress.district}
                    </p>
                  )}
                </div>

                {/* 提交订单 */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={!selectedAddress || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      处理中...
                    </>
                  ) : (
                    <>
                      提交订单
                      <span className="ml-2">¥{total.toFixed(2)}</span>
                    </>
                  )}
                </Button>

                {!selectedAddress && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <div className="text-amber-800 text-sm">
                      请先选择收货地址
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
