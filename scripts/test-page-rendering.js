const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function testPageRendering() {
  try {
    console.log('🔍 测试前端页面渲染问题...')
    
    // 模拟页面组件的数据获取
    console.log('\n📊 模拟brands页面数据获取:')
    
    const brands = await client.fetch(`*[_type == "brandBasic" && isActive == true] | order(name asc) {
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
    }`)
    
    const brandStats = await client.fetch(`{
      "total": count(*[_type == "brandBasic" && isActive == true]),
      "featured": count(*[_type == "brandBasic" && isActive == true]),
      "solutions": count(*[_type == "solution" && isPublished == true])
    }`)
    
    console.log(`✅ 数据获取成功:`)
    console.log(`   - 总品牌: ${brands.length}`)
    console.log(`   - 统计数据: ${JSON.stringify(brandStats)}`)
    
    // 模拟前端过滤逻辑
    console.log('\n🎯 模拟前端渲染逻辑:')
    
    // 特色品牌过滤 (brands页面第60行)
    const featuredBrands = brands.filter(brand => brand.isFeatured)
    console.log(`特色品牌区域: ${featuredBrands.length} 个品牌`)
    featuredBrands.forEach((brand, index) => {
      console.log(`   ${index + 1}. ${brand.name}`)
    })
    
    // 所有品牌显示 (brands页面第151行)
    console.log(`\n所有品牌区域: ${brands.length} 个品牌`)
    brands.forEach((brand, index) => {
      // 检查是否会导致渲染错误的数据
      const hasSlug = !!brand.slug
      const hasName = !!brand.name
      const potentialError = !hasSlug || !hasName
      
      console.log(`   ${index + 1}. ${brand.name} ${potentialError ? '⚠️ 潜在渲染问题' : '✅'}`)
      if (potentialError) {
        console.log(`      - name: ${hasName ? '✅' : '❌'}`)
        console.log(`      - slug: ${hasSlug ? '✅' : '❌'}`)
      }
    })
    
    // 检查可能导致渲染失败的数据问题
    console.log('\n🚨 检查潜在渲染问题:')
    
    // 1. 检查slug字段问题
    const invalidSlugs = brands.filter(brand => !brand.slug || brand.slug.trim() === '')
    if (invalidSlugs.length > 0) {
      console.log(`❌ 无效slug的品牌: ${invalidSlugs.map(b => b.name).join(', ')}`)
    }
    
    // 2. 检查必填字段缺失
    const missingRequired = brands.filter(brand => !brand.name || !brand._id)
    if (missingRequired.length > 0) {
      console.log(`❌ 缺失必填字段的品牌: ${missingRequired.length} 个`)
    }
    
    // 3. 检查可能导致链接错误的slug
    const problematicSlugs = brands.filter(brand => 
      brand.slug && (
        brand.slug.includes('  ') || // 连续空格
        brand.slug.includes('\n') || // 换行符
        brand.slug.includes('\t') || // 制表符
        /[^\w\-\u4e00-\u9fff]/.test(brand.slug) // 特殊字符
      )
    )
    
    if (problematicSlugs.length > 0) {
      console.log(`⚠️ 可能有问题的slug:`)
      problematicSlugs.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (长度: ${brand.slug.length})`)
        console.log(`     - 包含连续空格: ${brand.slug.includes('  ')}`)
        console.log(`     - 包含特殊字符: ${/[^\w\-\u4e00-\u9fff]/.test(brand.slug)}`)
      })
    }
    
    console.log('\n🎯 本质问题诊断:')
    console.log('='.repeat(50))
    
    if (brands.length === 5 && featuredBrands.length === 3) {
      console.log('✅ 数据查询和过滤逻辑正常')
    } else {
      console.log('❌ 数据查询或过滤逻辑有问题')
    }
    
    if (problematicSlugs.length > 0) {
      console.log('❌ 发现可能导致前端渲染失败的slug格式问题')
      console.log('💡 建议: 修复有问题的slug格式')
    } else if (invalidSlugs.length > 0) {
      console.log('❌ 发现空slug字段')
      console.log('💡 建议: 为所有品牌生成有效的slug')
    } else {
      console.log('✅ 所有数据格式正确')
      console.log('💡 问题可能在于前端JavaScript错误或组件渲染问题')
    }
    
    console.log('\n🔧 彻底解决方案:')
    console.log('1. 修复所有有问题的slug格式')
    console.log('2. 确保前端没有JavaScript运行时错误')
    console.log('3. 检查前端组件的错误边界处理')
    console.log('4. 清除浏览器缓存和Next.js编译缓存')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

testPageRendering()