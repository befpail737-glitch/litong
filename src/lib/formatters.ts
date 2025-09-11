import { Locale } from '@/i18n'

// 货币映射配置
const currencyMap: Record<Locale, string> = {
  'zh-CN': 'CNY',
  'zh-TW': 'TWD',
  'en': 'USD',
  'ja': 'JPY',
  'ko': 'KRW',
  'de': 'EUR',
  'fr': 'EUR',
  'es': 'EUR',
  'ru': 'RUB',
  'ar': 'AED', // 阿联酋迪拉姆，常用于阿拉伯地区
}

// 数字格式化配置
const numberFormatOptions: Record<Locale, Intl.NumberFormatOptions> = {
  'zh-CN': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'zh-TW': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'en': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'ja': { minimumFractionDigits: 0, maximumFractionDigits: 0 }, // 日语通常不显示小数
  'ko': { minimumFractionDigits: 0, maximumFractionDigits: 0 }, // 韩语通常不显示小数
  'de': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'fr': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'es': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'ru': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  'ar': { minimumFractionDigits: 0, maximumFractionDigits: 2 },
}

/**
 * 格式化数字
 */
export function formatNumber(value: number, locale: Locale): string {
  try {
    const formatter = new Intl.NumberFormat(locale, numberFormatOptions[locale])
    return formatter.format(value)
  } catch (error) {
    console.warn(`Failed to format number for locale ${locale}:`, error)
    return value.toString()
  }
}

/**
 * 格式化货币
 */
export function formatCurrency(value: number, locale: Locale, currency?: string): string {
  try {
    const targetCurrency = currency || currencyMap[locale] || 'USD'
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    return formatter.format(value)
  } catch (error) {
    console.warn(`Failed to format currency for locale ${locale}:`, error)
    return `${value} ${currency || currencyMap[locale] || 'USD'}`
  }
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, locale: Locale, decimals: number = 1): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    return formatter.format(value / 100) // 输入应该是0-100的数字
  } catch (error) {
    console.warn(`Failed to format percent for locale ${locale}:`, error)
    return `${value}%`
  }
}

/**
 * 格式化日期 - 短格式
 */
export function formatDateShort(date: Date, locale: Locale): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return formatter.format(date)
  } catch (error) {
    console.warn(`Failed to format date for locale ${locale}:`, error)
    return date.toLocaleDateString()
  }
}

/**
 * 格式化日期 - 长格式
 */
export function formatDateLong(date: Date, locale: Locale): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
    return formatter.format(date)
  } catch (error) {
    console.warn(`Failed to format date for locale ${locale}:`, error)
    return date.toLocaleDateString()
  }
}

/**
 * 格式化时间
 */
export function formatTime(date: Date, locale: Locale, includeSeconds: boolean = false): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: locale === 'en', // 英语使用12小时制，其他使用24小时制
    })
    return formatter.format(date)
  } catch (error) {
    console.warn(`Failed to format time for locale ${locale}:`, error)
    return date.toLocaleTimeString()
  }
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date, locale: Locale): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: locale === 'en',
    })
    return formatter.format(date)
  } catch (error) {
    console.warn(`Failed to format datetime for locale ${locale}:`, error)
    return date.toLocaleString()
  }
}

/**
 * 格式化相对时间（如：2小时前，3天前）
 */
export function formatRelativeTime(date: Date, locale: Locale): string {
  try {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'long',
    })

    // 定义时间单位（秒）
    const units = [
      { unit: 'year' as const, seconds: 31536000 },
      { unit: 'month' as const, seconds: 2592000 },
      { unit: 'week' as const, seconds: 604800 },
      { unit: 'day' as const, seconds: 86400 },
      { unit: 'hour' as const, seconds: 3600 },
      { unit: 'minute' as const, seconds: 60 },
      { unit: 'second' as const, seconds: 1 },
    ]

    for (const { unit, seconds } of units) {
      const interval = Math.floor(diffInSeconds / seconds)
      if (interval >= 1) {
        return rtf.format(-interval, unit)
      }
    }

    return rtf.format(0, 'second') // 刚刚
  } catch (error) {
    console.warn(`Failed to format relative time for locale ${locale}:`, error)
    return formatDateShort(date, locale)
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number, locale: Locale): string {
  try {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: unitIndex === 0 ? 0 : 1,
    })

    return `${formatter.format(size)} ${units[unitIndex]}`
  } catch (error) {
    console.warn(`Failed to format file size for locale ${locale}:`, error)
    return `${bytes} B`
  }
}

/**
 * 格式化数量单位（如：1K, 1M）
 */
export function formatCompactNumber(value: number, locale: Locale): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    })
    return formatter.format(value)
  } catch (error) {
    console.warn(`Failed to format compact number for locale ${locale}:`, error)
    return formatNumber(value, locale)
  }
}