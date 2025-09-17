import { getProduct, getRelatedProducts, getProducts } from '@/lib/sanity/queries';
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

interface ProductPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all products and locales
export async function generateStaticParams() {
  try {
    // Temporarily reduce product limit to improve build performance
    const result = await getProducts({ limit: 50 });
    const products = result.products || [];
    // Temporarily limit to primary locales to reduce build time
    const locales = ['zh-CN', 'en'];

    const params = [];
    for (const locale of locales) {
      for (const product of products) {
        if (product.slug) {
          params.push({
            locale,
            slug: product.slug,
          });
        }
      }
    }

    console.log('Generated static params for products:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = params;

  const product = await getProduct(slug);

  if (!product) {
    console.warn(`Product not found for slug: ${slug}`);
    notFound();
  }

  // Get related products if category exists
  const relatedProducts = product.category?._id
    ? await getRelatedProducts(product._id, product.category._id, 4)
    : [];

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href={`/${locale}`} className="hover:text-blue-600">
                首页
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${locale}/products`} className="hover:text-blue-600">
                产品
              </Link>
              {product.category && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <Link
                    href={`/${locale}/products?category=${product.category.slug}`}
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
              <Link href={`/${locale}/products`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回产品列表
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
                    {product.brand?.logo && (
                      <Image
                        src={safeImageUrl(product.brand.logo, { width: 40, height: 40 })}
                        alt={product.brand.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    )}
                    <Link
                      href={`/${locale}/brands/${product.brand?.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {product.brand?.name}
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
                  <Button size="lg" className="flex-1">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    立即询价
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">相关产品</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related._id}
                    href={`/${locale}/products/${related.slug}`}
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
                      {related.brand && (
                        <p className="text-sm text-blue-600">
                          {related.brand.name}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}