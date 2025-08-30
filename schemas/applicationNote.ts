import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'applicationNote',
  title: '应用笔记',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '笔记标题',
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
      name: 'abstract',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '笔记内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'applicationArea',
      title: '应用领域',
      type: 'string',
      options: {
        list: [
          {title: '电源管理', value: 'power'},
          {title: '信号处理', value: 'signal'},
          {title: '通信接口', value: 'communication'},
          {title: '传感器', value: 'sensor'},
          {title: '电机驱动', value: 'motor'},
        ],
      },
    }),
    defineField({
      name: 'difficulty',
      title: '难度等级',
      type: 'string',
      options: {
        list: [
          {title: '入门', value: 'beginner'},
          {title: '中级', value: 'intermediate'},
          {title: '高级', value: 'advanced'},
        ],
      },
      initialValue: 'intermediate',
    }),
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'attachments',
      title: '附件',
      type: 'array',
      of: [
        {
          type: 'file',
          title: '文件',
        },
      ],
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
      author: 'author.name',
      area: 'applicationArea',
    },
    prepare(selection) {
      const {author, area} = selection
      return {...selection, subtitle: `${area} - ${author}`}
    },
  },
})