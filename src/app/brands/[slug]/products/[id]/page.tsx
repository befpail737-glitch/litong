import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Package,
  ChevronRight,
  Cpu,
  Calendar,
  User,
  Download,
  ExternalLink,
  MessageCircle,
  FileText,
  ShoppingCart,
  Clock,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';

import { getBrandData } from '@/lib/sanity/brands';
import { getProductBySlug, getAllProducts } from '@/lib/sanity/products';
import { urlFor } from '@/lib/sanity/client';

interface BrandProductPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default async function BrandProductPage({ params }: BrandProductPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  const [brand, product] = await Promise.all([
    getBrandData(decodedSlug),
    getProductBySlug(params.id)
  ]);

  if (!brand || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/brands" className="hover:text-blue-600">品牌</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`} className="hover:text-blue-600">
          {brand.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`} className="hover:text-blue-600">
          产品
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{product.title}</span>
      </div>

      {/* Product Hero Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="order-2 lg:order-1 p-8 lg:p-12">
            {/* Brand Context */}
            <div className="mb-4">
              <span className="text-sm text-gray-500">来自品牌：</span>
              <Link
                href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                className="font-medium text-blue-600 hover:text-blue-800 ml-1"
              >
                {brand.name}
              </Link>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {product.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {product.category.name}
                </span>
              )}
              {product.package && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {product.package}
                </span>
              )}
              {product.status && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  product.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.status === 'active' ? '现货' : '询价'}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {product.partNumber && (
              <div className="mb-4">
                <span className="text-lg font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded">
                  {product.partNumber}
                </span>
              </div>
            )}

            {product.shortDescription && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{product.shortDescription}</p>
            )}

            {/* Key Specifications */}
            {product.keySpecs && product.keySpecs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  关键规格
                </h3>
                <ul className="space-y-2">
                  {product.keySpecs.map((spec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/inquiry"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>询价</span>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>添加到询价单</span>
              </button>
              <Link
                href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <span>查看更多产品</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product Image */}
          <div className="order-1 lg:order-2">
            {product.images && product.images[0] ? (
              <div className="h-64 lg:h-full">
                <Image
                  src={urlFor(product.images[0]).width(600).height(400).url()}
                  alt={product.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-contain bg-gray-50"
                />
              </div>
            ) : (
              <div className="h-64 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Package className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Product Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              产品详情
            </h2>

            {product.description ? (
              <div className="prose max-w-none">
                {product.description}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">详细信息正在完善中</h3>
                <p className="text-gray-500 mb-6">
                  该产品的详细技术信息正在整理中，如需了解更多信息请联系我们
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

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                技术规格
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <dt className="font-medium text-gray-900 mb-1">{key}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                应用领域
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.applications.map((app, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">{app.title || app}</span>
                    </div>
                    {app.description && (
                      <p className="text-sm text-gray-600">{app.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                快速操作
              </h3>
              <div className="space-y-3">
                <Link
                  href="/inquiry"
                  className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
                >
                  获取报价
                </Link>
                <button className="w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  技术支持
                </button>
                <Link
                  href="/contact"
                  className="w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium block"
                >
                  联系销售
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">产品信息</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">品牌</span>
                  <Link
                    href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                    className="block font-medium text-blue-600 hover:text-blue-800"
                  >
                    {brand.name}
                  </Link>
                </div>
                {product.partNumber && (
                  <div>
                    <span className="text-sm text-gray-500">型号</span>
                    <p className="font-medium font-mono">{product.partNumber}</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className="text-sm text-gray-500">分类</span>
                    <p className="font-medium">{product.category.name}</p>
                  </div>
                )}
                {product.package && (
                  <div>
                    <span className="text-sm text-gray-500">封装</span>
                    <p className="font-medium">{product.package}</p>
                  </div>
                )}
                {product.publishedAt && (
                  <div>
                    <span className="text-sm text-gray-500">发布日期</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {new Date(product.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌相关</h3>
              <div className="space-y-2">
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  品牌首页
                </Link>
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  全部产品
                </Link>
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  解决方案
                </Link>
                <Link
                  href="/inquiry"
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  获取报价
                </Link>
              </div>
            </div>

            {/* Download Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                资源下载
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">产品规格书</p>
                    <p className="text-sm text-gray-500">详细技术规格文档</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">应用指南</p>
                    <p className="text-sm text-gray-500">使用说明和案例</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    console.log('🔧 [brands/[slug]/products/[id]] Generating static params...');

    const [{ getAllBrands }, products] = await Promise.all([
      import('@/lib/sanity/brands'),
      getAllProducts()
    ]);

    const brands = await getAllBrands();

    console.log(`🔧 [brands/[slug]/products/[id]] Fetched ${brands.length} brands and ${products.length} products`);

    if (brands.length === 0 || products.length === 0) {
      console.warn('⚠️ [brands/[slug]/products/[id]] No brands or products found, using fallback');
      // Return some fallback params for common test cases
      return [
        { slug: 'cree', id: '11111' },
        { slug: 'cree', id: '55555' },
        { slug: 'mediatek', id: '11111' },
        { slug: 'qualcomm', id: '11111' }
      ];
    }

    const staticParams = [];

    brands
      .filter(brand => brand.isActive !== false && (brand.slug || brand.name))
      .forEach(brand => {
        const originalSlug = brand.slug || brand.name;

        // Get products for this brand
        const brandProducts = products.filter(product =>
          product.brand?.name === brand.name ||
          product.brand?.slug === originalSlug
        );

        console.log(`🔧 [brands/[slug]/products/[id]] Brand ${brand.name} has ${brandProducts.length} products`);

        brandProducts.forEach(product => {
          const productId = product.slug || product._id;

          // For English brands, generate both uppercase and lowercase versions
          if (/^[A-Z]/.test(originalSlug)) {
            // Original version
            const originalParam = {
              slug: encodeURIComponent(originalSlug),
              id: productId
            };
            staticParams.push(originalParam);
            console.log(`🔧 [brands/[slug]/products/[id]] Generated param: ${originalParam.slug}/${originalParam.id}`);

            // Lowercase version
            const lowercaseParam = {
              slug: encodeURIComponent(originalSlug.toLowerCase()),
              id: productId
            };
            staticParams.push(lowercaseParam);
            console.log(`🔧 [brands/[slug]/products/[id]] Generated param: ${lowercaseParam.slug}/${lowercaseParam.id}`);
          } else {
            // Chinese brands or others
            const chineseParam = {
              slug: encodeURIComponent(originalSlug),
              id: productId
            };
            staticParams.push(chineseParam);
            console.log(`🔧 [brands/[slug]/products/[id]] Generated param: ${chineseParam.slug}/${chineseParam.id}`);
          }
        });

        // Always include some fallback test IDs for each brand
        ['11111', '55555', 'test-product'].forEach(testId => {
          if (!brandProducts.find(p => (p.slug || p._id) === testId)) {
            const brandSlugs = [];
            if (/^[A-Z]/.test(originalSlug)) {
              brandSlugs.push(originalSlug, originalSlug.toLowerCase());
            } else {
              brandSlugs.push(originalSlug);
            }

            brandSlugs.forEach(slug => {
              const param = {
                slug: /^[A-Za-z]/.test(slug) ? encodeURIComponent(slug) : encodeURIComponent(slug),
                id: testId
              };
              staticParams.push(param);
              console.log(`🔧 [brands/[slug]/products/[id]] Generated fallback param: ${param.slug}/${param.id}`);
            });
          }
        });
      });

    console.log(`🔧 [brands/[slug]/products/[id]] Generated ${staticParams.length} static params`);
    return staticParams;
  } catch (error) {
    console.error('❌ [brands/[slug]/products/[id]] Error generating static params:', error);

    // Return fallback params to prevent complete failure
    console.log('🔧 [brands/[slug]/products/[id]] Using emergency fallback params');
    return [
      { slug: 'cree', id: '11111' },
      { slug: 'cree', id: '55555' },
      { slug: 'cree', id: 'test-product' },
      { slug: 'mediatek', id: '11111' },
      { slug: 'mediatek', id: '55555' },
      { slug: 'qualcomm', id: '11111' },
      { slug: 'qualcomm', id: '55555' }
    ];
  }
}

export async function generateMetadata({ params }: BrandProductPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const [brand, product] = await Promise.all([
    getBrandData(decodedSlug),
    getProductBySlug(params.id)
  ]);

  if (!brand || !product) {
    return {
      title: '产品详情 - 力通电子',
      description: '产品详情页面'
    };
  }

  return {
    title: `${product.title} - ${brand.name} - 力通电子`,
    description: product.shortDescription || product.description || `${product.title} - ${brand.name}品牌产品详情`,
    keywords: `${product.title}, ${product.partNumber || ''}, ${brand.name}, ${product.category?.name || ''}, 电子元器件`,
  };
}