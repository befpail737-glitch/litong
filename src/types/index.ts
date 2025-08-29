export interface Product {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: string;
  subcategory: string;
  parameters: Record<string, string>;
  package: string;
  datasheet?: string;
  image?: string;
  price?: number;
  stock: number;
  description?: string;
  specifications: ProductSpecification[];
}

export interface ProductSpecification {
  parameter: string;
  value: string;
  unit?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  website?: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  products?: Product[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'selection-guide' | 'application-note' | 'troubleshooting' | 'product-review';
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
  relatedArticles?: string[];
  relatedProducts?: string[];
}

export interface Author {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  experience: string;
}

export interface Solution {
  id: string;
  title: string;
  slug: string;
  industry: string;
  description: string;
  content: string;
  blockDiagram?: string;
  advantages: string[];
  bom: BOMItem[];
  applications: string[];
  publishedAt: string;
}

export interface BOMItem {
  partNumber: string;
  description: string;
  quantity: number;
  manufacturer: string;
  productId?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: 'company-news' | 'industry-news';
  publishedAt: string;
  featured?: boolean;
  tags: string[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}