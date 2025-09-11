import { defineType, defineField } from 'sanity'
import { User } from 'lucide-react'

export const author = defineType({
  name: 'author',
  title: '作者',
  type: 'document',
  icon: User,
  
  fields: [
    defineField({
      name: 'name',
      title: '姓名',
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
      name: 'bio',
      title: '个人简介',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'avatar',
      title: '头像',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})