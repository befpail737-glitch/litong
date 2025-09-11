const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function deepDebugFrontendIssue() {
  try {
    console.log('🔍 深度调查前端显示问题的本质原因...')
    
    // 1. 检查数据库中最新的品牌数据
    console.log('\n📊 1. 检查数据库最新状态:')
    const allBrands = await client.fetch(`*[_type == "brandBasic"] | order(_updatedAt desc) {
      _id,
      name,
      _createdAt,
      _updatedAt,
      isActive,
      isFeatured,
      slug
    }`)
    
    console.log(`总共找到 ${allBrands.length} 个brandBasic品牌:`)
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - ID: ${brand._id}`)
      console.log(`   - 创建时间: ${brand._createdAt}`)
      console.log(`   - 更新时间: ${brand._updatedAt}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log(`   - isFeatured: ${brand.isFeatured}`)
      console.log(`   - slug类型: ${typeof brand.slug} ${brand.slug ? `(值: ${JSON.stringify(brand.slug)})` : ''}`)
      console.log('')
    })
    
    // 2. 模拟前端确切的查询
    console.log('\n🎯 2. 执行前端确切查询:')
    const frontendQuery = `*[_type == "brandBasic" && isActive == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`
    
    console.log('前端查询语句:')
    console.log(frontendQuery)
    
    const frontendResult = await client.fetch(frontendQuery)
    console.log(`\n前端查询结果: ${frontendResult.length} 个品牌`)
    
    frontendResult.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name}`)
      console.log(`   - isActive: ${brand.isActive}`)
      console.log(`   - isFeatured: ${brand.isFeatured}`)
      console.log(`   - slug: ${brand.slug}`)
      console.log('')
    })
    
    // 3. 检查特色品牌过滤结果
    console.log('\n🌟 3. 测试特色品牌过滤:')
    const featuredBrands = frontendResult.filter(brand => brand.isFeatured)
    console.log(`特色品牌过滤结果: ${featuredBrands.length} 个`)
    featuredBrands.forEach(brand => {
      console.log(`   - ${brand.name} (isFeatured: ${brand.isFeatured})`)
    })
    
    // 4. 检查前端缓存问题
    console.log('\n🔄 4. 检查缓存相关问题:')
    
    // 使用不同的API版本测试
    const clientNoCdn = createClient({
      projectId: 'oquvb2bs',
      dataset: 'production',
      apiVersion: '2022-06-01',
      useCdn: false, // 确保不使用CDN缓存
    })
    
    const noCdnResult = await clientNoCdn.fetch(frontendQuery)
    console.log(`无CDN查询结果: ${noCdnResult.length} 个品牌`)
    
    if (noCdnResult.length !== frontendResult.length) {
      console.log('⚠️ CDN缓存可能导致数据不一致!')
    } else {
      console.log('✅ CDN缓存没有问题')
    }
    
    // 5. 检查字段数据完整性
    console.log('\n🧪 5. 字段数据完整性检查:')
    const incompleteData = frontendResult.filter(brand => 
      !brand.name || 
      brand.isActive === undefined || 
      brand.isFeatured === undefined ||
      !brand.slug
    )
    
    if (incompleteData.length > 0) {
      console.log(`❌ 发现 ${incompleteData.length} 个数据不完整的品牌:`)
      incompleteData.forEach(brand => {
        console.log(`   - ${brand.name}:`)
        console.log(`     name: ${brand.name ? '✅' : '❌'}`)
        console.log(`     isActive: ${brand.isActive !== undefined ? '✅' : '❌'}`)
        console.log(`     isFeatured: ${brand.isFeatured !== undefined ? '✅' : '❌'}`)
        console.log(`     slug: ${brand.slug ? '✅' : '❌'}`)
      })
    } else {
      console.log('✅ 所有品牌数据完整')
    }
    
    // 6. 检查是否存在重复或冲突数据
    console.log('\n🔍 6. 检查数据冲突:')
    const nameMap = new Map()
    frontendResult.forEach(brand => {
      if (nameMap.has(brand.name)) {
        console.log(`⚠️ 发现重复品牌名称: ${brand.name}`)
        console.log(`   - 第一个: ${nameMap.get(brand.name)}`)
        console.log(`   - 重复的: ${brand._id}`)
      } else {
        nameMap.set(brand.name, brand._id)
      }
    })
    
    // 7. 生成诊断报告
    console.log('\n📋 7. 本质原因诊断报告:')
    console.log('=' .repeat(60))
    
    if (allBrands.length > frontendResult.length) {
      console.log(`❌ 数据过滤问题: 数据库有${allBrands.length}个品牌，但查询只返回${frontendResult.length}个`)
      
      const filtered = allBrands.filter(brand => !brand.isActive)
      if (filtered.length > 0) {
        console.log(`   - 被isActive=false过滤的品牌: ${filtered.map(b => b.name).join(', ')}`)
      }
      
      const nullSlug = allBrands.filter(brand => !brand.slug || !brand.slug.current)
      if (nullSlug.length > 0) {
        console.log(`   - slug.current为空的品牌: ${nullSlug.map(b => b.name).join(', ')}`)
      }
    }
    
    console.log('\n🎯 根本原因总结:')
    console.log('1. 数据查询: 前端查询返回所有符合条件的品牌')
    console.log('2. 字段完整性: 检查所有必需字段是否存在')
    console.log('3. 缓存问题: 检查CDN和浏览器缓存')
    console.log('4. 前端渲染: 需要检查React组件是否正确处理数据')
    
    console.log('\n💡 建议的彻底解决方案:')
    console.log('1. 确保所有品牌都有完整的必需字段')
    console.log('2. 在前端添加详细的调试日志')
    console.log('3. 检查前端组件的条件渲染逻辑')
    console.log('4. 验证前端状态管理和数据流')
    
  } catch (error) {
    console.error('❌ 深度调试失败:', error)
  }
}

deepDebugFrontendIssue()