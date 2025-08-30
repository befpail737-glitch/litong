import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project configuration')
}

// 客户端配置
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false, // 禁用CDN以获取最新数据
})

// 图片URL构建器 (简化版本)
export const urlFor = (source: any) => ({
  url: () => source?.asset?._ref ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${source.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : '/placeholder-image.jpg',
  width: (w: number) => ({ url: () => urlFor(source).url() }),
  height: (h: number) => ({ url: () => urlFor(source).url() })
})

// 查询函数
export async function getProducts(limit?: number) {
  const query = `*[_type == "product"] | order(_createdAt desc) ${limit ? `[0..${limit - 1}]` : ''} {
    _id,
    _createdAt,
    partNumber,
    name,
    nameEn,
    brand->{name, nameEn, slug},
    category->{name, nameEn, slug},
    subcategory->{name, nameEn, slug},
    description,
    package,
    specifications,
    features,
    applications,
    pricing,
    stock,
    leadTime,
    tags,
    images,
    datasheet,
    slug
  }`
  
  return await client.fetch(query)
}

export async function getProduct(partNumber: string) {
  const query = `*[_type == "product" && partNumber == $partNumber][0] {
    _id,
    _createdAt,
    partNumber,
    name,
    nameEn,
    brand->{name, nameEn, slug, description, website, country, founded},
    category->{name, nameEn, slug, description},
    subcategory->{name, nameEn, slug, description},
    description,
    package,
    specifications,
    features,
    applications,
    pricing,
    stock,
    leadTime,
    tags,
    images,
    datasheet,
    slug
  }`
  
  return await client.fetch(query, { partNumber })
}

export async function getProductsByCategory(categorySlug: string, limit?: number) {
  const query = `*[_type == "product" && (category->slug.current == $categorySlug || subcategory->slug.current == $categorySlug)] 
    | order(_createdAt desc) ${limit ? `[0..${limit - 1}]` : ''} {
    _id,
    _createdAt,
    partNumber,
    name,
    nameEn,
    brand->{name, nameEn, slug},
    category->{name, nameEn, slug},
    subcategory->{name, nameEn, slug},
    description,
    package,
    specifications,
    pricing,
    stock,
    tags,
    images,
    slug
  }`
  
  return await client.fetch(query, { categorySlug })
}

export async function getProductCategories() {
  const query = `*[_type == "productCategory"] | order(sort asc, name asc) {
    _id,
    name,
    nameEn,
    slug,
    description,
    sort,
    _createdAt
  }`
  
  return await client.fetch(query)
}

export async function getBrands(limit?: number) {
  const query = `*[_type == "brand"] | order(name asc) ${limit ? `[0..${limit - 1}]` : ''} {
    _id,
    name,
    nameEn,
    slug,
    description,
    website,
    country,
    founded,
    logo,
    _createdAt
  }`
  
  return await client.fetch(query)
}

export async function getBrand(slug: string) {
  const query = `*[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    nameEn,
    slug,
    description,
    website,
    country,
    founded,
    logo,
    _createdAt
  }`
  
  return await client.fetch(query, { slug })
}

export async function getSolutions(category?: string, limit?: number) {
  let query = `*[_type == "solution"]`
  
  if (category && category !== 'all') {
    query += ` && category == "${category}"`
  }
  
  query += ` | order(_createdAt desc)`
  
  if (limit) {
    query += ` [0..${limit - 1}]`
  }
  
  query += ` {
    _id,
    title,
    titleEn,
    summary,
    content,
    category,
    tags,
    author,
    publishDate,
    _createdAt,
    _updatedAt,
    slug,
    featured,
    images
  }`
  
  return await client.fetch(query)
}

export async function getSolution(slug: string) {
  const query = `*[_type == "solution" && slug.current == $slug][0] {
    _id,
    title,
    titleEn,
    summary,
    content,
    category,
    tags,
    author,
    publishDate,
    _createdAt,
    _updatedAt,
    slug,
    featured,
    images
  }`
  
  return await client.fetch(query, { slug })
}

export async function getArticles(type?: string, limit?: number) {
  let query = `*[_type in ["selectionGuide", "applicationNote", "troubleshooting", "productReview"]]`
  
  if (type) {
    query = `*[_type == "${type}"]`
  }
  
  query += ` | order(_createdAt desc)`
  
  if (limit) {
    query += ` [0..${limit - 1}]`
  }
  
  query += ` {
    _id,
    _type,
    title,
    titleEn,
    summary,
    content,
    category,
    tags,
    author->{name, title},
    publishedAt,
    readTime,
    difficulty,
    featured,
    _createdAt,
    slug,
    images
  }`
  
  return await client.fetch(query)
}

export async function getArticle(slug: string) {
  const query = `*[_type in ["selectionGuide", "applicationNote", "troubleshooting", "productReview"] && slug.current == $slug][0] {
    _id,
    _type,
    title,
    titleEn,
    summary,
    content,
    category,
    tags,
    author->{name, title},
    publishedAt,
    readTime,
    difficulty,
    featured,
    _createdAt,
    slug,
    images
  }`
  
  return await client.fetch(query, { slug })
}

export async function getNews(type?: string, limit?: number) {
  let query = `*[_type in ["companyNews", "industryNews"]]`
  
  if (type) {
    query = `*[_type == "${type}"]`
  }
  
  query += ` | order(publishedAt desc)`
  
  if (limit) {
    query += ` [0..${limit - 1}]`
  }
  
  query += ` {
    _id,
    _type,
    title,
    titleEn,
    summary,
    content,
    publishedAt,
    author->{name, title},
    tags,
    featured,
    _createdAt,
    slug,
    images
  }`
  
  return await client.fetch(query)
}

export async function searchProducts(searchTerm: string, filters?: any) {
  const query = `*[_type == "product" && (
    partNumber match $searchTerm + "*" ||
    name match "*" + $searchTerm + "*" ||
    description match "*" + $searchTerm + "*" ||
    tags[] match "*" + $searchTerm + "*"
  )] | order(_score desc) [0..49] {
    _id,
    partNumber,
    name,
    nameEn,
    brand->{name, nameEn, slug},
    category->{name, nameEn, slug},
    description,
    pricing,
    stock,
    tags,
    slug,
    _score
  }`
  
  return await client.fetch(query, { searchTerm })
}

// 数据导入函数
export async function importProductsFromExcel(products: any[]) {
  const mutations = products.map(product => ({
    create: {
      _type: 'product',
      ...product,
      _id: undefined // 让Sanity自动生成ID
    }
  }))
  
  return await client
    .transaction(mutations)
    .commit()
}

export async function importBrandsFromExcel(brands: any[]) {
  const mutations = brands.map(brand => ({
    create: {
      _type: 'brand',
      ...brand,
      _id: undefined
    }
  }))
  
  return await client
    .transaction(mutations)
    .commit()
}

export async function importSolutionsFromExcel(solutions: any[]) {
  const mutations = solutions.map(solution => ({
    create: {
      _type: 'solution',
      ...solution,
      _id: undefined
    }
  }))
  
  return await client
    .transaction(mutations)
    .commit()
}

// 批量创建文档
export async function createDocuments(documents: any[], documentType: string) {
  const mutations = documents.map(doc => ({
    create: {
      _type: documentType,
      ...doc,
      _id: undefined
    }
  }))
  
  return await client
    .transaction(mutations)
    .commit()
}