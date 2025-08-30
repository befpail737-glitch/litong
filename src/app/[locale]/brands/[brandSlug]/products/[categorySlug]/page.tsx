import { notFound } from 'next/navigation';
import { getBrandInfo, getBrandCategoryFilterData } from '@/lib/brandData';
import ProductFilter from '@/components/brands/ProductFilter';
import { Metadata } from 'next';

interface PageProps {
  params: {
    locale: string;
    brandSlug: string;
    categorySlug: string;
  };
  searchParams: {
    subcategory?: string;
  };
}

// 生成页面元数据
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { brandSlug, categorySlug } = params;
  const { subcategory } = searchParams;

  try {
    const [brandInfo, categoryData] = await Promise.all([
      getBrandInfo(brandSlug),
      getBrandCategoryFilterData(brandSlug, categorySlug, subcategory)
    ]);

    if (!brandInfo || !categoryData) {
      return {
        title: 'Product Not Found',
        description: 'The requested product category could not be found.'
      };
    }

    const pageTitle = `${brandInfo.name} ${categoryData.categoryInfo.name} - 产品筛选`;
    const pageDescription = `浏览和筛选${brandInfo.name}的${categoryData.categoryInfo.name}产品，包含${categoryData.products.length}个产品型号。支持参数筛选、价格对比和技术规格查询。`;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: `${brandInfo.name}, ${categoryData.categoryInfo.name}, 产品筛选, 参数对比, 电子元器件`,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        url: `/brands/${brandSlug}/products/${categorySlug}${subcategory ? `?subcategory=${subcategory}` : ''}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
      }
    };
  } catch (error) {
    return {
      title: 'Error Loading Product Category',
      description: 'An error occurred while loading the product category.'
    };
  }
}

export default async function BrandCategoryPage({ params, searchParams }: PageProps) {
  const { brandSlug, categorySlug } = params;
  const { subcategory } = searchParams;

  try {
    // 并行获取品牌信息和分类数据
    const [brandInfo, categoryData] = await Promise.all([
      getBrandInfo(brandSlug),
      getBrandCategoryFilterData(brandSlug, categorySlug, subcategory)
    ]);

    // 检查数据是否存在
    if (!brandInfo) {
      console.error(`Brand not found: ${brandSlug}`);
      notFound();
    }

    if (!categoryData || categoryData.products.length === 0) {
      console.error(`No products found for brand: ${brandSlug}, category: ${categorySlug}, subcategory: ${subcategory}`);
      notFound();
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <ProductFilter
          brandSlug={brandSlug}
          brandName={brandInfo.name}
          categoryData={categoryData.categoryInfo}
        />
      </main>
    );

  } catch (error) {
    console.error('Error loading brand category page:', error);
    notFound();
  }
}

// 生成静态路径（可选，用于预渲染热门品牌分类）
export async function generateStaticParams() {
  // 这里可以预生成一些热门的品牌分类组合
  // 由于数据量可能很大，建议只预生成最热门的几个
  return [
    {
      brandSlug: 'stmicroelectronics',
      categorySlug: 'microcontrollers'
    },
    {
      brandSlug: 'ti',
      categorySlug: 'power-management'
    },
    {
      brandSlug: 'infineon',
      categorySlug: 'microcontrollers'
    }
  ];
}