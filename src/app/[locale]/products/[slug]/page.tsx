import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { urlFor, client } from '@/lib/sanity/client';
import { getProduct } from '@/lib/sanity/queries';
import { locales } from '@/i18n';

// 为静态生成提供基本参数（简化版本）
export async function generateStaticParams() {
  return [
    { locale: 'zh-CN', slug: 'sample-product' }
  ];
}

interface PageProps {
  params: {
    slug: string
    locale: string
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const productSlug = decodeURIComponent(params.slug);

  console.log('ProductDetailPage called with slug:', params.slug, 'decoded:', productSlug);

  try {
    const product = await getProduct(productSlug);
    console.log('Product found:', product);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href={`/${params.locale}`} className="hover:text-blue-600">首页</Link>
          <span>/</span>
          <Link href={`/${params.locale}/products`} className="hover:text-blue-600">产品中心</Link>
          <span>/</span>
          {product.brand && (
            <>
              <Link
                href={`/${params.locale}/brands/${product.brand.slug}`}
                className="hover:text-blue-600"
              >
                {product.brand.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.partNumber}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧 - 产品图片和基本信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 产品图片 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img
                    src={urlFor(product.image).width(600).height(600).url()}
                    alt={product.title || product.partNumber}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-8xl text-gray-300">📱</div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.gallery?.length ? (
                  product.gallery.map((image: any, index: number) => (
                    <div key={index} className="aspect-square bg-gray-50 rounded-md overflow-hidden">
                      <img
                        src={urlFor(image).width(200).height(200).url()}
                        alt={`${product.title || product.partNumber} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-md flex items-center justify-center">
                      <div className="text-2xl text-gray-300">📱</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 产品描述 */}
            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle>产品描述</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-sm">
                    {product.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 产品规格 */}
            {product.specifications?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>产品规格</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">基本参数</h4>
                      <dl className="space-y-2">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                            <dt className="text-sm text-gray-600">{spec.name}</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {spec.value}{spec.unit || ''}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>产品规格</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">规格参数正在完善中...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧 - 产品信息和购买 */}
          <div className="space-y-6">
            {/* 产品基本信息 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{product.partNumber}</CardTitle>
                  <div className="flex gap-2">
                    {product.isNew && <Badge variant="success">新品</Badge>}
                    {product.isFeatured && <Badge variant="default">推荐</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {product.title || product.partNumber}
                </h2>

                {product.brand && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {product.brand.logo ? (
                        <img
                          src={urlFor(product.brand.logo).width(24).height(24).url()}
                          alt={product.brand.name}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {product.brand.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <Link
                        href={`/${params.locale}/brands/${product.brand.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {product.brand.name}
                      </Link>
                    </div>
                  </div>
                )}

                {product.shortDescription && (
                  <p className="text-sm text-gray-600">
                    {product.shortDescription}
                  </p>
                )}

                {product.category && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">分类:</span>
                    <Link
                      href={`/${params.locale}/products?category=${product.category.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.category.name}
                    </Link>
                    {product.subcategory && (
                      <>
                        <span className="text-gray-400">&gt;</span>
                        <span className="text-gray-600">{product.subcategory.name}</span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 价格和库存 */}
            <Card>
              <CardHeader>
                <CardTitle>价格 & 库存</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">库存状态</span>
                    <Badge variant={product.inventory?.status === 'in_stock' ? 'success' : 'secondary'}>
                      {product.inventory?.status === 'in_stock' ? '现货' : '询价'}
                    </Badge>
                  </div>
                  {product.inventory?.quantity && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">可用库存</span>
                      <span className="font-semibold">{product.inventory.quantity.toLocaleString()} 件</span>
                    </div>
                  )}
                  {product.pricing?.moq && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">最小起订量</span>
                      <span className="font-semibold">{product.pricing.moq} 件</span>
                    </div>
                  )}
                  {product.pricing?.leadTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">交货期</span>
                      <span className="text-green-600 font-semibold">{product.pricing.leadTime}</span>
                    </div>
                  )}
                </div>

                {product.pricing?.tiers?.length ? (
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">阶梯价格</h4>
                      {product.pricing.tiers.map((tier, index) => (
                        <div key={index} className="flex justify-between py-2 px-3 bg-gray-50 rounded-md">
                          <span className="text-sm">{tier.quantity}+ 件</span>
                          <span className="font-semibold text-blue-600">
                            ¥{tier.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3 pt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link href={`/${params.locale}/inquiry`}>
                      立即询价
                    </Link>
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/${params.locale}/inquiry`}>
                        详细询价单
                      </Link>
                    </Button>
                    <Button variant="outline" className="px-4">
                      收藏
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 相关文档 */}
            {product.documents?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>相关文档</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.documents.map((doc, index) => (
                      <Link
                        key={index}
                        href={doc.url || '#'}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                      >
                        <span className="text-red-600">📄</span>
                        <span className="text-sm text-blue-600 hover:underline">
                          {doc.title || `文档 ${index + 1}`}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>相关文档</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">产品文档正在整理中...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const productSlug = decodeURIComponent(params.slug);

  try {
    const product = await getProduct(productSlug);

    return {
      title: `${product.title || product.partNumber} - 力通电子`,
      description: product.shortDescription || product.description?.substring(0, 160) || `${product.partNumber} - 力通电子原装正品现货供应`,
      keywords: `${product.partNumber}, ${product.brand?.name || ''}, ${product.category?.name || ''}, 电子元器件`,
    };
  } catch (error) {
    return {
      title: '产品详情 - 力通电子',
      description: '查看产品详细信息'
    };
  }
}
