import { defineField, defineType } from 'sanity'

// 支持的语言列表
export const supportedLanguages = [
  { id: 'zhCN', title: '简体中文', isDefault: true },
  { id: 'zhTW', title: '繁體中文', isDefault: false },
  { id: 'en', title: 'English', isDefault: false },
  { id: 'ja', title: '日本語', isDefault: false },
  { id: 'ko', title: '한국어', isDefault: false },
  { id: 'de', title: 'Deutsch', isDefault: false },
  { id: 'fr', title: 'Français', isDefault: false },
  { id: 'es', title: 'Español', isDefault: false },
  { id: 'ru', title: 'Русский', isDefault: false },
  { id: 'ar', title: 'العربية', isDefault: false },
] as const

export type SupportedLanguage = typeof supportedLanguages[number]['id']
export const defaultLanguage = supportedLanguages.find(l => l.isDefault)!

/**
 * 创建本地化字符串字段
 */
export function localizedString(name: string, title: string, options: {
  description?: string
  validation?: (Rule: any) => any
  required?: boolean
  maxLength?: number
} = {}) {
  const { description, validation, required = false, maxLength } = options
  
  return defineField({
    name,
    title,
    type: 'object',
    description,
    validation: validation || (required ? (Rule) => Rule.required() : undefined),
    fieldsets: [
      {
        title: '翻译',
        name: 'translations',
        options: {
          collapsible: true,
          collapsed: false,
        },
      },
    ],
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: 'string',
      validation: (Rule: any) => {
        let rule = Rule
        if (lang.isDefault && required) {
          rule = rule.required()
        }
        if (maxLength) {
          rule = rule.max(maxLength)
        }
        return rule
      },
      fieldset: lang.isDefault ? undefined : 'translations',
    })),
    preview: {
      select: supportedLanguages.reduce((acc, lang) => {
        acc[lang.id] = `${lang.id}`
        return acc
      }, {} as Record<string, string>),
      prepare(selection: Record<string, string>) {
        const defaultValue = selection[defaultLanguage.id]
        const availableLanguages = Object.keys(selection).filter(key => selection[key])
        
        return {
          title: defaultValue || selection[availableLanguages[0]] || '未填写',
          subtitle: `可用语言: ${availableLanguages.length}/${supportedLanguages.length}`,
        }
      },
    },
  })
}

/**
 * 创建本地化文本字段
 */
export function localizedText(name: string, title: string, options: {
  description?: string
  validation?: (Rule: any) => any
  required?: boolean
  rows?: number
} = {}) {
  const { description, validation, required = false, rows = 4 } = options
  
  return defineField({
    name,
    title,
    type: 'object',
    description,
    validation: validation || (required ? (Rule) => Rule.required() : undefined),
    fieldsets: [
      {
        title: '翻译',
        name: 'translations',
        options: {
          collapsible: true,
          collapsed: false,
        },
      },
    ],
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: 'text',
      rows,
      validation: (Rule: any) => {
        if (lang.isDefault && required) {
          return Rule.required()
        }
        return Rule
      },
      fieldset: lang.isDefault ? undefined : 'translations',
    })),
    preview: {
      select: supportedLanguages.reduce((acc, lang) => {
        acc[lang.id] = `${lang.id}`
        return acc
      }, {} as Record<string, string>),
      prepare(selection: Record<string, string>) {
        const defaultValue = selection[defaultLanguage.id]
        const availableLanguages = Object.keys(selection).filter(key => selection[key])
        
        return {
          title: (defaultValue || selection[availableLanguages[0]] || '未填写').substring(0, 50) + '...',
          subtitle: `可用语言: ${availableLanguages.length}/${supportedLanguages.length}`,
        }
      },
    },
  })
}

/**
 * 创建本地化富文本字段
 */
