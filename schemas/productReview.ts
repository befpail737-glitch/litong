import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productReview',
  title: '新品评测',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '评测标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'product',
      title: '评测产品',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: '评测摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '评测内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'rating',
      title: '综合评分',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'pros',
      title: '优点',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cons',
      title: '缺点',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'testConditions',
      title: '测试条件',
      type: 'object',
      fields: [
        {
          name: 'temperature',
          title: '温度',
          type: 'string',
        },
        {
          name: 'voltage',
          title: '电压',
          type: 'string',
        },
        {
          name: 'frequency',
          title: '频率',
          type: 'string',
        },
        {
          name: 'other',
          title: '其他条件',
          type: 'text',
          rows: 2,
        },
      ],
    }),
    defineField({
      name: 'testResults',
      title: '测试结果',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'parameter',
              title: '测试参数',
              type: 'string',
            },
            {
              name: 'expected',
              title: '期望值',
              type: 'string',
            },
            {
              name: 'actual',
              title: '实测值',
              type: 'string',
            },
            {
              name: 'result',
              title: '测试结果',
              type: 'string',
              options: {
                list: [
                  {title: '通过', value: 'pass'},
                  {title: '失败', value: 'fail'},
                  {title: '警告', value: 'warning'},
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'images',
      title: '评测图片',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'author',
      title: '评测工程师',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
    }),
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      productName: 'product.partNumber',
      rating: 'rating',
      author: 'author.name',
    },
    prepare(selection) {
      const {productName, rating, author} = selection
      return {
        ...selection,
        subtitle: `${productName} - ${rating}/10 - ${author}`,
      }
    },
  },
})