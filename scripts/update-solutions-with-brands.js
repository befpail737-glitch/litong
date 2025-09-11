const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function updateSolutionsWithBrands() {
  try {
    console.log('Fetching existing solutions...')
    
    // 获取现有解决方案
    const solutions = await client.fetch('*[_type == "solution"]')
    console.log('Found', solutions.length, 'solutions')
    
    // 为每个解决方案添加品牌名称
    const brands = ['Infineon', 'STMicroelectronics', 'Texas Instruments', 'Intel']
    
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i]
      const brandName = brands[i % brands.length] // 循环分配品牌
      
      console.log(`Updating solution ${solution.title} with brand ${brandName}...`)
      
      // 更新解决方案
      await client
        .patch(solution._id)
        .set({ 
          brandName: brandName,
          // 确保有富文本内容
          description: solution.description || [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: `这是一个基于${brandName}技术的专业解决方案，提供高性能和可靠性。`
                }
              ]
            },
            {
              _type: 'block',
              style: 'h2',
              children: [
                {
                  _type: 'span',
                  text: '主要特性'
                }
              ]
            },
            {
              _type: 'block',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '高性能处理能力'
                }
              ]
            },
            {
              _type: 'block',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '低功耗设计'
                }
              ]
            },
            {
              _type: 'block',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '丰富的接口支持'
                }
              ]
            }
          ]
        })
        .commit()
      
      console.log(`✅ Updated solution: ${solution.title} -> ${brandName}`)
    }
    
    console.log('🎉 All solutions updated with brand names!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateSolutionsWithBrands()