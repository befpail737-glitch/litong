import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 技术文章数据获取函数
const getArticleData = (brandSlug: string, articleId: string) => {
  // 示例文章数据
  const articles = {
    'stm': {
      'stm32-low-power-design': {
        id: 'stm32-low-power-design',
        title: 'STM32超低功耗设计指南',
        category: 'power-management',
        categoryName: '功耗管理',
        difficulty: 'intermediate',
        readTime: '15分钟',
        publishDate: '2024-11-15',
        lastUpdated: '2024-11-20',
        author: {
          name: 'STMicroelectronics FAE团队',
          title: '现场应用工程师',
          avatar: '/images/authors/stm-fae-team.jpg'
        },
        tags: ['STM32L4', '低功耗', 'Stop模式', 'Standby', '电池应用'],
        summary: '深入了解STM32L4系列的低功耗特性，掌握Stop、Standby等低功耗模式的配置和应用，实现电池供电应用的长期运行。',
        
        featured_image: '/images/articles/stm32-low-power-hero.jpg',
        
        content_sections: [
          {
            id: 'introduction',
            title: '引言',
            content: `在物联网和可穿戴设备快速发展的今天，超低功耗设计已成为嵌入式系统设计的关键要求。STM32L4系列微控制器专为低功耗应用而设计，提供了多种节能模式和优化技术。

本文将详细介绍STM32L4的低功耗特性，包括各种低功耗模式的配置方法、唤醒机制以及实际应用中的优化策略，帮助开发者实现真正的超低功耗系统设计。`,
            type: 'text'
          },
          {
            id: 'power-modes-overview',
            title: 'STM32L4功耗模式概述',
            content: `STM32L4系列提供了多种功耗模式，从正常运行模式到深度休眠模式，满足不同应用场景的功耗需求：

## 运行模式 (Run Mode)
- **Range 1**: 最高性能，80MHz，功耗~100µA/MHz
- **Range 2**: 平衡模式，26MHz，功耗~80µA/MHz

## 低功耗运行模式 (Low Power Run)
- 频率限制在2MHz以下
- 功耗仅~7µA/MHz
- 适合简单的后台任务

## 睡眠模式 (Sleep Mode)
- CPU停止，外设继续运行
- 功耗~50µA
- 可通过任意中断唤醒`,
            type: 'markdown'
          },
          {
            id: 'stop-modes',
            title: 'Stop模式详解',
            content: `## Stop 0模式
Stop 0是最常用的低功耗模式，在保持SRAM数据的同时实现超低功耗：

### 功耗特性
- 典型功耗：1.28µA (不含LSE)
- RTC运行时：1.4µA
- 支持所有SRAM和寄存器保持

### 配置代码示例
\`\`\`c
// 使能PWR时钟
__HAL_RCC_PWR_CLK_ENABLE();

// 配置Stop 0模式
HAL_PWREx_EnterSTOP0Mode(PWR_STOPENTRY_WFI);

// 系统从Stop模式唤醒后会从这里继续执行
// 需要重新配置系统时钟
SystemClock_Config();
\`\`\`

## Stop 1模式
进一步降低功耗的模式：

### 功耗特性
- 典型功耗：1.0µA
- 主稳压器关闭
- 部分SRAM内容可能丢失

### 唤醒源配置
\`\`\`c
// 配置WKUP引脚
HAL_PWR_EnableWakeUpPin(PWR_WAKEUP_PIN1_HIGH);

// 配置RTC唤醒
HAL_RTCEx_SetWakeUpTimer(&hrtc, 10, RTC_WAKEUPCLOCK_CK_SPRE_16BITS);
\`\`\``,
            type: 'markdown'
          },
          {
            id: 'standby-mode',
            title: 'Standby模式应用',
            content: `Standby模式是功耗最低的模式，适合长期休眠的应用：

## 功耗特性
- 典型功耗：0.032µA（不含RTC）
- 含RTC时：0.4µA
- 仅保持备份域寄存器和备份SRAM

## 进入Standby模式
\`\`\`c
// 清除唤醒标志
__HAL_PWR_CLEAR_FLAG(PWR_FLAG_WU);

// 使能WKUP1引脚
HAL_PWR_EnableWakeUpPin(PWR_WAKEUP_PIN1_HIGH);

// 进入Standby模式
HAL_PWR_EnterSTANDBYMode();
\`\`\`

## 唤醒处理
从Standby模式唤醒相当于系统复位，程序将从头开始执行：

\`\`\`c
// 在main函数开始检查复位原因
if (__HAL_PWR_GET_FLAG(PWR_FLAG_SB)) {
    // 从Standby唤醒
    __HAL_PWR_CLEAR_FLAG(PWR_FLAG_SB);
    // 执行唤醒后的初始化
}
\`\`\``,
            type: 'markdown'
          },
          {
            id: 'optimization-tips',
            title: '功耗优化技巧',
            content: [
              {
                title: 'GPIO配置优化',
                description: '正确配置GPIO可以显著降低漏电流',
                code: `// 将未使用的GPIO配置为输入上拉
GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

// 或配置为模拟输入（最低功耗）
GPIO_InitStruct.Mode = GPIO_MODE_ANALOG;
GPIO_InitStruct.Pull = GPIO_NOPULL;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);`
              },
              {
                title: '时钟管理',
                description: '合理配置系统时钟和外设时钟',
                code: `// 关闭不需要的外设时钟
__HAL_RCC_GPIOB_CLK_DISABLE();
__HAL_RCC_SPI2_CLK_DISABLE();

// 使用LSI代替LSE（如果精度要求不高）
RCC_OscInitStruct.LSIState = RCC_LSI_ON;`
              },
              {
                title: 'ADC功耗优化',
                description: 'ADC在低功耗模式下的优化配置',
                code: `// 使用ADC的低功耗模式
hadc1.Init.LowPowerAutoWait = ENABLE;
hadc1.Init.LowPowerAutoPowerOff = ENABLE;

// 在Stop模式下使用ADC
HAL_ADCEx_EnableVREFINT();
HAL_ADC_Start(&hadc1);`
              }
            ],
            type: 'tips'
          },
          {
            id: 'measurement-tools',
            title: '功耗测量工具',
            content: `## STM32CubeMonitor-Power
STM32官方提供的功耗分析工具：

### 主要功能
- 实时功耗监测
- 功耗波形显示  
- 不同模式功耗对比
- 优化建议

### 测量配置
\`\`\`c
// 在代码中添加测量标记
// 进入低功耗模式前
__HAL_DBGMCU_FREEZE_IWDG();
__HAL_DBGMCU_FREEZE_WWDG();

// 配置调试模式下的低功耗
HAL_DBGMCU_EnableDBGStopMode();
\`\`\`

## X-NUCLEO-LPM01A功耗测量扩展板
专业的功耗测量解决方案：
- 测量范围：1nA到200mA
- 高精度shunt电阻
- 与STM32CubeMonitor-Power配套使用`,
            type: 'markdown'
          },
          {
            id: 'case-study',
            title: '实际应用案例',
            content: `## 无线传感器节点设计

### 应用需求
- 电池供电，需运行3年以上
- 每小时采集并发送一次数据
- 99%时间处于休眠状态

### 设计方案
\`\`\`c
void sensor_node_main_loop(void) {
    while (1) {
        // 1. 唤醒系统，重新配置时钟
        SystemClock_Config();
        
        // 2. 初始化外设
        sensor_init();
        radio_init();
        
        // 3. 采集数据
        sensor_data_t data = read_sensors();
        
        // 4. 发送数据
        transmit_data(&data);
        
        // 5. 关闭外设
        sensor_deinit();
        radio_deinit();
        
        // 6. 配置RTC定时器（1小时后唤醒）
        set_rtc_wakeup_timer(3600);
        
        // 7. 进入Standby模式
        HAL_PWR_EnterSTANDBYMode();
    }
}
\`\`\`

### 功耗分析
- 工作状态（10秒）：20mA × 10s = 200mAs/h
- 休眠状态（3590秒）：0.4µA × 3590s = 1.44mAs/h  
- 总功耗：≈201.44mAs/h
- 使用2000mAh电池可运行约10年`,
            type: 'markdown'
          }
        ],
        
        related_articles: [
          {
            id: 'stm32-rtc-calendar',
            title: 'STM32 RTC和日历功能详解',
            summary: '深入了解STM32的实时时钟和日历功能配置'
          },
          {
            id: 'stm32-dma-optimization',
            title: 'STM32 DMA优化技术',
            summary: '使用DMA降低CPU负载，提高系统效率'
          }
        ],
        
        downloads: [
          {
            title: 'STM32L4低功耗示例代码',
            description: '完整的低功耗模式示例项目',
            url: '/downloads/stm32l4-low-power-examples.zip',
            size: '2.5MB'
          },
          {
            title: 'AN4445应用笔记',
            description: 'STM32L4系列时钟配置和低功耗模式',
            url: '/documents/an4445-stm32l4-clock-low-power.pdf',
            size: '1.8MB'
          }
        ]
      }
    }
  };

  return articles[brandSlug]?.[articleId] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs, locales and article IDs
  const brandArticles = [
    { brandSlug: 'stm', id: 'stm32-low-power-design' }
  ];
  const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  const params = [];
  for (const locale of locales) {
    for (const item of brandArticles) {
      params.push({
        locale,
        brandSlug: item.brandSlug,
        id: item.id,
      });
    }
  }
  
  return params;
}

