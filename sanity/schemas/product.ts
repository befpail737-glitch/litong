import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    defineField({
      name: 'partNumber',
      title: '产品型号',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'name',
      title: '产品名称',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'brand',
      title: '品牌',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: '大类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: (Rule) => Rule.required(),
      options: {
        filter: '!defined(parent)'  // 只显示没有父级的分类（大类）
      }
    }),
    defineField({
      name: 'subcategory',
      title: '小类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      options: {
        filter: 'defined(parent)'  // 只显示有父级的分类（小类）
      }
    }),
    defineField({
      name: 'description',
      title: '产品描述',
      type: 'text',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'detailedDescription',
      title: '详细描述',
      type: 'array',
      of: [{ type: 'block' }],
      description: '支持富文本编辑的详细描述'
    }),
    defineField({
      name: 'package',
      title: '封装类型',
      type: 'string'
    }),
    defineField({
      name: 'specifications',
      title: '技术参数',
      type: 'array',
      of: [
        defineType({
          type: 'object',
          fields: [
            { name: 'parameter', title: '参数名称', type: 'string' },
            { name: 'value', title: '参数值', type: 'string' },
            { name: 'unit', title: '单位', type: 'string' }
          ]
        })
      ]
    }),
    defineField({
      name: 'features',
      title: '产品特性',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'applications',
      title: '应用场景',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'images',
      title: '产品图片',
      type: 'array',
      of: [
        defineType({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: '图片描述', type: 'string' },
            { name: 'caption', title: '图片标题', type: 'string' }
          ]
        })
      ]
    }),
    defineField({
      name: 'documents',
      title: '技术文档',
      type: 'array',
      of: [
        defineType({
          type: 'object',
          fields: [
            { name: 'title', title: '文档标题', type: 'string' },
            { name: 'type', title: '文档类型', type: 'string', 
              options: {
                list: [
                  { title: '数据手册', value: 'datasheet' },
                  { title: '用户手册', value: 'user-manual' },
                  { title: '应用笔记', value: 'application-note' },
                  { title: '勘误表', value: 'errata' },
                  { title: '参考设计', value: 'reference-design' }
                ]
              }
            },
            { name: 'file', title: '文档文件', type: 'file' },
            { name: 'url', title: '外部链接', type: 'url' }
          ]
        })
      ]
    }),
    defineField({
      name: 'pricing',
      title: '价格信息',
      type: 'object',
      fields: [
        { name: 'price', title: '单价（元）', type: 'number' },
        { name: 'currency', title: '货币', type: 'string', initialValue: 'CNY' },
        { name: 'moq', title: '最小起订量', type: 'number', initialValue: 1 },
        {
          name: 'priceBreaks',
          title: '阶梯价格',
          type: 'array',
          of: [
            defineType({
              type: 'object',
              fields: [
                { name: 'quantity', title: '数量', type: 'number' },
                { name: 'price', title: '单价', type: 'number' }
              ]
            })
          ]
        }
      ]
    }),
    defineField({
      name: 'stock',
      title: '库存数量',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'leadTime',
      title: '交期',
      type: 'string',
      options: {
        list: [
          { title: '现货', value: 'in-stock' },
          { title: '1-3天', value: '1-3-days' },
          { title: '1-2周', value: '1-2-weeks' },
          { title: '3-4周', value: '3-4-weeks' },
          { title: '询价', value: 'inquiry' }
        ]
      }
    }),
    defineField({
      name: 'isActive',
      title: '是否发布',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO描述',
      type: 'text'
    }),
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [{ type: 'string' }]
    })
  ],
  preview: {
    select: {
      title: 'partNumber',
      subtitle: 'name',
      media: 'images.0'
    }
  },
  orderings: [
    {
      title: '按型号',
      name: 'partNumberAsc',
      by: [{ field: 'partNumber', direction: 'asc' }]
    },
    {
      title: '按创建时间',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ]
})