const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
})

async function checkBrands() {
  try {
    const brands = await client.fetch('*[_type == "brand"]{_id, name, isActive}')
    console.log('Found brands:', JSON.stringify(brands, null, 2))
    
    if (brands.length === 0) {
      console.log('No brands found. Creating sample brands...')
      
      // 创建示例品牌
      const sampleBrands = [
        {
          _type: 'brand',
          name: 'Intel',
          slug: { current: 'intel' },
          country: 'US',
          isActive: true,
          isFeatured: true,
        },
        {
          _type: 'brand',
          name: 'AMD',
          slug: { current: 'amd' },
          country: 'US',  
          isActive: true,
          isFeatured: false,
        },
        {
          _type: 'brand',
          name: 'STMicroelectronics',
          slug: { current: 'stmicroelectronics' },
          country: 'CH',
          isActive: true,
          isFeatured: true,
        }
      ]
      
      for (const brand of sampleBrands) {
        const result = await client.create(brand)
        console.log('Created brand:', result.name)
      }
      
      console.log('Sample brands created successfully!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBrands()