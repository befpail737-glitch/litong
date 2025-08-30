import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 新闻文章数据获取函数
const getNewsData = (brandSlug: string, newsId: string) => {
  // 示例新闻数据
  const news = {
    'stm': {
      'stm32h5-launch': {
        id: 'stm32h5-launch',
        title: 'STM32H5系列正式发布：下一代高性能安全微控制器',
        category: 'product-launch',
        categoryName: '产品发布',
        publishDate: '2024-11-15',
        lastUpdated: '2024-11-15',
        author: {
          name: 'STMicroelectronics',
          title: '官方新闻'
        },
        tags: ['STM32H5', '产品发布', '安全', 'Cortex-M33', 'TrustZone'],
        summary: 'STMicroelectronics正式发布STM32H5系列微控制器，基于Arm® Cortex®-M33内核，集成TrustZone安全技术，为物联网和工业应用提供企业级安全保护。',
        
        featured_image: '/images/news/stm32h5-launch-hero.jpg',
        
        content: `## 革命性的安全微控制器

STMicroelectronics今天正式宣布推出STM32H5系列微控制器，这是公司迄今为止最安全的通用微控制器产品线。STM32H5系列基于Arm® Cortex®-M33内核，工作频率高达250MHz，集成了先进的安全功能，专为需要强大安全保护的应用而设计。

## 核心特性与优势

### 强大的处理性能
STM32H5系列采用40nm制程工艺，提供了卓越的处理性能：
- **Arm® Cortex®-M33内核**：工作频率高达250MHz
- **高速Flash存储器**：高达2MB，支持双Bank并行读取
- **大容量RAM**：高达640KB SRAM
- **先进的总线架构**：支持高带宽数据传输

### 企业级安全功能
STM32H5的安全特性是其最大亮点：

#### TrustZone® 技术
- **安全/非安全域隔离**：硬件级别的代码和数据隔离
- **安全启动**：确保系统从可信代码开始执行
- **安全调试**：在保护敏感代码的同时支持开发调试

#### 加密加速器
- **AES-256硬件加速**：支持多种加密模式
- **哈希处理器**：SHA-1/SHA-2硬件加速
- **真随机数发生器**：NIST SP800-90B认证
- **公钥加密**：支持RSA、ECC算法

#### 防篡改检测
- **有源篡改检测**：实时监控系统状态
- **被动篡改检测**：检测物理攻击
- **安全时钟监控**：防止时钟故障攻击

### 丰富的连接选项
STM32H5系列提供了全面的连接解决方案：
- **以太网MAC**：支持10/100Mbps以太网
- **USB接口**：USB 2.0 FS/HS，支持OTG
- **CAN-FD**：下一代CAN总线协议
- **多种串行接口**：UART、SPI、I²C、SAI等

## 目标应用领域

### 工业物联网 (IIoT)
STM32H5为工业4.0应用提供了理想的解决方案：
- **边缘计算网关**：本地数据处理和分析
- **智能传感器节点**：集成安全通信能力
- **工业控制器**：实时控制和安全通信

### 智能基础设施
- **智能电表**：支持安全的远程抄表和固件更新
- **楼宇自动化**：集中控制和监控系统
- **智能照明**：联网照明解决方案

### 医疗设备
- **便携式医疗设备**：安全的患者数据处理
- **远程监护设备**：安全的数据传输和存储
- **医疗物联网**：符合HIPAA等医疗数据保护法规

## 开发生态系统

### STM32CubeH5软件包
全新的软件包为STM32H5开发提供了完整支持：
- **HAL驱动库**：简化外设配置和使用
- **中间件组件**：包括安全库、通信协议栈
- **示例代码**：涵盖各种应用场景
- **TrustZone模板**：快速开发安全应用

### 开发工具支持
- **STM32CubeMX**：图形化配置工具，支持TrustZone配置
- **STM32CubeIDE**：集成开发环境，支持安全调试
- **STM32TrustedPackage Creator**：安全固件打包工具

### 评估板和开发板
- **NUCLEO-H563ZI**：高性能评估板
- **STM32H573I-DK**：发现套件，展示完整功能
- **STM32H562E-DK**：入门级开发板

## 产品规格概览

### STM32H563系列
- **内核**：Arm® Cortex®-M33 @ 250MHz
- **Flash**：高达2MB双Bank
- **RAM**：640KB
- **封装**：LQFP64至LQFP176
- **特色**：完整的TrustZone支持

### STM32H562系列  
- **内核**：Arm® Cortex®-M33 @ 250MHz
- **Flash**：高达2MB
- **RAM**：640KB
- **特色**：基础安全功能，成本优化

### STM32H503系列
- **内核**：Arm® Cortex®-M33 @ 250MHz  
- **Flash**：高达512KB
- **RAM**：128KB
- **特色**：入门级安全MCU

## 供货与定价

STM32H5系列现已开始量产，并通过STMicroelectronics全球分销网络供货：

- **STM32H563**：建议零售价从$4.50起（10K量）
- **STM32H562**：建议零售价从$3.80起（10K量）
- **STM32H503**：建议零售价从$2.20起（10K量）

## 技术支持与培训

STMicroelectronics为STM32H5系列提供全面的技术支持：

### 在线资源
- **应用笔记**：详细的技术文档和设计指南
- **参考设计**：完整的硬件和软件解决方案
- **视频教程**：从入门到高级的培训内容

### 技术培训
- **线上研讨会**：定期举办产品和技术培训
- **现场技术支持**：FAE工程师提供一对一支持
- **开发者社区**：活跃的技术交流平台

## 未来路线图

STM32H5系列是STMicroelectronics安全MCU战略的重要组成部分：
- **2025年Q1**：推出更多封装选项和存储配置
- **2025年Q2**：发布专用安全应用软件包
- **2025年下半年**：推出STM32H5无线连接版本

## 行业评价

> "STM32H5系列代表了嵌入式安全的新标杆。TrustZone技术的集成为我们的工业物联网项目提供了前所未有的安全保护。" 
> 
> —— 某知名工业自动化公司CTO

> "从评估到量产，STM32H5的开发体验非常出色。丰富的安全特性让我们能够快速开发符合严格安全要求的医疗设备。"
> 
> —— 医疗设备制造商技术总监

## 总结

STM32H5系列的发布标志着STMicroelectronics在安全微控制器领域的又一次重大突破。结合强大的处理性能、企业级安全功能和丰富的开发生态，STM32H5为各行业的安全关键应用提供了理想的解决方案。

随着物联网和边缘计算的快速发展，安全性已成为嵌入式系统的首要考虑因素。STM32H5系列以其先进的安全特性和卓越的性能表现，必将在智能制造、智慧城市、医疗健康等领域发挥重要作用。`,
        
        gallery: [
          {
            url: '/images/news/stm32h5-chip.jpg',
            caption: 'STM32H5系列芯片实物图',
            alt: 'STM32H5 microcontroller chip'
          },
          {
            url: '/images/news/stm32h5-board.jpg',
            caption: 'STM32H563ZI Nucleo开发板',
            alt: 'STM32H563ZI Nucleo development board'
          },
          {
            url: '/images/news/stm32h5-architecture.jpg',
            caption: 'STM32H5架构示意图',
            alt: 'STM32H5 architecture diagram'
          }
        ],
        
        related_news: [
          {
            id: 'stm32-ecosystem-2024',
            title: 'STM32生态系统2024年度回顾',
            date: '2024-11-10',
            summary: '回顾STM32在2024年的重要发布和技术进展'
          },
          {
            id: 'trustzone-security-guide',
            title: 'TrustZone安全技术深度解析',
            date: '2024-11-05', 
            summary: '详细解析Arm TrustZone技术在嵌入式安全中的应用'
          }
        ],
        
        downloads: [
          {
            title: 'STM32H5产品简介',
            description: '完整的产品特性和规格说明',
            url: '/documents/stm32h5-product-brief.pdf',
            size: '2.1MB'
          },
          {
            title: 'STM32H5选型指南',
            description: '帮助选择合适的STM32H5型号',
            url: '/documents/stm32h5-selection-guide.pdf',
            size: '1.5MB'
          }
        ]
      }
    }
  };

  return (news as any)[brandSlug]?.[newsId] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs and news IDs
  const brandNews = [
    { slug: 'stm', id: 'stm32h5-launch' }
  ];
  
  return brandNews.map((item) => ({
    slug: item.slug,
    id: item.id,
  }));
}

