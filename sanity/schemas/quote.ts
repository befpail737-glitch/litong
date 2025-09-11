import { defineType, defineField } from 'sanity'

export const quote = defineType({
  name: 'quote',
  title: '报价单',
  type: 'document',
  
  fields: [
    defineField({
      name: 'quoteNumber',
      title: '报价单编号',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'inquiry',
      title: '关联询价',
      type: 'reference',
      to: [{ type: 'inquiry' }],
    }),
    defineField({
      name: 'total',
      title: '总价',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: '货币',
      type: 'string',
      initialValue: 'CNY',
    }),
    defineField({
      name: 'validUntil',
      title: '有效期至',
      type: 'date',
    }),
    defineField({
      name: 'status',
      title: '状态',
      type: 'string',
      options: {
        list: [
          { title: '草稿', value: 'draft' },
          { title: '已发送', value: 'sent' },
          { title: '已接受', value: 'accepted' },
          { title: '已拒绝', value: 'rejected' },
        ]
      },
      initialValue: 'draft',
    }),
  ],
})