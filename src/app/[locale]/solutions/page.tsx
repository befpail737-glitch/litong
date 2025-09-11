import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { urlFor } from '@/lib/sanity/client';
import { getSolutions } from '@/lib/sanity/queries';

type Solution = {
  _id: string
  title: string
  slug: string
  summary: string
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
  isPublished: boolean
  isFeatured: boolean
}

interface SolutionsPageProps {
  params: {
    locale: string
  }
}

// 禁用缓存，确保总是获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SolutionsPage({ params: { locale } }: SolutionsPageProps) {

  let solutions: Solution[] = [];
  let total = 0;
  let error = null;

  try {
    const result = await getSolutions({ limit: 50 }); // 获取更多解决方案
    solutions = result.solutions;
    total = result.total;
    console.log('Successfully fetched solutions from Sanity:', solutions.length);
    console.log('Solutions data:', solutions.map(s => ({
      id: s._id,
      title: s.title,
      primaryBrand: s.primaryBrand?.name,
      relatedBrands: s.relatedBrands?.map(b => b.name)
    })));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch solutions';
    console.error('Error fetching solutions from Sanity:', err);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">解决方案</h1>
        <p className="text-gray-600">
          专业的电子元件解决方案，涵盖多个行业和应用领域
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold">加载错误</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {solutions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无解决方案</p>
          <p className="text-gray-400 mt-2">请在Sanity Studio中创建解决方案</p>
        </div>
      )}

      {solutions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">找到 {total} 个解决方案</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <Card key={solution._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              {/* 品牌信息 */}
              {solution.primaryBrand && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {solution.primaryBrand.logo ? (
                      <Image
                        src={urlFor(solution.primaryBrand.logo).width(40).height(40).url()}
                        alt={solution.primaryBrand.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                    ) : (
                      <span className="text-blue-600 font-semibold text-xs">
                        {solution.primaryBrand.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{solution.primaryBrand.name}</div>
                    {solution.relatedBrands && solution.relatedBrands.length > 0 && (
                      <div className="text-xs text-gray-500">
                        +{solution.relatedBrands.length} 个相关品牌
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                {solution.isFeatured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    推荐
                  </Badge>
                )}
                <Badge variant="outline">
                  {targetMarketLabels[solution.targetMarket] || solution.targetMarket}
                </Badge>
                <Badge variant="outline">
                  {complexityLabels[solution.complexity] || solution.complexity}
                </Badge>
              </div>

              <CardTitle className="line-clamp-2">
                {solution.title || '未命名解决方案'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {solution.summary || '暂无描述'}
              </CardDescription>
              <div className="flex justify-between items-center">
                {solution.slug ? (
                  <Link
                    href={`/${locale}/solutions/${solution.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    查看详情 →
                  </Link>
                ) : (
                  <span className="text-gray-400">无链接</span>
                )}
                {solution.publishedAt && (
                  <span className="text-sm text-gray-500">
                    {new Date(solution.publishedAt).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
