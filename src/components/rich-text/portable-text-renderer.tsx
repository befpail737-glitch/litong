'use client'

import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Quote,
  ExternalLink,
  Download,
  Play,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Portable Text 组件类型
interface PortableTextRendererProps {
  value: any[]
  className?: string
}

// 代码块组件
interface CodeBlockProps {
  value: {
    language?: string
    code: string
    filename?: string
    caption?: string
  }
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value }) => {
  const { language = 'javascript', code, filename, caption } = value

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // 这里可以添加复制成功的提示
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <Card className="my-6">
      {(filename || caption) && (
        <CardHeader className="pb-2">
          {filename && (
            <CardTitle className="text-sm font-mono">{filename}</CardTitle>
          )}
          {caption && (
            <CardDescription className="text-xs">{caption}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 z-10"
            onClick={handleCopy}
          >
            复制
          </Button>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 0.5rem 0.5rem',
              fontSize: '0.875rem'
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  )
}

// 图片组件
interface ImageBlockProps {
  value: {
    asset: {
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
    alt?: string
    caption?: string
    alignment?: 'left' | 'center' | 'right'
    size?: 'small' | 'medium' | 'large' | 'full'
  }
}

const ImageBlock: React.FC<ImageBlockProps> = ({ value }) => {
  const { asset, alt, caption, alignment = 'center', size = 'full' } = value
  
  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-md',
    large: 'max-w-2xl',
    full: 'w-full'
  }

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  }

  return (
    <figure className={cn("my-8", alignmentClasses[alignment])}>
      <div className={cn("relative rounded-lg overflow-hidden", sizeClasses[size])}>
        <Image
          src={asset.url}
          alt={alt || ''}
          width={asset.metadata?.dimensions?.width || 800}
          height={asset.metadata?.dimensions?.height || 600}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// 视频组件
interface VideoBlockProps {
  value: {
    url: string
    title?: string
    caption?: string
    autoplay?: boolean
  }
}

const VideoBlock: React.FC<VideoBlockProps> = ({ value }) => {
  const { url, title, caption, autoplay = false } = value

  // 检测视频类型
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const isVimeo = url.includes('vimeo.com')

  let embedUrl = url
  if (isYouTube) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`
  } else if (isVimeo) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
    embedUrl = `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`
  }

  return (
    <Card className="my-8">
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            className="w-full h-full rounded-b-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {caption && (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{caption}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 提示框组件
interface CalloutBlockProps {
  value: {
    type: 'info' | 'warning' | 'error' | 'success'
    title?: string
    content: any[]
  }
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({ value }) => {
  const { type, title, content } = value

  const typeConfig = {
    info: {
      icon: Info,
      color: 'border-blue-200 bg-blue-50 text-blue-900',
      iconColor: 'text-blue-600'
    },
    warning: {
      icon: AlertTriangle,
      color: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      iconColor: 'text-yellow-600'
    },
    error: {
      icon: AlertCircle,
      color: 'border-red-200 bg-red-50 text-red-900',
      iconColor: 'text-red-600'
    },
    success: {
      icon: CheckCircle,
      color: 'border-green-200 bg-green-50 text-green-900',
      iconColor: 'text-green-600'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className={cn("border-l-4 p-4 my-6 rounded-r-lg", config.color)}>
      <div className="flex items-start gap-3">
        <IconComponent className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{title}</h4>
          )}
          <PortableText
            value={content}
            components={portableTextComponents}
          />
        </div>
      </div>
    </div>
  )
}

// 表格组件
interface TableBlockProps {
  value: {
    rows: Array<{
      cells: string[]
    }>
    caption?: string
    hasHeader?: boolean
  }
}

const TableBlock: React.FC<TableBlockProps> = ({ value }) => {
  const { rows, caption, hasHeader = false } = value

  if (!rows || rows.length === 0) return null

  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        {hasHeader && rows[0] && (
          <thead>
            <tr className="bg-muted/50">
              {rows[0].cells.map((cell, index) => (
                <th
                  key={index}
                  className="border border-border p-3 text-left font-semibold"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {(hasHeader ? rows.slice(1) : rows).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-border p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          {caption}
        </p>
      )}
    </div>
  )
}

// 下载链接组件
interface DownloadBlockProps {
  value: {
    file: {
      asset: {
        url: string
        originalFilename?: string
      }
    }
    title?: string
    description?: string
    fileSize?: string
  }
}

const DownloadBlock: React.FC<DownloadBlockProps> = ({ value }) => {
  const { file, title, description, fileSize } = value

  return (
    <Card className="my-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium">
              {title || file.asset.originalFilename || '下载文件'}
            </h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {fileSize && (
              <p className="text-xs text-muted-foreground mt-1">{fileSize}</p>
            )}
          </div>
          <Button asChild>
            <a href={file.asset.url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              下载
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Portable Text 组件配置
const portableTextComponents = {
  types: {
    image: ImageBlock,
    code: CodeBlock,
    video: VideoBlock,
    callout: CalloutBlock,
    table: TableBlock,
    download: DownloadBlock
  },
  
  marks: {
    link: ({ children, value }: any) => {
      const isExternal = value.href?.startsWith('http')
      return (
        <Link
          href={value.href || '#'}
          className={cn(
            "text-primary hover:underline inline-flex items-center gap-1",
            isExternal && "after:content-['_↗']"
          )}
          target={value.blank || isExternal ? '_blank' : '_self'}
          rel={value.blank || isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
          {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
        </Link>
      )
    },
    
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    
    underline: ({ children }: any) => (
      <u className="underline">{children}</u>
    ),
    
    'strike-through': ({ children }: any) => (
      <s className="line-through">{children}</s>
    ),
    
    highlight: ({ children }: any) => (
      <mark className="bg-yellow-200 px-1 rounded">{children}</mark>
    )
  },
  
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-0 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h1>
    ),
    
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-10 mb-4 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h2>
    ),
    
    h3: ({ children }: any) => (
      <h3 className="text-xl font-medium mt-8 mb-3 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h3>
    ),
    
    h4: ({ children }: any) => (
      <h4 className="text-lg font-medium mt-6 mb-2 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h4>
    ),
    
    h5: ({ children }: any) => (
      <h5 className="text-base font-medium mt-5 mb-2 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h5>
    ),
    
    h6: ({ children }: any) => (
      <h6 className="text-sm font-medium mt-4 mb-2 scroll-mt-20" id={`heading-${Date.now()}`}>
        {children}
      </h6>
    ),
    
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/30 rounded-r">
        <Quote className="w-4 h-4 text-primary mb-2" />
        <div className="space-y-4">{children}</div>
      </blockquote>
    ),
    
    normal: ({ children }: any) => (
      <p className="mb-4 leading-7 text-foreground">{children}</p>
    ),
  },
  
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        {children}
      </ul>
    ),
    
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 pl-4">
        {children}
      </ol>
    ),
  },
  
  listItem: {
    bullet: ({ children }: any) => (
      <li className="leading-7">{children}</li>
    ),
    
    number: ({ children }: any) => (
      <li className="leading-7">{children}</li>
    ),
  },
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!value || !Array.isArray(value)) {
    return null
  }

  return (
    <div className={cn("prose prose-slate max-w-none", className)}>
      <PortableText
        value={value}
        components={portableTextComponents}
      />
    </div>
  )
}

export { portableTextComponents }