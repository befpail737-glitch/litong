// 全局类型定义
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 网站配置
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SITE_NAME: string;
      NEXT_PUBLIC_SITE_DESCRIPTION: string;

      // Sanity CMS
      NEXT_PUBLIC_SANITY_PROJECT_ID: string;
      NEXT_PUBLIC_SANITY_DATASET: string;
      SANITY_API_TOKEN: string;
      SANITY_PREVIEW_SECRET: string;
      SANITY_STUDIO_PREVIEW_URL: string;

      // 分析工具
      NEXT_PUBLIC_GA_ID?: string;
      VERCEL_ANALYTICS_ID?: string;

      // 其他配置
      DATABASE_URL?: string;
      REDIS_URL?: string;
      CDN_URL?: string;
      NEXT_PUBLIC_CDN_URL?: string;
    }
  }
}

// Sanity 相关类型
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// 产品相关类型
export interface Product extends SanityDocument {
  _type: 'product';
  partNumber: string;
  slug: SanitySlug;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: SanityImage;
  gallery?: SanityImage[];
  brand: Brand;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  specifications: ProductSpecification[];
  pricing?: ProductPricing;
  inventory?: ProductInventory;
  documents?: ProductDocuments;
  isActive: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Brand extends SanityDocument {
  _type: 'brand';
  name: string;
  slug: SanitySlug;
  logo?: SanityImage;
  description?: string;
  website?: string;
  country?: string;
  established?: number;
  headquarters?: string;
  isActive: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductCategory extends SanityDocument {
  _type: 'productCategory';
  name: string;
  slug: SanitySlug;
  description?: string;
  icon?: string;
  image?: SanityImage;
  parent?: ProductCategory;
  level: number;
  sortOrder?: number;
  isVisible: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductSubcategory extends SanityDocument {
  _type: 'productSubcategory';
  name: string;
  slug: SanitySlug;
  description?: string;
  category: ProductCategory;
  sortOrder?: number;
  isVisible: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
  category?: string;
  order?: number;
}

export interface ProductPricing {
  currency: string;
  tiers: PricingTier[];
  moq?: number; // 最小订购量
  leadTime?: string;
}

export interface PricingTier {
  quantity: number;
  price: number;
  unit?: string;
}

export interface ProductInventory {
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  warehouse?: string;
  lastUpdated: string;
}

export interface ProductDocuments {
  datasheet?: SanityDocument;
  applicationNotes?: SanityDocument[];
  certificates?: SanityDocument[];
  referenceDesigns?: SanityDocument[];
}

// 技术文章类型
export interface Article extends SanityDocument {
  _type: 'article';
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  content: any; // Portable Text
  image?: SanityImage;
  author: Author;
  category: ArticleCategory;
  tags?: string[];
  publishedAt: string;
  readingTime?: number;
  isPublished: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Author extends SanityDocument {
  _type: 'author';
  name: string;
  slug: SanitySlug;
  bio?: string;
  avatar?: SanityImage;
  position?: string;
  company?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface ArticleCategory extends SanityDocument {
  _type: 'articleCategory';
  name: string;
  slug: SanitySlug;
  description?: string;
  color?: string;
  isVisible: boolean;
}

// 解决方案类型
export interface Solution extends SanityDocument {
  _type: 'solution';
  title: string;
  slug: SanitySlug;
  description?: string;
  content: any; // Portable Text
  image?: SanityImage;
  industry: Industry;
  application: Application;
  products: Product[];
  bomList?: BOMItem[];
  benefits?: string[];
  specifications?: Record<string, string>;
  isPublished: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Industry extends SanityDocument {
  _type: 'industry';
  name: string;
  slug: SanitySlug;
  description?: string;
  icon?: string;
  isVisible: boolean;
}

export interface Application extends SanityDocument {
  _type: 'application';
  name: string;
  slug: SanitySlug;
  description?: string;
  industry: Industry;
  isVisible: boolean;
}

export interface BOMItem {
  product: Product;
  quantity: number;
  designator?: string;
  notes?: string;
}

// 询价相关类型
export interface Inquiry extends SanityDocument {
  _type: 'inquiry';
  inquiryNumber: string;
  type: InquiryType;
  status: InquiryStatus;
  customer: CustomerInfo;
  products: InquiryProduct[];
  message?: string;
  urgency: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
  quote?: Quote;
}

export type InquiryType = 'single_product' | 'bulk_order' | 'bom_quote' | 'sample_request';
export type InquiryStatus = 'pending' | 'processing' | 'quoted' | 'completed' | 'cancelled';
export type UrgencyLevel = 'low' | 'normal' | 'high' | 'urgent';

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  company: string;
  position?: string;
  country: string;
  address?: string;
  industry?: string;
}

export interface InquiryProduct {
  product: Product;
  quantity: number;
  targetPrice?: number;
  specifications?: Record<string, string>;
  notes?: string;
}

export interface Quote extends SanityDocument {
  _type: 'quote';
  quoteNumber: string;
  inquiry: Inquiry;
  items: QuoteItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  currency: string;
  validUntil: string;
  terms?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  leadTime?: string;
  notes?: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: Record<string, any>;
}

// 搜索相关类型
export interface SearchResult {
  results: SearchResultItem[];
  facets: SearchFacet[];
  total: number;
  query: string;
  executionTime: number;
}

export interface SearchResultItem {
  id: string;
  type: 'product' | 'brand' | 'article' | 'solution';
  title: string;
  description?: string;
  image?: string;
  url: string;
  highlights?: string[];
  score: number;
}

export interface SearchFacet {
  name: string;
  type: 'category' | 'brand' | 'specification' | 'price_range';
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

// 表单类型
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company: string;
  message: string;
  subject?: string;
}

export interface InquiryForm extends ContactForm {
  products: {
    productId: string;
    quantity: number;
    targetPrice?: number;
  }[];
  urgency: UrgencyLevel;
  bomFile?: File;
}

export interface NewsletterForm {
  email: string;
  name?: string;
  preferences?: string[];
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  company?: string;
  phone?: string;
  preferences?: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'customer' | 'guest';

export interface UserPreferences {
  language: string;
  currency: string;
  newsletter: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

// 配置类型
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  features: {
    newsletter: boolean;
    search: boolean;
    multiLanguage: boolean;
    darkMode: boolean;
  };
}

export {};
