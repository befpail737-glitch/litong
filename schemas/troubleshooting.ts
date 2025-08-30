import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'troubleshooting',
  title: '问题排查',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '问题标题',
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
      name: 'problem',
      title: '问题描述',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'symptoms',
      title: '故障现象',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'causes',
      title: '可能原因',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'cause',
              title: '原因',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'probability',
              title: '可能性',
              type: 'string',
              options: {
                list: [
                  {title: '高', value: 'high'},
                  {title: '中', value: 'medium'},
                  {title: '低', value: 'low'},
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'solutions',
      title: '解决方案',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'severity',
      title: '严重程度',
      type: 'string',
      options: {
        list: [
          {title: '严重', value: 'critical'},
          {title: '重要', value: 'high'},
          {title: '中等', value: 'medium'},
          {title: '轻微', value: 'low'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'author',
      title: '作者',
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
      severity: 'severity',
      author: 'author.name',
    },
    prepare(selection) {
      const {severity, author} = selection
      return {...selection, subtitle: `${severity} - ${author}`}
    },
  },
})