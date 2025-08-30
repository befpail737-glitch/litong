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
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug, categorySlug } = params;

  try {
    const [brandInfo, categoryData] = await Promise.all([
      getBrandInfo(brandSlug),
      getBrandCategoryFilterData(brandSlug, categorySlug) // 移除 subcategory 参数
    ]);

    if (!brandInfo || !categoryData) {
      return {
        title: 'Product Not Found',
        description: 'The requested product category could not be found.'
      };
    }

    const pageTitle = `${(brandInfo as any).name} ${(categoryData as any).categoryInfo.name} - 产品筛选`;
    const pageDescription = `浏览和筛选${(brandInfo as any).name}的${(categoryData as any).categoryInfo.name}产品，包含${(categoryData as any).products.length}个产品型号。支持参数筛选、价格对比和技术规格查询。`;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: `${(brandInfo as any).name}, ${(categoryData as any).categoryInfo.name}, 产品筛选, 参数对比, 电子元器件`,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        url: `/brands/${brandSlug}/products/${categorySlug}`,
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

export default async function BrandCategoryPage({ params }: PageProps) {
  const { brandSlug, categorySlug } = params;

  try {
    // 并行获取品牌信息和分类数据
    const [brandInfo, categoryData] = await Promise.all([
      getBrandInfo(brandSlug),
      getBrandCategoryFilterData(brandSlug, categorySlug) // 移除 subcategory 参数
    ]);

    // 检查数据是否存在
    if (!brandInfo) {
      console.error(`Brand not found: ${brandSlug}`);
      notFound();
    }

    if (!categoryData || (categoryData as any).products.length === 0) {
      console.error(`No products found for brand: ${brandSlug}, category: ${categorySlug}`);
      notFound();
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <ProductFilter
          brandSlug={brandSlug}
          brandName={(brandInfo as any).name}
          categoryData={(categoryData as any).categoryInfo}
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
  // 这里可以预生成一些热门的品牌分类组合，支持多语言
  const brandCategories = [
    {
      brandSlug: 'stm',
      categorySlug: 'microcontrollers'
    },
    {
      brandSlug: 'stmicroelectronics',
      categorySlug: 'microcontrollers'
    }
  ];
  
  const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  const params = [];
  for (const locale of locales) {
    for (const brandCategory of brandCategories) {
      params.push({
        locale,
        brandSlug: brandCategory.brandSlug,
        categorySlug: brandCategory.categorySlug
      });
    }
  }
  
  return params;
}