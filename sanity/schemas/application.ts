import { defineType, defineField } from 'sanity'

export const application = defineType({
  name: 'application',
  title: '应用场景',
  type: 'document',
  
  fields: [
    defineField({
      name: 'name',
      title: '应用名称',
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
      name: 'industry',
      title: '所属行业',
      type: 'reference',
      to: [{ type: 'industry' }],
    }),
    defineField({
      name: 'isVisible',
      title: '是否显示',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})