// 测试品牌数据查询
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // 使用最新数据
  perspective: 'published',
});

async function testBrandQueries() {
  console.log('🔍 开始测试品牌数据查询...\n');

  // 测试1: 检查是否有任何品牌数据
  try {
    console.log('📋 测试1: 检查所有品牌数据...');
    const allBrands = await client.fetch(`
      *[_type == "brandBasic"] {
        _id,
        name,
        "slug": slug.current,
        isActive,
        isFeatured,
        logo,
        description,
        _createdAt,
        _updatedAt
      }
    `);

    console.log(`✅ 找到 ${allBrands.length} 个品牌记录`);
    if (allBrands.length > 0) {
      console.log('📊 前5个品牌:', allBrands.slice(0, 5).map(b => ({
        名称: b.name,
        slug: b.slug,
        激活状态: b.isActive,
        推荐: b.isFeatured
      })));
    }
    console.log('');
  } catch (error) {
    console.error('❌ 测试1失败:', error.message);
  }

  // 测试2: 检查激活的品牌
  try {
    console.log('📋 测试2: 检查激活的品牌...');
    const activeBrands = await client.fetch(`
      *[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        logo,
        description,
        website,
        country,
        isActive,
        isFeatured
      }
    `);

    console.log(`✅ 找到 ${activeBrands.length} 个激活的品牌`);
    if (activeBrands.length > 0) {
      console.log('📊 激活品牌列表:', activeBrands.map(b => ({
        名称: b.name,
        slug: b.slug,
        国家: b.country,
        网站: b.website
      })));
    }
    console.log('');
  } catch (error) {
    console.error('❌ 测试2失败:', error.message);
  }

  // 测试3: 检查数据完整性
  try {
    console.log('📋 测试3: 检查数据完整性...');
    const brandStats = await client.fetch(`
      {
        "total": count(*[_type == "brandBasic"]),
        "published": count(*[_type == "brandBasic" && !(_id in path("drafts.**"))]),
        "active": count(*[_type == "brandBasic" && !(_id in path("drafts.**")) && isActive == true]),
        "featured": count(*[_type == "brandBasic" && !(_id in path("drafts.**")) && isActive == true && isFeatured == true]),
        "withLogos": count(*[_type == "brandBasic" && !(_id in path("drafts.**")) && defined(logo)]),
        "withDescriptions": count(*[_type == "brandBasic" && !(_id in path("drafts.**")) && defined(description)])
      }
    `);

    console.log('📊 品牌数据统计:', {
      总数: brandStats.total,
      已发布: brandStats.published,
      激活: brandStats.active,
      推荐: brandStats.featured,
      有Logo: brandStats.withLogos,
      有描述: brandStats.withDescriptions
    });
  } catch (error) {
    console.error('❌ 测试3失败:', error.message);
  }

  console.log('\n🎉 品牌数据测试完成!');
}

testBrandQueries().catch(console.error);