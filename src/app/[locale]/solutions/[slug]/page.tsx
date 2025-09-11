import Image from 'next/image';
import { notFound } from 'next/navigation';

import PortableText from '@/components/PortableText';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { urlFor, client } from '@/lib/sanity/client';
import { getSolution } from '@/lib/sanity/queries';
import { getLocalizedValue } from '@/lib/sanity-i18n';
import { locales } from '@/i18n';

// 为静态生成获取所有解决方案slugs
export async function generateStaticParams() {
  try {
    const solutions = await client.fetch(`
      *[_type == "solution" && defined(slug.current)] {
        "slug": slug.current
      }
    `);

    // 为每个locale和每个solution生成参数
    const params = [];
    for (const locale of locales) {
      for (const solution of solutions) {
        if (solution.slug) {
          params.push({
            locale,
            slug: solution.slug
          });
        }
      }
    }

    return params;
  } catch (error) {
    console.error('Error generating static params for solutions:', error);
    return [];
  }
}

type Solution = {
  _id: string
  title: string
  summary: string
  description: any[] // 富文本内容数组
  coverImage: any
  primaryBrand?: {
    _id: string
    name: string
    slug: string
    logo?: any
  }
  relatedBrands?: Array<{
    _id: string
    name: string
    slug: string
    logo?: any
  }>
  targetMarket: string
  complexity: string
  publishedAt: string
  viewCount: number
}

interface SolutionDetailPageProps {
  params: {
    locale: string
    slug: string
  }
}

// 禁用缓存，确保总是获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SolutionDetailPage({ params: { locale, slug } }: SolutionDetailPageProps) {

  // 解码URL编码的slug（处理包含空格的slug）
  const decodedSlug = decodeURIComponent(slug);
  console.log('SolutionDetailPage called with slug:', slug, 'decoded:', decodedSlug);

  let solution: Solution | null = null;
  let error = null;

  try {
    solution = await getSolution(decodedSlug);
    console.log('Successfully fetched solution from Sanity:', solution?._id || 'null');
    console.log('Solution brand data:', {
      primaryBrand: solution?.primaryBrand?.name,
      relatedBrands: solution?.relatedBrands?.map(b => b.name)
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch solution';
    console.error('Error fetching solution from Sanity:', err);
  }

  if (!solution && !error) {
    notFound();
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold text-lg">加载错误</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const targetMarketLabels: Record<string, string> = {
    'consumer-electronics': '消费电子',
    'industrial-automation': '工业自动化',
    'automotive': '汽车电子',
    'communications': '通信设备',
    'medical': '医疗设备',
    'power-energy': '电力能源',
    'aerospace': '航空航天',
    'others': '其他'
  };

  const complexityLabels: Record<string, string> = {
    'simple': '简单',
    'medium': '中等',
    'complex': '复杂',
    'high-complex': '高复杂'
  };

  const statusLabels: Record<string, string> = {
    'development': '开发中',
    'testing': '测试中',
    'released': '已发布',
    'deprecated': '已弃用'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页头 */}
      <div className="mb-8">
        {/* 品牌信息 */}
        {solution!.brandName && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {solution!.brandName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{solution!.brandName}</h2>
              <div className="text-sm text-gray-600">
                品牌相关解决方案
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">
            {targetMarketLabels[solution!.targetMarket] || solution!.targetMarket}
          </Badge>
          <Badge variant="outline">
            {complexityLabels[solution!.complexity] || solution!.complexity}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {solution!.title || '未命名解决方案'}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {solution!.summary || '暂无简介'}
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>发布时间: {new Date(solution!.publishedAt).toLocaleDateString('zh-CN')}</span>
          <span>浏览次数: {solution!.viewCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 封面图片 */}
          {solution!.coverImage && (
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">封面图片</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 详细描述 */}
          <Card>
            <CardHeader>
              <CardTitle>方案描述</CardTitle>
            </CardHeader>
            <CardContent>
              <PortableText
                content={solution!.description}
                className="max-w-none"
              />
            </CardContent>
          </Card>

          {/* 技术特性 */}
          {solution!.features && solution!.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>技术特性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solution!.features.map((feature: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">
                        {getLocalizedValue(feature.title, locale)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {getLocalizedValue(feature.description, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* BOM清单 */}
          {solution!.bomList && solution!.bomList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>BOM清单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">器件型号</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">描述</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">数量</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">单位</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solution!.bomList.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">{item.partNumber}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 应用案例 */}
          {solution!.caseStudies && solution!.caseStudies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>应用案例</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {solution!.caseStudies.map((caseStudy: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">
                        {getLocalizedValue(caseStudy.title, locale)}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {getLocalizedValue(caseStudy.description, locale)}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        {caseStudy.clientName && <span>客户: {caseStudy.clientName}</span>}
                        {caseStudy.industry && <span>行业: {caseStudy.industry}</span>}
                        {caseStudy.completedDate && (
                          <span>完成时间: {new Date(caseStudy.completedDate).toLocaleDateString('zh-CN')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">目标市场:</span>
                <span className="ml-2">
                  {targetMarketLabels[solution!.targetMarket] || solution!.targetMarket}
                </span>
              </div>
              <div>
                <span className="font-medium">复杂度:</span>
                <span className="ml-2">
                  {complexityLabels[solution!.complexity] || solution!.complexity}
                </span>
              </div>
              {solution!.developmentCycle && (
                <div>
                  <span className="font-medium">开发周期:</span>
                  <span className="ml-2">{solution!.developmentCycle} 天</span>
                </div>
              )}
              {solution!.costRange && (
                <div>
                  <span className="font-medium">成本范围:</span>
                  <span className="ml-2">
                    {solution!.costRange.min} - {solution!.costRange.max} {solution!.costRange.currency}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 应用场景 */}
          {solution!.applications && solution!.applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>应用场景</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {solution!.applications.map((app: string, index: number) => (
                    <Badge key={index} variant="secondary">{app}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 适用行业 */}
          {solution!.industries && solution!.industries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>适用行业</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {solution!.industries.map((industry) => (
                    <Badge key={industry._id} variant="outline">
                      {industry.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 相关产品 */}
          {solution!.relatedProducts && solution!.relatedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>相关产品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {solution!.relatedProducts.map((product) => (
                    <div key={product._id} className="flex items-center space-x-3 p-2 border rounded">
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500">图片</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title || product.partNumber}</p>
                        <p className="text-xs text-gray-500 truncate">{product.partNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
