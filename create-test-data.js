const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oquvb2bs',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz',
  useCdn: false,
})

async function createTestData() {
  try {
    console.log('Creating test industry...')
    
    // 创建行业文档
    const industry = await client.create({
      _type: 'industry',
      name: '工业自动化',
      slug: { current: 'industrial-automation' },
      isVisible: true,
    })
    console.log('Created industry:', industry._id)

    console.log('Creating test solution...')
    
    // 创建解决方案文档
    const solution = await client.create({
      _type: 'solution',
      title: {
        zhCN: '智能工厂IoT控制解决方案',
        en: 'Smart Factory IoT Control Solution'
      },
      slug: { current: 'smart-factory-iot-control-2024' },
      summary: {
        zhCN: '基于STM32微控制器的工业级IoT控制方案，实现智能工厂设备远程监控和自动化控制。',
        en: 'Industrial-grade IoT control solution based on STM32 microcontrollers for smart factory equipment monitoring and automation.'
      },
      description: {
        zhCN: [
          {
            _type: 'block',
            _key: 'desc1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: '本解决方案采用最新的STM32H7系列微控制器，结合高性能的工业级传感器和通信模块，为智能工厂提供完整的IoT控制解决方案。支持多种工业协议，具备强大的数据处理和实时控制能力。'
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
                text: 'This solution uses the latest STM32H7 series microcontrollers, combined with high-performance industrial sensors and communication modules, to provide complete IoT control solutions for smart factories.'
              }
            ]
          }
        ]
      },
      industries: [{ _type: 'reference', _ref: industry._id }],
      applications: ['设备监控', '远程控制', '数据采集', '预测维护'],
      targetMarket: 'industrial-automation',
      complexity: 'complex',
      developmentCycle: 90,
      costRange: {
        min: 50000,
        max: 200000,
        currency: 'CNY'
      },
      features: [
        {
          _key: 'feature1',
          title: {
            zhCN: '实时数据采集',
            en: 'Real-time Data Collection'
          },
          description: {
            zhCN: '支持多路传感器数据同时采集，采样率可达1kHz',
            en: 'Supports multi-channel sensor data collection with sampling rate up to 1kHz'
          }
        },
        {
          _key: 'feature2',
          title: {
            zhCN: '远程控制',
            en: 'Remote Control'
          },
          description: {
            zhCN: '通过无线网络实现设备远程控制，支持多种通信协议',
            en: 'Remote device control via wireless networks with multiple communication protocols'
          }
        }
      ],
      bomList: [
        {
          _key: 'bom1',
          partNumber: 'STM32H743VIT6',
          description: '主控微控制器',
          quantity: 1,
          unit: 'pcs'
        },
        {
          _key: 'bom2',
          partNumber: 'ESP32-WROOM-32',
          description: 'WiFi通信模块',
          quantity: 1,
          unit: 'pcs'
        }
      ],
      publishedAt: new Date().toISOString(),
      isPublished: true,
      isFeatured: true,
      status: 'released',
      viewCount: 0
    })
    
    console.log('Created solution:', solution._id)
    console.log('✅ Test data created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
  }
}

createTestData()