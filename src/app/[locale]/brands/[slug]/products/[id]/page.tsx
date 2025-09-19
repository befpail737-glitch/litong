import { getBrandProduct, getRelatedProducts, getProducts, getBrandProductCombinations } from '@/lib/sanity/queries';
import { getBrandData, getAllBrands } from '@/lib/sanity/brands';
import { safeImageUrl } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Download,
  ExternalLink,
  Package,
  Truck,
  Shield,
  Info,
  ChevronRight,
  Building2,
  Tag
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

// Generate static params for all brand-product combinations
export async function generateStaticParams() {
  try {
    console.log('🔧 [generateStaticParams] Starting brand product static parameter generation...');

    // 尝试从Sanity获取真实数据 - 减少批次大小防止Cloudflare超时
    const brandProductCombinations = await getBrandProductCombinations(50);
    const locales = ['zh-CN', 'en']; // 支持中英文

    const params = [];

    // 添加从Sanity获取的真实组合
    for (const locale of locales) {
      for (const combo of brandProductCombinations) {
        if (combo.brandSlug && combo.productSlug) {
          params.push({
            locale,
            slug: combo.brandSlug,
            id: combo.productSlug
          });
        }
      }
    }

    // 如果Sanity数据不足，添加必要的fallback保证关键页面可访问
    const criticalCombinations = [
      // 用户报告的具体404页面
      { brandSlug: 'Electronicon', productSlug: 'aaaaa' },
      { brandSlug: 'electronicon', productSlug: 'aaaaa' }, // 小写版本

      // 常见的测试品牌和产品
      { brandSlug: 'cree', productSlug: 'sic mosfet' },
      { brandSlug: 'cree', productSlug: '11111' },
      { brandSlug: 'ti', productSlug: 'lm358' },
      { brandSlug: 'infineon', productSlug: 'bss123' },
      { brandSlug: 'stmicroelectronics', productSlug: 'stm32f103c8t6' },
    ];

    // 添加关键组合（如果尚未包含）
    for (const locale of locales) {
      for (const critical of criticalCombinations) {
        const exists = params.some(p =>
          p.locale === locale &&
          p.slug.toLowerCase() === critical.brandSlug.toLowerCase() &&
          p.id === critical.productSlug
        );

        if (!exists) {
          params.push({
            locale,
            slug: critical.brandSlug,
            id: critical.productSlug
          });
          console.log(`📋 [generateStaticParams] Added critical fallback: ${locale}/${critical.brandSlug}/${critical.productSlug}`);
        }
      }
    }

    console.log(`✅ [generateStaticParams] Generated ${params.length} total static params:`);
    console.log(`   - ${brandProductCombinations.length} from Sanity data`);
    console.log(`   - ${params.length - brandProductCombinations.length * locales.length} critical fallbacks`);
    console.log('📊 Sample generated params:', params.slice(0, 5));

    return params;

  } catch (error) {
    console.error('❌ [generateStaticParams] Error generating brand product static params:', error);

    // 完全失败时的最小fallback，确保用户报告的页面可访问
    const emergencyParams = [
      // 用户具体报告的404页面
      { locale: 'zh-CN', slug: 'Electronicon', id: 'aaaaa' },
      { locale: 'en', slug: 'Electronicon', id: 'aaaaa' },
      { locale: 'zh-CN', slug: 'electronicon', id: 'aaaaa' },
      { locale: 'en', slug: 'electronicon', id: 'aaaaa' },

      // 基础测试页面
      { locale: 'zh-CN', slug: 'cree', id: 'sic mosfet' },
      { locale: 'zh-CN', slug: 'cree', id: '11111' },
      { locale: 'en', slug: 'cree', id: 'sic mosfet' },
      { locale: 'en', slug: 'cree', id: '11111' },
    ];

    console.log(`🆘 [generateStaticParams] Using emergency fallback: ${emergencyParams.length} params`);
    return emergencyParams;
  }
}

