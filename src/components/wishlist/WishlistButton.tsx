'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  productName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  showText?: boolean
}

// 模拟本地存储的心愿单管理
const WISHLIST_STORAGE_KEY = 'litong_wishlist'

const getWishlist = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const setWishlist = (wishlist: string[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
  } catch {
    // 静默处理存储错误
  }
}

export function WishlistButton({
  productId,
  productName,
  size = 'md',
  variant = 'outline',
  className,
  showText = true,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const wishlist = getWishlist()
    setIsInWishlist(wishlist.includes(productId))
  }, [productId])

  const handleToggleWishlist = async () => {
    setIsLoading(true)
    
    try {
      const currentWishlist = getWishlist()
      let newWishlist: string[]
      
      if (isInWishlist) {
        // 从心愿单移除
        newWishlist = currentWishlist.filter(id => id !== productId)
        setIsInWishlist(false)
        
        // 显示提示信息
        if (productName) {
          // 这里可以添加一个 toast 通知
          console.log(`已将 ${productName} 从心愿单移除`)
        }
      } else {
        // 添加到心愿单
        newWishlist = [...currentWishlist, productId]
        setIsInWishlist(true)
        
        // 显示提示信息
        if (productName) {
          // 这里可以添加一个 toast 通知
          console.log(`已将 ${productName} 添加到心愿单`)
        }
      }
      
      setWishlist(newWishlist)
      
      // 触发自定义事件，通知其他组件心愿单已更新
      window.dispatchEvent(new CustomEvent('wishlistUpdated', {
        detail: { productId, isInWishlist: !isInWishlist }
      }))
      
    } catch (error) {
      console.error('更新心愿单失败:', error)
      // 恢复状态
      setIsInWishlist(!isInWishlist)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm', 
    lg: 'h-10 w-10 text-base',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        !showText && sizeClasses[size],
        isInWishlist && variant === 'outline' && 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100',
        isInWishlist && variant === 'ghost' && 'text-red-600 hover:bg-red-50',
        className
      )}
      title={isInWishlist ? '从心愿单移除' : '添加到心愿单'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isInWishlist ? 'fill-current text-red-500' : 'text-gray-400 hover:text-red-500',
          showText && 'mr-2'
        )} 
      />
      {showText && (
        <span className={isLoading ? 'opacity-50' : ''}>
          {isLoading ? '...' : isInWishlist ? '已收藏' : '收藏'}
        </span>
      )}
    </Button>
  )
}

// 心愿单数量获取 hook
export function useWishlistCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const wishlist = getWishlist()
      setCount(wishlist.length)
    }

    // 初始化计数
    updateCount()

    // 监听心愿单更新事件
    window.addEventListener('wishlistUpdated', updateCount)
    
    return () => {
      window.removeEventListener('wishlistUpdated', updateCount)
    }
  }, [])

  return count
}

// 心愿单管理工具函数
export const wishlistUtils = {
  getWishlist,
  setWishlist,
  addToWishlist: (productId: string) => {
    const current = getWishlist()
    if (!current.includes(productId)) {
      setWishlist([...current, productId])
      window.dispatchEvent(new CustomEvent('wishlistUpdated', {
        detail: { productId, isInWishlist: true }
      }))
    }
  },
  removeFromWishlist: (productId: string) => {
    const current = getWishlist()
    setWishlist(current.filter(id => id !== productId))
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { productId, isInWishlist: false }
    }))
  },
  isInWishlist: (productId: string) => {
    return getWishlist().includes(productId)
  },
  clearWishlist: () => {
    setWishlist([])
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { cleared: true }
    }))
  }
}