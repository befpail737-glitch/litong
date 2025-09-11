const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function fixBrandFields() {
  try {
    console.log('🔧 修复品牌字段不匹配问题...')
    
    // 获取所有brandBasic品牌
    const brands = await client.fetch('*[_type == "brandBasic"]')
    console.log(`📋 找到 ${brands.length} 个品牌需要修复`)
    
    for (const brand of brands) {
      console.log(`\n🔄 修复品牌: ${brand.name}`)
      
      // 生成slug（将名称转为小写并替换特殊字符）
      const slug = brand.name.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-') // 保留中文字符
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      // 设置isFeatured（前3个设为特色品牌）
      const isFeatured = brands.indexOf(brand) < 3
      
      // 更新文档
      const result = await client
        .patch(brand._id)
        .set({
          slug: slug,
          isFeatured: isFeatured,
          // 如果需要，也可以添加其他缺失字段
          logo: null, // 前端期望的logo字段
          headquarters: brand.country, // 使用country作为headquarters
          established: null // 前端期望的established字段
        })
        .commit()
      
      console.log(`✅ ${brand.name} 已更新:`)
      console.log(`   - slug: ${slug}`)
      console.log(`   - isFeatured: ${isFeatured}`)
      console.log(`   - headquarters: ${brand.country}`)
    }
    
    // 验证修复结果
    console.log('\n📊 验证修复结果...')
    const updatedBrands = await client.fetch(`*[_type == "brandBasic"] {
      _id, name, slug, isFeatured, isActive
    }`)
    
    console.log('✅ 修复后的品牌列表:')
    updatedBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - slug: ${brand.slug}`)
      console.log(`   - isFeatured: ${brand.isFeatured}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log('')
    })
    
    // 测试前端过滤器
    const featuredBrands = updatedBrands.filter(brand => brand.isFeatured)
    console.log(`🌟 特色品牌数量: ${featuredBrands.length}`)
    featuredBrands.forEach(brand => {
      console.log(`   - ${brand.name}`)
    })
    
    console.log('\n🎉 字段修复完成！')
    console.log('📍 现在请刷新前端页面: http://localhost:3006/zh-CN/brands')
    console.log('📍 应该能看到所有品牌正常显示，包括特色品牌区域')
    
  } catch (error) {
    console.error('❌ 修复失败:', error)
  }
}

fixBrandFields()