import { Locale, locales } from '@/i18n'
import { LocalizedString } from './sanity-i18n'

export interface TranslationIssue {
  type: 'missing' | 'empty' | 'length_mismatch' | 'invalid_format' | 'placeholder_mismatch'
  field: string
  locale: Locale
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

export interface TranslationStats {
  totalFields: number
  translatedFields: number
  completionRate: number
  issues: TranslationIssue[]
}

export interface ValidationRules {
  // 长度验证
  maxLength?: number
  minLength?: number
  // 长度差异警告阈值（与默认语言比较）
  lengthDifferenceThreshold?: number
  // 必需的占位符
  requiredPlaceholders?: string[]
  // 格式验证
  format?: 'email' | 'url' | 'phone' | 'html'
  // 是否为必填字段
  required?: boolean
}

/**
 * 翻译验证器类
 */
export class TranslationValidator {
  private defaultLocale: Locale = 'zh-CN'
  private issues: TranslationIssue[] = []

  constructor(defaultLocale: Locale = 'zh-CN') {
    this.defaultLocale = defaultLocale
  }

  /**
   * 验证本地化字段
   */
  validateField(
    field: LocalizedString | undefined,
    fieldName: string,
    rules: ValidationRules = {}
  ): TranslationIssue[] {
    this.issues = []

    if (!field) {
      if (rules.required) {
        this.issues.push({
          type: 'missing',
          field: fieldName,
          locale: this.defaultLocale,
          severity: 'error',
          message: `字段 "${fieldName}" 完全缺失`,
        })
      }
      return this.issues
    }

    const defaultValue = field[this.defaultLocale]

    // 检查默认语言是否存在
    if (rules.required && !defaultValue?.trim()) {
      this.issues.push({
        type: 'empty',
        field: fieldName,
        locale: this.defaultLocale,
        severity: 'error',
        message: `默认语言 (${this.defaultLocale}) 的 "${fieldName}" 为空`,
        suggestion: '请先填写默认语言的内容'
      })
    }

    // 验证每种语言
    locales.forEach(locale => {
      const value = field[locale]
      this.validateSingleField(value, fieldName, locale, rules, defaultValue)
    })

    return this.issues
  }

  /**
   * 验证单个语言的字段
   */
  private validateSingleField(
    value: string | undefined,
    fieldName: string,
    locale: Locale,
    rules: ValidationRules,
    defaultValue?: string
  ): void {
    // 检查是否为空
    if (!value?.trim()) {
      if (locale === this.defaultLocale && rules.required) {
        this.issues.push({
          type: 'empty',
          field: fieldName,
          locale,
          severity: 'error',
          message: `"${fieldName}" 在 ${locale} 中为空`,
        })
      } else if (locale !== this.defaultLocale && defaultValue?.trim()) {
        this.issues.push({
          type: 'empty',
          field: fieldName,
          locale,
          severity: 'warning',
          message: `"${fieldName}" 在 ${locale} 中未翻译`,
          suggestion: `参考默认语言内容: "${defaultValue.substring(0, 50)}..."`
        })
      }
      return
    }

    // 长度验证
    if (rules.minLength && value.length < rules.minLength) {
      this.issues.push({
        type: 'length_mismatch',
        field: fieldName,
        locale,
        severity: 'warning',
        message: `"${fieldName}" 在 ${locale} 中长度过短 (${value.length} < ${rules.minLength})`,
      })
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      this.issues.push({
        type: 'length_mismatch',
        field: fieldName,
        locale,
        severity: 'error',
        message: `"${fieldName}" 在 ${locale} 中长度过长 (${value.length} > ${rules.maxLength})`,
      })
    }

    // 与默认语言长度差异检查
    if (defaultValue && rules.lengthDifferenceThreshold && locale !== this.defaultLocale) {
      const lengthDiff = Math.abs(value.length - defaultValue.length)
      const threshold = defaultValue.length * rules.lengthDifferenceThreshold
      
      if (lengthDiff > threshold) {
        this.issues.push({
          type: 'length_mismatch',
          field: fieldName,
          locale,
          severity: 'info',
          message: `"${fieldName}" 在 ${locale} 中与默认语言长度差异较大 (差异: ${lengthDiff})`,
          suggestion: '请检查翻译是否完整或过于冗长'
        })
      }
    }

    // 占位符验证
    if (rules.requiredPlaceholders) {
      const missingPlaceholders = rules.requiredPlaceholders.filter(
        placeholder => !value.includes(placeholder)
      )
      
      if (missingPlaceholders.length > 0) {
        this.issues.push({
          type: 'placeholder_mismatch',
          field: fieldName,
          locale,
          severity: 'error',
          message: `"${fieldName}" 在 ${locale} 中缺少占位符: ${missingPlaceholders.join(', ')}`,
          suggestion: '请确保所有占位符都已包含在翻译中'
        })
      }
    }

    // 格式验证
    if (rules.format) {
      const isValidFormat = this.validateFormat(value, rules.format)
      if (!isValidFormat) {
        this.issues.push({
          type: 'invalid_format',
          field: fieldName,
          locale,
          severity: 'error',
          message: `"${fieldName}" 在 ${locale} 中格式无效 (期望格式: ${rules.format})`,
        })
      }
    }
  }

