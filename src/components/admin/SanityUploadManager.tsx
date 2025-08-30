'use client';

import { useState, useCallback } from 'react';
import ExcelJS from 'exceljs';

interface Product {
  partNumber: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  package: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  price?: number;
  stock: number;
  leadTime: string;
  tags: string[];
}

interface Category {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  parent?: string;
}

export default function SanityUploadManager() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'products' | 'categories' | 'articles'>('products');
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadFile(file);
    } else {
      alert('请选择Excel文件 (.xlsx 或 .xls)');
    }
  }, []);

  const processProductsExcel = useCallback(async (data: any[][]) => {
    const headers = data[0];
    const rows = data.slice(1);
    
    const requiredColumns = ['产品型号', '产品名称', '品牌', '大类', '描述'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`缺少必要的列: ${missingColumns.join(', ')}`);
    }

    const products: Product[] = [];
    
    rows.forEach((row, index) => {
      if (!row || row.length === 0) return;

      const product: Product = {
        partNumber: String(row[headers.indexOf('产品型号')] || ''),
        name: String(row[headers.indexOf('产品名称')] || ''),
        brand: String(row[headers.indexOf('品牌')] || ''),
        category: String(row[headers.indexOf('大类')] || ''),
        subcategory: String(row[headers.indexOf('小类')] || ''),
        description: String(row[headers.indexOf('描述')] || ''),
        package: String(row[headers.indexOf('封装')] || ''),
        specifications: {},
        features: [],
        applications: [],
        price: parseFloat(String(row[headers.indexOf('价格')] || '0')) || undefined,
        stock: parseInt(String(row[headers.indexOf('库存')] || '0')) || 0,
        leadTime: String(row[headers.indexOf('交期')] || 'inquiry'),
        tags: []
      };

      // 解析参数列
      headers.forEach((header, headerIndex) => {
        if (header.startsWith('参数') && row[headerIndex]) {
          const paramValue = String(row[headerIndex]);
          if (paramValue.includes(':')) {
            const [key, value] = paramValue.split(':');
            product.specifications[key.trim()] = value.trim();
          }
        }
      });

      // 解析特性和应用
      if (row[headers.indexOf('特性')]) {
        product.features = String(row[headers.indexOf('特性')]).split(',').map(f => f.trim());
      }
      
      if (row[headers.indexOf('应用')]) {
        product.applications = String(row[headers.indexOf('应用')]).split(',').map(a => a.trim());
      }

      if (row[headers.indexOf('标签')]) {
        product.tags = String(row[headers.indexOf('标签')]).split(',').map(t => t.trim());
      }

      if (product.partNumber && product.name) {
        products.push(product);
      }
    });

    return products;
  }, []);

  const processCategoriesExcel = useCallback(async (data: any[][]) => {
    const headers = data[0];
    const rows = data.slice(1);
    
    const requiredColumns = ['分类名称', '英文名称', '标识符'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`缺少必要的列: ${missingColumns.join(', ')}`);
    }

    const categories: Category[] = [];
    
    rows.forEach((row) => {
      if (!row || row.length === 0) return;

      const category: Category = {
        name: String(row[headers.indexOf('分类名称')] || ''),
        nameEn: String(row[headers.indexOf('英文名称')] || ''),
        slug: String(row[headers.indexOf('标识符')] || ''),
        description: String(row[headers.indexOf('描述')] || ''),
        parent: String(row[headers.indexOf('父级分类')] || '') || undefined
      };

      if (category.name && category.slug) {
        categories.push(category);
      }
    });

    return categories;
  }, []);

  const uploadToSanity = useCallback(async (data: any[], type: string) => {
    try {
      const response = await fetch('/api/sanity/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          type
        })
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`上传到Sanity失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, []);

  const processExcelUpload = useCallback(async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults([]);

    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(data);
          const worksheet = workbook.worksheets[0];
          const jsonData: any[][] = [];
          
          worksheet.eachRow((row, rowNumber) => {
            const rowData: any[] = [];
            row.eachCell((cell, colNumber) => {
              rowData[colNumber - 1] = cell.value;
            });
            jsonData.push(rowData);
          });

          setUploadProgress(30);

          if (jsonData.length < 2) {
            throw new Error('Excel文件格式不正确，至少需要表头和一行数据');
          }

          let processedData: any[] = [];
          
          if (uploadType === 'products') {
            processedData = await processProductsExcel(jsonData);
          } else if (uploadType === 'categories') {
            processedData = await processCategoriesExcel(jsonData);
          }

          setUploadProgress(60);

          // 上传到Sanity
          const results = await uploadToSanity(processedData, uploadType);
          
          setUploadProgress(100);
          setUploadResults(results);
          
          setTimeout(() => {
            setIsUploading(false);
            setUploadFile(null);
            setUploadProgress(0);
            alert(`成功导入 ${processedData.length} 条${uploadType === 'products' ? '产品' : '分类'}数据到Sanity！`);
          }, 1000);

        } catch (error) {
          setIsUploading(false);
          alert(`导入失败：${error instanceof Error ? error.message : '请检查文件格式'}`);
        }
      };

      fileReader.onerror = () => {
        setIsUploading(false);
        alert('文件读取失败');
      };

      fileReader.readAsArrayBuffer(uploadFile);

    } catch (error) {
      setIsUploading(false);
      alert(`导入失败：${error instanceof Error ? error.message : '请检查文件格式'}`);
    }
  }, [uploadFile, uploadType, processProductsExcel, processCategoriesExcel, uploadToSanity]);

  const downloadTemplate = useCallback(async () => {
    let templateData: any[][] = [];
    
    if (uploadType === 'products') {
      templateData = [
        [
          '产品型号', '产品名称', '品牌', '大类', '小类', '描述', 
          '封装', '价格', '库存', '交期', '特性', '应用', '标签',
          '参数1', '参数2', '参数3', '参数4', '参数5'
        ],
        [
          'STM32F407VGT6', '32位ARM Cortex-M4微控制器', 'STMicroelectronics', 'microcontrollers', 'ARM Cortex-M4',
          '168MHz主频，1024KB Flash，192KB RAM', 'LQFP100', '45.80', '1200', 'in-stock',
          '高性能,低功耗,丰富外设', '工业控制,医疗设备,消费电子', 'STM32,ARM,微控制器',
          '内核:ARM Cortex-M4', '主频:168MHz', 'Flash:1024KB', 'RAM:192KB', '工作电压:1.8-3.6V'
        ]
      ];
    } else if (uploadType === 'categories') {
      templateData = [
        ['分类名称', '英文名称', '标识符', '描述', '父级分类'],
        ['微控制器', 'Microcontrollers', 'microcontrollers', '32位和8位微控制器产品', ''],
        ['ARM Cortex-M4', 'ARM Cortex-M4', 'arm-cortex-m4', 'ARM Cortex-M4内核微控制器', 'microcontrollers']
      ];
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(uploadType === 'products' ? '产品模板' : '分类模板');
      
      // 添加数据
      templateData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellRef = worksheet.getCell(rowIndex + 1, colIndex + 1);
          cellRef.value = cell;
          
          // 设置标题行样式
          if (rowIndex === 0) {
            cellRef.font = { bold: true };
            cellRef.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE6E6FA' }
            };
          }
        });
      });
      
      // 设置列宽
      templateData[0].forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 15;
      });
      
      // 下载文件
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LiTong${uploadType === 'products' ? '产品' : '分类'}导入模板.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('模板下载失败:', error);
    }
  }, [uploadType]);

  const openSanityStudio = useCallback(() => {
    window.open('/studio', '_blank');
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h2 className="text-2xl font-semibold text-gray-900">Sanity CMS 数据管理</h2>
            <p className="mt-2 text-sm text-gray-700">
              上传Excel数据到Sanity CMS，或直接访问Sanity Studio管理内容
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={openSanityStudio}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              打开Sanity Studio
            </button>
          </div>
        </div>
      </div>

      {/* Upload Type Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">选择上传类型</h3>
        <div className="flex space-x-4">
          {(['products', 'categories', 'articles'] as const).map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="uploadType"
                value={type}
                checked={uploadType === type}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                {type === 'products' ? '产品数据' : type === 'categories' ? '分类数据' : '文章数据'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium text-gray-900">
              {uploadType === 'products' ? '产品数据' : uploadType === 'categories' ? '分类数据' : '文章数据'}上传
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              上传Excel文件到Sanity CMS数据库
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载模板
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="mt-6">
          {!isUploading ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {uploadFile ? uploadFile.name : '选择Excel文件上传'}
                    </span>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".xlsx,.xls" />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">支持 .xlsx 和 .xls 格式</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  {uploadType === 'products' ? '产品' : uploadType === 'categories' ? '分类' : '文章'}Excel文件格式要求：
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {uploadType === 'products' ? (
                    <>
                      <li>• 必须包含：产品型号、产品名称、品牌、大类、描述</li>
                      <li>• 可选列：小类、封装、价格、库存、交期、特性、应用、标签</li>
                      <li>• 参数列：参数1, 参数2... (格式: 参数名:参数值)</li>
                    </>
                  ) : uploadType === 'categories' ? (
                    <>
                      <li>• 必须包含：分类名称、英文名称、标识符</li>
                      <li>• 可选列：描述、父级分类</li>
                      <li>• 父级分类填写上级分类的标识符</li>
                    </>
                  ) : (
                    <>
                      <li>• 必须包含：标题、类型、分类、摘要、内容</li>
                      <li>• 可选列：作者、标签、发布时间</li>
                      <li>• 内容支持Markdown格式</li>
                    </>
                  )}
                  <li>• 建议先下载模板文件查看正确格式</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">正在上传到Sanity...</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-sm text-gray-500">{uploadProgress}%</div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setUploadFile(null);
                setUploadProgress(0);
                setUploadResults([]);
              }}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              重置
            </button>
            <button
              onClick={processExcelUpload}
              disabled={!uploadFile || isUploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isUploading ? '上传中...' : '开始上传'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">上传结果</h3>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  成功上传 {uploadResults.length} 条数据到Sanity CMS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}