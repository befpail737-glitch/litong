import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

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
          name: product.name,
          brand: product.brand,
          description: product.description,
          package: product.package || '',
          specifications: Object.entries(product.specifications || {}).map(([parameter, value]) => ({
            parameter,
            value: String(value),
            unit: ''
          })),
          features: product.features || [],
          applications: product.applications || [],
          pricing: {
            price: product.price || null,
            currency: 'CNY',
            moq: 1,
            priceBreaks: product.price ? [
              { quantity: 1, price: product.price },
              { quantity: 10, price: product.price * 0.95 },
              { quantity: 100, price: product.price * 0.9 },
              { quantity: 1000, price: product.price * 0.85 }
            ] : []
          },
          stock: product.stock || 0,
          leadTime: product.leadTime || 'inquiry',
          isActive: true,
          tags: product.tags || [],
          seoTitle: `${product.partNumber} - ${product.name}`,
          seoDescription: product.description
        }
      }))
    } else if (type === 'categories') {
      mutations = data.map(category => ({
        create: {
          _type: 'productCategory',
          name: category.name,
          nameEn: category.nameEn,
          slug: {
            _type: 'slug',
            current: category.slug
          },
          description: category.description || '',
          sort: 0,
          isActive: true
        }
      }))
    } else if (type === 'articles') {
      mutations = data.map(article => ({
        create: {
          _type: 'article',
          title: article.title,
          slug: {
            _type: 'slug',
            current: article.slug
          },
          type: article.type || 'technical',
          category: article.category || 'general',
          summary: article.summary,
          content: [
            {
              _type: 'block',
              _key: 'content',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  _key: 'span',
                  text: article.content || article.summary,
                  marks: []
                }
              ]
            }
          ],
          author: {
            name: article.author || 'LiTong Electronics',
            title: 'Technical Team'
          },
          tags: article.tags || [],
          publishedAt: new Date().toISOString(),
          isPublished: true,
          isFeatured: false,
          readTime: Math.ceil((article.content || article.summary).length / 200) || 5,
          difficulty: article.difficulty || 'intermediate',
          seoTitle: article.title,
          seoDescription: article.summary
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
      count: result.length,
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