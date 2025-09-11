import Image from 'next/image';

import { PortableText as BasePortableText } from '@portabletext/react';

import { urlFor } from '@/lib/sanity/client';

// 富文本内容类型定义
type PortableTextProps = {
  content: any[]
  className?: string
}

// 自定义组件配置
const components = {
  // 块级元素样式
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-gray-50 py-2">
        {children}
      </blockquote>
    ),
  },

  // 列表样式
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },

  // 列表项样式
  listItem: {
    bullet: ({ children }: any) => <li className="mb-2">{children}</li>,
    number: ({ children }: any) => <li className="mb-2">{children}</li>,
  },

  // 文本标记样式
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <span className="underline">{children}</span>,
    'strike-through': ({ children }: any) => <span className="line-through">{children}</span>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),

    // 链接处理
    link: ({ value, children }: any) => {
      const { href, target = '_blank' } = value;
      return (
        <a
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    },

    // 字体颜色处理
    color: ({ value, children }: any) => {
      const { hex } = value;
      return (
        <span style={{ color: hex }}>
          {children}
        </span>
      );
    },

    // 字体大小处理
    fontSize: ({ value, children }: any) => {
      const { size } = value;
      return (
        <span className={size}>
          {children}
        </span>
      );
    },
  },

  // 自定义类型处理
  types: {
    // 图片处理
    image: ({ value }: any) => {
      const { alt, caption } = value;
      const imageUrl = urlFor(value).width(800).height(600).url();

      return (
        <figure className="my-6">
          <div className="relative w-full h-96">
            <Image
              src={imageUrl}
              alt={alt || '图片'}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-600 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // PDF文件处理
    pdf: ({ value }: any) => {
      const { title, description, asset } = value;
      const fileUrl = asset?.url;

      if (!fileUrl) return null;

      return (
        <div className="border rounded-lg p-4 my-6 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">PDF</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{title}</h4>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              下载PDF
            </a>
          </div>
        </div>
      );
    },

    // 表格处理
    table: ({ value }: any) => {
      const { title, rows } = value;

      if (!rows?.length) return null;

      return (
        <div className="my-6">
          {title && <h4 className="text-lg font-semibold mb-3">{title}</h4>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {rows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50' : ''}>
                    {row.cells?.map((cell: string, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
  },
};

export default function PortableText({ content, className = '' }: PortableTextProps) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <div className={`text-gray-500 ${className}`}>
        暂无内容
      </div>
    );
  }

  return (
    <div className={`prose max-w-none ${className}`}>
      <BasePortableText value={content} components={components} />
    </div>
  );
}
