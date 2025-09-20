import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types';
import { getClientConfig, validateSanityConfig } from '@/config/sanity';

// 验证配置
validateSanityConfig();

// 公开客户端（不需要token）- 使用动态配置
export const client = createClient(getClientConfig(false));

// 带认证的客户端（用于需要权限的操作）
export const authenticatedClient = createClient({
  ...getClientConfig(false),
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
});

// 预览模式客户端（包含草稿）
export const previewClient = createClient(getClientConfig(true));

// 获取客户端实例
export function getClient(preview?: boolean) {
  return preview ? previewClient : client;
}

// 图片URL构建器
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// 文件类型检测和处理工具
export function getFileInfo(source: any | null | undefined): {
  type: string;
  extension: string;
  icon: string;
  size?: string;
  name?: string;
} {
  const defaultInfo = {
    type: 'unknown',
    extension: '',
    icon: 'file-text',
    size: undefined,
    name: 'Unknown File'
  };

  if (!source) return defaultInfo;

  // 从_ref中提取文件信息
  let ref = '';
  if (source.asset?._ref) {
    ref = source.asset._ref;
  } else if (source._ref) {
    ref = source._ref;
  }

  if (ref && ref.startsWith('file-')) {
    // 格式: file-{hash}-{extension}
    const parts = ref.split('-');
    if (parts.length >= 3) {
      const extension = parts[parts.length - 1].toLowerCase();

      let type = 'document';
      let icon = 'file-text';

      // 根据扩展名确定类型
      if (['pdf'].includes(extension)) {
        type = 'pdf';
        icon = 'file-text';
      } else if (['doc', 'docx'].includes(extension)) {
        type = 'word';
        icon = 'file-text';
      } else if (['xls', 'xlsx'].includes(extension)) {
        type = 'excel';
        icon = 'file-spreadsheet';
      } else if (['ppt', 'pptx'].includes(extension)) {
        type = 'powerpoint';
        icon = 'presentation';
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        type = 'archive';
        icon = 'archive';
      } else if (['txt', 'rtf'].includes(extension)) {
        type = 'text';
        icon = 'file-text';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        type = 'image';
        icon = 'image';
      } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
        type = 'video';
        icon = 'video';
      } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
        type = 'audio';
        icon = 'music';
      }

      // 获取文件大小（字节转换为可读格式）
      let sizeFormatted = source.size;
      if (typeof source.size === 'number') {
        const bytes = source.size;
        if (bytes === 0) {
          sizeFormatted = '0 B';
        } else {
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          sizeFormatted = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
      }

      return {
        type,
        extension,
        icon,
        size: sizeFormatted || undefined,
        name: source.title || source.originalFilename || source.name || `${type.toUpperCase()} 文档`
      };
    }
  }

  return defaultInfo;
}