export function localizedRichText(name: string, title: string, options: {
  description?: string
  validation?: (Rule: any) => any
  required?: boolean
} = {}) {
  const { description, validation, required = false } = options
  
  return defineField({
    name,
    title,
    type: 'object',
    description,
    validation: validation || (required ? (Rule) => Rule.required() : undefined),
    fieldsets: [
      {
        title: '翻译',
        name: 'translations',
        options: {
          collapsible: true,
          collapsed: false,
        },
      },
    ],
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '正文', value: 'normal' },
            { title: '标题1', value: 'h1' },
            { title: '标题2', value: 'h2' },
            { title: '标题3', value: 'h3' },
            { title: '标题4', value: 'h4' },
            { title: '引用', value: 'blockquote' },
          ],
          lists: [
            { title: '无序列表', value: 'bullet' },
            { title: '有序列表', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: '粗体', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下划线', value: 'underline' },
              { title: '删除线', value: 'strike-through' },
              { title: '代码', value: 'code' },
            ],
            annotations: [
              {
                title: '链接',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule: any) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: '在新窗口打开',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: false
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '替代文本',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: '图片说明'
            }
          ]
        }
      ],
      validation: (Rule: any) => {
        if (lang.isDefault && required) {
          return Rule.required()
        }
        return Rule
      },
      fieldset: lang.isDefault ? undefined : 'translations',
    })),
    preview: {
      select: supportedLanguages.reduce((acc, lang) => {
        acc[lang.id] = `${lang.id}`
        return acc
      }, {} as Record<string, string>),
      prepare(selection: Record<string, any>) {
        const defaultValue = selection[defaultLanguage.id]
        const availableLanguages = Object.keys(selection).filter(key => selection[key])
        
        return {
          title: '富文本内容',
          subtitle: `可用语言: ${availableLanguages.length}/${supportedLanguages.length}`,
        }
      },
    },
  })
}

/**
 * 创建本地化SEO字段组
 */
export function localizedSEO(name = 'seo', title = 'SEO设置') {
  return defineField({
    name,
    title,
    type: 'object',
    description: '搜索引擎优化设置',
    fields: [
      // SEO标题
      {
        name: 'title',
        title: 'SEO标题',
        type: 'object',
        fieldsets: [
          {
            title: '其他语言',
            name: 'translations',
            options: {
              collapsible: true,
              collapsed: true,
            },
          },
        ],
        fields: supportedLanguages.map((lang) => ({
          name: lang.id,
          title: lang.title,
          type: 'string',
          validation: (Rule: any) => Rule.max(60).warning('SEO标题建议不超过60个字符'),
          fieldset: lang.isDefault ? undefined : 'translations',
        })),
      },
      // SEO描述
      {
        name: 'description',
        title: 'SEO描述',
        type: 'object',
        fieldsets: [
          {
            title: '其他语言',
            name: 'translations',
            options: {
              collapsible: true,
              collapsed: true,
            },
          },
        ],
        fields: supportedLanguages.map((lang) => ({
          name: lang.id,
          title: lang.title,
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.max(160).warning('SEO描述建议不超过160个字符'),
          fieldset: lang.isDefault ? undefined : 'translations',
        })),
      },
      // 关键词
      {
        name: 'keywords',
        title: '关键词',
        type: 'object',
        fieldsets: [
          {
            title: '其他语言',
            name: 'translations',
            options: {
              collapsible: true,
              collapsed: true,
            },
          },
        ],
        fields: supportedLanguages.map((lang) => ({
          name: lang.id,
          title: lang.title,
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          },
          fieldset: lang.isDefault ? undefined : 'translations',
        })),
      },
      // Open Graph图片
      {
        name: 'ogImage',
        title: 'Open Graph图片',
        type: 'image',
        description: '社交媒体分享时显示的图片（建议1200x630px）',
        options: {
          hotspot: true
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: '替代文本'
          }
        ]
      }
    ]
  })
}

/**
 * 获取本地化值的工具函数（用于前端）
 */
export function getLocalizedValue(localizedField: any, locale: string, fallbackLocale = defaultLanguage.id): string {
  if (!localizedField) return ''
  
  // 首先尝试获取请求的语言
  if (localizedField[locale]) {
    return localizedField[locale]
  }
  
  // 然后尝试获取默认语言
  if (localizedField[fallbackLocale]) {
    return localizedField[fallbackLocale]
  }
  
  // 最后获取任何可用的值
  const availableValues = Object.values(localizedField).filter(Boolean)
  return availableValues[0] as string || ''
}