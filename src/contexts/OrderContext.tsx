'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 订单状态类型
export type OrderStatus =
  | 'pending'      // 待确认
  | 'confirmed'    // 已确认
  | 'processing'   // 处理中
  | 'shipped'      // 已发货
  | 'delivered'    // 已送达
  | 'cancelled'    // 已取消
  | 'refunded'     // 已退款

// 支付状态类型
export type PaymentStatus =
  | 'pending'      // 待支付
  | 'processing'   // 支付处理中
  | 'completed'    // 支付完成
  | 'failed'       // 支付失败
  | 'refunded'     // 已退款

// 支付方式类型
export type PaymentMethod =
  | 'alipay'       // 支付宝
  | 'wechat'       // 微信支付
  | 'bank_transfer'// 银行转账
  | 'credit_card'  // 信用卡

// 订单商品项
export interface OrderItem {
  id: string
  productId: string
  name: string
  model: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  specifications?: string
  brand?: string
  imageUrl?: string
}

// 收货地址
export interface ShippingAddress {
  id: string
  recipientName: string
  phone: string
  company?: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string
  isDefault: boolean
}

// 订单详情
export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod

  // 订单商品
  items: OrderItem[]

  // 价格信息
  subtotal: number        // 小计
  shippingFee: number     // 运费
  discount: number        // 折扣
  totalAmount: number     // 总金额

  // 地址信息
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress

  // 时间戳
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  shippedAt?: string
  deliveredAt?: string

  // 备注和追踪
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string

  // 发票信息
  invoiceInfo?: {
    type: 'personal' | 'company'
    title: string
    taxNumber?: string
    email?: string
  }
}

// 购物车项
export interface CartItem {
  id: string
  productId: string
  name: string
  model: string
  sku: string
  quantity: number
  unitPrice: number
  specifications?: string
  brand?: string
  imageUrl?: string
  stock: number
  minOrderQuantity?: number
}

// 订单上下文类型
interface OrderContextType {
  // 购物车状态
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number

  // 订单状态
  orders: Order[]
  currentOrder: Order | null

  // 购物车操作
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void

  // 订单操作
  createOrder: (orderData: CreateOrderData) => Promise<{ success: boolean; orderId?: string; error?: string }>
  getOrder: (orderId: string) => Promise<Order | null>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{ success: boolean; error?: string }>
  cancelOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; error?: string }>

  // 支付操作
  processPayment: (orderId: string, paymentMethod: PaymentMethod) => Promise<{ success: boolean; error?: string }>

  // 地址管理
  addresses: ShippingAddress[]
  addAddress: (address: Omit<ShippingAddress, 'id'>) => Promise<{ success: boolean; error?: string }>
  updateAddress: (addressId: string, address: Partial<ShippingAddress>) => Promise<{ success: boolean; error?: string }>
  deleteAddress: (addressId: string) => Promise<{ success: boolean; error?: string }>
  setDefaultAddress: (addressId: string) => Promise<{ success: boolean; error?: string }>

  // 工具函数
  getOrderStatusText: (status: OrderStatus) => string
  getPaymentStatusText: (status: PaymentStatus) => string
}

// 创建订单数据类型
export interface CreateOrderData {
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  notes?: string
  invoiceInfo?: Order['invoiceInfo']
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// 订单状态文本映射
const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
  refunded: '已退款'
};

