const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function fixSlugFormattingIssues() {
  try {
    console.log('🔧 修复所有slug格式问题...')
    
    // 获取所有品牌及其slug
    const brands = await client.fetch(`*[_type == "brandBasic"] {
      _id,
      name,
      slug
    }`)
    
    console.log(`📋 检查 ${brands.length} 个品牌的slug格式:`)
    
    const problematicBrands = []
    
    for (const brand of brands) {
      const currentSlug = brand.slug?.current
      
      if (!currentSlug) {
        console.log(`❌ ${brand.name}: 缺失slug`)
        problematicBrands.push({ ...brand, issue: 'missing' })
        continue
      }
      
      // 检查各种格式问题
      const issues = []
      
      if (currentSlug !== currentSlug.trim()) {
        issues.push('前后空格')
      }
      
      if (currentSlug.includes('  ')) {
        issues.push('连续空格')
      }
      
      if (/[^\w\-\u4e00-\u9fff]/.test(currentSlug)) {
        issues.push('非法字符')
      }
      
      if (currentSlug.length === 0) {
        issues.push('空字符串')
      }
      
      if (issues.length > 0) {
        console.log(`⚠️ ${brand.name}: "${currentSlug}" - 问题: ${issues.join(', ')}`)
        problematicBrands.push({ ...brand, issue: 'formatting', problems: issues })
      } else {
        console.log(`✅ ${brand.name}: "${currentSlug}" - 格式正确`)
      }
    }
    
    // 修复有问题的slug
    if (problematicBrands.length > 0) {
      console.log(`\n🔧 修复 ${problematicBrands.length} 个有问题的slug:`)
      
      for (const brand of problematicBrands) {
        let fixedSlug
        
        if (brand.issue === 'missing') {
          // 根据品牌名称生成slug
          fixedSlug = brand.name.toLowerCase()
            .trim()
            .replace(/[^\w\u4e00-\u9fff]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        } else {
          // 修复格式问题
          fixedSlug = brand.slug.current
            .trim() // 去除前后空格
            .replace(/\s+/g, '-') // 将空格替换为连字符
            .replace(/[^\w\-\u4e00-\u9fff]/g, '-') // 替换非法字符
            .replace(/-+/g, '-') // 合并连续连字符
            .replace(/^-|-$/g, '') // 去除首尾连字符
            .toLowerCase() // 转为小写（除了中文）
        }
        
        // 确保slug不为空
        if (!fixedSlug) {
          fixedSlug = 'brand-' + Date.now()
        }
        
        console.log(`🔄 修复 ${brand.name}:`)
        console.log(`   原始: "${brand.slug?.current || '(缺失)'}"`)
        console.log(`   修复: "${fixedSlug}"`)
        
        // 更新数据库
        const result = await client
          .patch(brand._id)
          .set({
            slug: {
              _type: 'slug',
              current: fixedSlug
            }
          })
          .commit()
        
        console.log(`✅ ${brand.name} slug已修复`)
      }
    } else {
      console.log('\n✅ 所有slug格式都正确，无需修复')
    }
    
    // 验证修复结果
    console.log('\n📊 验证修复结果:')
    const updatedBrands = await client.fetch(`*[_type == "brandBasic"] {
      _id,
      name,
      slug
    } | order(name asc)`)
    
    let allFixed = true
    updatedBrands.forEach(brand => {
      const slug = brand.slug?.current
      const isValid = slug && 
        slug === slug.trim() && 
        !slug.includes('  ') && 
        !/[^\w\-\u4e00-\u9fff]/.test(slug)
      
      console.log(`${isValid ? '✅' : '❌'} ${brand.name}: "${slug}"`)
      if (!isValid) allFixed = false
    })
    
    console.log('\n🎉 修复完成!')
    if (allFixed) {
      console.log('✅ 所有slug格式都已修复')
      console.log('💡 现在前端页面应该能正常显示所有品牌')
      console.log('🔧 建议: 清除浏览器缓存并刷新前端页面')
    } else {
      console.log('❌ 仍有一些问题需要手动处理')
    }
    
    console.log('\n📋 彻底解决方案总结:')
    console.log('1. ✅ 修复了所有格式错误的slug')
    console.log('2. 🔧 建议: 在Sanity Studio中为slug字段添加验证规则')
    console.log('3. 🔧 建议: 在前端添加错误边界处理无效数据')
    console.log('4. 🔧 建议: 定期运行此脚本检查数据质量')
    
  } catch (error) {
    console.error('❌ 修复失败:', error)
  }
}

fixSlugFormattingIssues()