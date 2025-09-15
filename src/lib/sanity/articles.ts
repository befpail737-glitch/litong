import { groq } from 'next-sanity';
import { client, withRetry } from './client';

// 文章基础字段
const ARTICLE_BASE_FIELDS = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  summary,
  content,
  featuredImage,
  author,
  publishedAt,
  readingTime,
  isActive,
  category->{
    _id,
    name,
    slug
  },
  tags,
  brand->{
    _id,
    name,
    slug
  }
`;

export async function getArticleBySlug(slug: string) {
  try {
    const query = groq`
      *[_type == "article" && slug.current == $slug && isActive == true][0] {
        ${ARTICLE_BASE_FIELDS}
      }
    `;

    const result = await withRetry(() => client.fetch(query, { slug }));
    return result;
  } catch (error) {
    console.error(`Error fetching article by slug "${slug}":`, error);
    return null;
  }
}

export async function getAllArticles() {
  try {
    const query = groq`
      *[_type == "article" && isActive == true] | order(publishedAt desc) {
        ${ARTICLE_BASE_FIELDS}
      }
    `;

    const result = await withRetry(() => client.fetch(query));
    return result || [];
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

export async function getArticles(params: {
  limit?: number
  offset?: number
  category?: string
  brand?: string
  featured?: boolean
} = {}) {
  const {
    limit = 12,
    offset = 0,
    category,
    brand,
    featured
  } = params;

  let filter = '_type == "article" && isActive == true && !(_id in path("drafts.**"))';

  if (category) {
    filter += ` && category->slug.current == "${category}"`;
  }

  if (brand) {
    filter += ` && brand->slug.current == "${brand}"`;
  }

  if (featured) {
    filter += ' && isFeatured == true';
  }

  const query = groq`
    {
      "articles": *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
        ${ARTICLE_BASE_FIELDS}
      },
      "total": count(*[${filter}])
    }
  `;

  try {
    const result = await withRetry(() => client.fetch(query));
    return result || { articles: [], total: 0 };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], total: 0 };
  }
}

export async function getBrandArticles(brandSlug: string, limit: number = 12) {
  try {
    const query = groq`
      *[_type == "article" &&
        isActive == true &&
        (brand->slug.current == $brandSlug || brand->name == $brandSlug)
      ] | order(publishedAt desc) [0...$limit] {
        ${ARTICLE_BASE_FIELDS}
      }
    `;

    const result = await withRetry(() => client.fetch(query, { brandSlug, limit }));
    return result || [];
  } catch (error) {
    console.error(`Error fetching articles for brand "${brandSlug}":`, error);
    return [];
  }
}