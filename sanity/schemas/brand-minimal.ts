import { defineType, defineField } from 'sanity'
import { Award } from 'lucide-react'

export const brandMinimal = defineType({
  name: 'brandMinimal',
  title: '品牌（最简版）',
  type: 'document',
  icon: Award,
  
  fields: [
    defineField({
      name: 'name',
      title: '品牌名称',
      type: 'string',
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    
    defineField({
      name: 'logo',
      title: '品牌Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
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
    }),
    
    defineField({
      name: 'established',
      title: '成立年份',
      type: 'number',
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
        title: title || '无标题',
        subtitle: `${country || ''}${isActive ? '' : ' (已禁用)'}`,
        media: logo
      }
    }
  },
})