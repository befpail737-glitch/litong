const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz',
  useCdn: false,
})

async function updatePublishedFlag() {
  try {
    const docId = '1c7943f6-2109-4fa1-b216-94b92fcb0484'
    
    console.log('Updating isPublished flag to true...')
    
    const result = await client
      .patch(docId)
      .set({ isPublished: true })
      .commit()
    
    console.log('✅ Updated document:', result._id)
    
    // 验证更新结果
    console.log('Verifying published solutions...')
    const publishedSolutions = await client.fetch(`*[_type == "solution" && isPublished == true]`)
    console.log(`Found ${publishedSolutions.length} published solutions:`)
    publishedSolutions.forEach(sol => {
      console.log(`- ${sol.title} (${sol._id})`)
    })
    
  } catch (error) {
    console.error('❌ Error updating document:', error)
  }
}

updatePublishedFlag()