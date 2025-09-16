import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Package, Settings, HelpCircle, ArrowRight, Star, Globe, MapPin, Calendar } from 'lucide-react';

import { getBrandData, getBrandProducts, getBrandSolutions, getBrandArticles, getBrandProductCategories } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';

interface BrandPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  // 解码URL以支持中文品牌名称
  const decodedSlug = decodeURIComponent(params.slug);

  // 获取品牌数据和预览内容
  const [brand, products, solutions, articles, categories] = await Promise.all([
    getBrandData(decodedSlug),
    getBrandProducts(decodedSlug, 6),
    getBrandSolutions(decodedSlug, 3),
    getBrandArticles(decodedSlug, 3),
    getBrandProductCategories(decodedSlug)
  ]);

  if (!brand) {
    notFound();
  }

  const baseUrl = `/brands/${encodeURIComponent(brand.slug || brand.name)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Brand Hero Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Brand Logo & Basic Info */}
          <div className="lg:col-span-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
            {brand.logo ? (
              <div className="w-32 h-32 mb-6">
                <Image
                  src={urlFor(brand.logo).width(200).height(200).url()}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-32 h-32 mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{brand.name}</h1>
              {brand.isFeatured && (
                <div className="flex items-center justify-center space-x-1 text-yellow-600 mb-4">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">重点品牌</span>
                </div>
              )}
            </div>
          </div>

          {/* Brand Description & Details */}
          <div className="lg:col-span-2 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">品牌介绍</h2>
              {brand.description ? (
                <p className="text-gray-600 leading-relaxed text-lg">{brand.description}</p>
              ) : (
                <p className="text-gray-500 italic">品牌介绍正在完善中...</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {brand.country && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">所属国家</p>
                    <p className="font-medium text-gray-900">{brand.country}</p>
                  </div>
                </div>
              )}
              {brand.established && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">成立时间</p>
                    <p className="font-medium text-gray-900">{brand.established}</p>
                  </div>
                </div>
              )}
              {brand.headquarters && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">总部地址</p>
                    <p className="font-medium text-gray-900">{brand.headquarters}</p>
                  </div>
                </div>
              )}
              {brand.website && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">官方网站</p>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      访问官网
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`${baseUrl}/products`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>浏览产品</span>
              </Link>
              <Link
                href={`${baseUrl}/solutions`}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>解决方案</span>
              </Link>
              <Link
                href={`${baseUrl}/support`}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>技术支持</span>
              </Link>
              <Link
                href="/inquiry"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                立即询价
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Categories Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              产品分类
            </h3>
            <Link
              href={`${baseUrl}/products`}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.slice(0, 5).map((category: any) => (
                <div key={category.slug} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-gray-800">{category.name}</span>
                  <span className="text-sm text-blue-600 font-medium">{category.count}</span>
                </div>
              ))}
              {categories.length > 5 && (
                <div className="text-center pt-2">
                  <Link
                    href={`${baseUrl}/products`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    +{categories.length - 5} 更多分类
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">产品分类正在完善中</p>
            </div>
          )}
        </div>

        {/* Solutions Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              解决方案
            </h3>
            <Link
              href={`${baseUrl}/solutions`}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {solutions.length > 0 ? (
            <div className="space-y-4">
              {solutions.map((solution: any) => (
                <div key={solution._id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">{solution.title}</h4>
                  {solution.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2">{solution.summary}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Settings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">解决方案正在完善中</p>
            </div>
          )}
        </div>

        {/* Support Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              技术支持
            </h3>
            <Link
              href={`${baseUrl}/support`}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1"
            >
              <span>查看全部</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article: any) => (
                <div key={article._id} className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{article.title}</h4>
                  {article.publishedAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-l-4 border-gray-300 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">📖 产品资料下载</h4>
                <p className="text-sm text-gray-600">完整的产品规格和技术文档</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">🔧 技术支持服务</h4>
                <p className="text-sm text-gray-600">专业工程师技术咨询服务</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">🎓 技术培训</h4>
                <p className="text-sm text-gray-600">产品培训和技术研讨会</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">热门产品</h3>
            <Link
              href={`${baseUrl}/products`}
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center space-x-1"
            >
              <span>查看全部产品</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                {product.images?.[0] && (
                  <div className="w-full h-32 mb-3 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={urlFor(product.images[0]).width(200).height(120).url()}
                      alt={product.title}
                      width={200}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                {product.partNumber && (
                  <p className="text-blue-600 text-sm font-mono mb-2">{product.partNumber}</p>
                )}
                {product.shortDescription && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.shortDescription}</p>
                )}
                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product.slug || product._id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    查看详情
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                    询价
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Emergency模式：完全禁用静态生成
export async function generateStaticParams() {
  console.log('🚨 Emergency mode: skipping static generation for', __filename);
  return []; // 让页面变为动态路由
}

// 页面元数据
export async function generateMetadata({ params }: BrandPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const brand = await getBrandData(decodedSlug);

  if (!brand) {
    return {
      title: '品牌未找到 - 力通电子',
      description: '品牌页面不存在或已被删除。'
    };
  }

  return {
    title: `${brand.name} - 力通电子合作品牌`,
    description: brand.description || `${brand.name} 是力通电子的重要合作伙伴，提供优质的电子元器件产品。`,
    keywords: `${brand.name}, 电子元器件, 力通电子, 代理商, ${brand.country || ''}`,
  };
}
