import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'company',
  title: '公司信息',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '公司名称',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(100)
    }),
    defineField({
      name: 'description',
      title: '公司简介',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'mission',
      title: '企业使命',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'vision',
      title: '企业愿景',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'values',
      title: '企业价值观',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '价值观名称',
              type: 'string'
            },
            {
              name: 'description',
              title: '价值观描述',
              type: 'string'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'founded',
      title: '成立时间',
      type: 'date'
    }),
    defineField({
      name: 'headquarters',
      title: '总部地址',
      type: 'string'
    }),
    defineField({
      name: 'contact',
      title: '联系信息',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: '联系电话',
          type: 'string'
        },
        {
          name: 'email',
          title: '邮箱地址',
          type: 'string'
        },
        {
          name: 'address',
          title: '公司地址',
          type: 'string'
        },
        {
          name: 'workingHours',
          title: '工作时间',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'stats',
      title: '公司统计数据',
      type: 'object',
      fields: [
        {
          name: 'yearsExperience',
          title: '行业经验（年）',
          type: 'number'
        },
        {
          name: 'employeeCount',
          title: '员工人数',
          type: 'number'
        },
        {
          name: 'clientCount',
          title: '服务客户数',
          type: 'number'
        },
        {
          name: 'projectCount',
          title: '项目数量',
          type: 'number'
        }
      ]
    }),
    defineField({
      name: 'team',
      title: '团队成员',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: '姓名',
              type: 'string'
            },
            {
              name: 'position',
              title: '职位',
              type: 'string'
            },
            {
              name: 'bio',
              title: '个人简介',
              type: 'text',
              rows: 3
            },
            {
              name: 'image',
              title: '头像',
              type: 'image',
              options: {
                hotspot: true,
              }
            },
            {
              name: 'social',
              title: '社交媒体',
              type: 'object',
              fields: [
                {
                  name: 'linkedin',
                  title: 'LinkedIn',
                  type: 'string'
                },
                {
                  name: 'twitter',
                  title: 'Twitter',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'achievements',
      title: '公司成就',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'year',
              title: '年份',
              type: 'string'
            },
            {
              name: 'title',
              title: '成就标题',
              type: 'string'
            },
            {
              name: 'description',
              title: '成就描述',
              type: 'string'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'certifications',
      title: '资质认证',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: '认证名称',
              type: 'string'
            },
            {
              name: 'issuer',
              title: '认证机构',
              type: 'string'
            },
            {
              name: 'image',
              title: '认证证书',
              type: 'image'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description'
    }
  }
})