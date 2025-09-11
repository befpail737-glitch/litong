const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function validateBrandData() {
  try {
    console.log('🔍 验证品牌数据完整性...')
    
    // 获取所有brandBasic数据
    const brands = await client.fetch('*[_type == "brandBasic"]')
    console.log(`📋 检查 ${brands.length} 个品牌数据`)
    
    for (const brand of brands) {
      console.log(`\n🔍 验证品牌: ${brand.name}`)
      
      // 检查必填字段
      const requiredFields = ['name', 'slug']
      const missingRequired = []
      
      for (const field of requiredFields) {
        if (!brand[field]) {
          missingRequired.push(field)
        }
      }
      
      if (missingRequired.length > 0) {
        console.log(`❌ 缺失必填字段: ${missingRequired.join(', ')}`)
        
        // 尝试修复缺失的slug
        if (missingRequired.includes('slug')) {
          const slug = {
            _type: 'slug',
            current: brand.name.toLowerCase()
              .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          }
          
          console.log(`🔧 自动修复slug: ${JSON.stringify(slug)}`)
          
          const result = await client
            .patch(brand._id)
            .set({ slug: slug })
            .commit()
          
          console.log(`✅ ${brand.name} slug已修复`)
        }
      } else {
        console.log(`✅ 所有必填字段完整`)
      }
      
      // 显示字段状态
      console.log(`   - name: ${brand.name || '❌ 缺失'}`)
      console.log(`   - slug: ${brand.slug?.current || '❌ 缺失'}`)
      console.log(`   - isFeatured: ${brand.isFeatured !== undefined ? brand.isFeatured : '❌ 缺失'}`)
      console.log(`   - isActive: ${brand.isActive !== undefined ? brand.isActive : '❌ 缺失'}`)
    }
    
    console.log('\n🎉 数据验证完成!')
    console.log('📍 现在尝试在Sanity Studio中编辑品牌，发布按钮应该可用')
    
  } catch (error) {
    console.error('❌ 验证失败:', error)
  }
}

validateBrandData()