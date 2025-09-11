const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function finalDebugLemDisplay() {
  try {
    console.log('🔍 最终调查LEM品牌前端显示问题...')
    
    // 1. 检查LEM品牌的完整数据
    console.log('\n📊 1. LEM品牌完整数据检查:')
    const lemBrand = await client.fetch(`*[_type == "brandBasic" && name == "LEM"][0] {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      slug,
      logo,
      headquarters,
      established,
      _createdAt,
      _updatedAt
    }`)
    
    if (!lemBrand) {
      console.log('❌ 找不到LEM品牌!')
      return
    }
    
    console.log('LEM品牌完整数据:')
    console.log(JSON.stringify(lemBrand, null, 2))
    
    // 2. 检查前端查询是否包含LEM
    console.log('\n📋 2. 前端查询结果检查:')
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
    
    const allBrands = await client.fetch(frontendQuery)
    const lemInResults = allBrands.find(brand => brand.name === 'LEM')
    
    console.log(`前端查询总结果: ${allBrands.length} 个品牌`)
    console.log('品牌列表:')
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} (ID: ${brand._id})`)
    })
    
    if (lemInResults) {
      console.log('\n✅ LEM在前端查询结果中:')
      console.log(JSON.stringify(lemInResults, null, 2))
    } else {
      console.log('\n❌ LEM不在前端查询结果中!')
      
      // 检查可能的过滤原因
      if (!lemBrand.isActive) {
        console.log('   原因: isActive = false')
      } else if (!lemBrand.slug || !lemBrand.slug.current) {
        console.log('   原因: slug字段缺失或格式错误')
      } else {
        console.log('   原因: 其他未知过滤条件')
      }
    }
    
    // 3. 检查特色品牌过滤
    console.log('\n🌟 3. 特色品牌过滤检查:')
    const featuredBrands = allBrands.filter(brand => brand.isFeatured)
    const lemIsFeatured = featuredBrands.find(brand => brand.name === 'LEM')
    
    console.log(`特色品牌数量: ${featuredBrands.length}`)
    if (lemIsFeatured) {
      console.log('✅ LEM是特色品牌，应该在特色区域显示')
    } else {
      console.log(`❌ LEM不是特色品牌 (isFeatured: ${lemBrand.isFeatured})`)
    }
    
    // 4. 模拟前端组件渲染逻辑
    console.log('\n🎯 4. 模拟前端组件渲染:')
    
    // 模拟brands页面的两个区域
    console.log('特色品牌区域渲染:')
    const featuredToRender = allBrands.filter(brand => brand.isFeatured)
    featuredToRender.forEach((brand, index) => {
      console.log(`   渲染 ${index + 1}: ${brand.name}`)
      
      // 检查可能导致渲染失败的字段
      const issues = []
      if (!brand.name) issues.push('缺少name')
      if (!brand.slug) issues.push('缺少slug')
      if (!brand._id) issues.push('缺少_id')
      
      if (issues.length > 0) {
        console.log(`     ⚠️ 渲染问题: ${issues.join(', ')}`)
      }
    })
    
    console.log('\n所有品牌区域渲染:')
    allBrands.forEach((brand, index) => {
      console.log(`   渲染 ${index + 1}: ${brand.name}`)
      
      // 检查Link组件需要的字段
      if (!brand.slug) {
        console.log(`     ❌ Link渲染会失败: 缺少slug`)
      }
    })
    
    // 5. 检查可能的前端缓存问题
    console.log('\n🔄 5. 缓存问题检查:')
    
    // 使用强制刷新的查询
    const clientForceRefresh = createClient({
      projectId: 'oquvb2bs',
      dataset: 'production',
      apiVersion: new Date().toISOString().split('T')[0], // 使用今天的日期作为API版本
      useCdn: false,
      token: undefined // 不使用token，模拟前端查询
    })
    
    try {
      const freshResults = await clientForceRefresh.fetch(frontendQuery)
      const lemInFresh = freshResults.find(brand => brand.name === 'LEM')
      
      console.log(`强制刷新查询结果: ${freshResults.length} 个品牌`)
      if (lemInFresh) {
        console.log('✅ 强制刷新后LEM存在')
      } else {
        console.log('❌ 强制刷新后LEM仍然不存在')
      }
    } catch (error) {
      console.log('强制刷新查询失败:', error.message)
    }
    
    // 6. 生成诊断报告
    console.log('\n📋 6. 最终诊断报告:')
    console.log('=' .repeat(60))
    
    if (lemInResults) {
      console.log('✅ 数据层面: LEM品牌数据正确且在查询结果中')
      console.log('❌ 前端渲染层面: 可能存在以下问题:')
      console.log('   1. React组件渲染错误')
      console.log('   2. CSS显示问题')
      console.log('   3. JavaScript运行时错误')
      console.log('   4. 浏览器缓存问题')
      console.log('   5. Next.js静态生成缓存问题')
      
      console.log('\n💡 建议的调试步骤:')
      console.log('1. 清除浏览器缓存和Next.js缓存')
      console.log('2. 检查浏览器开发者工具Console是否有错误')
      console.log('3. 检查Network面板API请求是否正常')
      console.log('4. 检查Elements面板DOM是否包含LEM品牌')
    } else {
      console.log('❌ 数据层面: LEM品牌不在查询结果中')
      console.log('💡 需要检查数据过滤条件')
    }
    
    // 7. 提供即时修复方案
    console.log('\n🔧 7. 即时修复方案:')
    
    // 检查LEM是否需要设置为特色品牌来显示
    if (!lemBrand.isFeatured) {
      console.log('方案1: 将LEM设置为特色品牌')
      console.log('   这样LEM会在特色品牌区域显示')
    }
    
    // 检查是否需要清除缓存
    console.log('方案2: 清除所有缓存')
    console.log('   rm -rf .next && 重启开发服务器')
    
    console.log('方案3: 检查前端组件错误处理')
    console.log('   在brands页面添加调试日志')
    
  } catch (error) {
    console.error('❌ 最终调试失败:', error)
  }
}

finalDebugLemDisplay()