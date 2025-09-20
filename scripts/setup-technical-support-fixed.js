const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN, // 从环境变量获取token
  useCdn: false,
});

async function setupTechnicalSupportCategory() {
  try {
    console.log('🔍 Checking if technical-support category exists...');

    // 检查是否已存在technical-support分类
    const existingCategory = await client.fetch(
      `*[_type == "articleCategory" && slug.current == "technical-support"][0]`
    );

    if (existingCategory) {
      console.log('✅ Technical support category already exists:', existingCategory.name);
      return existingCategory;
    }

    console.log('📝 Creating technical-support category...');

    // 创建新的技术支持分类
    const newCategory = await client.create({
      _type: 'articleCategory',
      name: '技术支持',
      slug: {
        _type: 'slug',
        current: 'technical-support'
      },
      isVisible: true,
      description: '技术支持相关文章分类'
    });

    console.log('✅ Technical support category created successfully:', newCategory.name);
    return newCategory;

  } catch (error) {
    console.error('❌ Error setting up technical support category:', error);
    throw error;
  }
}

async function createSampleSupportArticles() {
  try {
    console.log('🔍 Checking for existing support articles...');

    // 查找技术支持分类
    const supportCategory = await client.fetch(
      `*[_type == "articleCategory" && slug.current == "technical-support"][0]`
    );

    if (!supportCategory) {
      throw new Error('Technical support category not found. Please run setupTechnicalSupportCategory first.');
    }

    // 检查是否已有技术支持文章
    const existingArticles = await client.fetch(
      `*[_type == "article" && articleType == "support"] | order(_createdAt desc)[0...3]`
    );

    if (existingArticles && existingArticles.length > 0) {
      console.log(`✅ Found ${existingArticles.length} existing support articles`);
      return existingArticles;
    }

    console.log('📝 Creating sample support articles...');

    // 获取一些品牌用于关联
    const brands = await client.fetch(
      `*[_type == "brandBasic" && isActive == true][0...3] { _id, name }`
    );

    if (!brands || brands.length === 0) {
      console.warn('⚠️ No active brands found. Creating articles without brand association.');
    }

    // 创建示例技术支持文章
    const sampleArticles = [
      {
        _type: 'article',
        title: '常见问题解答 - 产品规格说明',
        slug: {
          _type: 'slug',
          current: 'faq-product-specifications'
        },
        excerpt: '详细解答关于产品规格、技术参数等常见问题，帮助客户快速理解产品特性。',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '本文档整理了客户最常询问的产品规格相关问题，涵盖电气特性、机械尺寸、环境要求等方面的详细说明。'
              }
            ]
          }
        ],
        articleType: 'support',
        difficulty: 'beginner',
        isPublished: true,
        publishedAt: new Date().toISOString(),
        category: {
          _ref: supportCategory._id,
          _type: 'reference'
        },
        relatedBrands: brands.length > 0 ? [{ _ref: brands[0]._id, _type: 'reference' }] : []
      },
      {
        _type: 'article',
        title: '安装和调试指南',
        slug: {
          _type: 'slug',
          current: 'installation-debugging-guide'
        },
        excerpt: '提供详细的产品安装步骤和调试方法，确保产品能够正常运行。',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '正确的安装和调试是确保产品性能的关键。本指南将逐步介绍安装过程中的注意事项和调试方法。'
              }
            ]
          }
        ],
        articleType: 'support',
        difficulty: 'intermediate',
        isPublished: true,
        publishedAt: new Date().toISOString(),
        category: {
          _ref: supportCategory._id,
          _type: 'reference'
        },
        relatedBrands: brands.length > 1 ? [{ _ref: brands[1]._id, _type: 'reference' }] : []
      }
    ];

    // 创建文章
    const createdArticles = [];
    for (const article of sampleArticles) {
      try {
        const created = await client.create(article);
        createdArticles.push(created);
        console.log(`✅ Created article: ${created.title}`);
      } catch (error) {
        console.error(`❌ Failed to create article: ${article.title}`, error);
      }
    }

    console.log(`✅ Created ${createdArticles.length} sample support articles`);
    return createdArticles;

  } catch (error) {
    console.error('❌ Error creating sample support articles:', error);
    throw error;
  }
}

async function setupTechnicalSupport() {
  try {
    console.log('🚀 Starting technical support setup...');

    // 检查环境变量
    if (!process.env.SANITY_API_TOKEN && !process.env.SANITY_TOKEN) {
      console.error('❌ SANITY_API_TOKEN environment variable is required');
      process.exit(1);
    }

    // 1. 设置技术支持分类
    console.log('\n📝 Step 1: Setting up technical support category...');
    await setupTechnicalSupportCategory();

    // 2. 创建示例技术支持文章
    console.log('\n📝 Step 2: Creating sample technical support articles...');
    await createSampleSupportArticles();

    console.log('\n✅ Technical support setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Visit Sanity Studio to review and edit the articles');
    console.log('2. Create additional technical support articles as needed');
    console.log('3. Test the support pages on the frontend');

  } catch (error) {
    console.error('❌ Technical support setup failed:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  setupTechnicalSupport()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupTechnicalSupport, setupTechnicalSupportCategory, createSampleSupportArticles };