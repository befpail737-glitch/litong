import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSolutions } from '@/lib/sanity/queries'
import { client } from '@/lib/sanity/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, ArrowLeft } from 'lucide-react'

// 从Sanity获取品牌数据
const getBrandData = async (slug: string) => {
  try {
    const brand = await client.fetch(`
      *[_type == "brandBasic" && slug.current == $slug && isActive == true][0] {
        _id,
        name,
        "slug": slug.current,
        description,
        isActive
      }
    `, { slug })
    
    return brand
  } catch (error) {
    console.error('Error fetching brand from Sanity:', error)
    return null
  }
}

interface BrandSolutionsPageProps {
  params: {
    locale: string
    slug: string
  }
}

// 禁用缓存，确保总是获取最新数据
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BrandSolutionsPage({ params }: BrandSolutionsPageProps) {
  // 解码URL编码的slug（处理中文slug）
  const decodedSlug = decodeURIComponent(params.slug)
  console.log('BrandSolutionsPage called with slug:', params.slug, 'decoded:', decodedSlug)
  
  // 从Sanity获取品牌数据
  const brand = await getBrandData(decodedSlug)
  console.log('Brand from Sanity:', brand)
  
  if (!brand) {
    console.log('Brand not found, calling notFound()')
    notFound()
  }

  // 获取该品牌相关的解决方案
  let solutions: any[] = []
  let total = 0
  let error = null
  
  try {
    // 获取所有解决方案，然后筛选与品牌相关的
    const result = await getSolutions({ limit: 100 })
    const allSolutions = result.solutions
    
    // 筛选与当前品牌相关的解决方案
    solutions = allSolutions.filter((solution: any) => {
      // 检查主要品牌
      if (solution.primaryBrand && solution.primaryBrand.slug === decodedSlug) {
        return true
      }
      // 检查相关品牌
      if (solution.relatedBrands && solution.relatedBrands.some((relatedBrand: any) => relatedBrand.slug === decodedSlug)) {
        return true
      }
      return false
    })
    
    total = solutions.length
    console.log(`Found ${total} solutions for brand ${brand.name}`)
    
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch solutions'
    console.error('Error fetching solutions for brand:', err)
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
  }

  const complexityLabels: Record<string, string> = {
    'simple': '简单',
    'medium': '中等',
    'complex': '复杂',
    'high-complex': '高复杂'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* 返回品牌页面的链接 */}
            <Link 
              href={`/${params.locale}/brands/${params.slug}`}
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回 {brand.name} 品牌页面
            </Link>
            
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{brand.name} 解决方案</h1>
                <p className="text-xl text-blue-100">
                  专业的 {brand.name} 电子元器件解决方案，为您的项目提供最优化的技术支持
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">解决方案列表</h2>
              <p className="text-gray-600">
                基于 {brand.name} 产品的专业解决方案
              </p>
            </div>
            {total > 0 && (
              <div className="text-sm text-gray-600">
                找到 {total} 个解决方案
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-semibold text-lg">加载错误</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}

        {solutions.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无解决方案</h3>
            <p className="text-gray-500 mb-6">
              {brand.name} 相关的解决方案正在准备中，敬请期待
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href={`/${params.locale}/brands/${params.slug}/products`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                查看产品
              </Link>
              <Link 
                href={`/${params.locale}/brands/${params.slug}`}
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-2 rounded-lg transition-colors"
              >
                返回品牌页面
              </Link>
            </div>
          </div>
        )}

        {solutions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card key={solution._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {/* 品牌关联类型标识 */}
                  <div className="flex items-center gap-2 mb-3">
                    {solution.primaryBrand && solution.primaryBrand.slug === decodedSlug && (
                      <Badge variant="default" className="bg-blue-600 text-white">
                        主要品牌
                      </Badge>
                    )}
                    {solution.relatedBrands && solution.relatedBrands.some((b: any) => b.slug === decodedSlug) && (
                      <Badge variant="secondary">
                        相关品牌
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
                  
                  {/* 其他相关品牌 */}
                  {solution.primaryBrand && solution.relatedBrands && solution.relatedBrands.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">相关品牌:</div>
                      <div className="flex flex-wrap gap-1">
                        {solution.primaryBrand.slug !== decodedSlug && (
                          <Badge key={solution.primaryBrand._id} variant="outline" className="text-xs">
                            {solution.primaryBrand.name}
                          </Badge>
                        )}
                        {solution.relatedBrands
                          .filter((brand: any) => brand.slug !== decodedSlug)
                          .map((brand: any) => (
                            <Badge key={brand._id} variant="outline" className="text-xs">
                              {brand.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {solution.slug ? (
                      <Link 
                        href={`/${params.locale}/solutions/${solution.slug}`}
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
        )}
      </div>
    </div>
  )
}

// SEO元数据
export async function generateMetadata({ params }: BrandSolutionsPageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const brand = await getBrandData(decodedSlug)
  
  if (!brand) {
    return {
      title: '品牌未找到'
    }
  }

  return {
    title: `${brand.name} 解决方案 | 力通电子`,
    description: `${brand.name} 专业电子元器件解决方案，为您的项目提供最优化的技术支持和产品配置。力通电子提供全面的${brand.name}解决方案服务。`,
    keywords: `${brand.name}解决方案,${brand.name}技术方案,电子元器件解决方案,${brand.name}应用方案`,
  }
}