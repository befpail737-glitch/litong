const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function testBrandMinimal() {
  try {
    console.log('🧪 测试brandMinimal创建功能...')
    
    // 创建测试品牌（使用brandMinimal）
    console.log('📝 创建最简品牌...')
    
    const testBrand = {
      _type: 'brandMinimal',
      name: 'Texas Instruments',
      slug: { 
        current: 'texas-instruments',
        _type: 'slug' 
      },
      description: '德州仪器（TI）是全球领先的半导体设计制造公司，专注于模拟IC及嵌入式处理器开发。',
      website: 'https://www.ti.com',
      country: 'US',
      established: 1930,
      headquarters: '美国达拉斯',
      isActive: true,
      isFeatured: true,
    }
    
    const brandResult = await client.create(testBrand)
    console.log('✅ 最简品牌创建成功:', brandResult._id)
    
    // 验证品牌数据
    console.log('🔍 验证品牌数据...')
    const verifyQuery = '*[_type == "brandMinimal" && name == "Texas Instruments"][0]'
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
    
    // 获取所有brandMinimal品牌
    console.log('📋 获取所有brandMinimal品牌...')
    const allBrands = await client.fetch('*[_type == "brandMinimal"] | order(name asc)')
    console.log('✅ 找到', allBrands.length, '个brandMinimal品牌')
    
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} (${brand._id})`)
    })
    
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

testBrandMinimal()