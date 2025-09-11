const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function testFrontendFilters() {
  try {
    console.log('🧪 测试前端页面过滤逻辑...')
    
    // 模拟brands.ts中的getAllBrands查询
    const query = `*[_type == "brandBasic" && isActive == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      slug,
      isFeatured,
      logo,
      headquarters,
      established
    }`
    
    const brands = await client.fetch(query)
    console.log('✅ 获取所有品牌:', brands.length, '个')
    
    // 模拟前端页面第60行的过滤逻辑
    const featuredBrands = brands.filter(brand => brand.isFeatured)
    console.log('\n🌟 特色品牌过滤结果:')
    console.log(`brands.filter(brand => brand.isFeatured) = ${featuredBrands.length} 个品牌`)
    
    if (featuredBrands.length > 0) {
      console.log('✅ 特色品牌区域将显示以下品牌:')
      featuredBrands.forEach((brand, index) => {
        console.log(`${index + 1}. ${brand.name}`)
        console.log(`   - isFeatured: ${brand.isFeatured}`)
        console.log(`   - slug: ${brand.slug}`)
        console.log(`   - headquarters: ${brand.headquarters}`)
        console.log('')
      })
    } else {
      console.log('❌ 特色品牌区域将为空！所有品牌的 isFeatured 都不是 true')
    }
    
    console.log('\n📋 所有品牌区域将显示:')
    brands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log(`   - slug: ${brand.slug} ${brand.slug ? '✅' : '❌ 缺失'}`)
      console.log(`   - isFeatured: ${brand.isFeatured}`)
      console.log('')
    })
    
    // 检查可能导致页面错误的问题
    console.log('\n🔍 检查潜在问题:')
    const missingSlug = brands.filter(brand => !brand.slug)
    if (missingSlug.length > 0) {
      console.log('❌ 以下品牌缺少 slug 字段，可能导致链接错误:')
      missingSlug.forEach(brand => console.log(`   - ${brand.name}`))
    } else {
      console.log('✅ 所有品牌都有 slug 字段')
    }
    
    const hasUndefinedIsFeatured = brands.filter(brand => brand.isFeatured === undefined)
    if (hasUndefinedIsFeatured.length > 0) {
      console.log('❌ 以下品牌的 isFeatured 字段为 undefined:')
      hasUndefinedIsFeatured.forEach(brand => console.log(`   - ${brand.name}`))
    } else {
      console.log('✅ 所有品牌都有明确的 isFeatured 字段')
    }
    
    console.log('\n🎉 测试完成！')
    console.log('📍 前端页面应该现在能正常显示所有品牌')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

testFrontendFilters()