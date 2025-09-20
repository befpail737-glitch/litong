// 直接创建技术支持文章的脚本
const https = require('https');

const SANITY_PROJECT_ID = 'oquvb2bs';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-01';
const SANITY_TOKEN = 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz';

function makeQuery(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function createDocument(document) {
  return new Promise((resolve, reject) => {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

    const postData = JSON.stringify({
      mutations: [
        {
          create: document
        }
      ]
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_TOKEN}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function createSupportArticles() {
  try {
    console.log('🚀 开始创建技术支持文章...\n');

    // 获取技术支持分类 ID
    console.log('1. 获取技术支持分类...');
    const categoryQuery = '*[_type == "articleCategory" && slug.current == "technical-support"][0] { _id, name }';
    const categoryResult = await makeQuery(categoryQuery);

    if (!categoryResult.result) {
      throw new Error('找不到技术支持分类');
    }

    const supportCategory = categoryResult.result;
    console.log(`   ✅ 找到分类: ${supportCategory.name} (ID: ${supportCategory._id})`);

    // 获取一些品牌 ID
    console.log('\n2. 获取品牌信息...');
    const brandsQuery = '*[_type == "brandBasic" && isActive == true][0...3] { _id, name, "slug": slug.current }';
    const brandsResult = await makeQuery(brandsQuery);

    const brands = brandsResult.result || [];
    console.log(`   ✅ 找到 ${brands.length} 个品牌可用于关联`);

    // 检查是否已有技术支持文章
    console.log('\n3. 检查现有技术支持文章...');
    const existingQuery = '*[_type == "article" && articleType == "support"] { _id, title }';
    const existingResult = await makeQuery(existingQuery);

    if (existingResult.result && existingResult.result.length > 0) {
      console.log(`   ⚠️ 已存在 ${existingResult.result.length} 篇技术支持文章，跳过创建`);
      return;
    }

    // 创建技术支持文章
    console.log('\n4. 创建示例技术支持文章...');

    const supportArticles = [
      {
        _type: 'article',
        title: '产品规格与技术参数说明',
        slug: {
          _type: 'slug',
          current: 'product-specifications-guide'
        },
        excerpt: '详细解释产品技术规格、电气参数和性能指标，帮助客户正确理解和使用产品。',
        content: [
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: '产品规格说明' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '本文档详细说明了产品的各项技术规格和参数，包括电气特性、机械尺寸、工作温度范围等关键信息。正确理解这些参数对于产品的选型和应用至关重要。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: '电气参数' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '电气参数是产品最重要的技术指标，包括额定电压、额定电流、功率等级、频率响应等。这些参数决定了产品能否满足您的应用需求。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: '环境要求' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '产品的工作环境要求包括温度范围、湿度限制、振动等级等。确保在规定的环境条件下使用产品，以保证最佳性能和使用寿命。'
              }
            ]
          }
        ],
        articleType: 'support',
        difficulty: 'beginner',
        readTime: 5,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
        category: {
          _ref: supportCategory._id,
          _type: 'reference'
        },
        relatedBrands: brands.length > 0 ? [{ _ref: brands[0]._id, _type: 'reference' }] : [],
        tags: ['产品规格', '技术参数', '电气特性', '环境要求']
      },
      {
        _type: 'article',
        title: '安装与调试完整指南',
        slug: {
          _type: 'slug',
          current: 'installation-debugging-complete-guide'
        },
        excerpt: '从开箱到调试完成的完整安装指南，包括安装步骤、调试方法和常见问题解决方案。',
        content: [
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: '安装准备' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '在开始安装之前，请确保您已准备好所有必要的工具和材料。仔细阅读产品说明书，了解安装要求和安全注意事项。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: '安装步骤' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '1. 检查包装内容是否完整\n2. 确认安装位置符合要求\n3. 按照接线图进行连接\n4. 检查所有连接是否牢固\n5. 进行通电前检查'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: '调试方法' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '调试过程需要逐步进行，从基本功能测试开始，逐步验证各项性能指标。如遇到问题，请参考故障排除章节或联系技术支持。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: '安全注意事项' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '安装和调试过程中请严格遵守安全操作规程，佩戴必要的防护设备，确保断电状态下进行接线操作。'
              }
            ]
          }
        ],
        articleType: 'support',
        difficulty: 'intermediate',
        readTime: 8,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date().toISOString(),
        category: {
          _ref: supportCategory._id,
          _type: 'reference'
        },
        relatedBrands: brands.length > 1 ? [{ _ref: brands[1]._id, _type: 'reference' }] : [],
        tags: ['安装指南', '调试方法', '安全操作', '故障排除']
      },
      {
        _type: 'article',
        title: '常见问题解答 (FAQ)',
        slug: {
          _type: 'slug',
          current: 'frequently-asked-questions'
        },
        excerpt: '收集了客户最常询问的问题和详细解答，帮助您快速找到问题的解决方案。',
        content: [
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: '产品选型问题' }]
          },
          {
            _type: 'block',
            style: 'h4',
            children: [{ _type: 'span', text: 'Q: 如何选择合适的产品型号？' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'A: 产品选型需要考虑应用需求、技术参数、环境条件等多个因素。建议您先明确具体的应用场景和技术要求，然后对比产品规格表选择最适合的型号。如需帮助，可联系我们的技术支持团队。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h4',
            children: [{ _type: 'span', text: 'Q: 产品是否支持定制？' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'A: 我们提供灵活的定制服务，可根据客户的特殊需求调整产品参数或功能。定制服务需要评估技术可行性和最小订购量，具体请咨询销售团队。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: '技术支持问题' }]
          },
          {
            _type: 'block',
            style: 'h4',
            children: [{ _type: 'span', text: 'Q: 产品出现故障如何处理？' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'A: 首先请参考产品手册中的故障排除章节进行初步检查。如问题仍未解决，请联系我们的技术支持团队，提供详细的故障现象描述和产品信息，我们将尽快为您提供解决方案。'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h4',
            children: [{ _type: 'span', text: 'Q: 如何获取技术文档？' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'A: 产品的技术文档包括数据手册、应用指南、安装说明等，可以在产品页面下载，或者联系销售代表获取最新版本的文档。'
              }
            ]
          }
        ],
        articleType: 'support',
        difficulty: 'beginner',
        readTime: 6,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
        category: {
          _ref: supportCategory._id,
          _type: 'reference'
        },
        relatedBrands: brands.length > 2 ? [{ _ref: brands[2]._id, _type: 'reference' }] : [],
        tags: ['常见问题', 'FAQ', '产品选型', '技术支持', '故障排除']
      }
    ];

    // 创建文章
    let createdCount = 0;
    for (const [index, article] of supportArticles.entries()) {
      try {
        console.log(`   创建文章 ${index + 1}: ${article.title}`);
        const result = await createDocument(article);
        if (result.results && result.results[0].operation === 'create') {
          createdCount++;
          console.log(`   ✅ 成功创建: ${article.title}`);
        }
      } catch (error) {
        console.error(`   ❌ 创建失败: ${article.title}`, error.message);
      }
    }

    console.log(`\n✅ 技术支持文章创建完成！成功创建 ${createdCount} 篇文章`);

    if (createdCount > 0) {
      console.log('\n🎉 后续步骤:');
      console.log('1. 访问 Sanity Studio 检查创建的文章');
      console.log('2. 为文章添加封面图片');
      console.log('3. 测试技术支持页面显示');
      console.log('4. 根据需要创建更多技术支持内容');
    }

  } catch (error) {
    console.error('❌ 创建技术支持文章失败:', error.message);
  }
}

createSupportArticles();