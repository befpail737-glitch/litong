import { BrandNavigation } from '@/components/layout/BrandNavigation';
import { getBrandWithContent, getAllBrands } from '@/lib/sanity/brands';
import { urlFor } from '@/lib/sanity/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, Target, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandSolutionsPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for all brands and locales
export async function generateStaticParams() {
  try {
    const brands = await getAllBrands();
    const locales = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'ar'];

    const params = [];
    for (const locale of locales) {
      for (const brand of brands) {
        if (brand.slug) {
          params.push({
            locale,
            slug: brand.slug,
          });

          // For Chinese brands, also add URL-encoded version
          if (brand.slug !== encodeURIComponent(brand.slug)) {
            params.push({
              locale,
              slug: encodeURIComponent(brand.slug),
            });
          }
        }
      }
    }

    console.log('Generated static params for brand solutions:', params.length);
    return params;
  } catch (error) {
    console.error('Error generating static params for brand solutions:', error);
    return [];
  }
}

export default async function BrandSolutionsPage({ params }: BrandSolutionsPageProps) {
  const { locale, slug } = params;

  // Decode slug to handle Chinese brand names
  const decodedSlug = decodeURIComponent(slug);

  try {
    const { brand, solutions } = await getBrandWithContent(decodedSlug);

    if (!brand) {
      console.warn(`Brand not found for slug: ${decodedSlug}`);
      notFound();
    }

    // Mock solution categories for demonstration
    const solutionCategories = [
      {
        icon: Target,
        title: '工业自动化',
        description: '为工业4.0提供完整的自动化解决方案',
        count: solutions?.filter(s => s.category?.includes('工业')).length || 3
      },
      {
        icon: Zap,
        title: '电源管理',
        description: '高效节能的电源管理系统设计',
        count: solutions?.filter(s => s.category?.includes('电源')).length || 5
      },
      {
        icon: Lightbulb,
        title: '智能物联网',
        description: '连接万物的智能IoT解决方案',
        count: solutions?.filter(s => s.category?.includes('IoT')).length || 4
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <BrandNavigation brand={brand} locale={locale} />
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {brand.name} 解决方案
                </h1>
                <p className="text-gray-600">
                  发现 {brand.name} 为各行业提供的专业技术解决方案
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索解决方案..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>
          </div>

          {/* Solution Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">解决方案分类</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {solutionCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.count} 个方案</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Solutions */}
          {solutions && solutions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">推荐解决方案</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((solution) => (
                  <div key={solution._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {solution.image && (
                      <div className="aspect-video relative bg-gray-100">
                        <Image
                          src={urlFor(solution.image).width(600).height(300).url()}
                          alt={solution.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {solution.category || '技术方案'}
                        </span>
                        {solution.featured && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                            推荐
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {solution.title}
                      </h3>
                      {solution.summary && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {solution.summary}
                        </p>
                      )}
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/${locale}/solutions/${solution.slug}`}>
                            了解详情
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/${locale}/inquiry`}>
                            咨询方案
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {solutions.length >= 6 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    查看更多解决方案
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No Solutions */}
          {(!solutions || solutions.length === 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无解决方案</h3>
              <p className="text-gray-600 mb-6">
                {brand.name} 的解决方案正在整理中，请稍后再来查看，或联系我们获取定制方案。
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/brands/${encodeURIComponent(brand.slug || brand.name)}`}>
                    返回品牌首页
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/${locale}/inquiry`}>
                    定制方案
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                需要定制化解决方案？
              </h2>
              <p className="text-blue-100 mb-6 text-lg">
                我们的技术专家团队可以根据您的具体需求，为您量身定制最适合的技术解决方案
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/${locale}/inquiry`}>
                    免费咨询
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href={`/${locale}/contact`}>
                    联系专家
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching brand solutions data:', error);
    notFound();
  }
}