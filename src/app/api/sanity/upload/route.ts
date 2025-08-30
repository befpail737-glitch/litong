import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity-client'

export async function POST(request: NextRequest) {
  try {
    const { data, type } = await request.json()

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      )
    }

    let mutations: any[] = []

    if (type === 'products') {
      mutations = data.map(product => ({
        create: {
          _type: 'product',
          partNumber: product.partNumber,
          slug: {
            _type: 'slug',
            current: product.partNumber.toLowerCase().replace(/[^\w]/g, '-')
          },
          name: product.name || product.description || product.partNumber,
          description: product.description || '',
          specifications: Object.entries(product.parameters || {}).map(([parameter, value]) => ({
            parameter,
            value: String(value),
            unit: ''
          })),
          stock: product.stock || 0,
          price: product.price ? {
            currency: 'CNY',
            amount: parseFloat(product.price.toString().replace(/[^0-9.]/g, '')),
            minQuantity: 1
          } : undefined,
          status: product.stock && product.stock > 0 ? 'active' : 'out_of_stock',
          isActive: true,
          seoTitle: `${product.partNumber} - ${product.name || product.description}`,
          seoDescription: product.description
        }
      }))
    } else if (type === 'brands') {
      mutations = data.map(brand => ({
        create: {
          _type: 'brand',
          name: brand.name,
          nameEn: brand.nameEn || brand.name,
          slug: {
            _type: 'slug',
            current: (brand.nameEn || brand.name).toLowerCase().replace(/[^\w]/g, '-')
          },
          description: brand.description || '',
          website: brand.website,
          country: brand.country,
          founded: brand.founded ? parseInt(brand.founded) : undefined,
          isActive: true,
          sortOrder: brand.sortOrder || 0
        }
      }))
    } else if (type === 'categories') {
      mutations = data.map(category => ({
        create: {
          _type: 'productCategory',
          name: category.name,
          nameEn: category.nameEn || category.name,
          slug: {
            _type: 'slug',
            current: (category.nameEn || category.name).toLowerCase().replace(/[^\w]/g, '-')
          },
          description: category.description || '',
          sortOrder: category.sortOrder || 0,
          isActive: true
        }
      }))
    } else if (type === 'subcategories') {
      mutations = data.map(subcategory => ({
        create: {
          _type: 'productSubcategory',
          name: subcategory.name,
          nameEn: subcategory.nameEn || subcategory.name,
          slug: {
            _type: 'slug',
            current: (subcategory.nameEn || subcategory.name).toLowerCase().replace(/[^\w]/g, '-')
          },
          description: subcategory.description || '',
          specifications: subcategory.specifications || [],
          sortOrder: subcategory.sortOrder || 0,
          isActive: true
        }
      }))
    } else if (type === 'solutions') {
      mutations = data.map(solution => ({
        create: {
          _type: 'solution',
          title: solution.title,
          titleEn: solution.titleEn,
          slug: {
            _type: 'slug',
            current: solution.title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, '-')
          },
          summary: solution.summary,
          content: solution.content ? [{
            _type: 'block',
            _key: 'content',
            style: 'normal',
            markDefs: [],
            children: [{
              _type: 'span',
              _key: 'span',
              text: solution.content,
              marks: []
            }]
          }] : [],
          category: solution.category,
          publishedAt: new Date().toISOString(),
          isActive: true
        }
      }))
    }

    if (mutations.length === 0) {
      return NextResponse.json(
        { error: '无效的数据类型' },
        { status: 400 }
      )
    }

    // 批量创建文档
    const transaction = client.transaction()
    mutations.forEach(mutation => {
      transaction.create(mutation.create)
    })

    const result = await transaction.commit()

    return NextResponse.json({
      success: true,
      count: Array.isArray(result) ? result.length : 1,
      data: result
    })

  } catch (error) {
    console.error('Sanity upload error:', error)
    return NextResponse.json(
      { error: `上传失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    )
  }
}