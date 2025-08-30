// Brand-specific data integration for product categories
import { client } from './sanity'

export interface BrandProduct {
  _id: string;
  partNumber: string;
  name: string;
  description: string;
  brand: {
    _id: string;
    name: string;
    nameEn: string;
    slug: { current: string };
  };
  subcategory: {
    _id: string;
    name: string;
    nameEn: string;
    slug: { current: string };
    category: {
      _id: string;
      name: string;
      nameEn: string;
      slug: { current: string };
    };
    specifications: Array<{
      parameterName: string;
      parameterNameEn: string;
      parameterType: 'text' | 'number' | 'select' | 'range' | 'boolean';
      unit?: string;
      options?: string[];
      isFilterable: boolean;
      isRequired: boolean;
      sortOrder: number;
    }>;
  };
  specifications: Array<{
    parameter: string;
    value: string;
    unit?: string;
  }>;
  stock: number;
  price?: {
    currency: string;
    amount: number;
    minQuantity: number;
  };
  status: 'active' | 'discontinued' | 'preview' | 'out_of_stock';
  slug: { current: string };
  isActive: boolean;
}

export interface BrandCategory {
  _id: string;
  name: string;
  nameEn: string;
  slug: { current: string };
  description: string;
  subcategories: Array<{
    _id: string;
    name: string;
    nameEn: string;
    slug: { current: string };
    description: string;
    productCount: number;
    specifications: Array<{
      parameterName: string;
      parameterNameEn: string;
      parameterType: 'text' | 'number' | 'select' | 'range' | 'boolean';
      unit?: string;
      options?: string[];
      isFilterable: boolean;
      isRequired: boolean;
      sortOrder: number;
    }>;
  }>;
  productCount: number;
}

// 获取品牌的所有产品分类
export async function getBrandCategories(brandSlug: string): Promise<BrandCategory[]> {
  const query = `
    *[_type == "productCategory" && count(*[_type == "product" && brand->slug.current == $brandSlug && subcategory->category->slug.current == ^.slug.current]) > 0] {
      _id,
      name,
      nameEn,
      slug,
      description,
      "subcategories": *[_type == "productSubcategory" && category._ref == ^._id && count(*[_type == "product" && brand->slug.current == $brandSlug && subcategory._ref == ^._id]) > 0] {
        _id,
        name,
        nameEn,
        slug,
        description,
        specifications,
        "productCount": count(*[_type == "product" && brand->slug.current == $brandSlug && subcategory._ref == ^._id && isActive == true])
      },
      "productCount": count(*[_type == "product" && brand->slug.current == $brandSlug && subcategory->category->slug.current == ^.slug.current && isActive == true])
    } | order(sortOrder asc, name asc)
  `;

  try {
    const categories = await client.fetch(query, { brandSlug });
    return categories;
  } catch (error) {
    console.error('Error fetching brand categories:', error);
    return [];
  }
}

// 获取品牌特定分类下的产品
export async function getBrandCategoryProducts(
  brandSlug: string, 
  categorySlug: string,
  subcategorySlug?: string
): Promise<BrandProduct[]> {
  const subcategoryFilter = subcategorySlug 
    ? `&& subcategory->slug.current == $subcategorySlug`
    : `&& subcategory->category->slug.current == $categorySlug`;
    
  const query = `
    *[_type == "product" && brand->slug.current == $brandSlug && isActive == true ${subcategoryFilter}] {
      _id,
      partNumber,
      name,
      description,
      brand->{
        _id,
        name,
        nameEn,
        slug
      },
      subcategory->{
        _id,
        name,
        nameEn,
        slug,
        specifications,
        category->{
          _id,
          name,
          nameEn,
          slug
        }
      },
      specifications,
      stock,
      price,
      status,
      slug,
      isActive
    } | order(partNumber asc)
  `;

  try {
    const products = await client.fetch(query, { 
      brandSlug, 
      categorySlug,
      ...(subcategorySlug && { subcategorySlug })
    });
    return products;
  } catch (error) {
    console.error('Error fetching brand category products:', error);
    return [];
  }
}

// 获取品牌信息
export async function getBrandInfo(brandSlug: string) {
  const query = `
    *[_type == "brand" && slug.current == $brandSlug && isActive == true][0] {
      _id,
      name,
      nameEn,
      slug,
      description,
      logo,
      website,
      country,
      founded,
      isActive
    }
  `;

  try {
    const brand = await client.fetch(query, { brandSlug });
    return brand;
  } catch (error) {
    console.error('Error fetching brand info:', error);
    return null;
  }
}

// 将Sanity产品数据转换为前端Filter组件可用的格式
export function convertSanityProductsToFilterData(
  products: BrandProduct[],
  categoryInfo: BrandCategory
) {
  // 生成筛选列配置
  const filterColumns: Array<{
    key: string;
    name: string;
    type: 'select' | 'range';
    options?: string[];
    min?: number;
    max?: number;
    unit?: string;
  }> = [];

  // 从产品子类的规格定义中生成筛选配置
  if (categoryInfo.subcategories.length > 0) {
    const allSpecs = categoryInfo.subcategories.flatMap(sub => sub.specifications);
    const uniqueSpecs = allSpecs.filter((spec, index, self) => 
      spec.isFilterable && self.findIndex(s => s.parameterName === spec.parameterName) === index
    );

    uniqueSpecs.forEach(spec => {
      let filterType: 'select' | 'range' = 'select';
      let options: string[] = [];
      let min: number | undefined;
      let max: number | undefined;

      if (spec.parameterType === 'select' && spec.options) {
        filterType = 'select';
        options = spec.options;
      } else if (spec.parameterType === 'range' || spec.parameterType === 'number') {
        filterType = 'range';
        // 从实际产品数据中计算范围
        const values = products
          .flatMap(p => p.specifications.filter(s => s.parameter === spec.parameterName))
          .map(s => parseFloat(s.value))
          .filter(v => !isNaN(v));
        
        if (values.length > 0) {
          min = Math.min(...values);
          max = Math.max(...values);
        }
      } else {
        // 对于text类型，收集所有唯一值作为选项
        const values = products
          .flatMap(p => p.specifications.filter(s => s.parameter === spec.parameterName))
          .map(s => s.value)
          .filter((v, i, arr) => arr.indexOf(v) === i);
        
        if (values.length > 0 && values.length <= 20) { // 限制选项数量
          options = values;
        }
      }

      filterColumns.push({
        key: spec.parameterName.toLowerCase().replace(/[^\w]/g, '_'),
        name: spec.parameterName,
        type: filterType,
        options,
        min,
        max,
        unit: spec.unit
      });
    });
  }

  // 转换产品格式
  const convertedProducts = products.map(product => ({
    id: product._id,
    partNumber: product.partNumber,
    description: product.name || product.description,
    brand: product.brand.name,
    category: product.subcategory.category.slug.current,
    parameters: product.specifications.reduce((acc, spec) => {
      acc[spec.parameter.toLowerCase().replace(/[^\w]/g, '_')] = spec.value;
      return acc;
    }, {} as Record<string, string>),
    package: product.specifications.find(s => s.parameter.includes('封装') || s.parameter.includes('Package'))?.value || '',
    datasheet: `/datasheets/${product.partNumber.toLowerCase().replace(/[^\w]/g, '-')}.pdf`,
    price: product.price ? `¥${product.price.amount.toFixed(2)}` : undefined,
    stock: product.stock,
    image: `/images/products/${product.partNumber.toLowerCase().replace(/[^\w]/g, '-')}.jpg`
  }));

  return {
    products: convertedProducts,
    filterColumns: filterColumns.sort((a, b) => a.name.localeCompare(b.name)),
    categoryInfo: {
      id: categoryInfo._id,
      name: categoryInfo.name,
      description: categoryInfo.description,
      features: [], // 这里可以从分类信息中提取特性
      applications: [], // 这里可以从分类信息中提取应用领域
      filterColumns,
      products: convertedProducts
    }
  };
}

// 获取品牌分类的完整数据（用于ProductFilter组件）
export async function getBrandCategoryFilterData(
  brandSlug: string,
  categorySlug: string,
  subcategorySlug?: string
) {
  const [categories, products] = await Promise.all([
    getBrandCategories(brandSlug),
    getBrandCategoryProducts(brandSlug, categorySlug, subcategorySlug)
  ]);

  const categoryInfo = categories.find(cat => 
    subcategorySlug 
      ? cat.subcategories.some(sub => sub.slug.current === subcategorySlug)
      : cat.slug.current === categorySlug
  );

  if (!categoryInfo) {
    throw new Error(`Category ${categorySlug} not found for brand ${brandSlug}`);
  }

  return convertSanityProductsToFilterData(products, categoryInfo);
}