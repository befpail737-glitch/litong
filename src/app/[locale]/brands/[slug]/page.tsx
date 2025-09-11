import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award,
  Globe,
  Building2,
  ExternalLink
} from 'lucide-react'
import { client } from '@/lib/sanity/client'

// 从Sanity获取品牌数据
const getBrandData = async (slug: string) => {
  try {
    const brand = await client.fetch(`
      *[_type == "brandBasic" && slug.current == $slug && isActive == true][0] {
        _id,
        name,
        "slug": slug.current,
        description,
        website,
        country,
        headquarters,
        established,
        logo,
        isActive,
        isFeatured
      }
    `, { slug })
    
    return brand
  } catch (error) {
    console.error('Error fetching brand from Sanity:', error)
    return null
  }
}

// 为不完整的品牌数据提供默认值
const enhanceBrandData = (brand: any, slug: string) => {
  return {
    ...brand,
    description: brand.description && brand.description !== slug ? brand.description : `${brand.name}是我们的重要合作伙伴，提供高质量的电子元器件产品和解决方案`,
    website: brand.website || `https://www.${slug}.com`,
    country: brand.country || '未知',
    headquarters: brand.headquarters || brand.country || '未知',
    established: brand.established || '未知',
    employees: '未知',
    isAuthorized: true,
    isPreferred: brand.isFeatured || false
  }
}

interface BrandPageProps {
  params: {
    locale: string
    slug: string
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  // 解码URL编码的slug（处理中文slug）
  const decodedSlug = decodeURIComponent(params.slug)
  console.log('BrandPage called with slug:', params.slug, 'decoded:', decodedSlug)
  
  // 从Sanity获取品牌数据
  let brand = await getBrandData(decodedSlug)
  console.log('Brand from Sanity:', brand)
  
  if (!brand) {
    console.log('Brand not found, calling notFound()')
    notFound()
  }

  // 增强品牌数据，为缺失字段提供默认值
  const enhancedBrand = enhanceBrandData(brand, decodedSlug)
  console.log('Enhanced brand data:', enhancedBrand)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold">{enhancedBrand.name}</h1>
                  {enhancedBrand.isPreferred && (
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      特色品牌
                    </span>
                  )}
                </div>
                <p className="text-xl text-blue-100 mb-6">
                  {enhancedBrand.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{enhancedBrand.established}</div>
                    <div className="text-blue-100 text-sm">成立年份</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{enhancedBrand.employees}</div>
                    <div className="text-blue-100 text-sm">员工数量</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{enhancedBrand.country}</div>
                    <div className="text-blue-100 text-sm">总部国家</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">✓</div>
                    <div className="text-blue-100 text-sm">授权代理</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* 公司信息 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">公司概况</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">总部位置</span>
                    <span className="font-medium">{enhancedBrand.headquarters}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">成立时间</span>
                    <span className="font-medium">{enhancedBrand.established}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">员工规模</span>
                    <span className="font-medium">{enhancedBrand.employees}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">官方网站</span>
                    <a 
                      href={enhancedBrand.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {enhancedBrand.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">合作状态</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 border border-green-200 rounded text-sm">
                      {enhancedBrand.isAuthorized ? '授权代理商' : '合作伙伴'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷导航 */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href={`/brands/${enhancedBrand.slug}/products`}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors duration-200 text-center"
            >
              <div className="text-lg font-semibold mb-1">浏览产品</div>
              <div className="text-sm opacity-90">查看全系列产品</div>
            </Link>
            
            <Link 
              href={`/brands/${enhancedBrand.slug}/solutions`}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 p-4 rounded-lg transition-colors duration-200 text-center"
            >
              <div className="text-lg font-semibold mb-1">解决方案</div>
              <div className="text-sm opacity-70">行业应用方案</div>
            </Link>
            
            <Link 
              href={`/brands/${enhancedBrand.slug}/support`}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 p-4 rounded-lg transition-colors duration-200 text-center"
            >
              <div className="text-lg font-semibold mb-1">技术支持</div>
              <div className="text-sm opacity-70">技术文档资料</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// SEO元数据
export async function generateMetadata({ params }: BrandPageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const brand = await getBrandData(decodedSlug)
  
  if (!brand) {
    return {
      title: '品牌未找到'
    }
  }

  const enhancedBrand = enhanceBrandData(brand, decodedSlug)

  return {
    title: `${enhancedBrand.name} - 授权代理商 | 力通电子`,
    description: `力通电子是${enhancedBrand.name}授权代理商，提供${enhancedBrand.name}全系列电子元器件产品，原装正品现货供应，专业技术支持服务。${enhancedBrand.description}`,
    keywords: `${enhancedBrand.name}代理,${enhancedBrand.name}现货,${enhancedBrand.name}芯片,电子元器件代理,半导体现货`,
  }
}