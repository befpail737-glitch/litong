import { getBrandData } from '@/lib/sanity/brands';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  // 解码URL以支持中文品牌名称
  const decodedSlug = decodeURIComponent(params.slug);
  
  // 获取品牌数据
  const brand = await getBrandData(decodedSlug);
  
  if (!brand) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 品牌头部 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* 品牌logo */}
            {brand.logo && (
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <Image
                  src={urlFor(brand.logo).width(200).height(200).url()}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain border rounded-lg p-2"
                />
              </div>
            )}
            
            {/* 品牌信息 */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {brand.name}
              </h1>
              
              {brand.description && (
                <p className="text-lg text-gray-600 mb-4">{brand.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {brand.country && (
                  <span>📍 {brand.country}</span>
                )}
                {brand.established && (
                  <span>📅 成立于 {brand.established}</span>
                )}
                {brand.headquarters && (
                  <span>🏢 {brand.headquarters}</span>
                )}
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    🌐 官方网站
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 品牌详情内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">品牌介绍</h2>
              <div className="prose prose-gray max-w-none">
                {brand.description ? (
                  <p className="text-gray-600 leading-relaxed">{brand.description}</p>
                ) : (
                  <p className="text-gray-500">暂无详细介绍。</p>
                )}
              </div>
            </div>

            {/* 产品分类占位 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">产品分类</h2>
              <p className="text-gray-500">产品分类信息即将推出...</p>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">品牌信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">品牌名称:</span>
                  <span className="font-medium">{brand.name}</span>
                </div>
                {brand.country && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">所属国家:</span>
                    <span className="font-medium">{brand.country}</span>
                  </div>
                )}
                {brand.established && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">成立时间:</span>
                    <span className="font-medium">{brand.established}</span>
                  </div>
                )}
                {brand.headquarters && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">总部地址:</span>
                    <span className="font-medium text-right">{brand.headquarters}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">代理状态:</span>
                  <span className={`font-medium ${brand.isFeatured ? 'text-green-600' : 'text-blue-600'}`}>
                    {brand.isFeatured ? '重点品牌' : '合作品牌'}
                  </span>
                </div>
              </div>
            </div>

            {brand.website && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">外部链接</h3>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  访问官方网站 →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  // 这个函数将被build脚本忽略，因为我们使用自定义静态生成
  return [];
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