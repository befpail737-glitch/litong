'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Undo,
  Redo,
  Save,
  Eye,
  FileText,
  Type,
  Palette,
  Upload
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

// 富文本编辑器组件接口
interface RichTextEditorProps {
  value?: any[]
  onChange?: (value: any[]) => void
  locale: Locale
  placeholder?: string
  className?: string
  readOnly?: boolean
  tools?: string[]
}

// 工具栏按钮接口
interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
  onClick: () => void
  disabled?: boolean
}

// 文本样式
interface TextStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  color?: string
  backgroundColor?: string
}

// 段落对齐
type TextAlign = 'left' | 'center' | 'right' | 'justify'

// 编辑器状态
interface EditorState {
  content: any[]
  selection: {
    start: number
    end: number
  }
  textStyle: TextStyle
  align: TextAlign
  canUndo: boolean
  canRedo: boolean
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  disabled
}) => (
  <Button
    variant={isActive ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={label}
    className="w-8 h-8 p-0"
  >
    <Icon className="w-4 h-4" />
  </Button>
);

export function RichTextEditor({
  value = [],
  onChange,
  locale,
  placeholder,
  className,
  readOnly = false,
  tools = ['all']
}: RichTextEditorProps) {
  const t = useTranslations('richTextEditor');
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    content: value,
    selection: { start: 0, end: 0 },
    textStyle: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false
    },
    align: 'left',
    canUndo: false,
    canRedo: false
  });

  const [showPreview, setShowPreview] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // 检查工具是否启用
  const isToolEnabled = (tool: string) => {
    return tools.includes('all') || tools.includes(tool);
  };

  // 格式化命令
  const execCommand = useCallback((command: string, value?: string) => {
    if (readOnly) return;
    document.execCommand(command, false, value);
    updateEditorState();
  }, [readOnly]);

  // 更新编辑器状态
  const updateEditorState = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      textStyle: {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
        color: document.queryCommandValue('foreColor'),
        backgroundColor: document.queryCommandValue('backColor')
      },
      align: (document.queryCommandValue('justifyLeft') && 'left') ||
             (document.queryCommandValue('justifyCenter') && 'center') ||
             (document.queryCommandValue('justifyRight') && 'right') ||
             (document.queryCommandValue('justifyFull') && 'justify') ||
             'left',
      canUndo: document.queryCommandEnabled('undo'),
      canRedo: document.queryCommandEnabled('redo')
    }));
  }, []);

  // 处理内容变化
  const handleContentChange = useCallback(() => {
    if (readOnly || !editorRef.current) return;

    const content = editorRef.current.innerHTML;
    // 这里可以转换为Portable Text格式
    const portableTextContent = htmlToPortableText(content);
    onChange?.(portableTextContent);
  }, [onChange, readOnly]);

  // HTML转Portable Text (简化版)
  const htmlToPortableText = (html: string): any[] => {
    // 实际项目中需要实现完整的HTML到Portable Text的转换
    return [
      {
        _type: 'block',
        _key: Date.now().toString(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: (Date.now() + 1).toString(),
            text: html.replace(/<[^>]*>/g, ''), // 简单去除HTML标签
            marks: []
          }
        ],
        markDefs: []
      }
    ];
  };

  // Portable Text转HTML (简化版)
  const portableTextToHtml = (content: any[]): string => {
    // 实际项目中需要实现完整的Portable Text到HTML的转换
    return content.map(block => {
      if (block._type === 'block') {
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        switch (block.style) {
          case 'h1': return `<h1>${text}</h1>`;
          case 'h2': return `<h2>${text}</h2>`;
          case 'h3': return `<h3>${text}</h3>`;
          default: return `<p>${text}</p>`;
        }
      }
      return '';
    }).join('');
  };

  // 插入链接
  const insertLink = useCallback(() => {
    if (!linkUrl) return;
    execCommand('createLink', linkUrl);
    setShowLinkDialog(false);
    setLinkUrl('');
  }, [linkUrl, execCommand]);

  // 插入图片
  const insertImage = useCallback(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      execCommand('insertImage', imgSrc);
      setShowImageDialog(false);
      setImageFile(null);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile, execCommand]);

  // 插入表格
  const insertTable = useCallback(() => {
    const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">单元格 1</td>
          <td style="padding: 8px; border: 1px solid #ccc;">单元格 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">单元格 3</td>
          <td style="padding: 8px; border: 1px solid #ccc;">单元格 4</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHtml);
  }, []);

  // 键盘快捷键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (readOnly) return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
        case 's':
          e.preventDefault();
          // 触发保存
          break;
      }
    }
  }, [readOnly, execCommand]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = portableTextToHtml(value);
    }
  }, [value]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('richTextEditor')}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant={showPreview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {t('preview')}
            </Button>

            {!readOnly && (
              <Button size="sm">
                <Save className="w-4 h-4 mr-1" />
                {t('save')}
              </Button>
            )}
          </div>
        </div>

        {/* 工具栏 */}
        {!readOnly && !showPreview && (
          <div className="space-y-2">
            {/* 第一行：文本格式 */}
            <div className="flex items-center gap-1 flex-wrap">
              {isToolEnabled('undo') && (
                <ToolbarButton
                  icon={Undo}
                  label={t('undo')}
                  onClick={() => execCommand('undo')}
                  disabled={!editorState.canUndo}
                />
              )}
              {isToolEnabled('redo') && (
                <ToolbarButton
                  icon={Redo}
                  label={t('redo')}
                  onClick={() => execCommand('redo')}
                  disabled={!editorState.canRedo}
                />
              )}

              <Separator orientation="vertical" className="h-6" />

              {isToolEnabled('heading') && (
                <>
                  <ToolbarButton
                    icon={Heading1}
                    label={t('heading1')}
                    onClick={() => execCommand('formatBlock', 'h1')}
                  />
                  <ToolbarButton
                    icon={Heading2}
                    label={t('heading2')}
                    onClick={() => execCommand('formatBlock', 'h2')}
                  />
                  <ToolbarButton
                    icon={Heading3}
                    label={t('heading3')}
                    onClick={() => execCommand('formatBlock', 'h3')}
                  />

                  <Separator orientation="vertical" className="h-6" />
                </>
              )}

              {isToolEnabled('bold') && (
                <ToolbarButton
                  icon={Bold}
                  label={t('bold')}
                  isActive={editorState.textStyle.bold}
                  onClick={() => execCommand('bold')}
                />
              )}
              {isToolEnabled('italic') && (
                <ToolbarButton
                  icon={Italic}
                  label={t('italic')}
                  isActive={editorState.textStyle.italic}
                  onClick={() => execCommand('italic')}
                />
              )}
              {isToolEnabled('underline') && (
                <ToolbarButton
                  icon={Underline}
                  label={t('underline')}
                  isActive={editorState.textStyle.underline}
                  onClick={() => execCommand('underline')}
                />
              )}
              {isToolEnabled('strikethrough') && (
                <ToolbarButton
                  icon={Strikethrough}
                  label={t('strikethrough')}
                  isActive={editorState.textStyle.strikethrough}
                  onClick={() => execCommand('strikeThrough')}
                />
              )}

              <Separator orientation="vertical" className="h-6" />

              {isToolEnabled('color') && (
                <input
                  type="color"
                  onChange={(e) => execCommand('foreColor', e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                  title={t('textColor')}
                />
              )}

              {isToolEnabled('backgroundColor') && (
                <input
                  type="color"
                  onChange={(e) => execCommand('backColor', e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                  title={t('backgroundColor')}
                />
              )}
            </div>

            {/* 第二行：对齐和列表 */}
            <div className="flex items-center gap-1 flex-wrap">
              {isToolEnabled('align') && (
                <>
                  <ToolbarButton
                    icon={AlignLeft}
                    label={t('alignLeft')}
                    isActive={editorState.align === 'left'}
                    onClick={() => execCommand('justifyLeft')}
                  />
                  <ToolbarButton
                    icon={AlignCenter}
                    label={t('alignCenter')}
                    isActive={editorState.align === 'center'}
                    onClick={() => execCommand('justifyCenter')}
                  />
                  <ToolbarButton
                    icon={AlignRight}
                    label={t('alignRight')}
                    isActive={editorState.align === 'right'}
                    onClick={() => execCommand('justifyRight')}
                  />
                  <ToolbarButton
                    icon={AlignJustify}
                    label={t('alignJustify')}
                    isActive={editorState.align === 'justify'}
                    onClick={() => execCommand('justifyFull')}
                  />

                  <Separator orientation="vertical" className="h-6" />
                </>
              )}

              {isToolEnabled('list') && (
                <>
                  <ToolbarButton
                    icon={List}
                    label={t('bulletList')}
                    onClick={() => execCommand('insertUnorderedList')}
                  />
                  <ToolbarButton
                    icon={ListOrdered}
                    label={t('numberedList')}
                    onClick={() => execCommand('insertOrderedList')}
                  />

                  <Separator orientation="vertical" className="h-6" />
                </>
              )}

              {isToolEnabled('quote') && (
                <ToolbarButton
                  icon={Quote}
                  label={t('blockquote')}
                  onClick={() => execCommand('formatBlock', 'blockquote')}
                />
              )}

              {isToolEnabled('code') && (
                <ToolbarButton
                  icon={Code}
                  label={t('code')}
                  onClick={() => execCommand('formatBlock', 'pre')}
                />
              )}

              <Separator orientation="vertical" className="h-6" />

              {isToolEnabled('link') && (
                <ToolbarButton
                  icon={Link}
                  label={t('link')}
                  onClick={() => setShowLinkDialog(true)}
                />
              )}

              {isToolEnabled('image') && (
                <ToolbarButton
                  icon={Image}
                  label={t('image')}
                  onClick={() => setShowImageDialog(true)}
                />
              )}

              {isToolEnabled('table') && (
                <ToolbarButton
                  icon={Table}
                  label={t('table')}
                  onClick={insertTable}
                />
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {showPreview ? (
          // 预览模式
          <div className="min-h-[400px] p-4 border rounded-md bg-background">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: portableTextToHtml(editorState.content)
              }}
            />
          </div>
        ) : (
          // 编辑模式
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onMouseUp={updateEditorState}
            className={cn(
              'min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring',
              readOnly && 'bg-muted cursor-not-allowed'
            )}
            style={{
              minHeight: '400px',
              whiteSpace: 'pre-wrap'
            }}
            suppressContentEditableWarning={true}
            placeholder={placeholder}
            data-placeholder={placeholder}
          />
        )}

        {/* 字符统计 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{t('characters')}: {editorRef.current?.textContent?.length || 0}</span>
            <span>{t('words')}: {(editorRef.current?.textContent?.split(/\s+/).length || 1) - 1}</span>
          </div>

          {locale && (
            <Badge variant="outline" className="text-xs">
              {locale.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* 链接对话框 */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{t('insertLink')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="link-url">{t('url')}</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={insertLink}>
                  {t('insert')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 图片对话框 */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{t('insertImage')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-file">{t('selectFile')}</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={insertImage} disabled={!imageFile}>
                  {t('insert')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
