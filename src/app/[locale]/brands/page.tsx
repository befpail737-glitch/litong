import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Globe, MapPin, Users, Award, TrendingUp } from 'lucide-react'
import { client, urlFor } from '@/lib/sanity/client'
import Image from 'next/image'

// 强制动态渲染
export const dynamic = 'force-dynamic'

// 直接在组件中定义获取函数
async function getAllBrands() {
  try {
    const query = `*[_type == "brandBasic" && isActive == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`
    
    const brands = await client.fetch(query)
    return brands || []
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

async function getBrandStats() {
  try {
    const query = `{
      "total": count(*[_type == "brandBasic" && isActive == true]),
      "featured": count(*[_type == "brandBasic" && isActive == true && isFeatured == true]),
      "solutions": count(*[_type == "solution" && isPublished == true])
    }`
    
    const stats = await client.fetch(query)
    return {
      total: stats?.total || 0,
      authorized: stats?.featured || 0,
      totalProducts: (stats?.solutions || 0) * 1000, // 估算产品数量
    }
  } catch (error) {
    console.error('Error fetching brand stats:', error)
    return {
      total: 0,
      authorized: 0,
      totalProducts: 0,
    }
  }
}

export default async function BrandsPage() {
  const brands = await getAllBrands()
  const brandStats = await getBrandStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">合作品牌</h1>
            <p className="text-xl text-blue-100 mb-8">
              与全球领先的电子元器件制造商建立深度合作关系，为客户提供优质产品和专业服务
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{brandStats.total}+</div>
                <div className="text-blue-100">合作品牌</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{brandStats.authorized}</div>
                <div className="text-blue-100">授权代理</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{Math.floor(brandStats.totalProducts / 1000)}K+</div>
                <div className="text-blue-100">产品型号</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">15+</div>
                <div className="text-blue-100">年合作经验</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">特色品牌</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              与行业领军企业建立战略合作关系，确保为客户提供最新技术和最优质产品
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.filter((brand: any) => brand.isFeatured).map((brand: any) => (
              <Card key={brand._id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    {brand.logo ? (
                      <div className="h-8 w-8">
                        <Image
                          src={urlFor(brand.logo).width(32).height(32).url()}
                          alt={brand.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      </div>
                    ) : (
                      <Building2 className="h-8 w-8 text-blue-600" />
                    )}
                    {brand.isFeatured && <Badge className="bg-blue-100 text-blue-800">特色品牌</Badge>}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </CardTitle>
                  {brand.headquarters && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {brand.headquarters}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {brand.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {brand.description}
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    {brand.established && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">成立于 {brand.established}</span>
                      </div>
                    )}
                    {brand.website && (
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">官方网站</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {brand.country && (
                      <Badge variant="secondary" className="text-xs">
                        {brand.country}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/brands/${brand.slug}`}>
                        查看详情
                      </Link>
                    </Button>
                    {brand.website && (
                      <Button variant="outline" asChild>
                        <Link href={brand.website} target="_blank">
                          官方网站
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">所有合作品牌</h2>
            <p className="text-lg text-gray-600">
              完整的品牌合作伙伴列表，涵盖各个技术领域和应用场景
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand: any) => (
              <Link key={brand._id} href={`/brands/${brand.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {brand.logo ? (
                        <div className="h-6 w-6">
                          <Image
                            src={urlFor(brand.logo).width(24).height(24).url()}
                            alt={brand.name}
                            width={24}
                            height={24}
                            className="rounded"
                          />
                        </div>
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      )}
                      {brand.isFeatured && <Badge className="bg-blue-100 text-blue-800 text-xs">特色</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {brand.name}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2">
                      {brand.headquarters && brand.established ? `${brand.headquarters} • ${brand.established}` : 
                       brand.headquarters ? brand.headquarters : 
                       brand.established ? brand.established : 
                       brand.country || ''}
                    </div>
                    <div className="text-xs text-gray-600">
                      {brand.website ? '官方认证' : '合作品牌'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
