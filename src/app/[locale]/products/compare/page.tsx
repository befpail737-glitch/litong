'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCompare } from '@/components/product/ProductCompare'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// 模拟产品数据（实际应用中应该从API获取）
const mockProductsData = {
  '1': {
    id: '1',
    partNumber: 'STM32F401RET6',
    title: 'STM32F401RET6 ARM Cortex-M4 微控制器',
    shortDescription: '84MHz ARM Cortex-M4 内核，512KB Flash，96KB SRAM',
    image: '/images/products/stm32f401.jpg',
    brand: { name: 'STMicroelectronics', slug: 'stmicroelectronics' },
    category: { name: '微控制器', slug: 'microcontrollers' },
    pricing: {
      tiers: [{ quantity: 1, price: 25.50 }],
      currency: 'CNY'
    },
    specifications: [
      { name: '内核', value: 'ARM Cortex-M4', unit: '', category: 'basic' },
      { name: '主频', value: '84', unit: 'MHz', category: 'basic' },
      { name: 'Flash存储器', value: '512', unit: 'KB', category: 'basic' },
      { name: 'SRAM', value: '96', unit: 'KB', category: 'basic' },
      { name: '工作电压', value: '1.7-3.6', unit: 'V', category: 'electrical' },
      { name: '工作温度', value: '-40 to +85', unit: '°C', category: 'environmental' },
      { name: '封装', value: 'LQFP64', unit: '', category: 'mechanical' },
    ],
    inventory: { status: 'in_stock' as const },
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  '2': {
    id: '2',
    partNumber: 'STM32F103C8T6',
    title: 'STM32F103C8T6 ARM Cortex-M3 微控制器',
    shortDescription: '72MHz ARM Cortex-M3 内核，64KB Flash，20KB SRAM',
    brand: { name: 'STMicroelectronics', slug: 'stmicroelectronics' },
    category: { name: '微控制器', slug: 'microcontrollers' },
    pricing: {
      tiers: [{ quantity: 1, price: 18.80 }],
      currency: 'CNY'
    },
    specifications: [
      { name: '内核', value: 'ARM Cortex-M3', unit: '', category: 'basic' },
      { name: '主频', value: '72', unit: 'MHz', category: 'basic' },
      { name: 'Flash存储器', value: '64', unit: 'KB', category: 'basic' },
      { name: 'SRAM', value: '20', unit: 'KB', category: 'basic' },
      { name: '工作电压', value: '2.0-3.6', unit: 'V', category: 'electrical' },
      { name: '工作温度', value: '-40 to +85', unit: '°C', category: 'environmental' },
      { name: '封装', value: 'LQFP48', unit: '', category: 'mechanical' },
    ],
    inventory: { status: 'in_stock' as const },
    isActive: true,
  },
  '3': {
    id: '3',
    partNumber: 'ESP32-WROOM-32',
    title: 'ESP32-WROOM-32 WiFi+蓝牙模块',
    shortDescription: '双核240MHz，WiFi+蓝牙，4MB Flash',
    brand: { name: 'Espressif', slug: 'espressif' },
    category: { name: '无线模块', slug: 'wireless-modules' },
    pricing: {
      tiers: [{ quantity: 1, price: 32.00 }],
      currency: 'CNY'
    },
    specifications: [
      { name: '内核', value: 'Xtensa LX6', unit: '', category: 'basic' },
      { name: '主频', value: '240', unit: 'MHz', category: 'basic' },
      { name: 'Flash存储器', value: '4096', unit: 'KB', category: 'basic' },
      { name: 'SRAM', value: '520', unit: 'KB', category: 'basic' },
      { name: '工作电压', value: '3.0-3.6', unit: 'V', category: 'electrical' },
      { name: '工作温度', value: '-40 to +85', unit: '°C', category: 'environmental' },
      { name: '封装', value: 'SMD', unit: '', category: 'mechanical' },
    ],
    inventory: { status: 'low_stock' as const },
    isFeatured: true,
    isActive: true,
  }
}

export default function ProductComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // 从URL参数获取产品ID列表
    const productIds = searchParams.get('ids')?.split(',') || []
    const validProducts = productIds
      .map(id => mockProductsData[id as keyof typeof mockProductsData])
      .filter(Boolean)
    
    setProducts(validProducts)
  }, [searchParams])

  const handleRemoveProduct = (productId: string) => {
    const newProducts = products.filter(p => p.id !== productId)
    setProducts(newProducts)
    
    // 更新URL
    const newIds = newProducts.map(p => p.id).join(',')
    if (newIds) {
      router.replace(`/products/compare?ids=${newIds}`)
    } else {
      router.replace('/products')
    }
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleClose} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">产品对比</h1>
          <p className="text-gray-600 mt-1">
            详细对比产品规格，帮助您做出最佳选择
          </p>
        </div>
      </div>

      {/* 产品比较组件 */}
      <ProductCompare
        products={products}
        onRemoveProduct={handleRemoveProduct}
        onClose={handleClose}
      />
    </div>
  )
}