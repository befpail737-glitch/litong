const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
});

async function testFrontendQueries() {
  console.log('=== 测试前端可能的查询 ===');
  
  // 测试不同类型的查询
  const queries = [
    'brandSimple',
    'brand', 
    'brandMinimal',
    'brandBasic'
  ];
  
  for (const type of queries) {
    try {
      const result = await client.fetch(`*[_type == "${type}" && isActive == true] | order(name asc)`);
      console.log(`${type} 活跃品牌数量: ${result.length}`);
      result.forEach(brand => console.log(`  - ${brand.name}`));
    } catch (error) {
      console.log(`${type} 查询失败: ${error.message}`);
    }
  }
  
  console.log('\n=== 检查前端实际使用的查询 ===');
  // 检查当前前端代码在查询什么
  try {
    const { getAllBrands } = require('./src/lib/sanity/brands.ts');
    const brands = await getAllBrands();
    console.log('前端 getAllBrands() 返回:', brands.length, '个品牌');
    brands.forEach(brand => console.log(`  - ${brand.name} (${brand._id})`));
  } catch (error) {
    console.log('前端查询失败:', error.message);
  }
}

testFrontendQueries().catch(console.error);