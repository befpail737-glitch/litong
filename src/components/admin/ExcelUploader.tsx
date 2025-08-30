'use client';

import { useRef, useState, useCallback } from 'react';
import { useProductData } from '@/hooks/useProductData';

interface ExcelUploaderProps {
  onUploadComplete?: (result: { count: number; products: any[]; columns: any[] }) => void;
  onSanityUpload?: (result: any) => void;
  className?: string;
  showSanityUpload?: boolean;
}

export default function ExcelUploader({ 
  onUploadComplete, 
  onSanityUpload,
  className = '', 
  showSanityUpload = true 
}: ExcelUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadExcelFile, uploadProductsToSanity, products, loading, error } = useProductData();
  const [dragOver, setDragOver] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ count: number; products: any[]; columns: any[] } | null>(null);
  const [sanityUploading, setSanityUploading] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.name.match(/\.(csv|xlsx?|txt)$/i)) {
      alert('请选择CSV、Excel或TXT文件');
      return;
    }

    try {
      const result = await uploadExcelFile(file);
      setUploadResult(result);
      onUploadComplete?.(result);
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('文件上传失败:', err);
      setUploadResult(null);
    }
  }, [uploadExcelFile, onUploadComplete]);

  const handleSanityUpload = useCallback(async () => {
    if (!uploadResult?.products || uploadResult.products.length === 0) {
      alert('请先上传Excel文件');
      return;
    }

    setSanityUploading(true);
    try {
      const result = await uploadProductsToSanity(uploadResult.products);
      onSanityUpload?.(result);
      alert(`成功上传 ${result.count} 个产品到CMS`);
    } catch (err) {
      console.error('CMS上传失败:', err);
      alert(`CMS上传失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setSanityUploading(false);
    }
  }, [uploadResult, uploadProductsToSanity, onSanityUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Excel模板下载 */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Excel模板说明</h3>
        <p className="text-sm text-blue-700 mb-3">
          请使用以下列结构上传产品数据。每个参数列将自动生成对应的筛选条件。
        </p>
        
        <div className="bg-white rounded border p-3 mb-3">
          <div className="text-xs font-mono text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-1">
            <div><strong>必需列：</strong></div>
            <div></div>
            <div>• 型号 (Part Number)</div>
            <div>• 描述 (Description)</div>
            <div>• 品牌 (Brand)</div>
            <div>• 分类 (Category)</div>
            <div>• 封装 (Package)</div>
            <div>• 价格 (Price)</div>
            <div>• 库存 (Stock)</div>
            <div></div>
            <div><strong>参数列（自动生成筛选）：</strong></div>
            <div></div>
            <div>• 产品系列 (Series)</div>
            <div>• CPU内核 (Core)</div>
            <div>• 主频MHz (Frequency)</div>
            <div>• Flash容量 (Flash)</div>
            <div>• RAM容量 (RAM)</div>
            <div>• 工作温度 (Temperature)</div>
            <div>• ... (其他自定义参数)</div>
          </div>
        </div>

        <button
          onClick={() => {
            // 生成示例CSV
            const csvContent = [
              '型号,描述,品牌,分类,封装,价格,库存,产品系列,CPU内核,主频MHz,Flash容量,RAM容量,工作温度',
              'STM32F407VGT6,32位ARM Cortex-M4微控制器,STMicroelectronics,microcontrollers,LQFP100,45.80,1200,STM32F4,Cortex-M4,168,1MB,192KB,-40~85°C',
              'STM32F103C8T6,32位ARM Cortex-M3微控制器,STMicroelectronics,microcontrollers,LQFP48,12.50,8500,STM32F1,Cortex-M3,72,64KB,20KB,-40~85°C'
            ].join('\n');

            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = '产品数据模板.csv';
            link.click();
          }}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          📥 下载CSV模板
        </button>
      </div>

      {/* 文件上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${dragOver 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${loading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.txt"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-sm text-gray-600 mt-2">解析文件中...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  上传Excel产品数据
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {dragOver ? '松开鼠标上传文件' : '拖拽文件到这里，或点击选择文件'}
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">CSV</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">XLSX</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">XLS</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">TXT</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* 解析成功提示和Sanity上传 */}
      {uploadResult && !error && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-green-800">
                <p className="font-medium">✅ 文件解析成功</p>
                <p>成功解析 {uploadResult.count} 个产品，生成了 {uploadResult.columns.length} 个筛选条件</p>
                <div className="mt-2">
                  <p className="font-medium">生成的筛选条件：</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {uploadResult.columns.map((col, idx) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {col.name} ({col.type})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showSanityUpload && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">🚀 上传到CMS</h4>
              <p className="text-sm text-blue-700 mb-3">
                将解析的产品数据上传到Sanity CMS，供网站前台展示使用。
              </p>
              <button
                onClick={handleSanityUpload}
                disabled={sanityUploading}
                className={`
                  px-4 py-2 rounded text-sm font-medium transition-colors
                  ${sanityUploading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {sanityUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    上传中...
                  </div>
                ) : (
                  `上传 ${uploadResult.count} 个产品到CMS`
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 上传提示 */}
      {!uploadResult && !error && !loading && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-green-800">
              <p className="font-medium">上传提示</p>
              <p>文件上传后，系统将自动：</p>
              <ul className="mt-1 list-disc list-inside">
                <li>解析所有数据列并生成对应筛选条件</li>
                <li>根据列名智能识别筛选类型（选择/范围）</li>
                <li>为每个产品生成独立的详情页面</li>
                <li>自动优化SEO元数据和结构化数据</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}