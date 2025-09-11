const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function debugPageRender() {
  try {
    console.log('🔍 调试前端页面渲染问题...')
    
    // 1. 获取原始数据
    console.log('\n📋 1. 检查数据库中的实际数据:')
    const rawBrands = await client.fetch('*[_type == "brandBasic"] | order(name asc)')
    rawBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - _id: ${brand._id}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log(`   - isFeatured: ${brand.isFeatured}`)
      console.log(`   - slug: ${brand.slug}`)
      console.log('')
    })
    
    // 2. 模拟前端getAllBrands查询（完全相同的查询）
    console.log('\n📋 2. 模拟前端 getAllBrands() 查询:')
    const query = `*[_type == "brandBasic" && isActive == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive
    }`
    
    const brands = await client.fetch(query)
    console.log(`查询结果: ${brands.length} 个品牌`)
    brands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - _id: ${brand._id}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log('   - 注意: 此查询没有获取 isFeatured 和 slug 字段!')
      console.log('')
    })
    
    // 3. 检查前端页面实际需要的完整查询
    console.log('\n📋 3. 前端页面实际需要的完整字段查询:')
    const fullQuery = `*[_type == "brandBasic" && isActive == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      slug,
      logo,
      headquarters,
      established
    }`
    
    const fullBrands = await client.fetch(fullQuery)
    console.log(`完整查询结果: ${fullBrands.length} 个品牌`)
    
    // 4. 测试前端过滤逻辑
    console.log('\n🔍 4. 测试前端过滤逻辑:')
    console.log('前端代码第60行: brands.filter(brand => brand.isFeatured)')
    
    const featuredFromIncomplete = brands.filter(brand => brand.isFeatured)
    console.log(`不完整数据的过滤结果: ${featuredFromIncomplete.length} 个 (因为没有isFeatured字段)`)
    
    const featuredFromComplete = fullBrands.filter(brand => brand.isFeatured)
    console.log(`完整数据的过滤结果: ${featuredFromComplete.length} 个`)
    featuredFromComplete.forEach(brand => {
      console.log(`  - ${brand.name} (isFeatured: ${brand.isFeatured})`)
    })
    
    // 5. 检查brands.ts查询是否包含所需字段
    console.log('\n⚠️  5. 关键问题发现:')
    console.log('前端 src/lib/sanity/brands.ts 的查询缺少关键字段!')
    console.log('当前查询只包含: _id, _type, name, description, website, country, isActive')
    console.log('但前端页面需要: isFeatured, slug, logo, headquarters, established')
    
    console.log('\n🎯 本质原因: brands.ts查询字段不完整!')
    
  } catch (error) {
    console.error('❌ 调试失败:', error)
  }
}

debugPageRender()