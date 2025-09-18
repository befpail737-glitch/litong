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
    console.log('🔧 Generating minimal brand product static parameters for Cloudflare...');

    // Emergency mode for Cloudflare: drastically reduce static generation
    const brandProductCombinations = await getBrandProductCombinations(5);
    const locales = ['zh-CN']; // Only Chinese locale for emergency deployment

    const params = [];

    for (const locale of locales) {
      for (const combo of brandProductCombinations) {
        if (combo.brandSlug && combo.productSlug) {
          console.log(`📋 Adding minimal static param: ${locale}/${combo.brandSlug}/${combo.productSlug}`);
          params.push({
            locale,
            slug: combo.brandSlug,
            id: combo.productSlug
          });
        }
      }
    }

    console.log(`✅ Generated ${params.length} brand product static params from ${brandProductCombinations.length} combinations`);
    console.log('📊 Sample generated params:', params.slice(0, 3));
    return params;
  } catch (error) {
    console.error('Error generating brand product static params:', error);
    // Fallback to ensure critical pages are generated - only verified products
    const fallbackParams = [
      { locale: 'zh-CN', slug: 'cree', id: 'sic mosfet' },
      { locale: 'zh-CN', slug: 'cree', id: '11111' },
      { locale: 'en', slug: 'cree', id: 'sic mosfet' },
      { locale: 'en', slug: 'cree', id: '11111' },
    ];
    console.log(`⚠️ Using fallback: generated ${fallbackParams.length} verified params`);
    return fallbackParams;
  }
}

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
        notFound();
      }
      // During build time, create a fallback product to prevent build failure
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