// 支付状态文本映射
const PAYMENT_STATUS_MAP: Record<PaymentStatus, string> = {
  pending: '待支付',
  processing: '支付处理中',
  completed: '支付完成',
  failed: '支付失败',
  refunded: '已退款'
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);

  // 从本地存储加载数据
  useEffect(() => {
    const savedCart = localStorage.getItem('litong_cart');
    const savedOrders = localStorage.getItem('litong_orders');
    const savedAddresses = localStorage.getItem('litong_addresses');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load orders from localStorage:', error);
      }
    }

    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('Failed to load addresses from localStorage:', error);
      }
    }
  }, []);

  // 保存购物车到本地存储
  useEffect(() => {
    localStorage.setItem('litong_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 保存订单到本地存储
  useEffect(() => {
    localStorage.setItem('litong_orders', JSON.stringify(orders));
  }, [orders]);

  // 保存地址到本地存储
  useEffect(() => {
    localStorage.setItem('litong_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // 计算购物车统计
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // 购物车操作
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const existingItem = cartItems.find(cartItem =>
      cartItem.productId === item.productId && cartItem.sku === item.sku
    );

    if (existingItem) {
      updateCartItemQuantity(existingItem.id, existingItem.quantity + item.quantity);
    } else {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      setCartItems(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 订单操作
  const createOrder = async (orderData: CreateOrderData): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      const orderId = 'ORD' + Date.now().toString();
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const shippingFee = subtotal > 500 ? 0 : 50; // 满500包邮

      const newOrder: Order = {
        id: orderId,
        orderNumber: orderId,
        userId: 'current_user', // 实际使用时从用户context获取
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map(item => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          productId: item.productId,
          name: item.name,
          model: item.model,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          specifications: item.specifications,
          brand: item.brand,
          imageUrl: item.imageUrl
        })),
        subtotal,
        shippingFee,
        discount: 0,
        totalAmount: subtotal + shippingFee,
        shippingAddress: orderData.shippingAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: orderData.notes,
        invoiceInfo: orderData.invoiceInfo
      };

      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);

      return { success: true, orderId };
    } catch (error) {
      return { success: false, error: '创建订单失败，请重试' };
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    return orders.find(order => order.id === orderId) || null;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: '更新订单状态失败' };
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: 'cancelled' as OrderStatus,
                updatedAt: new Date().toISOString(),
                notes: reason ? `${order.notes || ''}\n取消原因: ${reason}`.trim() : order.notes
              }
            : order
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: '取消订单失败' };
    }
  };

  const processPayment = async (orderId: string, paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> => {
    try {
      // 模拟支付处理
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                paymentStatus: 'processing' as PaymentStatus,
                paymentMethod,
                updatedAt: new Date().toISOString()
              }
            : order
        )
      );

      // 模拟异步支付结果
      setTimeout(() => {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  paymentStatus: 'completed' as PaymentStatus,
                  status: 'confirmed' as OrderStatus,
                  confirmedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : order
          )
        );
      }, 2000);

      return { success: true };
    } catch (error) {
      return { success: false, error: '支付处理失败' };
    }
  };

  // 地址管理
  const addAddress = async (address: Omit<ShippingAddress, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const newAddress: ShippingAddress = {
        ...address,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };

      // 如果是默认地址，取消其他地址的默认状态
      if (newAddress.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }

      setAddresses(prev => [...prev, newAddress]);
      return { success: true };
    } catch (error) {
      return { success: false, error: '添加地址失败' };
    }
  };

  const updateAddress = async (addressId: string, addressData: Partial<ShippingAddress>): Promise<{ success: boolean; error?: string }> => {
    try {
      // 如果设置为默认地址，取消其他地址的默认状态
      if (addressData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }

      setAddresses(prev =>
        prev.map(addr =>
          addr.id === addressId ? { ...addr, ...addressData } : addr
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: '更新地址失败' };
    }
  };

  const deleteAddress = async (addressId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      return { success: true };
    } catch (error) {
      return { success: false, error: '删除地址失败' };
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<{ success: boolean; error?: string }> => {
    return updateAddress(addressId, { isDefault: true });
  };

  // 工具函数
  const getOrderStatusText = (status: OrderStatus): string => {
    return ORDER_STATUS_MAP[status] || status;
  };

  const getPaymentStatusText = (status: PaymentStatus): string => {
    return PAYMENT_STATUS_MAP[status] || status;
  };

  const value: OrderContextType = {
    // 购物车状态
    cartItems,
    cartCount,
    cartTotal,

    // 订单状态
    orders,
    currentOrder,

    // 购物车操作
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,

    // 订单操作
    createOrder,
    getOrder,
    updateOrderStatus,
    cancelOrder,

    // 支付操作
    processPayment,

    // 地址管理
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,

    // 工具函数
    getOrderStatusText,
    getPaymentStatusText
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
