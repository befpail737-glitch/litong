const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function testBrandCreation() {
  try {
    console.log('🧪 测试品牌创建功能...')
    
    // 创建测试品牌（使用brandSimple）
    console.log('📝 创建测试品牌...')
    
    const testBrand = {
      _type: 'brandSimple',
      name: 'STMicroelectronics',
      slug: { 
        current: 'stmicroelectronics',
        _type: 'slug' 
      },
      description: '意法半导体（STMicroelectronics）是全球领先的半导体供应商，为各种电子应用提供创新的半导体解决方案。',
      website: 'https://www.st.com',
      country: 'IT',
      established: 1987,
      headquarters: '瑞士日内瓦',
      isActive: true,
      isFeatured: true,
    }
    
    const brandResult = await client.create(testBrand)
    console.log('✅ 测试品牌创建成功:', brandResult._id)
    
    // 验证品牌数据
    console.log('🔍 验证品牌数据...')
    const verifyQuery = '*[_type == "brandSimple" && name == "STMicroelectronics"][0]'
    const verifiedBrand = await client.fetch(verifyQuery)
    
    if (verifiedBrand) {
      console.log('✅ 品牌数据验证成功')
      console.log('品牌信息:', {
        id: verifiedBrand._id,
        name: verifiedBrand.name,
        slug: verifiedBrand.slug?.current,
        website: verifiedBrand.website,
        isActive: verifiedBrand.isActive
      })
    } else {
      console.log('❌ 品牌数据验证失败')
    }
    
    console.log('\n🎉 测试完成！')
    console.log('Sanity Studio: http://localhost:3334')
    console.log('前端品牌页面: http://localhost:3005/zh-CN/brands')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    if (error.response) {
      console.error('响应错误:', error.response.body)
    }
  }
}

testBrandCreation()