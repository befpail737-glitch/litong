import { defineType, defineField } from 'sanity'

export const industry = defineType({
  name: 'industry',
  title: '行业',
  type: 'document',
  
  fields: [
    defineField({
      name: 'name',
      title: '行业名称',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'isVisible',
      title: '是否显示',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})