import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';

import {
  FileText,
  ChevronRight,
  Calendar,
  User,
  Clock,
  Download,
  ExternalLink,
  MessageCircle,
  BookOpen,
  ArrowLeft,
  Share2,
  Tag,
  HelpCircle
} from 'lucide-react';

import { getBrandData } from '@/lib/sanity/brands';
import { getArticleBySlug, getAllArticles } from '@/lib/sanity/articles';
import { urlFor } from '@/lib/sanity/client';

// PortableText 自定义组件配置
const portableTextComponents = {
  block: {
    // 普通段落
    normal: ({ children }: any) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,

    // 标题
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h4>,

    // 引用
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },

  list: {
    // 无序列表
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 pl-4 text-gray-700">{children}</ul>,
    // 有序列表
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 pl-4 text-gray-700">{children}</ol>,
  },

  listItem: {
    // 列表项
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>,
  },

  marks: {
    // 文本标记
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <u className="underline">{children}</u>,
    'strike-through': ({ children }: any) => <s className="line-through">{children}</s>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
    ),

    // 链接
    link: ({ value, children }: any) => (
      <a
        href={value.href}
        target={value.target || '_self'}
        className="text-blue-600 hover:text-blue-800 underline"
        rel={value.target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),

    // 颜色
    color: ({ value, children }: any) => (
      <span style={{ color: value.hex }}>{children}</span>
    ),

    // 字体大小
    fontSize: ({ value, children }: any) => (
      <span className={value.size}>{children}</span>
    ),
  },

  types: {
    // 图片
    image: ({ value }: any) => (
      <figure className="my-6">
        <Image
          src={urlFor(value).width(800).height(600).url()}
          alt={value.alt || ''}
          width={800}
          height={600}
          className="rounded-lg shadow-lg"
        />
        {value.caption && (
          <figcaption className="text-center text-sm text-gray-600 mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),

    // PDF 文件
    pdf: ({ value }: any) => (
      <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-red-600" />
          <div>
            <h4 className="font-medium text-gray-900">{value.title}</h4>
            {value.description && (
              <p className="text-sm text-gray-600">{value.description}</p>
            )}
          </div>
          <a
            href={value.asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          >
            <Download className="h-4 w-4" />
            <span>下载</span>
          </a>
        </div>
      </div>
    ),

    // 表格
    table: ({ value }: any) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          {value.title && (
            <caption className="text-lg font-medium text-gray-900 mb-2">
              {value.title}
            </caption>
          )}
          <tbody>
            {value.rows?.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50' : ''}>
                {row.cells?.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-200 px-4 py-2 text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
};

interface BrandSupportArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default async function BrandSupportArticlePage({ params }: BrandSupportArticlePageProps) {
  const decodedSlug = decodeURIComponent(params.slug);

  // Convert URL-friendly slug back to original slug for article lookup
  const originalArticleSlug = params.id.replace(/-/g, ' ');

  const [brand, article] = await Promise.all([
    getBrandData(decodedSlug),
    // Try both the original slug and the URL-friendly version
    getArticleBySlug(originalArticleSlug).then(result =>
      result || getArticleBySlug(params.id)
    )
  ]);

  if (!brand || !article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/brands" className="hover:text-blue-600">品牌</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`} className="hover:text-blue-600">
          {brand.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/support`} className="hover:text-blue-600">
          技术支持
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{article.title}</span>
      </div>

      {/* Back to Support */}
      <div className="mb-6">
        <Link
          href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/support`}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回 {brand.name} 技术支持</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-8 lg:p-12">
          {/* Brand Context */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">来自品牌：</span>
            <Link
              href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
              className="font-medium text-blue-600 hover:text-blue-800 ml-1"
            >
              {brand.name}
            </Link>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              技术支持
            </span>
            {article.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category.name}
              </span>
            )}
            {article.tags && article.tags.length > 0 && (
              article.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {tag}
                </span>
              ))
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

          {article.summary && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6">{article.summary}</p>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            {article.author && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
            {article.publishedAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
              </div>
            )}
            {article.readingTime && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} 分钟阅读</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>分享文章</span>
            </button>
            <Link
              href="/inquiry"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>技术咨询</span>
            </Link>
            <Link
              href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>查看相关产品</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Article Image */}
        {article.featuredImage && (
          <div className="h-64 lg:h-80 bg-gray-100">
            <Image
              src={urlFor(article.featuredImage).width(800).height(400).url()}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="prose max-w-none">
              {article.content && Array.isArray(article.content) && article.content.length > 0 ? (
                <PortableText value={article.content} components={portableTextComponents} />
              ) : article.content && typeof article.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">技术文档正在完善中</h3>
                  <p className="text-gray-500 mb-6">
                    该技术支持文档正在整理中，我们的技术专家正在为您准备详细的解决方案
                  </p>
                  <Link
                    href="/inquiry"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>联系技术专家</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Brand Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              {brand.name} 相关支持
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-2">产品资料</h4>
                <p className="text-sm text-gray-600">查看 {brand.name} 的完整产品线和技术规格</p>
              </Link>
              <Link
                href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-2">解决方案</h4>
                <p className="text-sm text-gray-600">探索基于 {brand.name} 产品的完整解决方案</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Brand Support Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                {brand.name} 技术支持
              </h3>
              <div className="space-y-3">
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
                  联系销售团队
                </Link>
              </div>
            </div>

            {/* Article Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文章信息</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">所属品牌</span>
                  <Link
                    href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                    className="block font-medium text-blue-600 hover:text-blue-800"
                  >
                    {brand.name}
                  </Link>
                </div>
                {article.category && (
                  <div>
                    <span className="text-sm text-gray-500">分类</span>
                    <p className="font-medium">{article.category.name}</p>
                  </div>
                )}
                {article.author && (
                  <div>
                    <span className="text-sm text-gray-500">作者</span>
                    <p className="font-medium">{article.author}</p>
                  </div>
                )}
                {article.publishedAt && (
                  <div>
                    <span className="text-sm text-gray-500">发布日期</span>
                    <p className="font-medium">
                      {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                )}
                {article.readingTime && (
                  <div>
                    <span className="text-sm text-gray-500">阅读时间</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{article.readingTime} 分钟</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌相关</h3>
              <div className="space-y-2">
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  品牌首页
                </Link>
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/products`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  产品分类
                </Link>
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/solutions`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  解决方案
                </Link>
                <Link
                  href={`/brands/${encodeURIComponent(brand.slug || brand.name)}/support`}
                  className="block p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  技术支持
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
                技术资源
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">产品手册</p>
                    <p className="text-sm text-gray-500">{brand.name} 产品技术手册</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <p className="font-medium text-gray-900">应用指南</p>
                    <p className="text-sm text-gray-500">技术应用和案例说明</p>
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
    console.log('🔧 [brands/[slug]/support/[id]] Generating static params...');

    const [{ getAllBrands }, articles] = await Promise.all([
      import('@/lib/sanity/brands'),
      getAllArticles()
    ]);

    const brands = await getAllBrands();

    console.log(`🔧 [brands/[slug]/support/[id]] Fetched ${brands.length} brands and ${articles.length} articles`);

    if (brands.length === 0) {
      console.warn('⚠️ [brands/[slug]/support/[id]] No brands found, using fallback');
      // Return some fallback params for common test cases
      return [
        { slug: 'cree', id: '55555' },
        { slug: 'cree', id: '11111' },
        { slug: 'mediatek', id: '55555' },
        { slug: 'qualcomm', id: '55555' }
      ];
    }

    const staticParams = [];

    brands
      .filter(brand => brand.isActive !== false && (brand.slug || brand.name))
      .forEach(brand => {
        const originalSlug = brand.slug || brand.name;

        // Get articles for this brand or general articles
        const brandArticles = articles.filter(article =>
          // Check if the article is associated with this brand through relatedBrands
          (article.relatedBrands && article.relatedBrands.some(relatedBrand =>
            relatedBrand.name === brand.name ||
            relatedBrand.slug === originalSlug ||
            relatedBrand.slug === originalSlug.toLowerCase()
          )) ||
          // Check if the article has a direct brand association
          (article.brand && (
            article.brand.name === brand.name ||
            article.brand.slug === originalSlug ||
            article.brand.slug === originalSlug.toLowerCase()
          ))
        );

        console.log(`🔧 [brands/[slug]/support/[id]] Brand ${brand.name} has ${brandArticles.length} articles`);

        brandArticles.forEach(article => {
          const rawId = article.slug || article._id;
          const articleId = typeof rawId === 'string' ? rawId.replace(/\s+/g, '-') : String(rawId).replace(/\s+/g, '-');

          // For English brands, generate both uppercase and lowercase versions
          if (/^[A-Z]/.test(originalSlug)) {
            // Original version
            const originalParam = {
              slug: encodeURIComponent(originalSlug),
              id: articleId
            };
            staticParams.push(originalParam);
            console.log(`🔧 [brands/[slug]/support/[id]] Generated param: ${originalParam.slug}/${originalParam.id}`);

            // Lowercase version
            const lowercaseParam = {
              slug: encodeURIComponent(originalSlug.toLowerCase()),
              id: articleId
            };
            staticParams.push(lowercaseParam);
            console.log(`🔧 [brands/[slug]/support/[id]] Generated param: ${lowercaseParam.slug}/${lowercaseParam.id}`);
          } else {
            // Chinese brands or others
            const chineseParam = {
              slug: encodeURIComponent(originalSlug),
              id: articleId
            };
            staticParams.push(chineseParam);
            console.log(`🔧 [brands/[slug]/support/[id]] Generated param: ${chineseParam.slug}/${chineseParam.id}`);
          }
        });

        // Always include some fallback test IDs for each brand (whether they have articles or not)
        ['55555', '11111', 'test-article'].forEach(testId => {
          if (!brandArticles.find(a => (a.slug || a._id) === testId)) {
            const brandSlugs = [];
            if (/^[A-Z]/.test(originalSlug)) {
              brandSlugs.push(originalSlug, originalSlug.toLowerCase());
            } else {
              brandSlugs.push(originalSlug);
            }

            brandSlugs.forEach(slug => {
              const param = {
                slug: /^[A-Za-z]/.test(slug) ? encodeURIComponent(slug) : encodeURIComponent(slug),
                id: testId
              };
              staticParams.push(param);
              console.log(`🔧 [brands/[slug]/support/[id]] Generated fallback param: ${param.slug}/${param.id}`);
            });
          }
        });
      });

    console.log(`🔧 [brands/[slug]/support/[id]] Generated ${staticParams.length} static params`);
    return staticParams;
  } catch (error) {
    console.error('❌ [brands/[slug]/support/[id]] Error generating static params:', error);

    // Return fallback params to prevent complete failure
    console.log('🔧 [brands/[slug]/support/[id]] Using emergency fallback params');
    return [
      { slug: 'cree', id: '55555' },
      { slug: 'cree', id: '11111' },
      { slug: 'cree', id: 'test-article' },
      { slug: 'mediatek', id: '55555' },
      { slug: 'mediatek', id: '11111' },
      { slug: 'qualcomm', id: '55555' },
      { slug: 'qualcomm', id: '11111' }
    ];
  }
}

export async function generateMetadata({ params }: BrandSupportArticlePageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const [brand, article] = await Promise.all([
    getBrandData(decodedSlug),
    getArticleBySlug(params.id)
  ]);

  if (!brand || !article) {
    return {
      title: '技术支持文章 - 力通电子',
      description: '技术支持文章页面'
    };
  }

  return {
    title: `${article.title} - ${brand.name} 技术支持 - 力通电子`,
    description: article.summary || article.content || `${article.title} - ${brand.name}品牌技术支持文档`,
    keywords: `${article.title}, ${brand.name}, 技术支持, ${article.category?.name || ''}, ${article.tags?.join(', ') || ''}, 力通电子`,
  };
}