export async function generateMetadata({
  params: { locale, brandSlug, id }
}: {
  params: { locale: string; brandSlug: string; id: string };
}): Promise<Metadata> {
  const article = getArticleData(brandSlug, id);
  
  if (!article) {
    return {
      title: 'Article Not Found'
    };
  }
  
  const brandName = brandSlug === 'stm' ? 'STMicroelectronics' : brandSlug;
  
  return {
    title: `${article.title} - ${brandName} | LiTong`,
    description: article.summary,
    keywords: [...article.tags, `${brandName}技术支持`, '技术文章'],
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      images: article.featured_image ? [article.featured_image] : undefined
    }
  };
}

export default async function SupportArticlePage({
  params: { locale, brandSlug, id }
}: {
  params: { locale: string; brandSlug: string; id: string };
}) {
  const article = getArticleData(brandSlug, id);
  
  if (!article) {
    notFound();
  }

  const brandName = brandSlug === 'stm' ? 'STMicroelectronics' : brandSlug;

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brandName, href: `/brands/${brandSlug}` },
    { label: '技术支持', href: `/brands/${brandSlug}/support` },
    { label: article.title, href: `/brands/${brandSlug}/support/${id}` }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return difficulty;
    }
  };

  const renderContent = (section: any) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            {section.content.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        );
      
      case 'markdown':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }} />
          </div>
        );
      
      case 'tips':
        return (
          <div className="space-y-6">
            {section.content.map((tip: any, index: number) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h4 className="font-semibold text-blue-900 mb-2">{tip.title}</h4>
                <p className="text-blue-800 mb-4">{tip.description}</p>
                {tip.code && (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                    <code>{tip.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>{section.content}</div>;
    }
  };

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
              {getDifficultyText(article.difficulty)}
            </span>
            <span className="text-sm text-gray-500">
              {article.readTime} 阅读时间
            </span>
            <span className="text-sm text-gray-500">
              发布于 {article.publishDate}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">{article.summary}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{article.author.name}</div>
              <div className="text-sm text-gray-600">{article.author.title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border p-8">
              {article.content_sections.map((section, index) => (
                <section key={section.id} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6" id={section.id}>
                    {section.title}
                  </h2>
                  {renderContent(section)}
                </section>
              ))}
            </article>

            {/* Downloads */}
            {article.downloads && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">相关下载</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.downloads.map((download, index) => (
                    <a key={index} href={download.url}
                       className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center mb-3">
                        <svg className="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">文章目录</h3>
              <nav className="space-y-2">
                {article.content_sections.map((section, index) => (
                  <a key={section.id} href={`#${section.id}`}
                     className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related Articles */}
            {article.related_articles && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">相关文章</h3>
                <div className="space-y-4">
                  {article.related_articles.map((related, index) => (
                    <a key={related.id} href={`/brands/${brandSlug}/support/${related.id}`}
                       className="block p-3 rounded hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900 mb-1">{related.title}</h4>
                      <p className="text-sm text-gray-600">{related.summary}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": article.title,
            "description": article.summary,
            "author": {
              "@type": "Person",
              "name": article.author.name
            },
            "publisher": {
              "@type": "Organization",
              "name": brandName
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/${locale}/brands/${brandSlug}/support/${id}`
            },
            "image": article.featured_image,
            "datePublished": article.publishDate,
            "dateModified": article.lastUpdated,
            "keywords": article.tags.join(", ")
          })
        }}
      />
    </>
  );
}