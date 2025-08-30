// Sanity CMS integration
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oquvb2bs'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false // Set to true for production
})

// Data fetching functions
export const getBrands = async () => {
  const query = `*[_type == "brand" && isActive == true] | order(sortOrder asc, name asc) {
    _id,
    name,
    nameEn,
    slug,
    description,
    logo,
    website,
    country,
    founded,
    isActive,
    sortOrder
  }`
  
  try {
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export const getProducts = async (limit = 50) => {
  const query = `*[_type == "product" && isActive == true] | order(_createdAt desc) [0...$limit] {
    _id,
    partNumber,
    name,
    description,
    brand->{
      name,
      slug
    },
    subcategory->{
      name,
      slug,
      category->{
        name,
        slug
      }
    },
    specifications,
    stock,
    price,
    status,
    slug
  }`
  
  try {
    return await client.fetch(query, { limit })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getSolutions = async (limit = 10) => {
  const query = `*[_type == "solution" && isActive == true] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    titleEn,
    slug,
    summary,
    content,
    featuredImage,
    category,
    relatedProducts[]->{
      partNumber,
      name,
      brand->{
        name
      }
    },
    publishedAt,
    isActive
  }`
  
  try {
    return await client.fetch(query, { limit })
  } catch (error) {
    console.error('Error fetching solutions:', error)
    return []
  }
}

export const getNews = async (limit = 10) => {
  const query = `*[(_type == "companyNews" || _type == "industryNews") && isActive == true] | order(publishedAt desc) [0...$limit] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author->{
      name
    },
    publishedAt,
    isActive
  }`
  
  try {
    return await client.fetch(query, { limit })
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

// Image URL builder (simplified)
export const urlFor = (source: any) => {
  if (!source || !source.asset) {
    return {
      width: (w: number) => ({ url: () => '/placeholder-image.jpg' }),
      height: (h: number) => ({ url: () => '/placeholder-image.jpg' }),
      url: () => '/placeholder-image.jpg'
    }
  }
  
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${source.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
  
  return {
    width: (w: number) => ({ 
      url: () => `${baseUrl}?w=${w}&auto=format&fit=crop` 
    }),
    height: (h: number) => ({ 
      url: () => `${baseUrl}?h=${h}&auto=format&fit=crop` 
    }),
    url: () => `${baseUrl}?auto=format`
  }
}

export default client