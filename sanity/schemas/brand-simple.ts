import { defineType, defineField } from 'sanity'
import { Award } from 'lucide-react'

export const brandSimple = defineType({
  name: 'brandSimple',
  title: '品牌（简化版）',
  type: 'document',
  icon: Award,
  
  fields: [
    defineField({
      name: 'name',
      title: '品牌名称',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    
    defineField({
      name: 'logo',
      title: '品牌Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Logo描述',
        }
      ]
    }),
    
    defineField({
      name: 'description',
      title: '品牌介绍',
      type: 'text',
      rows: 4,
    }),
    
    defineField({
      name: 'website',
      title: '官方网站',
      type: 'url',
    }),
    
    defineField({
      name: 'country',
      title: '国家/地区',
      type: 'string',
      options: {
        list: [
          { title: '美国', value: 'US' },
          { title: '中国', value: 'CN' },
          { title: '德国', value: 'DE' },
          { title: '日本', value: 'JP' },
          { title: '韩国', value: 'KR' },
          { title: '荷兰', value: 'NL' },
          { title: '瑞士', value: 'CH' },
          { title: '英国', value: 'GB' },
          { title: '法国', value: 'FR' },
          { title: '意大利', value: 'IT' },
          { title: '其他', value: 'OTHER' },
        ]
      }
    }),
    
    defineField({
      name: 'established',
      title: '成立年份',
      type: 'number',
      validation: Rule => Rule.min(1800).max(new Date().getFullYear()).integer(),
    }),
    
    defineField({
      name: 'headquarters',
      title: '总部地址',
      type: 'string',
    }),
    
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'isFeatured',
      title: '是否推荐',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      country: 'country',
      logo: 'logo',
      isActive: 'isActive'
    },
    prepare({ title, country, logo, isActive }) {
      return {
        title,
        subtitle: `${country || ''}${isActive ? '' : ' (已禁用)'}`,
        media: logo
      }
    }
  },
  
  orderings: [
    {
      title: '品牌名称',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: '创建时间（最新）',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ]
})