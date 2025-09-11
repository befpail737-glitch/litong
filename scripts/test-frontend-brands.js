const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  // 不使用token，模拟前端公开查询
})

async function testFrontendBrands() {
  try {
    console.log('🧪 测试前端品牌数据查询...')
    
    // 测试前端查询（模拟brands.ts中的查询）
    console.log('📋 执行前端getAllBrands查询...')
    
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
    console.log('✅ 查询成功！找到', brands.length, '个品牌:')
    
    brands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - 国家: ${brand.country || '未设置'}`)
      console.log(`   - 网站: ${brand.website || '未设置'}`)
      console.log(`   - 描述: ${brand.description ? brand.description.substring(0, 50) + '...' : '未设置'}`)
      console.log(`   - 启用: ${brand.isActive}`)
      console.log(`   - ID: ${brand._id}`)
      console.log('')
    })
    
    // 测试品牌统计查询
    console.log('📊 执行品牌统计查询...')
    const statsQuery = `{
      "total": count(*[_type == "brandBasic" && isActive == true]),
      "featured": count(*[_type == "brandBasic" && isActive == true]),
      "solutions": count(*[_type == "solution" && isPublished == true])
    }`
    
    const stats = await client.fetch(statsQuery)
    console.log('✅ 统计查询成功:')
    console.log(`   - 总品牌数: ${stats.total}`)
    console.log(`   - 特色品牌数: ${stats.featured}`)
    console.log(`   - 解决方案数: ${stats.solutions}`)
    
    console.log('\n🎉 前端品牌查询功能正常！')
    console.log('📍 现在检查前端页面: http://localhost:3005/zh-CN/brands')
    
  } catch (error) {
    console.error('❌ 查询失败:', error)
    if (error.response) {
      console.error('响应错误:', error.response.body)
    }
  }
}

testFrontendBrands()