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
      type: 'array',
      description: '产品详细描述，支持富文本编辑、图片、表格、链接等',
      of: [
        {
          type: 'block',
          styles: [
            { title: '正文', value: 'normal' },
            { title: '标题1', value: 'h1' },
            { title: '标题2', value: 'h2' },
            { title: '标题3', value: 'h3' },
            { title: '标题4', value: 'h4' },
            { title: '引用', value: 'blockquote' },
          ],
          lists: [
            { title: '无序列表', value: 'bullet' },
            { title: '有序列表', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: '粗体', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下划线', value: 'underline' },
              { title: '删除线', value: 'strike-through' },
              { title: '代码', value: 'code' },
            ],
            annotations: [
              // 超链接功能
              {
                name: 'link',
                type: 'object',
                title: '超链接',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: '链接地址',
                    validation: Rule => Rule.required().uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    }),
                  },
                  {
                    name: 'target',
                    type: 'string',
                    title: '打开方式',
                    options: {
                      list: [
                        { title: '当前窗口', value: '_self' },
                        { title: '新窗口', value: '_blank' },
                      ]
                    },
                    initialValue: '_blank',
                  },
                ],
              },
              // 字体颜色
              {
                name: 'color',
                type: 'object',
                title: '字体颜色',
                fields: [
                  {
                    name: 'hex',
                    type: 'string',
                    title: '颜色',
                    options: {
                      list: [
                        { title: '黑色', value: '#000000' },
                        { title: '红色', value: '#DC2626' },
                        { title: '蓝色', value: '#2563EB' },
                        { title: '绿色', value: '#059669' },
                        { title: '橙色', value: '#EA580C' },
                        { title: '紫色', value: '#7C3AED' },
                        { title: '灰色', value: '#6B7280' },
                      ]
                    },
                    initialValue: '#000000',
                  },
                ],
              },
              // 字体大小
              {
                name: 'fontSize',
                type: 'object',
                title: '字体大小',
                fields: [
                  {
                    name: 'size',
                    type: 'string',
                    title: '大小',
                    options: {
                      list: [
                        { title: '小号 (12px)', value: 'text-xs' },
                        { title: '正常 (14px)', value: 'text-sm' },
                        { title: '中号 (16px)', value: 'text-base' },
                        { title: '大号 (18px)', value: 'text-lg' },
                        { title: '特大 (20px)', value: 'text-xl' },
                        { title: '超大 (24px)', value: 'text-2xl' },
                      ]
                    },
                    initialValue: 'text-base',
                  },
                ],
              },
            ],
          },
        },
        // 图片支持
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '图片描述',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: '图片标题',
            },
          ],
        },
        // PDF文件支持
        {
          type: 'file',
          name: 'pdf',
          title: 'PDF文档',
          options: {
            accept: '.pdf',
          },
          fields: [
            {
              name: 'title',
              type: 'string',
              title: '文档标题',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: '文档描述',
            },
          ],
        },
        // 表格支持
        {
          type: 'object',
          name: 'table',
          title: '表格',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: '表格标题',
            },
            {
              name: 'rows',
              type: 'array',
              title: '表格行',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      title: '单元格',
                      of: [{ type: 'string' }],
                    },
                  ],
                },
              ],
            },
            {
              name: 'hasHeader',
              type: 'boolean',
              title: '包含表头',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || '数据表格',
                subtitle: '产品规格表格',
              };
            },
          },
        },
      ],
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