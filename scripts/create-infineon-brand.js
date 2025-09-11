const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz'
})

async function createInfineonBrand() {
  try {
    console.log('Creating Infineon brand...')
    
    const infineonBrand = {
      _type: 'brandSimple',
      name: 'Infineon',
      slug: { current: 'infineon' },
      description: '英飞凌科技股份公司是全球领先的半导体解决方案供应商，致力于让生活更便捷、更安全、更环保。微电子技术是数字化转型的关键驱动力，英飞凌通过产品和解决方案推动这一转型进程，连接现实与数字世界。',
      website: 'https://www.infineon.com',
      country: 'DE',
      established: 1999,
      headquarters: '德国慕尼黑',
      isActive: true,
      isFeatured: true,
    }
    
    const result = await client.create(infineonBrand)
    console.log('✅ Infineon brand created:', result._id)
    
    // 创建一个英飞凌相关的解决方案
    console.log('Creating Infineon solution...')
    
    const infineonSolution = {
      _type: 'solution',
      title: '英飞凌AURIX微控制器汽车电子解决方案',
      slug: { current: 'infineon-aurix-automotive-solution' },
      brandName: 'Infineon',
      summary: '基于英飞凌AURIX微控制器的汽车电子控制系统解决方案，提供高性能、高可靠性的汽车电子控制。',
      description: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '英飞凌AURIX微控制器是专为汽车应用设计的高性能32位微控制器，集成了多个CPU内核、硬件安全模块和丰富的外设接口。'
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
              text: '三个32位TriCore CPU内核，最高频率300MHz'
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
              text: '集成硬件安全模块（HSM），符合EVITA安全等级'
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
              text: '丰富的汽车专用外设：CAN-FD、FlexRay、以太网等'
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
              text: '支持AUTOSAR软件架构'
            }
          ]
        }
      ],
      targetMarket: 'automotive',
      complexity: 'complex',
      publishedAt: new Date().toISOString(),
      isPublished: true,
      isFeatured: true,
      viewCount: 0
    }
    
    const solutionResult = await client.create(infineonSolution)
    console.log('✅ Infineon solution created:', solutionResult._id)
    
    console.log('🎉 All done! Infineon brand and solution created successfully.')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createInfineonBrand()