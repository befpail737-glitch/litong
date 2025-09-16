import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Package,
  ShoppingCart,
  Heart,
  Share2,
  FileText,
  Zap,
  Settings,
  Info,
  ExternalLink,
  ChevronRight,
  Download,
  MessageCircle
} from 'lucide-react';

import { getProductBySlug, getAllProducts } from '@/lib/sanity/products';
import { urlFor } from '@/lib/sanity/client';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Decode URL-encoded slug to handle special characters
  const decodedSlug = decodeURIComponent(params.slug);

  let product;
  try {
    product = await getProductBySlug(decodedSlug);
  } catch (error) {
    console.error(`Error fetching product by slug "${decodedSlug}":`, error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-blue-600">产品</Link>
        <ChevronRight className="h-4 w-4" />
        {product.brand && (
          <>
            <Link href={`/brands/${encodeURIComponent(product.brand.slug || product.brand.name)}`} className="hover:text-blue-600">
              {product.brand.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-gray-900">{product.partNumber || product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={urlFor(product.images[0]).width(600).height(600).url()}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <Image
                    src={urlFor(image).width(150).height(150).url()}
                    alt={`${product.title} - ${index + 2}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            {product.partNumber && (
              <p className="text-xl text-blue-600 font-mono mb-4">{product.partNumber}</p>
            )}
            {product.shortDescription && (
              <p className="text-lg text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}
          </div>

          {/* Brand & Category */}
          <div className="flex items-center space-x-6">
            {product.brand && (
              <Link
                href={`/brands/${encodeURIComponent(product.brand.slug || product.brand.name)}`}
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                {product.brand.logo && (
                  <Image
                    src={urlFor(product.brand.logo).width(40).height(40).url()}
                    alt={product.brand.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                )}
                <span className="font-medium">{product.brand.name}</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
              >
                <span>{product.category.name}</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Pricing */}
          {product.pricing && product.pricing.tiers && product.pricing.tiers.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h3>
              <div className="space-y-2">
                {product.pricing.tiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{tier.quantity}+ {tier.unit || '个'}</span>
                    <span className="font-semibold text-blue-600">
                      ¥{tier.price} / {tier.unit || '个'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Status */}
          {product.inventory && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.inventory.status === 'in_stock' ? 'bg-green-500' :
                  product.inventory.status === 'low_stock' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {product.inventory.status === 'in_stock' ? '有库存' :
                   product.inventory.status === 'low_stock' ? '库存不足' : '缺货'}
                </span>
              </div>
              {product.inventory.quantity && (
                <span className="text-sm text-gray-600">
                  库存: {product.inventory.quantity} 个
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link
              href="/inquiry"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>立即询价</span>
            </Link>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            {product.isFeatured && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">推荐产品</span>
              </div>
            )}
            {product.isNew && (
              <div className="flex items-center space-x-2 text-green-600">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">新品上市</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
              产品详情
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              技术规格
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              应用场景
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Product Description */}
          {product.description ? (
            <div className="prose max-w-none">
              {product.description}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">产品详情完善中</h3>
              <p className="text-gray-500 mb-6">
                该产品的详细信息正在整理中，如需了解更多信息请联系我们
              </p>
              <Link
                href="/inquiry"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>咨询详情</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Support Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">技术资料</h3>
          <p className="text-sm text-gray-600 mb-4">下载产品规格书和技术文档</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            下载资料
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Settings className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">应用支持</h3>
          <p className="text-sm text-gray-600 mb-4">获取应用设计和技术支持</p>
          {product.brand && (
            <Link
              href={`/brands/${encodeURIComponent(product.brand.slug || product.brand.name)}/support`}
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              技术支持
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">专业咨询</h3>
          <p className="text-sm text-gray-600 mb-4">专业工程师为您解答疑问</p>
          <Link
            href="/inquiry"
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
          >
            立即咨询
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();

    const dynamicParams = products
      .filter(product => {
        // Only include products that are active and have valid slugs
        return product.isActive &&
               product.slug &&
               typeof product.slug === 'string' &&
               product.slug.trim().length > 0;
      })
      .map(product => ({
        // Ensure slug is properly URL-encoded
        slug: encodeURIComponent(product.slug.trim())
      }));

    console.log(`🔧 [products/[slug]] Generated ${dynamicParams.length} static params from real data`);

    // Limit to prevent too many static pages during build
    const limitedParams = dynamicParams.slice(0, 50);
    if (limitedParams.length < dynamicParams.length) {
      console.log(`🔧 [products/[slug]] Limited to ${limitedParams.length} params for build performance`);
    }

    return limitedParams;
  } catch (error) {
    console.error('Error generating static params for product detail:', error);
    console.log(`🔧 [products/[slug]] Returning empty params due to error`);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  let product;
  try {
    product = await getProductBySlug(decodedSlug);
  } catch (error) {
    console.error(`Error fetching product metadata for slug "${decodedSlug}":`, error);
    product = null;
  }

  if (!product) {
    return {
      title: '产品未找到 - 力通电子',
      description: '产品页面不存在或已被删除。'
    };
  }

  return {
    title: `${product.title} ${product.partNumber ? '- ' + product.partNumber : ''} - 力通电子`,
    description: product.shortDescription || product.description || `${product.title} - 力通电子提供的优质电子元器件产品`,
    keywords: `${product.title}, ${product.partNumber || ''}, ${product.brand?.name || ''}, 电子元器件, 力通电子`,
  };
}