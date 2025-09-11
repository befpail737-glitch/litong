const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  token: 'sk9mqwwYbVNWULjxsApJ3QXUd56p25PQcflhh924XaK1mdXYSGamiZxt8bfkIe3lBau3Pjx593sHbO48l'
})

async function createInfineonBrandAndSolution() {
  try {
    console.log('🚀 开始创建英飞凌品牌和解决方案...')
    
    // 1. 创建英飞凌品牌（使用brandSimple）
    console.log('📝 创建英飞凌品牌...')
    
    const infineonBrand = {
      _type: 'brandSimple',
      name: 'Infineon',
      slug: { 
        current: 'infineon',
        _type: 'slug' 
      },
      description: '英飞凌科技股份公司是全球领先的半导体解决方案供应商，致力于让生活更便捷、更安全、更环保。微电子技术是数字化转型的关键驱动力，英飞凌通过产品和解决方案推动这一转型进程，连接现实与数字世界。',
      website: 'https://www.infineon.com',
      country: 'DE',
      established: 1999,
      headquarters: '德国慕尼黑',
      isActive: true,
      isFeatured: true,
    }
    
    const brandResult = await client.create(infineonBrand)
    console.log('✅ 英飞凌品牌创建成功:', brandResult._id)
    
    // 2. 创建英飞凌解决方案
    console.log('📝 创建英飞凌解决方案...')
    
    const infineonSolution = {
      _type: 'solution',
      title: '英飞凌AURIX微控制器汽车电子解决方案',
      slug: { 
        current: 'infineon-aurix-automotive-solution',
        _type: 'slug' 
      },
      brandName: 'Infineon',
      summary: '基于英飞凌AURIX微控制器的汽车电子控制系统解决方案，提供高性能、高可靠性的汽车电子控制。',
      description: [
        {
          _type: 'block',
          _key: 'intro',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'intro-text',
              text: '英飞凌AURIX微控制器是专为汽车应用设计的高性能32位微控制器，集成了多个CPU内核、硬件安全模块和丰富的外设接口。'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'features-heading',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'features-title',
              text: '主要特性'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'feature1',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              _key: 'feature1-text',
              text: '三个32位TriCore CPU内核，最高频率300MHz'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'feature2',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              _key: 'feature2-text',
              text: '集成硬件安全模块（HSM），符合EVITA安全等级'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'feature3',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              _key: 'feature3-text',
              text: '丰富的汽车专用外设：CAN-FD、FlexRay、以太网等'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'feature4',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              _key: 'feature4-text',
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
    console.log('✅ 英飞凌解决方案创建成功:', solutionResult._id)
    
    console.log('\n🎉 数据创建完成！')
    console.log('品牌ID:', brandResult._id)
    console.log('解决方案ID:', solutionResult._id)
    console.log('\n请访问以下链接查看结果：')
    console.log('前端品牌页面: http://localhost:3005/zh-CN/brands')
    console.log('前端解决方案页面: http://localhost:3005/zh-CN/solutions')
    console.log('Sanity Studio: http://localhost:3334')
    
  } catch (error) {
    console.error('❌ 错误:', error)
    if (error.response) {
      console.error('响应错误:', error.response.body)
    }
  }
}

createInfineonBrandAndSolution()