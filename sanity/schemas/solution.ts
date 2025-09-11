import { defineType, defineField } from 'sanity'
import { Lightbulb } from 'lucide-react'

export const solution = defineType({
  name: 'solution',
  title: '解决方案',
  type: 'document',
  icon: Lightbulb,
  
  fields: [
    defineField({
      name: 'title',
      title: '方案名称',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    // 关联品牌 - 引用brandBasic文档
    defineField({
      name: 'relatedBrands',
      title: '关联品牌',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'brandBasic' }],
        options: {
          filter: 'isActive == true && !(_id in path("drafts.**"))',
          disableNew: true
        }
      }],
      description: '选择与此解决方案相关的品牌（可多选）',
    }),

    // 主要品牌 - 单选（向后兼容）
    defineField({
      name: 'primaryBrand',
      title: '主要品牌',
      type: 'reference',
      to: [{ type: 'brandBasic' }],
      options: {
        filter: 'isActive == true && !(_id in path("drafts.**"))',
        disableNew: true
      },
      description: '选择此解决方案的主要品牌',
    }),
    
    defineField({
      name: 'summary',
      title: '方案简介',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    
    // 升级为富文本编辑器
    defineField({
      name: 'description',
      title: '方案详细描述',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '正文', value: 'normal' },
            { title: '标题1', value: 'h1' },
            { title: '标题2', value: 'h2' },
            { title: '标题3', value: 'h3' },
            { title: '引用', value: 'blockquote' },
          ],
          lists: [
            { title: '无序列表', value: 'bullet' },
            { title: '有序列表', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: '加粗', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下划线', value: 'underline' },
              { title: '删除线', value: 'strike-through' },
              { title: '代码', value: 'code' },
            ],
            annotations: [
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
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || '表格',
                subtitle: '数据表格',
              };
            },
          },
        },
      ],
      validation: Rule => Rule.required(),
    }),

    // 封面图片
    defineField({
      name: 'coverImage',
      title: '封面图片',
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
      ],
    }),
    
    // 简化目标市场 - 可选
    defineField({
      name: 'targetMarket',
      title: '目标市场',
      type: 'string',
      options: {
        list: [
          { title: '工业自动化', value: 'industrial-automation' },
          { title: '消费电子', value: 'consumer-electronics' },
          { title: '其他', value: 'others' }
        ]
      },
      initialValue: 'industrial-automation'
    }),
    
    // 简化复杂度 - 可选
    defineField({
      name: 'complexity',
      title: '复杂度级别',
      type: 'string',
      options: {
        list: [
          { title: '简单', value: 'simple' },
          { title: '中等', value: 'medium' },
          { title: '复杂', value: 'complex' }
        ]
      },
      initialValue: 'medium'
    }),
    
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    
    defineField({
      name: 'isPublished',
      title: '是否发布',
      type: 'boolean',
      initialValue: false,
      description: '控制方案是否在前端显示'
    }),
    
    defineField({
      name: 'isFeatured',
      title: '是否推荐',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'viewCount',
      title: '浏览次数',
      type: 'number',
      initialValue: 0,
      readOnly: true
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      targetMarket: 'targetMarket',
      primaryBrand: 'primaryBrand.name',
      isPublished: 'isPublished',
      isFeatured: 'isFeatured'
    },
    prepare({ title, targetMarket, primaryBrand, isPublished, isFeatured }) {
      const marketMap: Record<string, string> = {
        'consumer-electronics': '消费电子',
        'industrial-automation': '工业自动化',
        'others': '其他'
      }
      
      const statusIcons = []
      if (isFeatured) statusIcons.push('⭐')
      if (!isPublished) statusIcons.push('📝')
      
      const brandInfo = primaryBrand ? ` • ${primaryBrand}` : ''
      
      return {
        title: title || '未命名方案',
        subtitle: `${marketMap[targetMarket] || targetMarket}${brandInfo} ${statusIcons.join(' ')}`,
      }
    }
  },
  
  orderings: [
    {
      title: '发布时间（最新）',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: '方案名称',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})