const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function testStudioBasic() {
  try {
    console.log('🧪 测试Studio最简化配置...')
    
    // 测试创建brandBasic
    console.log('📝 创建第二个测试品牌...')
    
    const testBrand = {
      _type: 'brandBasic',
      name: 'MediaTek',
      description: '联发科技是全球领先的无线通信及数字多媒体解决方案提供商。',
      website: 'https://www.mediatek.com',
      country: 'TW',
      isActive: true,
    }
    
    const brandResult = await client.create(testBrand)
    console.log('✅ MediaTek品牌创建成功:', brandResult._id)
    
    // 获取所有brandBasic品牌
    console.log('📋 获取所有brandBasic品牌...')
    const allBrands = await client.fetch('*[_type == "brandBasic"] | order(name asc)')
    console.log('✅ 目前有', allBrands.length, '个brandBasic品牌:')
    
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} - ${brand.country} (${brand._id})`)
    })
    
    console.log('\n🎉 API功能正常！')
    console.log('🔧 现在请测试Studio界面功能:')
    console.log('1. 打开: http://localhost:3334')
    console.log('2. 现在应该能看到默认的文档类型列表')
    console.log('3. 查找 "品牌（基础版）" 并点击创建')
    console.log('4. 如果仍出现useHook错误，说明问题可能在Sanity版本兼容性')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    if (error.response) {
      console.error('响应错误:', error.response.body)
    }
  }
}

testStudioBasic()