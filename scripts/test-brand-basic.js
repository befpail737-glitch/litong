const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function testBrandBasic() {
  try {
    console.log('🧪 测试brandBasic创建功能...')
    
    // 创建测试品牌（使用brandBasic - 最基础版本）
    console.log('📝 创建基础品牌...')
    
    const testBrand = {
      _type: 'brandBasic',
      name: 'Qualcomm',
      description: '高通公司是全球领先的无线技术创新者，专注于移动芯片和无线通信技术。',
      website: 'https://www.qualcomm.com',
      country: 'US',
      isActive: true,
    }
    
    const brandResult = await client.create(testBrand)
    console.log('✅ 基础品牌创建成功:', brandResult._id)
    
    // 验证品牌数据
    console.log('🔍 验证品牌数据...')
    const verifyQuery = '*[_type == "brandBasic" && name == "Qualcomm"][0]'
    const verifiedBrand = await client.fetch(verifyQuery)
    
    if (verifiedBrand) {
      console.log('✅ 品牌数据验证成功')
      console.log('品牌信息:', {
        id: verifiedBrand._id,
        name: verifiedBrand.name,
        website: verifiedBrand.website,
        country: verifiedBrand.country,
        isActive: verifiedBrand.isActive
      })
    } else {
      console.log('❌ 品牌数据验证失败')
    }
    
    // 获取所有brandBasic品牌
    console.log('📋 获取所有brandBasic品牌...')
    const allBrands = await client.fetch('*[_type == "brandBasic"] | order(name asc)')
    console.log('✅ 找到', allBrands.length, '个brandBasic品牌')
    
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} (${brand._id})`)
    })
    
    console.log('\n🎉 API测试完成！现在请在Sanity Studio中测试界面创建功能...')
    console.log('Sanity Studio: http://localhost:3334')
    console.log('导航到: 产品管理 → 品牌管理 → Create new document → 品牌（基础版）')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    if (error.response) {
      console.error('响应错误:', error.response.body)
    }
  }
}

testBrandBasic()