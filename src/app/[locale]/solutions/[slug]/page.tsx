import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Settings,
  ArrowRight,
  ChevronRight,
  Target,
  Calendar,
  User,
  Lightbulb,
  Download,
  ExternalLink,
  MessageCircle,
  FileText,
  Clock
} from 'lucide-react';

import { getSolutionBySlug, getAllSolutions } from '@/lib/sanity/solutions';
import { urlFor } from '@/lib/sanity/client';

interface SolutionPageProps {
  params: {
    slug: string;
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const solution = await getSolutionBySlug(params.slug);

  if (!solution) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/solutions" className="hover:text-blue-600">解决方案</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{solution.title}</span>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="order-2 lg:order-1 p-8 lg:p-12">
            {/* Meta Info */}
            <div className="flex items-center space-x-4 mb-6">
              {solution.targetMarket && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {solution.targetMarket}
                </span>
              )}
              {solution.publishedAt && (
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(solution.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{solution.title}</h1>

            {solution.summary && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{solution.summary}</p>
            )}

            {/* Key Features */}
            {solution.keyFeatures && solution.keyFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  核心特性
                </h3>
                <ul className="space-y-2">
                  {solution.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link
                href="/inquiry"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>咨询方案</span>
              </Link>
              {solution.brand && (
                <Link
                  href={`/brands/${encodeURIComponent(solution.brand.slug || solution.brand.name)}`}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>查看品牌</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2">
            {solution.heroImage ? (
              <div className="h-64 lg:h-full">
                <Image
                  src={urlFor(solution.heroImage).width(600).height(400).url()}
                  alt={solution.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-64 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Settings className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Solution Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              方案详情
            </h2>

            {solution.content ? (
              <div className="prose max-w-none">
                {solution.content}
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">详细方案正在完善中</h3>
                <p className="text-gray-500 mb-6">
                  该解决方案的详细信息正在整理中，如需了解更多信息请联系我们
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

          {/* Applications */}
          {solution.applications && solution.applications.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                应用场景
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solution.applications.map((app, index) => (
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

          {/* Benefits */}
          {solution.benefits && solution.benefits.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                方案优势
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solution.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title || benefit}
                      </h4>
                      {benefit.description && (
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                获取支持
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  我们的技术专家可以为您提供定制化的解决方案咨询服务
                </p>
                <Link
                  href="/inquiry"
                  className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
                >
                  咨询技术专家
                </Link>
                <Link
                  href="/contact"
                  className="w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium block"
                >
                  联系我们
                </Link>
              </div>
            </div>

            {/* Solution Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">方案信息</h3>
              <div className="space-y-3">
                {solution.targetMarket && (
                  <div>
                    <span className="text-sm text-gray-500">目标市场</span>
                    <p className="font-medium">{solution.targetMarket}</p>
                  </div>
                )}
                {solution.publishedAt && (
                  <div>
                    <span className="text-sm text-gray-500">发布日期</span>
                    <p className="font-medium">
                      {new Date(solution.publishedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                )}
                {solution.brand && (
                  <div>
                    <span className="text-sm text-gray-500">相关品牌</span>
                    <Link
                      href={`/brands/${encodeURIComponent(solution.brand.slug || solution.brand.name)}`}
                      className="font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>{solution.brand.name}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                )}
                {solution.readingTime && (
                  <div>
                    <span className="text-sm text-gray-500">阅读时间</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{solution.readingTime} 分钟</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关链接</h3>
              <div className="space-y-2">
                <Link
                  href="/solutions"
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  所有解决方案
                </Link>
                {solution.brand && (
                  <Link
                    href={`/brands/${encodeURIComponent(solution.brand.slug || solution.brand.name)}/solutions`}
                    className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    品牌解决方案
                  </Link>
                )}
                <Link
                  href="/products"
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  相关产品
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
                    <p className="font-medium text-gray-900">方案白皮书</p>
                    <p className="text-sm text-gray-500">详细技术说明文档</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">应用案例</p>
                    <p className="text-sm text-gray-500">实际项目应用示例</p>
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
    const solutions = await getAllSolutions();

    const dynamicParams = solutions
      .filter(solution => solution.isActive && (solution.slug || solution._id))
      .map(solution => ({
        slug: solution.slug || solution._id
      }));

    console.log(`🔧 [solutions/[slug]] Generated ${dynamicParams.length} static params from real data`);
    return dynamicParams;
  } catch (error) {
    console.error('Error generating static params for solution detail:', error);
    console.log(`🔧 [solutions/[slug]] Returning empty params due to error`);
    return [];
  }
}

export async function generateMetadata({ params }: SolutionPageProps) {
  const solution = await getSolutionBySlug(params.slug);

  if (!solution) {
    return {
      title: '解决方案未找到 - 力通电子',
      description: '解决方案页面不存在或已被删除。'
    };
  }

  return {
    title: `${solution.title} - 力通电子解决方案`,
    description: solution.summary || solution.content || `${solution.title} - 力通电子提供的专业解决方案`,
    keywords: `${solution.title}, 解决方案, ${solution.targetMarket || ''}, ${solution.brand?.name || ''}, 力通电子`,
  };
}