import { defineType, defineField } from 'sanity'
import { Package } from 'lucide-react'

export const product = defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  icon: Package,
  
  fields: [
    defineField({
      name: 'partNumber',
      title: '产品型号',
      type: 'string',
      validation: Rule => Rule.required().error('产品型号是必填项'),
      description: '产品的唯一标识符/型号'
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'partNumber',
        maxLength: 96,
      },
      validation: Rule => Rule.required().error('URL标识是必填项'),
    }),
    
    defineField({
      name: 'title',
      title: '产品名称',
      type: 'string',
      validation: Rule => Rule.required().error('产品名称是必填项'),
    }),
    
    defineField({
      name: 'description',
      title: '产品描述',
      type: 'text',
      rows: 4,
    }),
    
    defineField({
      name: 'shortDescription',
      title: '简短描述',
      type: 'string',
      validation: Rule => Rule.max(200).warning('建议不超过200字符'),
    }),
    
    defineField({
      name: 'image',
      title: '主图片',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '图片描述',
          description: '用于SEO和无障碍访问',
          validation: Rule => Rule.required().error('图片描述是必填项'),
        }
      ]
    }),
    
    defineField({
      name: 'gallery',
      title: '产品图册',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: '图片描述',
            validation: Rule => Rule.required().error('图片描述是必填项'),
          },
          {
            name: 'caption',
            type: 'string',
            title: '图片说明',
          }
        ]
      }],
      options: {
        layout: 'grid'
      }
    }),
    
    defineField({
      name: 'brand',
      title: '品牌',
      type: 'reference',
      to: [{ type: 'brandBasic' }],
      options: {
        filter: 'isActive == true && !(_id in path("drafts.**"))',
        disableNew: true
      },
      validation: Rule => Rule.required().error('请选择产品品牌'),
    }),
    
    defineField({
      name: 'category',
      title: '产品分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: Rule => Rule.required().error('产品分类是必填项'),
    }),
    
    defineField({
      name: 'subcategory',
      title: '产品子分类',
      type: 'reference',
      to: [{ type: 'productSubcategory' }],
    }),
    
    defineField({
      name: 'specifications',
      title: '产品规格',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'name',
            title: '规格名称',
            type: 'string',
            validation: Rule => Rule.required(),
          },
          {
            name: 'value',
            title: '规格值',
            type: 'string',
            validation: Rule => Rule.required(),
          },
          {
            name: 'unit',
            title: '单位',
            type: 'string',
          },
          {
            name: 'category',
            title: '规格分类',
            type: 'string',
            options: {
              list: [
                { title: '基本参数', value: 'basic' },
                { title: '电气参数', value: 'electrical' },
                { title: '机械参数', value: 'mechanical' },
                { title: '环境参数', value: 'environmental' },
                { title: '其他', value: 'other' },
              ]
            }
          },
          {
            name: 'order',
            title: '排序',
            type: 'number',
            initialValue: 0,
          }
        ],
        preview: {
          select: {
            name: 'name',
            value: 'value',
            unit: 'unit'
          },
          prepare({ name, value, unit }) {
            return {
              title: name,
              subtitle: `${value}${unit ? ` ${unit}` : ''}`
            }
          }
        }
      }]
    }),
    
    defineField({
      name: 'pricing',
      title: '价格信息',
      type: 'object',
      fields: [
        {
          name: 'currency',
          title: '货币',
          type: 'string',
          initialValue: 'CNY',
          options: {
            list: [
              { title: '人民币 (CNY)', value: 'CNY' },
              { title: '美元 (USD)', value: 'USD' },
              { title: '欧元 (EUR)', value: 'EUR' },
            ]
          }
        },
        {
          name: 'tiers',
          title: '阶梯价格',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'quantity',
                title: '数量',
                type: 'number',
                validation: Rule => Rule.required().positive(),
              },
              {
                name: 'price',
                title: '单价',
                type: 'number',
                validation: Rule => Rule.required().positive(),
              },
              {
                name: 'unit',
                title: '单位',
                type: 'string',
                initialValue: '个',
              }
            ],
            preview: {
              select: {
                quantity: 'quantity',
                price: 'price',
                unit: 'unit'
              },
              prepare({ quantity, price, unit }) {
                return {
                  title: `${quantity}${unit || '个'} 起`,
                  subtitle: `¥${price.toFixed(2)}`
                }
              }
            }
          }]
        },
        {
          name: 'moq',
          title: '最小订购量',
          type: 'number',
          validation: Rule => Rule.positive(),
        },
        {
          name: 'leadTime',
          title: '交货期',
          type: 'string',
        }
      ]
    }),
    
    defineField({
      name: 'inventory',
      title: '库存信息',
      type: 'object',
      fields: [
        {
          name: 'quantity',
          title: '库存数量',
          type: 'number',
          validation: Rule => Rule.min(0),
          initialValue: 0,
        },
        {
          name: 'status',
          title: '库存状态',
          type: 'string',
          options: {
            list: [
              { title: '有现货', value: 'in_stock' },
              { title: '库存紧张', value: 'low_stock' },
              { title: '缺货', value: 'out_of_stock' },
              { title: '停产', value: 'discontinued' },
            ]
          },
          initialValue: 'in_stock',
        },
        {
          name: 'warehouse',
          title: '仓库位置',
          type: 'string',
        },
        {
          name: 'lastUpdated',
          title: '最后更新',
          type: 'datetime',
          initialValue: () => new Date().toISOString(),
        }
      ]
    }),
    
    defineField({
      name: 'documents',
      title: '相关文档',
      type: 'object',
      fields: [
        {
          name: 'datasheet',
          title: '数据手册',
          type: 'file',
          options: {
            accept: '.pdf,.doc,.docx'
          }
        },
        {
          name: 'applicationNotes',
          title: '应用指南',
          type: 'array',
          of: [{ type: 'file' }]
        },
        {
          name: 'certificates',
          title: '认证证书',
          type: 'array',
          of: [{ type: 'file' }]
        },
        {
          name: 'referenceDesigns',
          title: '参考设计',
          type: 'array',
          of: [{ type: 'file' }]
        }
      ]
    }),
    
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'isFeatured',
      title: '是否推荐',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'isNew',
      title: '是否新品',
      type: 'boolean',
      initialValue: false,
    }),
    
    // SEO字段
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string',
      validation: Rule => Rule.max(60).warning('建议不超过60字符'),
    }),
    
    defineField({
      name: 'seoDescription',
      title: 'SEO描述',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160).warning('建议不超过160字符'),
    }),
    
    defineField({
      name: 'seoKeywords',
      title: 'SEO关键词',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      partNumber: 'partNumber',
      brand: 'brand.name',
      image: 'image',
      isActive: 'isActive'
    },
    prepare({ title, partNumber, brand, image, isActive }) {
      return {
        title: title || partNumber,
        subtitle: `${brand} • ${partNumber}${isActive ? '' : ' (已禁用)'}`,
        media: image
      }
    }
  },
  
  orderings: [
    {
      title: '产品型号',
      name: 'partNumberAsc',
      by: [{ field: 'partNumber', direction: 'asc' }]
    },
    {
      title: '创建时间（最新）',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: '更新时间（最新）',
      name: 'updatedDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }]
    }
  ]
})