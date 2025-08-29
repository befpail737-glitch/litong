import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = 'oquvb2bs'
const dataset = 'production'
const apiVersion = '2024-01-01'

// 创建Sanity客户端
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 在生产环境中可以设置为true以使用CDN
  token: process.env.SANITY_API_TOKEN, // 服务端使用的token
})

// 创建图片URL构建器
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ查询函数
export async function getProducts(limit?: number) {
  const query = `
    *[_type == "product" && isActive == true] | order(partNumber asc) ${limit ? `[0...${limit}]` : ''} {
      _id,
      partNumber,
      name,
      brand,
      category->{
        _id,
        name,
        slug
      },
      subcategory->{
        _id,
        name,
        slug
      },
      description,
      package,
      specifications,
      features,
      applications,
      images,
      pricing,
      stock,
      leadTime,
      tags
    }
  `
  return await client.fetch(query)
}

export async function getProduct(partNumber: string) {
  const query = `
    *[_type == "product" && partNumber == $partNumber && isActive == true][0] {
      _id,
      partNumber,
      name,
      brand,
      category->{
        _id,
        name,
        slug
      },
      subcategory->{
        _id,
        name,
        slug
      },
      description,
      detailedDescription,
      package,
      specifications,
      features,
      applications,
      images,
      documents,
      pricing,
      stock,
      leadTime,
      tags,
      seoTitle,
      seoDescription
    }
  `
  return await client.fetch(query, { partNumber })
}

export async function getProductsByCategory(categorySlug: string, limit?: number) {
  const query = `
    *[_type == "product" && isActive == true && 
      (category->slug.current == $categorySlug || subcategory->slug.current == $categorySlug)] 
      | order(partNumber asc) ${limit ? `[0...${limit}]` : ''} {
      _id,
      partNumber,
      name,
      brand,
      category->{
        _id,
        name,
        slug
      },
      subcategory->{
        _id,
        name,
        slug
      },
      description,
      package,
      specifications,
      pricing,
      stock,
      leadTime,
      tags
    }
  `
  return await client.fetch(query, { categorySlug })
}

export async function getProductCategories() {
  const query = `
    *[_type == "productCategory" && isActive == true] | order(sort asc) {
      _id,
      name,
      nameEn,
      slug,
      description,
      icon,
      parent->{
        _id,
        name,
        slug
      },
      sort
    }
  `
  return await client.fetch(query)
}

export async function getArticles(type?: string, limit?: number) {
  const typeFilter = type ? ` && type == "${type}"` : ''
  const query = `
    *[_type == "article" && isPublished == true${typeFilter}] 
      | order(publishedAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
      title,
      slug,
      type,
      category,
      summary,
      featuredImage,
      author,
      tags,
      publishedAt,
      readTime,
      difficulty,
      isFeatured
    }
  `
  return await client.fetch(query)
}

export async function getArticle(slug: string) {
  const query = `
    *[_type == "article" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      slug,
      type,
      category,
      summary,
      featuredImage,
      content,
      author,
      tags,
      publishedAt,
      updatedAt,
      readTime,
      difficulty,
      relatedProducts[]->{
        _id,
        partNumber,
        name,
        description,
        pricing
      },
      relatedArticles[]->{
        _id,
        title,
        slug,
        summary,
        publishedAt
      },
      downloadableResources,
      seoTitle,
      seoDescription
    }
  `
  return await client.fetch(query, { slug })
}

export async function searchProducts(searchTerm: string, filters?: any) {
  const searchFilter = searchTerm 
    ? ` && (partNumber match "*${searchTerm}*" || name match "*${searchTerm}*" || description match "*${searchTerm}*")`
    : ''
  
  let categoryFilter = ''
  if (filters?.category) {
    categoryFilter = ` && (category->slug.current == "${filters.category}" || subcategory->slug.current == "${filters.category}")`
  }
  
  const query = `
    *[_type == "product" && isActive == true${searchFilter}${categoryFilter}] 
      | order(partNumber asc) {
      _id,
      partNumber,
      name,
      brand,
      category->{
        name,
        slug
      },
      subcategory->{
        name,
        slug
      },
      description,
      package,
      specifications,
      pricing,
      stock,
      leadTime
    }
  `
  
  return await client.fetch(query)
}

// Excel导入功能
export async function importProductsFromExcel(products: any[]) {
  const mutations = products.map(product => ({
    create: {
      _type: 'product',
      partNumber: product.partNumber,
      name: product.name,
      brand: product.brand,
      description: product.description,
      package: product.package,
      specifications: product.specifications || [],
      features: product.features || [],
      applications: product.applications || [],
      pricing: product.pricing || {},
      stock: product.stock || 0,
      leadTime: product.leadTime || 'inquiry',
      isActive: true,
      tags: product.tags || []
    }
  }))
  
  return await client
    .transaction()
    .create(mutations)
    .commit()
}