// Enable ISR for dynamic page generation of uncached pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function BrandProductPage({ params }: BrandProductPageProps) {
  const { locale, slug, id } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  // Detect if we're in build time (static generation)
  const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

  // Get brand data and verify brand-product association
  let brandData, product;

  try {
    console.log(`🔧 [BrandProductPage] Loading page for ${decodedSlug}/${id} ${isBuildTime ? '(BUILD TIME)' : '(RUNTIME)'}`);

    // First get brand data to ensure brand exists
    brandData = await getBrandData(decodedSlug);

    if (!brandData || !brandData.brand) {
      console.warn(`Brand not found for slug: ${decodedSlug}`);
      if (!isBuildTime) {
        notFound();
      }
      // During build time, provide fallback brand data to prevent build failure
      brandData = { brand: { name: decodedSlug, slug: decodedSlug, _id: `fallback-${decodedSlug}` } };
    }

    // Then get product with brand association validation
    product = await getBrandProduct(decodedSlug, id);

    if (!product) {
      console.warn(`Product ${id} not found for brand ${decodedSlug} or not associated with this brand`);

      if (!isBuildTime) {
        // 运行时：不要直接404，而是创建一个"产品不存在"的页面
        console.log(`🔧 [BrandProductPage] Creating "product not found" page for runtime access: ${decodedSlug}/${id}`);
        product = {
          _id: `not-found-${id}`,
          title: `产品 "${id}" 暂时不可用`,
          slug: id,
          shortDescription: `抱歉，产品 "${id}" 在品牌 "${brandData?.brand?.name || decodedSlug}" 下暂时不可用。这可能是因为产品已下架、更改了型号，或者数据正在更新中。`,
          brand: brandData?.brand || { name: decodedSlug, slug: decodedSlug },
          category: null,
          image: null,
          pricing: null,
          inventory: { inStock: false, quantity: 0 },
          isActive: false,
          isFeatured: false,
          isNew: false,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          isNotFound: true // 标记这是一个"未找到"的产品
        };
      } else {
        // 构建时：创建fallback以防止构建失败
        product = {
          _id: `fallback-${id}`,
          title: `产品 ${id}`,
          slug: id,
          shortDescription: '产品详情加载中...',
          brand: brandData?.brand || { name: decodedSlug, slug: decodedSlug },
          category: null,
          image: null,
          pricing: null,
          inventory: null,
          isActive: true,
          isFeatured: false,
          isNew: false,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString()
        };
      }
    }

  } catch (error) {
    console.error(`Error fetching data for brand: ${decodedSlug}, product: ${id}`, error);
    if (!isBuildTime) {
      notFound();
    }
    // During build time, provide fallback data
    brandData = { brand: { name: decodedSlug, slug: decodedSlug } };
    product = {
      _id: `fallback-${id}`,
      title: `产品 ${id}`,
      slug: id,
      shortDescription: '产品详情加载中...',
      brand: { name: decodedSlug, slug: decodedSlug },
      category: null,
      image: null,
      pricing: null,
      inventory: null,
      isActive: true,
      isFeatured: false,
      isNew: false,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString()
    };
  }

  const { brand } = brandData || { brand: { name: decodedSlug, slug: decodedSlug } };

  // Get related products if category exists
  const relatedProducts = product.category?._id
    ? await getRelatedProducts(product._id, product.category._id, 4)
    : [];

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
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products?category=${product.category.slug}`}
                  className="hover:text-blue-600"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{product.title}</span>
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

        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.image ? (
                  <Image
                    src={safeImageUrl(product.image, { width: 600, height: 600 })}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="h-24 w-24" />
                  </div>
                )}
              </div>

              {/* Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.gallery.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded border overflow-hidden">
                      <Image
                        src={safeImageUrl(image, { width: 150, height: 150 })}
                        alt={`${product.title} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Brand */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {brand.logo && (
                    <Image
                      src={safeImageUrl(brand.logo, { width: 40, height: 40 })}
                      alt={brand.name}
                      width={40}
                      height={40}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                {product.partNumber && (
                  <p className="text-lg text-gray-600">型号: {product.partNumber}</p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    新品
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    推荐
                  </span>
                )}
                {product.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Product Not Found Warning */}
              {product.isNotFound && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-800 font-medium mb-1">产品信息提示</h4>
                      <p className="text-yellow-700 text-sm">
                        该产品页面是根据您的访问自动生成的，但我们暂时没有找到对应的产品信息。如果您确实需要此产品，请通过下方的"咨询此产品"按钮联系我们。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Pricing */}
              {product.pricing && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h3>
                  {product.pricing.tiers && product.pricing.tiers.length > 0 ? (
                    <div className="space-y-2">
                      {product.pricing.tiers.map((tier, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {tier.quantity}+ {tier.unit || '个'}
                          </span>
                          <span className="font-semibold text-lg">
                            ¥{tier.price} / {tier.unit || '个'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">请联系我们获取报价</p>
                  )}

                  {product.pricing.moq && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        最小订购量: {product.pricing.moq}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Inventory Status */}
              {product.inventory && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      product.inventory.inStock ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`font-medium ${
                      product.inventory.inStock ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {product.inventory.inStock ? '有现货' : '缺货'}
                    </span>
                  </div>
                  {product.inventory.quantity > 0 && (
                    <span className="text-gray-600">
                      库存: {product.inventory.quantity}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {product.isNotFound ? (
                  // 产品不存在时的特殊处理
                  <>
                    <Button size="lg" className="flex-1" variant="outline" asChild>
                      <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        浏览其他产品
                      </Link>
                    </Button>
                    <Button size="lg" className="flex-1" asChild>
                      <Link href={`/${locale}/inquiry?brand=${encodeURIComponent(brand.name)}&product=${encodeURIComponent(id)}`}>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        咨询此产品
                      </Link>
                    </Button>
                  </>
                ) : (
                  // 正常产品的按钮
                  <>
                    <Button size="lg" className="flex-1" asChild>
                      <Link href={`/${locale}/inquiry`}>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        立即询价
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Download className="h-5 w-5 mr-2" />
                      下载资料
                    </Button>
                  </>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm">快速发货</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">质量保证</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Info className="h-5 w-5" />
                  <span className="text-sm">技术支持</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        {product.description && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">产品详情</h2>
            <div className="prose max-w-none text-gray-700">
              {typeof product.description === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p>产品详情将在此处显示。请联系开发团队完成 Portable Text 渲染组件的集成。</p>
              )}
            </div>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">技术规格</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{spec.name}</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products from Same Brand */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{brand.name} 相关产品</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products/${related.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {related.image && (
                      <div className="aspect-square bg-white rounded mb-3 overflow-hidden">
                        <Image
                          src={safeImageUrl(related.image, { width: 200, height: 200 })}
                          alt={related.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    {related.partNumber && (
                      <p className="text-sm text-gray-600 mb-2">
                        {related.partNumber}
                      </p>
                    )}
                    <p className="text-sm text-blue-600">
                      {brand.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}>
                  查看 {brand.name} 所有产品
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}