const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function testPublishValidation() {
  try {
    console.log('🧪 测试发布功能和验证...')
    
    // 1. 创建一个最小的测试品牌
    console.log('\n📝 创建最小测试品牌...')
    const testBrand = {
      _type: 'brandBasic',
      name: 'Test Brand',
      slug: {
        _type: 'slug',
        current: 'test-brand'
      }
    }
    
    try {
      const result = await client.create(testBrand)
      console.log('✅ 测试品牌创建成功:', result._id)
      
      // 立即删除测试品牌
      await client.delete(result._id)
      console.log('🗑️ 测试品牌已清理')
      
    } catch (createError) {
      console.log('❌ 创建失败，可能的问题:')
      console.log('   - 权限问题')
      console.log('   - 字段验证失败')
      console.log('   - Schema配置问题')
      console.log('错误详情:', createError.message)
    }
    
    // 2. 检查现有品牌的验证状态
    console.log('\n🔍 检查现有品牌验证状态...')
    const brands = await client.fetch('*[_type == "brandBasic"] | order(name asc)')
    
    for (const brand of brands) {
      console.log(`\n📋 品牌: ${brand.name}`)
      
      // 检查必填字段
      const hasName = !!brand.name
      const hasSlug = !!(brand.slug && brand.slug.current)
      const isValid = hasName && hasSlug
      
      console.log(`   - name: ${hasName ? '✅' : '❌'} ${brand.name || '缺失'}`)
      console.log(`   - slug: ${hasSlug ? '✅' : '❌'} ${brand.slug?.current || '缺失'}`)
      console.log(`   - 验证状态: ${isValid ? '✅ 有效' : '❌ 无效'}`)
      
      if (!isValid) {
        console.log('   ⚠️ 此文档可能无法发布')
      }
    }
    
    // 3. 检查文档状态
    console.log('\n📄 检查文档发布状态...')
    const publishedBrands = await client.fetch(`
      *[_type == "brandBasic"] {
        _id,
        name,
        _createdAt,
        _updatedAt,
        _rev
      }
    `)
    
    publishedBrands.forEach(brand => {
      console.log(`${brand.name}:`)
      console.log(`   - 创建时间: ${brand._createdAt}`)
      console.log(`   - 更新时间: ${brand._updatedAt}`)
      console.log(`   - 修订版本: ${brand._rev}`)
    })
    
    console.log('\n💡 发布按钮缺失可能的原因:')
    console.log('1. 必填字段未填写 (name, slug)')
    console.log('2. 字段验证失败')
    console.log('3. 权限不足')
    console.log('4. Sanity Studio UI问题')
    console.log('5. 浏览器缓存问题')
    
    console.log('\n🔧 建议解决方案:')
    console.log('1. 清除浏览器缓存并刷新 Studio')
    console.log('2. 确保所有必填字段都已填写')
    console.log('3. 检查浏览器控制台是否有错误')
    console.log('4. 尝试在无痕模式下打开 Studio')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

testPublishValidation()