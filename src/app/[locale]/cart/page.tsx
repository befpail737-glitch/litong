'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOrder } from '@/contexts/OrderContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ShoppingBag,
  AlertCircle
} from 'lucide-react'

export default function CartPage() {
  const { 
    cartItems, 
    cartCount, 
    cartTotal, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart 
  } = useOrder()
  
  const [selectedItems, setSelectedItems] = useState<string[]>(cartItems.map(item => item.id))
  const [isLoading, setIsLoading] = useState(false)

  // 选中商品的统计
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const selectedCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTotal = selectedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === itemId)
    if (!item) return
    
    if (newQuantity < 1) {
      removeFromCart(itemId)
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    } else if (newQuantity <= item.stock) {
      updateCartItemQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveSelected = async () => {
    setIsLoading(true)
    selectedItems.forEach(itemId => {
      removeFromCart(itemId)
    })
    setSelectedItems([])
    setIsLoading(false)
  }

  const handleClearAll = async () => {
    if (confirm('确定要清空购物车吗？')) {
      setIsLoading(true)
      clearCart()
      setSelectedItems([])
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">购物车是空的</h2>
            <p className="text-gray-600 mb-8">去逛逛，找些你喜欢的商品吧</p>
            <Button asChild size="lg">
              <Link href="/products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                去购物
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            购物车 
            <Badge variant="secondary" className="ml-2">
              {cartCount} 件商品
            </Badge>
          </h1>
          <p className="text-gray-600 mt-2">管理您选择的商品，确认后进行结算</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 购物车商品列表 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 操作栏 */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <Checkbox
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="ml-2 text-sm font-medium">全选</span>
                    </label>
                    <span className="text-sm text-gray-600">
                      已选 {selectedItems.length} 项
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRemoveSelected}
                      disabled={selectedItems.length === 0 || isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除选中
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearAll}
                      disabled={isLoading}
                    >
                      清空购物车
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 商品列表 */}
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* 选择框 */}
                    <div className="pt-2">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </div>

                    {/* 商品图片 */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">
                          暂无图片
                        </div>
                      )}
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600">型号：{item.model}</p>
                          {item.specifications && (
                            <p className="text-sm text-gray-600">规格：{item.specifications}</p>
                          )}
                          {item.brand && (
                            <p className="text-sm text-gray-600">品牌：{item.brand}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              库存 {item.stock}
                            </Badge>
                            {item.minOrderQuantity && (
                              <Badge variant="secondary" className="text-xs">
                                起订量 {item.minOrderQuantity}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* 价格和操作 */}
                        <div className="text-right">
                          <div className="text-xl font-semibold text-red-600 mb-2">
                            ¥{(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            单价：¥{item.unitPrice.toFixed(2)}
                          </div>
                          
                          {/* 数量控制 */}
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1
                                handleQuantityChange(item.id, value)
                              }}
                              className="w-16 text-center"
                              min="1"
                              max={item.stock}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* 库存不足警告 */}
                      {item.quantity > item.stock && (
                        <Alert className="mt-3 border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4" />
                          <div className="text-red-800 text-sm">
                            库存不足，当前库存仅 {item.stock} 件
                          </div>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 结算区域 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>结算信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">已选商品</span>
                    <span>{selectedCount} 件</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品总价</span>
                    <span>¥{selectedTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className="text-green-600">
                      {selectedTotal >= 500 ? '免运费' : '¥50.00'}
                    </span>
                  </div>
                  {selectedTotal >= 500 && (
                    <div className="text-xs text-green-600">
                      满500元免运费
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>合计</span>
                      <span className="text-red-600">
                        ¥{(selectedTotal + (selectedTotal >= 500 ? 0 : 50)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={selectedItems.length === 0}
                  asChild
                >
                  <Link href="/checkout">
                    立即结算
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/products">
                      继续购物
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}