// 统一的文件URL构建函数
export function safeFileUrl(
  source: any | null | undefined,
  options: {
    fallback?: string;
    projectId?: string;
    dataset?: string;
  } = {}
): string {
  const {
    fallback = '#',
    projectId = 'oquvb2bs',
    dataset = 'production'
  } = options;

  // 早期返回无效输入
  if (!source) {
    console.log('🗄️ [safeFileUrl] No source provided, using fallback');
    return fallback;
  }

  // 检查是否为静态路径字符串
  if (typeof source === 'string') {
    if (source.startsWith('/') || source.startsWith('http')) {
      console.log('🗄️ [safeFileUrl] Static path detected, returning as-is:', source);
      return source;
    }
  }

  try {
    // 处理完整的文件对象
    if (typeof source === 'object' && source !== null) {
      // 如果直接有url字段，优先使用
      if (source.url && typeof source.url === 'string') {
        console.log('🗄️ [safeFileUrl] Found direct URL:', source.url);
        return source.url;
      }

      // 处理asset对象
      if (source.asset) {
        // 检查asset.url
        if (source.asset.url && typeof source.asset.url === 'string') {
          console.log('🗄️ [safeFileUrl] Found asset URL:', source.asset.url);
          return source.asset.url;
        }

        // 检查asset._ref并构建CDN URL
        if (source.asset._ref && typeof source.asset._ref === 'string') {
          console.log('🗄️ [safeFileUrl] Building URL from _ref:', source.asset._ref);

          // 验证_ref格式
          if (source.asset._ref.startsWith('file-')) {
            // 从_ref构建文件URL
            // 格式: file-{hash}-{extension}
            const ref = source.asset._ref.replace('file-', '');
            const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${ref}`;

            console.log('🗄️ [safeFileUrl] Constructed file URL:', fileUrl);
            return fileUrl;
          } else if (source.asset._ref.startsWith('image-')) {
            // 处理错误归类的图片文件
            console.warn('⚠️ [safeFileUrl] Image asset found in file context, redirecting to image URL');
            const imageUrl = urlFor(source).url();
            console.log('🗄️ [safeFileUrl] Redirected to image URL:', imageUrl);
            return imageUrl;
          } else {
            console.warn('⚠️ [safeFileUrl] Invalid file _ref format:', source.asset._ref);
          }
        }
      }

      // 检查直接的_ref字段
      if (source._ref && typeof source._ref === 'string') {
        if (source._ref.startsWith('file-')) {
          const ref = source._ref.replace('file-', '');
          const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${ref}`;
          console.log('🗄️ [safeFileUrl] Constructed URL from direct _ref:', fileUrl);
          return fileUrl;
        }
      }
    }

    console.warn('⚠️ [safeFileUrl] Could not extract file URL, using fallback');
    return fallback;

  } catch (error) {
    console.error('❌ [safeFileUrl] Error building file URL:', error);
    console.error('❌ [safeFileUrl] Source:', source);
    return fallback;
  }
}

// 安全的图片URL构建器，带有错误处理
export function safeUrlFor(source: SanityImageSource | null | undefined): string | null {
  try {
    // 检查source是否有效
    if (!source) {
      return null;
    }

    // 检查是否为有效的图片对象
    if (typeof source === 'object' && '_type' in source) {
      if (source._type !== 'image') {
        console.warn('Invalid image type:', source._type);
        return null;
      }

      // 检查是否有资产引用
      if (!('asset' in source) || !source.asset) {
        console.warn('Image missing asset reference:', source);
        return null;
      }
    }

    // 尝试构建URL
    const imageBuilder = builder.image(source);
    if (!imageBuilder) {
      return null;
    }

    // 返回URL字符串
    return imageBuilder.url();
  } catch (error) {
    console.error('Error building image URL:', error, 'Source:', source);
    return null;
  }
}

// 带有尺寸和备用图片的安全图片URL构建器
export function safeImageUrl(
  source: SanityImageSource | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
    fallback?: string;
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto', fallback = '/images/placeholder-image.svg' } = options;

  // 早期返回无效输入
  if (!source) {
    console.log('🖼️ [safeImageUrl] No source provided, using fallback');
    return fallback;
  }

  // 检查是否为静态路径字符串（不是Sanity资产）
  if (typeof source === 'string') {
    // 如果是相对路径或绝对路径，直接返回
    if (source.startsWith('/') || source.startsWith('http')) {
      console.log('🖼️ [safeImageUrl] Static path detected, returning as-is:', source);
      return source;
    }
  }

  try {
    // 对于对象类型的source，进行详细验证
    if (typeof source === 'object' && source !== null) {
      // 检查是否为有效的Sanity图片对象
      if ('_type' in source) {
        if (source._type !== 'image') {
          console.warn(`⚠️ [safeImageUrl] Invalid image type: ${source._type}, using fallback`);
          return fallback;
        }

        // 检查asset引用
        if (!('asset' in source) || !source.asset) {
          console.warn('⚠️ [safeImageUrl] Image missing asset reference, using fallback');
          return fallback;
        }

        // 检查asset._ref格式
        if (typeof source.asset === 'object' && source.asset !== null) {
          if (!('_ref' in source.asset) || !source.asset._ref) {
            console.warn('⚠️ [safeImageUrl] Image asset missing _ref, using fallback');
            return fallback;
          }

          // 验证_ref格式 - 应该像 "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"
          const ref = source.asset._ref;
          if (typeof ref === 'string' && !ref.startsWith('image-')) {
            console.warn(`⚠️ [safeImageUrl] Invalid Sanity asset _ref format: ${ref}, using fallback`);
            return fallback;
          }
        }
      }
    }

    // 尝试构建安全URL
    const safeUrl = safeUrlFor(source);
    if (!safeUrl) {
      console.warn('⚠️ [safeImageUrl] safeUrlFor returned null, using fallback');
      return fallback;
    }

    // 构建图片URL
    let imageBuilder = builder.image(source);

    if (width) {
      imageBuilder = imageBuilder.width(width);
    }
    if (height) {
      imageBuilder = imageBuilder.height(height);
    }
    if (quality) {
      imageBuilder = imageBuilder.quality(quality);
    }
    if (format && format !== 'auto') {
      imageBuilder = imageBuilder.format(format);
    }

    const finalUrl = imageBuilder.url();
    if (!finalUrl) {
      console.warn('⚠️ [safeImageUrl] Image builder returned empty URL, using fallback');
      return fallback;
    }

    return finalUrl;
  } catch (error) {
    console.error('❌ [safeImageUrl] Error building image URL:', error);
    console.error('❌ [safeImageUrl] Source:', source);
    console.error('❌ [safeImageUrl] Options:', options);
    return fallback;
  }
}

// 常用GROQ查询片段
export const GROQ_FRAGMENTS = {
  // 产品基础信息 - 简化以避免Cloudflare超时
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
    isActive,
    isFeatured,
    isNew,
    _createdAt,
    _updatedAt
  `,

  // 产品详细信息 - 简化以避免Cloudflare超时
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

  // 简化的定价查询 - 仅在需要时单独获取
  pricing: `
    pricing{
      currency,
      tiers[0..2]{
        quantity,
        price,
        unit
      },
      moq,
      leadTime
    }
  `,

  // 简化的库存查询 - 仅在需要时单独获取
  inventory: `
    inventory{
      quantity,
      status,
      warehouse,
      lastUpdated
    }
  `,
};

// 错误处理
export class SanityError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SanityError';
  }
}

// 增强的重试机制 - 支持激进超时保护用于Cloudflare构建
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delay = 500,
  timeoutMs = 8000 // 8秒超时，激进防止Cloudflare构建挂起
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 包装函数以支持超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
      });

      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      console.error(`❌ [withRetry] Attempt ${i + 1}/${maxRetries} failed:`, error instanceof Error ? error.message : error);

      if (i === maxRetries - 1) {
        console.error(`🚨 [withRetry] All ${maxRetries} attempts failed, throwing error`);
        throw error;
      }

      const currentDelay = delay * Math.pow(2, i);
      console.log(`⏳ [withRetry] Retrying in ${currentDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
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

// 构建时图片验证函数
export function validateImageForBuild(imageSource: any): boolean {
  try {
    if (!imageSource) {
      return false;
    }

    // 检查基本结构
    if (typeof imageSource === 'object') {
      if (imageSource._type !== 'image') {
        console.warn('🖼️ [validateImageForBuild] Invalid image type:', imageSource._type);
        return false;
      }

      if (!imageSource.asset) {
        console.warn('🖼️ [validateImageForBuild] Missing asset reference');
        return false;
      }

      if (typeof imageSource.asset === 'object' && !imageSource.asset._ref) {
        console.warn('🖼️ [validateImageForBuild] Missing asset._ref');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.warn('🖼️ [validateImageForBuild] Validation error:', error);
    return false;
  }
}

// 批量验证产品图片
export async function validateProductImages(limit: number = 100) {
  try {
    console.log('🔍 开始验证产品图片...');

    const query = `*[_type == "product" && !(_id in path("drafts.**"))][0...${limit}] {
      _id,
      title,
      partNumber,
      image,
      gallery,
      brand->{
        name,
        logo
      }
    }`;

    const products = await client.fetch(query);

    const issues = [];

    products.forEach((product, index) => {
      console.log(`🔍 验证产品 ${index + 1}/${products.length}: ${product.title || product.partNumber}`);

      // 验证主图片
      if (product.image && !validateImageForBuild(product.image)) {
        issues.push({
          type: 'invalid_main_image',
          productId: product._id,
          productName: product.title || product.partNumber,
          image: product.image
        });
      }

      // 验证图库
      if (product.gallery && Array.isArray(product.gallery)) {
        product.gallery.forEach((img, imgIndex) => {
          if (!validateImageForBuild(img)) {
            issues.push({
              type: 'invalid_gallery_image',
              productId: product._id,
              productName: product.title || product.partNumber,
              galleryIndex: imgIndex,
              image: img
            });
          }
        });
      }

      // 验证品牌Logo
      if (product.brand?.logo && !validateImageForBuild(product.brand.logo)) {
        issues.push({
          type: 'invalid_brand_logo',
          productId: product._id,
          productName: product.title || product.partNumber,
          brandName: product.brand.name,
          image: product.brand.logo
        });
      }
    });

    console.log(`✅ 图片验证完成. 发现 ${issues.length} 个问题`);

    return {
      totalProducts: products.length,
      totalIssues: issues.length,
      issues: issues,
      summary: {
        invalidMainImages: issues.filter(i => i.type === 'invalid_main_image').length,
        invalidGalleryImages: issues.filter(i => i.type === 'invalid_gallery_image').length,
        invalidBrandLogos: issues.filter(i => i.type === 'invalid_brand_logo').length
      }
    };

  } catch (error) {
    console.error('❌ 图片验证失败:', error);
    throw error;
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

// 全面诊断产品发布状态
export async function diagnoseProductPublishStatus(options: {
  limit?: number,
  includeInactive?: boolean,
  includeDrafts?: boolean
} = {}) {
  const { limit = 10, includeInactive = false, includeDrafts = false } = options;

  try {
    console.log('🔍 开始产品发布状态诊断...');

    // 查询1: 检查所有产品（包括草稿和非激活）
    const allProductsQuery = `{
      "publishedProducts": *[_type == "product" && !(_id in path("drafts.**"))][0...${limit}] {
        _id,
        _type,
        partNumber,
        title,
        "slug": slug.current,
        isActive,
        isFeatured,
        "brand": brand->name,
        "brandSlug": brand->slug.current,
        "brandActive": brand->isActive,
        "category": category->name,
        "categorySlug": category->slug.current,
        pricing,
        inventory,
        _createdAt,
        _updatedAt,
        "hasDraft": defined(*[_id == path("drafts." + ^._id)][0])
      },
      "draftProducts": *[_id in path("drafts.**") && _type == "product"][0...${limit}] {
        _id,
        _type,
        partNumber,
        title,
        "slug": slug.current,
        isActive,
        isFeatured,
        "brand": brand->name,
        "brandSlug": brand->slug.current,
        "brandActive": brand->isActive,
        "category": category->name,
        "categorySlug": category->slug.current,
        pricing,
        inventory,
        _createdAt,
        _updatedAt
      },
      "stats": {
        "totalProducts": count(*[_type == "product"]),
        "publishedProducts": count(*[_type == "product" && !(_id in path("drafts.**"))]),
        "draftProducts": count(*[_id in path("drafts.**") && _type == "product"]),
        "activeProducts": count(*[_type == "product" && !(_id in path("drafts.**")) && isActive == true]),
        "inactiveProducts": count(*[_type == "product" && !(_id in path("drafts.**")) && isActive != true]),
        "featuredProducts": count(*[_type == "product" && !(_id in path("drafts.**")) && isFeatured == true]),
        "productsWithBrands": count(*[_type == "product" && !(_id in path("drafts.**")) && defined(brand)]),
        "productsWithoutBrands": count(*[_type == "product" && !(_id in path("drafts.**")) && !defined(brand)]),
        "productsWithCategories": count(*[_type == "product" && !(_id in path("drafts.**")) && defined(category)]),
        "productsWithoutCategories": count(*[_type == "product" && !(_id in path("drafts.**")) && !defined(category)])
      }
    }`;

    const allData = await withRetry(() => client.fetch(allProductsQuery));

    // 查询2: 检查品牌状态
    const brandQuery = `*[_type == "brandBasic"][0...20] {
      _id,
      name,
      "slug": slug.current,
      isActive,
      isFeatured,
      "productCount": count(*[_type == "product" && brand._ref == ^._id && !(_id in path("drafts.**"))]),
      "activeProductCount": count(*[_type == "product" && brand._ref == ^._id && !(_id in path("drafts.**")) && isActive == true])
    }`;

    const brands = await withRetry(() => client.fetch(brandQuery));

    // 查询3: 检查分类状态
    const categoryQuery = `*[_type == "productCategory"][0...20] {
      _id,
      name,
      "slug": slug.current,
      isVisible,
      "productCount": count(*[_type == "product" && category._ref == ^._id && !(_id in path("drafts.**"))]),
      "activeProductCount": count(*[_type == "product" && category._ref == ^._id && !(_id in path("drafts.**")) && isActive == true])
    }`;

    const categories = await withRetry(() => client.fetch(categoryQuery));

    // 数据完整性检查
    const dataIntegrityIssues = [];

    // 检查产品无品牌的情况
    allData.publishedProducts.forEach(product => {
      if (!product.brand) {
        dataIntegrityIssues.push({
          type: 'missing_brand',
          productId: product._id,
          productName: product.title || product.partNumber,
          issue: '产品缺少品牌关联'
        });
      }
      if (!product.category) {
        dataIntegrityIssues.push({
          type: 'missing_category',
          productId: product._id,
          productName: product.title || product.partNumber,
          issue: '产品缺少分类关联'
        });
      }
      if (product.brand && !product.brandActive) {
        dataIntegrityIssues.push({
          type: 'inactive_brand',
          productId: product._id,
          productName: product.title || product.partNumber,
          brandName: product.brand,
          issue: '产品关联的品牌未激活'
        });
      }
    });

    const result = {
      timestamp: new Date().toISOString(),
      query: {
        limit,
        includeInactive,
        includeDrafts
      },
      stats: allData.stats,
      publishedProducts: allData.publishedProducts,
      draftProducts: allData.draftProducts,
      brands: brands,
      categories: categories,
      dataIntegrityIssues: dataIntegrityIssues,
      summary: {
        totalIssues: dataIntegrityIssues.length,
        publishRatio: allData.stats.totalProducts > 0
          ? (allData.stats.publishedProducts / allData.stats.totalProducts * 100).toFixed(1) + '%'
          : '0%',
        activeRatio: allData.stats.publishedProducts > 0
          ? (allData.stats.activeProducts / allData.stats.publishedProducts * 100).toFixed(1) + '%'
          : '0%',
        mainIssues: [
          ...new Set(dataIntegrityIssues.map(issue => issue.type))
        ]
      }
    };

    console.log('✅ 产品诊断完成:', {
      总产品数: result.stats.totalProducts,
      已发布: result.stats.publishedProducts,
      草稿: result.stats.draftProducts,
      激活: result.stats.activeProducts,
      问题数量: result.dataIntegrityIssues.length
    });

    return result;

  } catch (error) {
    console.error('❌ 产品诊断失败:', error);
    throw new SanityError('产品发布状态诊断失败', 'DIAGNOSE_PRODUCT_ERROR');
  }
}

// 简化的产品查询测试（用于API连接验证）
export async function testProductQuery(queryType: 'basic' | 'detailed' | 'raw' = 'basic') {
  try {
    console.log(`🧪 测试产品查询 (${queryType})...`);

    const queries = {
      basic: `*[_type == "product" && isActive == true && !(_id in path("drafts.**"))][0...5] {
        _id,
        partNumber,
        title,
        isActive
      }`,

      detailed: `*[_type == "product" && isActive == true && !(_id in path("drafts.**"))][0...3] {
        ${GROQ_FRAGMENTS.productBase}
      }`,

      raw: `*[_type == "product"][0...10] {
        _id,
        _type,
        partNumber,
        title,
        isActive,
        "publishedVersion": !(_id in path("drafts.**")),
        "brand": brand->name,
        "category": category->name,
        _createdAt,
        _updatedAt
      }`
    };

    const startTime = Date.now();
    const result = await withRetry(() => client.fetch(queries[queryType]));
    const duration = Date.now() - startTime;

    console.log(`✅ 查询完成 (${duration}ms):`, {
      查询类型: queryType,
      返回数量: Array.isArray(result) ? result.length : 'N/A',
      首个结果: Array.isArray(result) && result.length > 0 ? result[0] : result
    });

    return {
      queryType,
      duration,
      resultCount: Array.isArray(result) ? result.length : 1,
      results: result,
      success: true,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ 查询测试失败 (${queryType}):`, error);
    return {
      queryType,
      duration: 0,
      resultCount: 0,
      results: null,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
