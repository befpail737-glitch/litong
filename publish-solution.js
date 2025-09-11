const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz',
  useCdn: false,
})

async function publishSolution() {
  try {
    const docId = 'ad4709dc-e067-4ec2-8778-2dd17dd578e8'
    const draftId = `drafts.${docId}`
    
    console.log('Fetching draft document...')
    const draft = await client.getDocument(draftId)
    
    if (!draft) {
      console.log('Draft document not found')
      return
    }
    
    console.log('Publishing document and updating fields...')
    
    // 发布文档：创建发布版本并删除草稿
    const publishedDoc = {
      ...draft,
      _id: docId, // 移除 drafts. 前缀
      isPublished: true, // 设置为已发布
      status: 'released', // 设置状态为已发布
      publishedAt: new Date().toISOString(), // 更新发布时间
      
      // 添加必需字段，确保完整性
      slug: draft.slug || { current: 'test-solution-2024' },
      summary: draft.summary || {
        zhCN: '这是一个测试解决方案',
        en: 'This is a test solution'
      },
      description: draft.description || {
        zhCN: [
          {
            _type: 'block',
            _key: 'desc1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: '这是一个测试解决方案的详细描述。'
              }
            ]
          }
        ],
        en: [
          {
            _type: 'block',
            _key: 'desc1en',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span1en',
                text: 'This is a detailed description of the test solution.'
              }
            ]
          }
        ]
      },
      targetMarket: draft.targetMarket || 'industrial-automation'
    }
    
    // 创建发布的文档
    const result = await client.createOrReplace(publishedDoc)
    console.log('Document published:', result._id)
    
    // 删除草稿
    await client.delete(draftId)
    console.log('Draft deleted:', draftId)
    
    console.log('✅ Solution published successfully!')
    
    // 验证发布结果
    console.log('Verifying published solutions...')
    const publishedSolutions = await client.fetch(`*[_type == "solution" && isPublished == true]`)
    console.log(`Found ${publishedSolutions.length} published solutions`)
    
  } catch (error) {
    console.error('❌ Error publishing solution:', error)
  }
}

publishSolution()