import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types';

// 公开客户端（不需要token）- 硬编码配置确保一致性
export const client = createClient({
  projectId: 'oquvb2bs', // 直接硬编码
  dataset: 'production', // 直接硬编码
  apiVersion: '2023-05-03', // 使用最新API版本
  useCdn: false, // 禁用CDN以获取最新数据
  perspective: 'published', // 只获取已发布的内容
  // 不使用token进行公开访问
});

// 带认证的客户端（用于需要权限的操作）
export const authenticatedClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
  ignoreBrowserTokenWarning: true,
});

// 预览模式客户端（包含草稿）
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts', // 包含草稿内容
});

// 获取客户端实例
export function getClient(preview?: boolean) {
  return preview ? previewClient : client;
}

// 图片URL构建器
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// 常用GROQ查询片段
export const GROQ_FRAGMENTS = {
  // 产品基础信息
  productBase: `
    _id,
    _type,
    partNumber,
    "slug": slug.current,
    title,
    shortDescription,
    image,
    brand->{
      name,
      "slug": slug.current,
      logo
    },
    category->{
      name,
      "slug": slug.current
    },
    pricing,
    inventory,
    isActive,
    isFeatured,
    isNew,
    _createdAt,
    _updatedAt
  `,

  // 产品详细信息
  productDetail: `
    _id,
    _type,
    partNumber,
    "slug": slug.current,
    title,
    description,
    shortDescription,
    image,
    gallery,
    brand->{
      name,
      "slug": slug.current,
      logo
    },
    category->{
      name,
      "slug": slug.current
    },
    subcategory->{
      name,
      "slug": slug.current
    },
    specifications,
    pricing,
    inventory,
    documents,
    isActive,
    isFeatured,
    isNew,
    seoTitle,
    seoDescription,
    seoKeywords,
    _createdAt,
    _updatedAt
  `,

  // 品牌信息
  brand: `
    _id,
    name,
    "slug": slug.current,
    logo,
    description,
    website,
    country,
    isActive,
    isFeatured
  `,

  // 分类信息
  category: `
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    image,
    level,
    sortOrder,
    isVisible
  `,

  // 文章信息
  article: `
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    image,
    author->{
      name,
      "slug": slug.current,
      avatar
    },
    relatedBrands[]->{
      _id,
      name,
      "slug": slug.current,
      logo
    },
    category->{
      name,
      "slug": slug.current
    },
    tags,
    readTime,
    difficulty,
    publishedAt,
    isPublished,
    isFeatured
  `,

  // 解决方案信息
  solution: `
    _id,
    title,
    "slug": slug.current,
    summary,
    description,
    coverImage,
    primaryBrand->{
      _id,
      name,
      "slug": slug.current,
      logo
    },
    relatedBrands[]->{
      _id,
      name,
      "slug": slug.current,
      logo
    },
    targetMarket,
    complexity,
    publishedAt,
    isPublished,
    isFeatured,
    viewCount,
    _createdAt,
    _updatedAt
  `,
};

// 错误处理
export class SanityError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SanityError';
  }
}

// 重试机制
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Maximum retries exceeded');
}

// 检查文档发布状态
export async function checkDocumentPublishStatus(documentId: string, documentType: string) {
  try {
    const query = `*[_id == $documentId && _type == $documentType][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      "publishedVersion": *[_id == path("drafts." + ^._id)][0],
      "hasDraft": defined(*[_id == path("drafts." + ^._id)][0])
    }`;

    const result = await withRetry(() => client.fetch(query, { documentId, documentType }));

    return {
      exists: !!result,
      isPublished: !!result && !result.hasDraft,
      hasDraft: result?.hasDraft || false,
      publishedVersion: result?.publishedVersion,
      lastUpdated: result?._updatedAt
    };
  } catch (error) {
    console.error('Error checking document publish status:', error);
    return {
      exists: false,
      isPublished: false,
      hasDraft: false,
      publishedVersion: null,
      lastUpdated: null
    };
  }
}

// 验证品牌-产品关联
export async function validateBrandProductAssociation(brandSlug: string, productId?: string) {
  try {
    const brandQuery = `*[_type == "brandBasic" && slug.current == $brandSlug && !(_id in path("drafts.**"))][0] {
      _id,
      name,
      "slug": slug.current,
      isActive,
      "productCount": count(*[_type == "product" && brand._ref == ^._id && !(_id in path("drafts.**")) && isActive == true])
    }`;

    const brand = await withRetry(() => client.fetch(brandQuery, { brandSlug }));

    if (productId) {
      const productQuery = `*[_id == $productId && !(_id in path("drafts.**"))][0] {
        _id,
        brand,
        isActive,
        "brandSlug": brand->slug.current
      }`;

      const product = await withRetry(() => client.fetch(productQuery, { productId }));

      return {
        brandExists: !!brand,
        brandActive: brand?.isActive || false,
        productCount: brand?.productCount || 0,
        productExists: !!product,
        productActive: product?.isActive || false,
        associationValid: product?.brandSlug === brandSlug
      };
    }

    return {
      brandExists: !!brand,
      brandActive: brand?.isActive || false,
      productCount: brand?.productCount || 0,
      productExists: null,
      productActive: null,
      associationValid: null
    };
  } catch (error) {
    console.error('Error validating brand-product association:', error);
    return {
      brandExists: false,
      brandActive: false,
      productCount: 0,
      productExists: false,
      productActive: false,
      associationValid: false
    };
  }
}