export async function generateMetadata({
  params: { locale, slug, id }
}: {
  params: { locale: string; slug: string; id: string };
}): Promise<Metadata> {
  const news = getNewsData(slug, id);
  
  if (!news) {
    return {
      title: 'News Not Found'
    };
  }
  
  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;
  
  return {
    title: `${news.title} - ${brandName} | LiTong`,
    description: news.summary,
    keywords: [...news.tags, `${brandName}新闻`, '产品发布'],
    openGraph: {
      title: news.title,
      description: news.summary,
      type: 'article',
      images: news.featured_image ? [news.featured_image] : undefined
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function NewsDetailPage({
  params: { locale, slug, id }
}: {
  params: { locale: string; slug: string; id: string };
}) {
  const news = getNewsData(slug, id);
  
  if (!news) {
    notFound();
  }

  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brandName, href: `/brands/${slug}` },
    { label: '新闻中心', href: `/brands/${slug}/news` },
    { label: news.title, href: `/brands/${slug}/news/${id}` }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* News Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {news.categoryName}
            </span>
            <span className="text-sm text-gray-500">
              发布时间：{formatDate(news.publishDate)}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {news.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {news.summary}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center pt-6 border-t border-gray-200">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
              {news.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{news.author.name}</div>
              <div className="text-sm text-gray-600">{news.author.title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {news.featured_image && (
        <div className="bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
            <img 
              src={news.featured_image} 
              alt={news.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border p-8">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: news.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^(.*)$/, '<p>$1</p>')
                }} />
              </div>

              {/* Gallery */}
              {news.gallery && news.gallery.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">相关图片</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.gallery.map((image: any, index: number) => (
                      <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <p className="text-sm text-gray-600">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads */}
              {news.downloads && news.downloads.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">相关资料下载</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.downloads.map((download: any, index: number) => (
                      <a key={index} href={download.url}
                         className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border">
                        <div className="flex items-center mb-3">
                          <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-500">{download.size}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{download.title}</h4>
                        <p className="text-gray-600 text-sm">{download.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Share */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">分享文章</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                  微信
                </button>
                <button className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-gray-900 transition-colors">
                  微博
                </button>
                <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors">
                  QQ
                </button>
              </div>
            </div>

            {/* Related News */}
            {news.related_news && news.related_news.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">相关新闻</h3>
                <div className="space-y-4">
                  {news.related_news.map((related: any, index: number) => (
                    <a key={related.id} href={`/brands/${slug}/news/${related.id}`}
                       className="block p-3 rounded hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm leading-tight">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{related.summary}</p>
                      <span className="text-xs text-gray-500">{formatDate(related.date)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">需要技术支持？</h3>
              <p className="text-sm text-gray-600 mb-4">
                我们的FAE团队随时为您提供专业的技术支持和解决方案。
              </p>
              <a href="/contact" 
                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title,
            "description": news.summary,
            "author": {
              "@type": "Organization",
              "name": news.author.name
            },
            "publisher": {
              "@type": "Organization",
              "name": "LiTong Electronics",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/${locale}/brands/${slug}/news/${id}`
            },
            "image": news.featured_image,
            "datePublished": news.publishDate,
            "dateModified": news.lastUpdated,
            "keywords": news.tags.join(", ")
          })
        }}
      />
    </>
  );
}