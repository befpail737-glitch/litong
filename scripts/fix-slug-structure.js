const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function fixSlugStructure() {
  try {
    console.log('🔧 修复slug字段结构...')
    
    // 获取所有brandBasic数据
    const brands = await client.fetch('*[_type == "brandBasic"]')
    console.log(`📋 修复 ${brands.length} 个品牌的slug字段`)
    
    for (const brand of brands) {
      console.log(`\n🔧 修复品牌: ${brand.name}`)
      
      // 检查当前slug结构
      if (brand.slug && typeof brand.slug === 'string') {
        // 如果是字符串，转换为正确的slug对象
        const slugObject = {
          _type: 'slug',
          current: brand.slug
        }
        
        console.log(`   转换字符串slug "${brand.slug}" 为对象结构`)
        
        const result = await client
          .patch(brand._id)
          .set({ slug: slugObject })
          .commit()
        
        console.log(`✅ ${brand.name} slug已转换为正确结构`)
        
      } else if (!brand.slug) {
        // 如果没有slug，创建新的
        const slugValue = brand.name.toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        
        const slugObject = {
          _type: 'slug',
          current: slugValue
        }
        
        console.log(`   创建新slug: ${slugValue}`)
        
        const result = await client
          .patch(brand._id)
          .set({ slug: slugObject })
          .commit()
        
        console.log(`✅ ${brand.name} slug已创建`)
        
      } else {
        console.log(`✅ ${brand.name} slug结构正确`)
      }
    }
    
    // 验证修复结果
    console.log('\n📊 验证修复结果:')
    const updatedBrands = await client.fetch('*[_type == "brandBasic"] { name, slug }')
    
    updatedBrands.forEach(brand => {
      const slugStatus = brand.slug?.current ? '✅' : '❌'
      console.log(`${brand.name}: ${slugStatus} ${brand.slug?.current || '缺失'}`)
    })
    
    console.log('\n🎉 slug结构修复完成!')
    console.log('📍 现在Sanity Studio的发布按钮应该可用了')
    
  } catch (error) {
    console.error('❌ 修复失败:', error)
  }
}

fixSlugStructure()