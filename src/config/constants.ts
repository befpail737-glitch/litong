// 应用级常量配置 - 不涉及环境变量的静态配置
export const APP_CONSTANTS = {
  // 支持的语言
  SUPPORTED_LOCALES: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'ar'] as const,
  DEFAULT_LOCALE: 'zh-CN' as const,

  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // 图片配置
  DEFAULT_IMAGE_QUALITY: 80,
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'png', 'webp', 'auto'] as const,
  FALLBACK_IMAGE: '/images/placeholder.svg',

  // 品牌相关
  MAX_FEATURED_BRANDS: 10,
  MAX_BRAND_PRODUCTS_PREVIEW: 8,
  MAX_BRAND_SOLUTIONS_PREVIEW: 6,
  MAX_BRAND_ARTICLES_PREVIEW: 4,

  // 搜索配置
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 100,
  SEARCH_DEBOUNCE_MS: 300,

  // URL相关
  SLUG_VALIDATION_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  MAX_SLUG_LENGTH: 100,

  // 错误重试配置
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,

  // 内容限制
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  BRAND_NOT_FOUND: '品牌未找到',
  PRODUCT_NOT_FOUND: '产品未找到',
  SOLUTION_NOT_FOUND: '解决方案未找到',
  ARTICLE_NOT_FOUND: '文章未找到',
  NETWORK_ERROR: '网络错误，请稍后重试',
  VALIDATION_ERROR: '数据验证失败',
  UNAUTHORIZED: '未授权访问',
  SERVER_ERROR: '服务器错误',
} as const;

// 成功消息常量
export const SUCCESS_MESSAGES = {
  DATA_LOADED: '数据加载成功',
  INQUIRY_SUBMITTED: '询价提交成功',
  SUBSCRIPTION_SUCCESS: '订阅成功',
} as const;

// API路径常量
export const API_PATHS = {
  BRANDS: '/api/brands',
  PRODUCTS: '/api/products',
  SOLUTIONS: '/api/solutions',
  ARTICLES: '/api/articles',
  INQUIRY: '/api/inquiry',
  SEARCH: '/api/search',
} as const;

// 外部链接
export const EXTERNAL_LINKS = {
  COMPANY_WEBSITE: 'https://www.litongelectronics.com',
  SUPPORT_EMAIL: 'support@litongelectronics.com',
  SALES_EMAIL: 'sales@litongelectronics.com',
} as const;