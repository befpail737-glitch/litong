import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: '内容块',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: '块',
      type: 'block',
      styles: [
        {title: '正文', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: '引用', value: 'blockquote'},
      ],
      lists: [{title: '项目符号', value: 'bullet'}],
      marks: {
        decorators: [
          {title: '粗体', value: 'strong'},
          {title: '斜体', value: 'em'},
        ],
        annotations: [
          {
            title: '链接',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})