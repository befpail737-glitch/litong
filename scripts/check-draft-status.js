const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function checkDraftStatus() {
  try {
    console.log('🔍 检查文档草稿和发布状态...')
    
    // 查询所有brandBasic文档，包括草稿
    const allDocs = await client.fetch(`
      *[_type == "brandBasic"] {
        _id,
        name,
        _createdAt,
        _updatedAt
      } | order(name asc)
    `)
    
    console.log(`📄 找到 ${allDocs.length} 个brandBasic文档`)
    
    // 分别检查草稿和已发布版本
    for (const doc of allDocs) {
      console.log(`\n📋 检查文档: ${doc.name}`)
      console.log(`   ID: ${doc._id}`)
      
      // 检查是否为草稿
      const isDraft = doc._id.startsWith('drafts.')
      console.log(`   文档类型: ${isDraft ? '草稿' : '已发布'}`)
      
      if (!isDraft) {
        // 如果是已发布版本，检查是否有对应草稿
        const draftId = `drafts.${doc._id}`
        const draftExists = await client.fetch(`*[_id == $draftId][0]`, { draftId })
        console.log(`   对应草稿: ${draftExists ? '存在' : '不存在'}`)
        
        if (draftExists) {
          console.log(`   ⚠️ 同时存在草稿和已发布版本，可能影响编辑`)
        }
      }
    }
    
    // 检查具体的草稿状态
    console.log('\n🔍 详细草稿状态检查...')
    const drafts = await client.fetch(`*[_id match "drafts.*" && _type == "brandBasic"]`)
    const published = await client.fetch(`*[!(_id match "drafts.*") && _type == "brandBasic"]`)
    
    console.log(`草稿文档数量: ${drafts.length}`)
    console.log(`已发布文档数量: ${published.length}`)
    
    if (drafts.length > 0) {
      console.log('\n📝 草稿文档列表:')
      drafts.forEach(draft => {
        console.log(`   - ${draft.name} (${draft._id})`)
      })
    }
    
    if (published.length > 0) {
      console.log('\n✅ 已发布文档列表:')
      published.forEach(pub => {
        console.log(`   - ${pub.name} (${pub._id})`)
      })
    }
    
    // 提供发布按钮问题的解决建议
    console.log('\n💡 发布按钮问题可能的原因和解决方案:')
    
    if (drafts.length === 0) {
      console.log('✅ 所有文档都已发布，不存在草稿')
      console.log('🔧 如果仍然没有发布按钮，可能是:')
      console.log('   1. 浏览器缓存问题 - 清除缓存刷新')
      console.log('   2. Sanity Studio版本问题')
      console.log('   3. 权限配置问题')
    } else {
      console.log(`⚠️ 存在 ${drafts.length} 个草稿文档`)
      console.log('🔧 建议:')
      console.log('   1. 在Studio中打开草稿文档进行编辑')
      console.log('   2. 填写必要字段后点击发布')
      console.log('   3. 或删除草稿使用已发布版本')
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
  }
}

checkDraftStatus()