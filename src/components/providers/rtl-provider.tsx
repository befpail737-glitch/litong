'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import { getDirection, isRTL } from '@/lib/rtl'

interface RTLProviderProps {
  children: React.ReactNode
}

export function RTLProvider({ children }: RTLProviderProps) {
  const locale = useLocale()

  useEffect(() => {
    const direction = getDirection(locale)
    const htmlElement = document.documentElement
    
    // 设置HTML元素的dir属性
    htmlElement.setAttribute('dir', direction)
    htmlElement.setAttribute('lang', locale)
    
    // 添加RTL相关的CSS类
    if (isRTL(locale)) {
      htmlElement.classList.add('rtl')
      htmlElement.classList.remove('ltr')
    } else {
      htmlElement.classList.add('ltr')
      htmlElement.classList.remove('rtl')
    }

    // 设置CSS自定义属性用于样式计算
    htmlElement.style.setProperty('--direction', direction)
    htmlElement.style.setProperty('--start', isRTL(locale) ? 'right' : 'left')
    htmlElement.style.setProperty('--end', isRTL(locale) ? 'left' : 'right')
  }, [locale])

  return <>{children}</>
}