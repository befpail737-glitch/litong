const sanityClient = require('@sanity/client');

// Sanity client configuration
const client = sanityClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-01',
  token: process.env.SANITY_TOKEN, // 需要写入权限的token
  useCdn: false,
});

// 示例技术支持文章数据
const sampleSupportArticles = [
  {
    title: 'Infineon IGBT模块安装指南',
    slug: 'infineon-igbt-installation-guide',
    excerpt: '详细介绍Infineon IGBT模块的正确安装步骤、注意事项和常见问题解决方案',
    content: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '本指南将详细介绍Infineon IGBT模块的安装过程，包括硬件准备、安装步骤和测试验证。'
        }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '安装前准备'
        }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '1. 确保工作环境温度在15-25°C之间\n2. 准备防静电工具和设备\n3. 检查IGBT模块外观是否完好'
        }],
        style: 'normal'
      }
    ],
    relatedBrands: ['infineon'], // 需要替换为实际的Infineon品牌_id
    category: 'technical-support', // 需要替换为实际的技术支持分类_id
    articleType: 'support',
    difficulty: 'intermediate',
    readTime: 10,
    isPublished: true,
    publishedAt: new Date().toISOString()
  },
  {
    title: 'TI DSP调试常见问题解决',
    slug: 'ti-dsp-debugging-faq',
    excerpt: 'Texas Instruments DSP芯片调试过程中常见问题的诊断方法和解决方案',
    content: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '本文档汇总了TI DSP调试过程中最常见的问题及其解决方案，帮助工程师快速定位和解决问题。'
        }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '问题1：程序无法正常启动'
        }],
        style: 'h3'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '检查启动配置：验证Boot Mode设置是否正确，确认BOOTCFG寄存器配置。'
        }],
        style: 'normal'
      }
    ],
    relatedBrands: ['ti'], // 需要替换为实际的TI品牌_id
    category: 'technical-support',
    articleType: 'support',
    difficulty: 'advanced',
    readTime: 15,
    isPublished: true,
    publishedAt: new Date().toISOString()
  },
  {
    title: 'Cree SiC器件热管理最佳实践',
    slug: 'cree-sic-thermal-management',
    excerpt: 'Cree碳化硅器件的热管理设计要点和散热解决方案推荐',
    content: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'SiC器件的热管理对于确保器件可靠性和性能至关重要。本文介绍Cree SiC器件的热管理最佳实践。'
        }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '热阻分析'
        }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '结温计算公式：Tj = Ta + (Pd × Rth(j-a))\n其中Tj为结温，Ta为环境温度，Pd为功率损耗，Rth(j-a)为结到环境热阻。'
        }],
        style: 'normal'
      }
    ],
    relatedBrands: ['cree'], // 需要替换为实际的Cree品牌_id
    category: 'technical-support',
    articleType: 'support',
    difficulty: 'expert',
    readTime: 12,
    isPublished: true,
    publishedAt: new Date().toISOString()
  }
];

async function createSampleSupportArticles() {
  try {
    console.log('🔍 Checking for existing brands and categories...');

    // 获取品牌和分类的实际_id
    const [brands, categories, authors] = await Promise.all([
      client.fetch(`*[_type == "brandBasic" && isActive == true] { _id, name, "slug": slug.current }`),
      client.fetch(`*[_type == "articleCategory"] { _id, name, "slug": slug.current }`),
      client.fetch(`*[_type == "author"] { _id, name }`)
    ]);

    console.log('Found brands:', brands.map(b => b.name).join(', '));
    console.log('Found categories:', categories.map(c => c.name).join(', '));
    console.log('Found authors:', authors.map(a => a.name).join(', '));

    // 查找技术支持分类
    const supportCategory = categories.find(cat => cat.slug === 'technical-support');
    if (!supportCategory) {
      console.error('❌ Technical support category not found. Please run setup-technical-support-category.js first.');
      return;
    }

    // 获取默认作者或创建一个
    let defaultAuthor = authors[0];
    if (!defaultAuthor) {
      console.log('📝 Creating default author...');
      defaultAuthor = await client.create({
        _type: 'author',
        name: '技术支持团队',
        email: 'technical@litong.com'
      });
    }

    console.log('📝 Creating sample technical support articles...');

    const createdArticles = [];

    for (const articleData of sampleSupportArticles) {
      // 查找对应的品牌
      const relatedBrandRefs = [];
      for (const brandSlug of articleData.relatedBrands) {
        const brand = brands.find(b => b.slug === brandSlug);
        if (brand) {
          relatedBrandRefs.push({
            _type: 'reference',
            _ref: brand._id
          });
        }
      }

      if (relatedBrandRefs.length === 0) {
        console.warn(`⚠️ No brands found for article: ${articleData.title}`);
        continue;
      }

      // 检查是否已存在相同slug的文章
      const existingArticle = await client.fetch(
        `*[_type == "article" && slug.current == $slug][0]`,
        { slug: articleData.slug }
      );

      if (existingArticle) {
        console.log(`ℹ️ Article with slug "${articleData.slug}" already exists, skipping...`);
        continue;
      }

      // 创建文章
      const article = await client.create({
        _type: 'article',
        title: articleData.title,
        slug: {
          _type: 'slug',
          current: articleData.slug
        },
        excerpt: articleData.excerpt,
        content: articleData.content,
        relatedBrands: relatedBrandRefs,
        category: {
          _type: 'reference',
          _ref: supportCategory._id
        },
        author: {
          _type: 'reference',
          _ref: defaultAuthor._id
        },
        articleType: articleData.articleType,
        difficulty: articleData.difficulty,
        readTime: articleData.readTime,
        isPublished: articleData.isPublished,
        publishedAt: articleData.publishedAt
      });

      createdArticles.push(article);
      console.log(`✅ Created support article: ${article.title}`);
    }

    console.log(`✅ Successfully created ${createdArticles.length} technical support articles`);
    return createdArticles;

  } catch (error) {
    console.error('❌ Error creating sample support articles:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createSampleSupportArticles()
    .then(() => {
      console.log('✅ Sample support articles creation complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sample support articles creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createSampleSupportArticles };