const { createClient } = require('@sanity/client')

// 使用和前端完全相同的配置
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01', // 与前端保持一致
  useCdn: false,
  // 不使用token进行公开访问
  // perspective: 'published', // 临时移除perspective限制
  maxRetries: 0, // 禁用重试
  requestTagPrefix: 'debug', // 添加调试标签
})

async function testFrontendQuery() {
  try {
    const query = `*[_type == "solution" && isPublished == true] {
      _id,
      title,
      "slug": slug.current,
      summary,
      targetMarket,
      complexity,
      publishedAt,
      isPublished,
      isFeatured
    }`
    
    console.log('Testing with exact frontend configuration...')
    const solutions = await client.fetch(query)
    
    console.log(`Found ${solutions.length} solutions:`)
    solutions.forEach((sol, index) => {
      console.log(`${index + 1}. ${sol.title} (${sol._id})`)
      console.log(`   slug: ${sol.slug}`)
      console.log(`   summary: ${sol.summary}`)
      console.log(`   isPublished: ${sol.isPublished}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testFrontendQuery()