  /**
   * 格式验证
   */
  private validateFormat(value: string, format: string): boolean {
    switch (format) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'url':
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      case 'phone':
        return /^\+?[\d\s\-\(\)]{10,}$/.test(value)
      case 'html':
        // 简单的HTML标签平衡检查
        const openTags = (value.match(/<[^\/][^>]*>/g) || []).length
        const closeTags = (value.match(/<\/[^>]*>/g) || []).length
        return openTags === closeTags
      default:
        return true
    }
  }

  /**
   * 计算翻译完成度统计
   */
  static getTranslationStats(data: Record<string, LocalizedString>): TranslationStats {
    let totalFields = 0
    let translatedFields = 0
    const issues: TranslationIssue[] = []
    const validator = new TranslationValidator()

    Object.entries(data).forEach(([fieldName, field]) => {
      locales.forEach(locale => {
        totalFields++
        const value = field?.[locale]
        
        if (value?.trim()) {
          translatedFields++
        } else {
          // 为未翻译的字段创建问题记录
          issues.push({
            type: 'empty',
            field: fieldName,
            locale,
            severity: locale === 'zh-CN' ? 'error' : 'warning',
            message: `"${fieldName}" 在 ${locale} 中未翻译`,
          })
        }
      })

      // 验证每个字段
      const fieldIssues = validator.validateField(field, fieldName, { required: true })
      issues.push(...fieldIssues)
    })

    const completionRate = totalFields > 0 ? (translatedFields / totalFields) * 100 : 0

    return {
      totalFields,
      translatedFields,
      completionRate,
      issues: this.deduplicateIssues(issues),
    }
  }

  /**
   * 去重问题记录
   */
  private static deduplicateIssues(issues: TranslationIssue[]): TranslationIssue[] {
    const seen = new Set<string>()
    return issues.filter(issue => {
      const key = `${issue.type}-${issue.field}-${issue.locale}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * 批量验证多个字段
   */
  validateMultipleFields(
    data: Record<string, LocalizedString>,
    rules: Record<string, ValidationRules> = {}
  ): TranslationStats {
    const allIssues: TranslationIssue[] = []
    let totalFields = Object.keys(data).length * locales.length
    let translatedFields = 0

    Object.entries(data).forEach(([fieldName, field]) => {
      const fieldRules = rules[fieldName] || {}
      const fieldIssues = this.validateField(field, fieldName, fieldRules)
      allIssues.push(...fieldIssues)

      // 统计已翻译字段
      locales.forEach(locale => {
        if (field?.[locale]?.trim()) {
          translatedFields++
        }
      })
    })

    const completionRate = totalFields > 0 ? (translatedFields / totalFields) * 100 : 0

    return {
      totalFields,
      translatedFields,
      completionRate,
      issues: TranslationValidator.deduplicateIssues(allIssues),
    }
  }
}

/**
 * 预设验证规则
 */
export const validationRules = {
  // SEO标题
  seoTitle: {
    required: true,
    maxLength: 60,
    lengthDifferenceThreshold: 0.5,
  } as ValidationRules,

  // SEO描述
  seoDescription: {
    required: true,
    maxLength: 160,
    minLength: 50,
    lengthDifferenceThreshold: 0.3,
  } as ValidationRules,

  // 产品名称
  productName: {
    required: true,
    maxLength: 100,
    lengthDifferenceThreshold: 0.5,
  } as ValidationRules,

  // 产品描述
  productDescription: {
    required: true,
    minLength: 50,
    lengthDifferenceThreshold: 0.4,
  } as ValidationRules,

  // 品牌介绍
  brandDescription: {
    required: false,
    minLength: 100,
    lengthDifferenceThreshold: 0.3,
  } as ValidationRules,

  // 邮箱字段
  email: {
    required: true,
    format: 'email',
  } as ValidationRules,

  // URL字段
  website: {
    required: false,
    format: 'url',
  } as ValidationRules,

  // 包含占位符的文本
  withPlaceholders: (placeholders: string[]) => ({
    required: true,
    requiredPlaceholders: placeholders,
  }) as ValidationRules,
}