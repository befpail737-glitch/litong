import { getProductData } from '@/lib/sanity/products';
import { getBrandData } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Package,
  Zap,
  Shield,
  Info,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandNavigation } from '@/components/layout/BrandNavigation';

interface BrandProductPageProps {
  params: {
    locale: string;
    slug: string;
    id: string;
  };
}

// Smart static generation with minimal critical combinations
export async function generateStaticParams() {
  try {
    console.log('🔧 [generateStaticParams] 生成核心品牌-产品组合...');

    // 只为5个核心品牌生成少量重要产品页面
    const { client } = await import('@/lib/sanity/client');

    const criticalCombinations = await client.fetch(`
      *[_type == "product" &&
        defined(slug.current) &&
        isActive == true &&
        count(brands) > 0
      ][0...8] {
        "productSlug": slug.current,
        "brandSlugs": brands[]->slug.current
      }
    `);

    const params = [];
    const allowedBrands = ['cree', 'infineon', 'ti', 'qualcomm', 'adi'];

    criticalCombinations.forEach(product => {
      product.brandSlugs?.forEach(brandSlug => {
        if (brandSlug && allowedBrands.includes(brandSlug.toLowerCase())) {
          params.push(
            { locale: 'zh-CN', slug: brandSlug, id: product.productSlug },
            { locale: 'en', slug: brandSlug, id: product.productSlug }
          );
        }
      });
    });

    console.log(`✅ [generateStaticParams] 生成 ${params.length} 个核心产品组合`);
    return params.slice(0, 20); // 最多20个组合

  } catch (error) {
    console.error('❌ [generateStaticParams] 生成失败:', error);

    // 极简fallback
    return [
      { locale: 'zh-CN', slug: 'cree', id: 'sample-product' },
      { locale: 'en', slug: 'cree', id: 'sample-product' },
      { locale: 'zh-CN', slug: 'infineon', id: 'sample-product' },
      { locale: 'en', slug: 'infineon', id: 'sample-product' }
    ];
  }
}

export default async function BrandProductPage({ params }: BrandProductPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);
  const decodedProductId = decodeURIComponent(id);

  console.log(`🔍 [BrandProductPage] 请求产品页面: brand=${decodedSlug}, product=${decodedProductId}, locale=${locale}`);

  // Get brand and product data
  let brandData, productData;

  try {
    [brandData, productData] = await Promise.all([
      getBrandData(decodedSlug),
      getProductData(decodedProductId)
    ]);

    console.log(`📊 [BrandProductPage] 数据获取结果: brand=${brandData?.brand?.name || 'null'}, product=${productData?.name || 'null'}`);

  } catch (error) {
    console.error(`❌ [BrandProductPage] 数据获取失败`, error);
    notFound();
  }

  if (!brandData?.brand) {
    console.warn(`⚠️ [BrandProductPage] 品牌未找到: ${decodedSlug}`);
    notFound();
  }

  if (!productData) {
    console.warn(`⚠️ [BrandProductPage] 产品未找到: ${decodedProductId}`);
    notFound();
  }

  // Validate product belongs to this brand
  const productBrands = productData.brands || [];
  const isRelatedToBrand = productBrands.some(brand =>
    brand.slug === brandData.brand.slug ||
    brand.slug === decodedSlug ||
    brand.name === brandData.brand.name
  );

  if (!isRelatedToBrand) {
    console.warn(`⚠️ [BrandProductPage] 产品 ${decodedProductId} 不属于品牌 ${decodedSlug}`);
    notFound();
  }

  const { brand } = brandData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Navigation */}
      <BrandNavigation brand={brand} locale={locale} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands`} className="hover:text-blue-600">
              品牌
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`} className="hover:text-blue-600">
              {brand.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products`} className="hover:text-blue-600">
              产品
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回 {brand.name} 产品列表
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              {productData.image ? (
                <Image
                  src={safeImageUrl(productData.image, { width: 600, height: 600 })}
                  alt={productData.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="h-24 w-24" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand Badge */}
            <div className="flex items-center gap-3">
              {brand.logo && (
                <Image
                  src={safeImageUrl(brand.logo, { width: 32, height: 32 })}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
              )}
              <Link
                href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {brand.name}
              </Link>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">
              {productData.name}
            </h1>

            {/* Product Number */}
            {productData.model && (
              <div className="text-lg text-gray-600">
                型号: <span className="font-mono">{productData.model}</span>
              </div>
            )}

            {/* Description */}
            {productData.description && (
              <div className="prose text-gray-700">
                <p>{productData.description}</p>
              </div>
            )}

            {/* Key Features */}
            {productData.features && productData.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  主要特性
                </h3>
                <ul className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Shield className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                询价
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                收藏
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
              {productData.datasheet && (
                <Button variant="outline" asChild>
                  <a href={productData.datasheet} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    数据手册
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {productData.specifications && Object.keys(productData.specifications).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Info className="h-6 w-6 mr-3 text-blue-600" />
              技术规格
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(productData.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-900">{key}</dt>
                  <dd className="text-gray-700 mt-1">{String(value)}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {brand.name} 相关产品
          </h2>
          <div className="text-center py-8">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}>
                查看 {brand.name} 所有产品
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}