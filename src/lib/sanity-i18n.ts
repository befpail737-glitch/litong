import { Locale } from '@/i18n'

/**
 * 从本地化字段中获取特定语言的值
 */
export function getLocalizedValue(
  localizedField: any,
  locale: Locale,
  fallbackLocale: Locale = 'zh-CN'
): string {
  if (!localizedField || typeof localizedField !== 'object') {
    return ''
  }
  
  // 转换locale格式 (zh-CN -> zhCN, zh-TW -> zhTW)
  const sanityLocale = locale.replace('-', '')
  const sanityFallback = fallbackLocale.replace('-', '')
  
  // 首先尝试获取请求的语言
  if (localizedField[sanityLocale]) {
    return localizedField[sanityLocale]
  }
  
  // 然后尝试获取默认语言
  if (localizedField[sanityFallback]) {
    return localizedField[sanityFallback]
  }
  
  // 最后获取任何可用的值
  const availableValues = Object.values(localizedField).filter(Boolean)
  return (availableValues[0] as string) || ''
}

/**
 * 从本地化富文本字段中获取特定语言的值
 */
export function getLocalizedRichText(
  localizedField: any,
  locale: Locale,
  fallbackLocale: Locale = 'zh-CN'
): any[] {
  if (!localizedField || typeof localizedField !== 'object') {
    return []
  }
  
  // 首先尝试获取请求的语言
  if (localizedField[locale] && Array.isArray(localizedField[locale])) {
    return localizedField[locale]
  }
  
  // 然后尝试获取默认语言
  if (localizedField[fallbackLocale] && Array.isArray(localizedField[fallbackLocale])) {
    return localizedField[fallbackLocale]
  }
  
  // 最后获取任何可用的值
  const availableValues = Object.values(localizedField).filter(value => 
    Array.isArray(value) && value.length > 0
  )
  return (availableValues[0] as any[]) || []
}

/**
 * 从本地化SEO字段中获取特定语言的值
 */
export function getLocalizedSEO(
  seoField: any,
  locale: Locale,
  fallbackLocale: Locale = 'zh-CN'
) {
  if (!seoField || typeof seoField !== 'object') {
    return {
      title: '',
      description: '',
      keywords: [],
      ogImage: null
    }
  }
  
  return {
    title: getLocalizedValue(seoField.title, locale, fallbackLocale),
    description: getLocalizedValue(seoField.description, locale, fallbackLocale),
    keywords: getLocalizedArray(seoField.keywords, locale, fallbackLocale),
    ogImage: seoField.ogImage || null
  }
}

/**
 * 从本地化数组字段中获取特定语言的值
 */
export function getLocalizedArray(
  localizedField: any,
  locale: Locale,
  fallbackLocale: Locale = 'zh-CN'
): string[] {
  if (!localizedField || typeof localizedField !== 'object') {
    return []
  }
  
  // 首先尝试获取请求的语言
  if (localizedField[locale] && Array.isArray(localizedField[locale])) {
    return localizedField[locale]
  }
  
  // 然后尝试获取默认语言
  if (localizedField[fallbackLocale] && Array.isArray(localizedField[fallbackLocale])) {
    return localizedField[fallbackLocale]
  }
  
  // 最后获取任何可用的值
  const availableValues = Object.values(localizedField).filter(value => 
    Array.isArray(value) && value.length > 0
  )
  return (availableValues[0] as string[]) || []
}

/**
 * 为Sanity查询构建本地化字段投影
 * 例如: buildLocalizedProjection('title') => 'title { zh-CN, zh-TW, en, ja, ko, de, fr, es, ru, ar }'
 */
export function buildLocalizedProjection(fieldName: string): string {
  const languages = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'ar']
  return `${fieldName} { ${languages.join(', ')} }`
}

/**
 * 为Sanity查询构建本地化SEO字段投影
 */
export function buildLocalizedSEOProjection(fieldName = 'seo'): string {
  return `${fieldName} {
    title { zh-CN, zh-TW, en, ja, ko, de, fr, es, ru, ar },
    description { zh-CN, zh-TW, en, ja, ko, de, fr, es, ru, ar },
    keywords { zh-CN, zh-TW, en, ja, ko, de, fr, es, ru, ar },
    ogImage
  }`
}

/**
 * 检查本地化字段是否为空
 */
export function isLocalizedFieldEmpty(localizedField: any): boolean {
  if (!localizedField || typeof localizedField !== 'object') {
    return true
  }
  
  return !Object.values(localizedField).some(value => 
    value && (typeof value === 'string' ? value.trim() : true)
  )
}

/**
 * 获取本地化字段中可用的语言列表
 */
export function getAvailableLanguages(localizedField: any): Locale[] {
  if (!localizedField || typeof localizedField !== 'object') {
    return []
  }
  
  return Object.keys(localizedField).filter(key => 
    localizedField[key] && (typeof localizedField[key] === 'string' 
      ? localizedField[key].trim() 
      : true)
  ) as Locale[]
}

/**
 * 为产品/品牌等实体创建本地化数据类型
 */
export interface LocalizedString {
  'zh-CN'?: string
  'zh-TW'?: string
  'en'?: string
  'ja'?: string
  'ko'?: string
  'de'?: string
  'fr'?: string
  'es'?: string
  'ru'?: string
  'ar'?: string
}

export interface LocalizedRichText {
  'zh-CN'?: any[]
  'zh-TW'?: any[]
  'en'?: any[]
  'ja'?: any[]
  'ko'?: any[]
  'de'?: any[]
  'fr'?: any[]
  'es'?: any[]
  'ru'?: any[]
  'ar'?: any[]
}

export interface LocalizedSEO {
  title?: LocalizedString
  description?: LocalizedString
  keywords?: {
    'zh-CN'?: string[]
    'zh-TW'?: string[]
    'en'?: string[]
    'ja'?: string[]
    'ko'?: string[]
    'de'?: string[]
    'fr'?: string[]
    'es'?: string[]
    'ru'?: string[]
    'ar'?: string[]
  }
  ogImage?: any
}