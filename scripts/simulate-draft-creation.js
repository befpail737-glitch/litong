const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function simulateDraftCreation() {
  try {
    console.log('🧪 模拟Sanity Studio创建文档流程...')
    
    // 1. 创建一个草稿文档（这是Studio在"Create new document"时做的）
    console.log('\n📝 步骤1: 创建草稿文档...')
    
    const draftBrand = {
      _id: 'drafts.test-simulation-brand',
      _type: 'brandBasic',
      name: 'Simulation Test Brand',
      slug: {
        _type: 'slug',
        current: 'simulation-test-brand'
      },
      description: '这是一个测试品牌，用于模拟Studio创建流程',
      isActive: true,
      isFeatured: false
    }
    
    const draftResult = await client.createOrReplace(draftBrand)
    console.log('✅ 草稿文档创建成功:', draftResult._id)
    
    // 2. 检查草稿状态
    console.log('\n📄 步骤2: 检查草稿状态...')
    const draft = await client.fetch(`*[_id == "drafts.test-simulation-brand"][0]`)
    if (draft) {
      console.log('✅ 草稿存在，可以在Studio中编辑')
      console.log(`   - Name: ${draft.name}`)
      console.log(`   - Slug: ${draft.slug?.current}`)
      console.log('   - 此时Studio应该显示发布按钮')
    }
    
    // 3. 发布草稿（这是点击发布按钮时发生的）
    console.log('\n🚀 步骤3: 发布草稿文档...')
    
    // 获取草稿内容
    const draftContent = await client.fetch(`*[_id == "drafts.test-simulation-brand"][0]`)
    
    // 创建已发布版本（去掉草稿前缀）
    const publishedContent = {
      ...draftContent,
      _id: 'test-simulation-brand' // 去掉 drafts. 前缀
    }
    delete publishedContent._rev // 删除revision，让Sanity创建新的
    
    const publishResult = await client.createOrReplace(publishedContent)
    console.log('✅ 已发布版本创建成功:', publishResult._id)
    
    // 删除草稿
    await client.delete('drafts.test-simulation-brand')
    console.log('🗑️ 草稿已删除')
    
    // 4. 验证最终状态
    console.log('\n✅ 步骤4: 验证最终状态...')
    const published = await client.fetch(`*[_id == "test-simulation-brand"][0]`)
    const draftCheck = await client.fetch(`*[_id == "drafts.test-simulation-brand"][0]`)
    
    console.log(`已发布文档: ${published ? '存在' : '不存在'}`)
    console.log(`草稿文档: ${draftCheck ? '存在' : '不存在'}`)
    
    if (published && !draftCheck) {
      console.log('✅ 文档发布流程正常完成')
    }
    
    // 清理测试数据
    console.log('\n🧹 清理测试数据...')
    await client.delete('test-simulation-brand')
    console.log('✅ 测试数据已清理')
    
    console.log('\n🎯 总结 - Sanity Studio发布按钮显示规则:')
    console.log('1. 新建文档时: 保存后会创建草稿，显示发布按钮')
    console.log('2. 编辑已发布文档时: 修改后会创建草稿，显示发布按钮')  
    console.log('3. 草稿存在时: 显示发布按钮')
    console.log('4. 仅有已发布版本时: 不显示发布按钮（已经发布了）')
    
    console.log('\n🔧 如果发布按钮不显示:')
    console.log('1. 确保在创建新文档时填写了必填字段并保存')
    console.log('2. 刷新浏览器页面')
    console.log('3. 检查浏览器控制台是否有JavaScript错误')
    console.log('4. 尝试修改现有文档，看是否会创建草稿')
    
  } catch (error) {
    console.error('❌ 模拟失败:', error)
  }
}

simulateDraftCreation()