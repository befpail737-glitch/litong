import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article',
  title: '文章',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: '文章标识符',
      type: 'slug',
      options: {
        source: 'title'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'type',
      title: '文章类型',
      type: 'string',
      options: {
        list: [
          { title: '新闻资讯', value: 'news' },
          { title: '技术文章', value: 'technical' },
          { title: '应用案例', value: 'case-study' },
          { title: '产品发布', value: 'product-release' },
          { title: '公司新闻', value: 'company-news' }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: '文章分类',
      type: 'string',
      options: {
        list: [
          { title: '微控制器', value: 'microcontrollers' },
          { title: '模拟器件', value: 'analog' },
          { title: '电源管理', value: 'power' },
          { title: '传感器', value: 'sensors' },
          { title: '无线通信', value: 'wireless' },
          { title: '工业应用', value: 'industrial' },
          { title: '汽车电子', value: 'automotive' },
          { title: '消费电子', value: 'consumer' }
        ]
      }
    }),
    defineField({
      name: 'summary',
      title: '摘要',
      type: 'text',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'featuredImage',
      title: '特色图片',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        { name: 'alt', title: '图片描述', type: 'string' },
        { name: 'caption', title: '图片标题', type: 'string' }
      ]
    }),
    defineField({
      name: 'content',
      title: '文章内容',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: '图片描述', type: 'string' },
            { name: 'caption', title: '图片标题', type: 'string' }
          ]
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: '代码块',
          fields: [
            { name: 'language', title: '编程语言', type: 'string' },
            { name: 'code', title: '代码', type: 'text' }
          ]
        },
        {
          type: 'object',
          name: 'table',
          title: '表格',
          fields: [
            { name: 'caption', title: '表格标题', type: 'string' },
            {
              name: 'rows',
              title: '表格数据',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      title: '单元格',
                      type: 'array',
                      of: [{ type: 'string' }]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'file',
          title: 'PDF文档',
          options: {
            accept: '.pdf'
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'author',
      title: '作者',
      type: 'object',
      fields: [
        { name: 'name', title: '姓名', type: 'string' },
        { name: 'title', title: '职位', type: 'string' },
        { name: 'avatar', title: '头像', type: 'image' }
      ]
    }),
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'updatedAt',
      title: '更新时间',
      type: 'datetime'
    }),
    defineField({
      name: 'isPublished',
      title: '是否发布',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'isFeatured',
      title: '是否推荐',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'readTime',
      title: '阅读时间（分钟）',
      type: 'number',
      description: '预计阅读时间，可以自动计算或手动设置'
    }),
    defineField({
      name: 'difficulty',
      title: '技术难度',
      type: 'string',
      options: {
        list: [
          { title: '入门', value: 'beginner' },
          { title: '中级', value: 'intermediate' },
          { title: '高级', value: 'advanced' }
        ]
      }
    }),
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }]
        }
      ]
    }),
    defineField({
      name: 'relatedArticles',
      title: '相关文章',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'article' }]
        }
      ]
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
      name: 'downloadableResources',
      title: '下载资源',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: '资源标题', type: 'string' },
            { name: 'description', title: '资源描述', type: 'text' },
            { name: 'file', title: '文件', type: 'file' },
            { name: 'url', title: '外部链接', type: 'url' }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'featuredImage'
    }
  },
  orderings: [
    {
      title: '按发布时间（最新）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: '按更新时间',
      name: 'updatedAtDesc',
      by: [{ field: 'updatedAt', direction: 'desc' }]
    },
    {
      title: '按标题',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})