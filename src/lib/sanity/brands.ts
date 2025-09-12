import { client, GROQ_FRAGMENTS } from './client';

export interface Brand {
  _id: string
  name: string
  description?: string
  website?: string
  country?: string
  isActive: boolean
  isFeatured?: boolean
  slug?: string
  logo?: any
  headquarters?: string
  established?: string
}

// 获取所有品牌
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const query = `*[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brands = await client.fetch(query);
    return brands || [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// 获取特色品牌
export async function getFeaturedBrands(): Promise<Brand[]> {
  try {
    const query = `*[_type == "brandBasic" && isActive == true && isFeatured == true && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brands = await client.fetch(query);
    return brands || [];
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    return [];
  }
}

// 根据名称获取品牌
export async function getBrandByName(name: string): Promise<Brand | null> {
  try {
    const query = `*[_type == "brandBasic" && name == $name && isActive == true && !(_id in path("drafts.**"))][0] {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brand = await client.fetch(query, { name });
    return brand || null;
  } catch (error) {
    console.error('Error fetching brand by name:', error);
    return null;
  }
}

// 根据slug获取品牌数据
export async function getBrandData(slug: string): Promise<Brand | null> {
  try {
    const query = `*[_type == "brandBasic" && slug.current == $slug && isActive == true && !(_id in path("drafts.**"))][0] {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brand = await client.fetch(query, { slug });
    return brand || null;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return null;
  }
}

// 获取按分类分组的品牌数据
export async function getBrandsByCategories() {
  try {
    const query = `{
      "brandCategories": *[_type == "productCategory" && level == 1 && isVisible == true] | order(sortOrder asc, name asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        icon,
        "brands": array::unique(*[_type == "product" && isActive == true && category._ref == ^._id].brand->)[defined(@) && isActive == true] | order(name asc) {
          _id,
          name,
          "slug": slug.current,
          description,
          website,
          country,
          headquarters,
          established,
          logo,
          isActive,
          isFeatured
        }
      },
      "allBrands": *[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        website,
        country,
        headquarters,
        established,
        logo,
        isActive,
        isFeatured
      }
    }`;

    const result = await client.fetch(query);
    
    // 过滤掉没有品牌的分类
    const validCategories = result?.brandCategories?.filter(cat => cat.brands && cat.brands.length > 0) || [];
    
    return {
      brandCategories: validCategories,
      allBrands: result?.allBrands || []
    };
  } catch (error) {
    console.error('Error fetching brands by categories:', error);
    return {
      brandCategories: [],
      allBrands: []
    };
  }
}

// 获取品牌统计数据
export async function getBrandStats() {
  try {
    const query = `{
      "total": count(*[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))]),
      "featured": count(*[_type == "brandBasic" && isActive == true && isFeatured == true && !(_id in path("drafts.**"))]),
      "solutions": count(*[_type == "solution" && isPublished == true && !(_id in path("drafts.**"))])
    }`;

    const stats = await client.fetch(query);
    return {
      total: stats?.total || 0,
      authorized: stats?.featured || 0,
      totalProducts: stats?.solutions || 0 * 1000, // 估算产品数量
    };
  } catch (error) {
    console.error('Error fetching brand stats:', error);
    return {
      total: 0,
      authorized: 0,
      totalProducts: 0,
    };
  }
}
