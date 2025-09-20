'use client';

import Image from 'next/image';

import { PortableText as BasePortableText } from '@portabletext/react';

import { safeImageUrl, safeFileUrl, getFileInfo } from '@/lib/sanity/client';

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
      const imageUrl = safeImageUrl(value, { width: 800, height: 600, fallback: '/images/placeholder.jpg' });

      // 调试图片信息
      if (process.env.NODE_ENV === 'development') {
        console.log('🖼️ [PortableText] Processing image:', { value, imageUrl });
      }

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

    // PDF文件处理 - 增强版本支持多种数据结构
    pdf: ({ value }: any) => {
      console.log('🗄️ [PortableText] PDF 原始数据:', value);

      // 检测多种可能的数据结构
      let asset = null;
      let title = '';
      let description = '';

      // 情况1: 直接的文件资产引用
      if (value?.asset || value?._ref) {
        asset = value.asset || value;
        title = value.title || value.name || '';
        description = value.description || value.caption || '';
      }
      // 情况2: 嵌套在其他结构中
      else if (value?.file?.asset) {
        asset = value.file.asset;
        title = value.title || value.file.title || '';
        description = value.description || value.file.description || '';
      }
      // 情况3: 直接包含_ref的情况
      else if (typeof value === 'object' && value._ref) {
        asset = value;
        title = value.originalFilename || '';
      }

      console.log('🔍 [PortableText] 解析后的文件资产:', { asset, title, description });

      // 使用新的safeFileUrl函数获取文件URL
      const fileUrl = safeFileUrl(asset, { fallback: null });
      const fileInfo = getFileInfo(asset);

      console.log('🔗 [PortableText] 生成的文件URL:', fileUrl);
      console.log('📄 [PortableText] 文件信息:', fileInfo);

      // 根据文件类型显示不同的图标和颜色
      const fileTypeConfig = {
        pdf: { color: 'red', bgColor: 'red-50', borderColor: 'red-200', textColor: 'red-900', iconColor: 'red-600' },
        doc: { color: 'blue', bgColor: 'blue-50', borderColor: 'blue-200', textColor: 'blue-900', iconColor: 'blue-600' },
        docx: { color: 'blue', bgColor: 'blue-50', borderColor: 'blue-200', textColor: 'blue-900', iconColor: 'blue-600' },
        xls: { color: 'green', bgColor: 'green-50', borderColor: 'green-200', textColor: 'green-900', iconColor: 'green-600' },
        xlsx: { color: 'green', bgColor: 'green-50', borderColor: 'green-200', textColor: 'green-900', iconColor: 'green-600' },
        ppt: { color: 'orange', bgColor: 'orange-50', borderColor: 'orange-200', textColor: 'orange-900', iconColor: 'orange-600' },
        pptx: { color: 'orange', bgColor: 'orange-50', borderColor: 'orange-200', textColor: 'orange-900', iconColor: 'orange-600' },
        default: { color: 'gray', bgColor: 'gray-50', borderColor: 'gray-200', textColor: 'gray-900', iconColor: 'gray-600' }
      };

      const extension = fileInfo.extension?.toLowerCase() || 'pdf';
      const config = fileTypeConfig[extension] || fileTypeConfig.default;

      if (!fileUrl || fileUrl === '#' || fileUrl.includes('undefined')) {
        console.warn('⚠️ [PortableText] 文件URL不可用:', { value, asset, fileUrl });
        return (
          <div className="border rounded-lg p-4 my-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">
                  {extension.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800">
                  {title || '文档文件'}
                </h4>
                <p className="text-sm text-yellow-600">
                  文件暂时不可用 - 请检查文件是否已正确上传到Sanity
                </p>
                {description && (
                  <p className="text-sm text-yellow-600 mt-1">{description}</p>
                )}
                <div className="text-xs text-yellow-500 mt-2 font-mono">
                  调试: {JSON.stringify({ asset: asset?._ref || 'null', url: fileUrl })}
                </div>
              </div>
              <div className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">
                文件缺失
              </div>
            </div>
          </div>
        );
      }

      // 使用固定的样式类避免动态类名问题
      const getFileTypeStyles = (ext: string) => {
        switch (ext.toLowerCase()) {
          case 'pdf':
            return {
              container: 'border rounded-lg p-4 my-6 bg-red-50 border-red-200',
              icon: 'w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center',
              iconText: 'text-red-600 font-bold text-sm',
              title: 'font-semibold text-red-900',
              description: 'text-sm text-red-700 mt-1',
              info: 'flex items-center gap-4 mt-2 text-xs text-red-600',
              button: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2'
            };
          case 'doc':
          case 'docx':
            return {
              container: 'border rounded-lg p-4 my-6 bg-blue-50 border-blue-200',
              icon: 'w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center',
              iconText: 'text-blue-600 font-bold text-sm',
              title: 'font-semibold text-blue-900',
              description: 'text-sm text-blue-700 mt-1',
              info: 'flex items-center gap-4 mt-2 text-xs text-blue-600',
              button: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2'
            };
          case 'xls':
          case 'xlsx':
            return {
              container: 'border rounded-lg p-4 my-6 bg-green-50 border-green-200',
              icon: 'w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center',
              iconText: 'text-green-600 font-bold text-sm',
              title: 'font-semibold text-green-900',
              description: 'text-sm text-green-700 mt-1',
              info: 'flex items-center gap-4 mt-2 text-xs text-green-600',
              button: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2'
            };
          case 'ppt':
          case 'pptx':
            return {
              container: 'border rounded-lg p-4 my-6 bg-orange-50 border-orange-200',
              icon: 'w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center',
              iconText: 'text-orange-600 font-bold text-sm',
              title: 'font-semibold text-orange-900',
              description: 'text-sm text-orange-700 mt-1',
              info: 'flex items-center gap-4 mt-2 text-xs text-orange-600',
              button: 'bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors flex items-center gap-2'
            };
          default:
            return {
              container: 'border rounded-lg p-4 my-6 bg-gray-50 border-gray-200',
              icon: 'w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center',
              iconText: 'text-gray-600 font-bold text-sm',
              title: 'font-semibold text-gray-900',
              description: 'text-sm text-gray-700 mt-1',
              info: 'flex items-center gap-4 mt-2 text-xs text-gray-600',
              button: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2'
            };
        }
      };

      const styles = getFileTypeStyles(extension);

      return (
        <div className={styles.container}>
          <div className="flex items-center gap-3">
            <div className={styles.icon}>
              <span className={styles.iconText}>
                {extension.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h4 className={styles.title}>
                {title || fileInfo.name || `${extension.toUpperCase()} 文档`}
              </h4>
              {description && (
                <p className={styles.description}>{description}</p>
              )}
              <div className={styles.info}>
                <span>类型: {extension.toUpperCase()}</span>
                {fileInfo.size && <span>大小: {fileInfo.size}</span>}
                <span className="font-mono text-xs">✓ URL正常</span>
              </div>
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载 {extension.toUpperCase()}
            </a>
          </div>
        </div>
      );
    },

    // 文件处理 (通用)
    file: ({ value }: any) => {
      // 使用PDF处理逻辑处理所有文件类型
      return components.types.pdf({ value });
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
