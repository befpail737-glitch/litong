import { defineType, defineField } from 'sanity'

export const inquiry = defineType({
  name: 'inquiry',
  title: '询价',
  type: 'document',
  
  fields: [
    defineField({
      name: 'inquiryNumber',
      title: '询价编号',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: '客户姓名',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: '客户邮箱',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: '询价内容',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: '状态',
      type: 'string',
      options: {
        list: [
          { title: '待处理', value: 'pending' },
          { title: '处理中', value: 'processing' },
          { title: '已完成', value: 'completed' },
        ]
      },
      initialValue: 'pending',
    }),
  ],
})