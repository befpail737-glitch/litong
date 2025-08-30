'use client';

import { useState, useCallback, useEffect } from 'react';
// Excel处理现在使用ExcelJS库通过useProductData hook
import { getProducts, getProductCategories } from '@/lib/sanity';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  package: string;
  description: string;
  specifications: Record<string, string>;
  price?: number;
  stock: number;
  datasheet?: string;
  createdAt: string;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'STM32F407VGT6',
    brand: 'STMicroelectronics',
    category: 'microcontrollers',
    subcategory: 'ARM Cortex-M4',
    package: 'LQFP100',
    description: '32位ARM Cortex-M4微控制器，168MHz，1MB Flash，192KB RAM',
    specifications: {
      '内核': 'ARM Cortex-M4',
      '主频': '168MHz',
      'Flash': '1MB',
      'RAM': '192KB',
      '工作电压': '1.8-3.6V',
      '工作温度': '-40 to +85°C'
    },
    price: 25.50,
    stock: 1000,
    datasheet: '/datasheets/STM32F407VGT6.pdf',
    createdAt: '2024-11-15'
  },
  {
    id: '2',
    name: 'TPS54360DDA',
    brand: 'Texas Instruments',
    category: 'power-management',
    subcategory: 'DC-DC转换器',
    package: 'HSOP8',
    description: '3.5V至60V输入、3.5A同步降压转换器',
    specifications: {
      '输入电压': '3.5-60V',
      '输出电流': '3.5A',
      '效率': '95%',
      '开关频率': '500kHz',
      '工作温度': '-40 to +125°C'
    },
    price: 8.20,
    stock: 500,
    datasheet: '/datasheets/TPS54360DDA.pdf',
    createdAt: '2024-11-14'
  }
];

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [sanityCategories, setSanityCategories] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataSource, setDataSource] = useState<'local' | 'sanity'>('local');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const defaultCategories = [
    { value: 'all', label: '所有分类' },
    { value: 'microcontrollers', label: '微控制器' },
    { value: 'power-management', label: '电源管理' },
    { value: 'analog-mixed-signal', label: '模拟与混合信号' },
    { value: 'rf-wireless', label: 'RF与无线' },
    { value: 'sensors', label: '传感器' },
    { value: 'interface-ics', label: '接口IC' }
  ];

  const productCategories = {
    'microcontrollers': {
      name: '微控制器',
      subcategories: [
        'ARM Cortex-M0',
        'ARM Cortex-M3', 
        'ARM Cortex-M4',
        'ARM Cortex-M7',
        '8051系列',
        'PIC系列',
        'AVR系列',
        'RISC-V',
        '其他'
      ]
    },
    'sensors': {
      name: '传感器',
      subcategories: [
        '温湿度传感器',
        '压力传感器',
        '光线传感器',
        '加速度传感器',
        '陀螺仪传感器',
        '磁场传感器',
        '气体传感器',
        '超声波传感器',
        '红外传感器',
        '其他传感器'
      ]
    },
    'power-management': {
      name: '电源管理',
      subcategories: [
        'DC-DC转换器',
        'LDO稳压器',
        '电池管理',
        '充电管理',
        '电源监控',
        '开关控制器',
        '电压基准',
        '其他电源'
      ]
    },
    'rf-wireless': {
      name: 'RF与无线',
      subcategories: [
        'WiFi模块',
        '蓝牙模块',
        'LoRa模块',
        'Zigbee模块',
        '4G/5G模块',
        'RF收发器',
        '天线',
        '其他无线'
      ]
    },
    'analog-mixed-signal': {
      name: '模拟与混合信号',
      subcategories: [
        'ADC转换器',
        'DAC转换器',
        '运算放大器',
        '比较器',
        '时钟发生器',
        '信号调理',
        '滤波器',
        '其他模拟'
      ]
    },
    'interface-ics': {
      name: '接口IC',
      subcategories: [
        'CAN收发器',
        'RS485收发器',
        'USB接口',
        '以太网PHY',
        'SPI/I2C接口',
        'UART接口',
        '其他接口'
      ]
    }
  };

  const brandOptions = [
    'STMicroelectronics',
    'Texas Instruments', 
    'Infineon',
    'NXP',
    'Analog Devices',
    'Microchip',
    'Renesas',
    'Maxim Integrated',
    'ON Semiconductor',
    'Cypress',
    'Nordic Semiconductor',
    'Espressif',
    'SiLabs',
    'Bosch',
    'Sensirion',
    '其他品牌'
  ];

  // 从Sanity加载产品数据
  const loadSanityData = useCallback(async () => {
    if (dataSource !== 'sanity') return;
    
    setIsLoading(true);
    try {
      console.log('开始加载Sanity数据...');
      const [sanityProducts, categories] = await Promise.all([
        getProducts(),
        getProductCategories()
      ]);
      
      console.log('成功获取Sanity数据:', { 
        products: sanityProducts?.length || 0, 
        categories: categories?.length || 0 
      });
      
      // 转换Sanity数据格式以匹配本地格式
      const formattedProducts = (sanityProducts || []).map((product: any) => ({
        id: product._id,
        name: product.partNumber || product.name,
        brand: product.brand,
        category: product.category?.slug?.current || product.category?.slug || 'unknown',
        subcategory: product.subcategory?.name || '',
        package: product.package,
        description: product.description,
        specifications: product.specifications?.reduce((acc: any, spec: any) => {
          acc[spec.parameter] = spec.value + (spec.unit ? ` ${spec.unit}` : '');
          return acc;
        }, {}) || {},
        price: product.pricing?.price,
        stock: product.stock || 0,
        datasheet: product.documents?.find((doc: any) => doc.type === 'datasheet')?.file?.asset?.url,
        createdAt: product._createdAt ? new Date(product._createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));

      setProducts(formattedProducts);
      setSanityCategories(categories || []);
      
      // 显示成功消息
      setMessage({ 
        type: 'success', 
        text: `成功加载 ${formattedProducts.length} 个产品和 ${(categories || []).length} 个分类` 
      });
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Failed to load Sanity data:', error);
      setMessage({ 
        type: 'error', 
        text: `从Sanity加载数据失败: ${error instanceof Error ? error.message : '未知错误'}` 
      });
      setTimeout(() => setMessage(null), 5000);
      
      // 如果Sanity加载失败，回退到本地数据
      console.log('回退到本地示例数据');
      setProducts(sampleProducts);
      setSanityCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    loadSanityData();
  }, [loadSanityData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadFile(file);
    } else {
      alert('请选择Excel文件 (.xlsx 或 .xls)');
    }
  };

  const processExcelUpload = useCallback(async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          setUploadProgress(30);

          if (jsonData.length < 2) {
            throw new Error('Excel文件格式不正确，至少需要表头和一行数据');
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);

          // 验证必要的列
          const requiredColumns = ['产品名称', '品牌', '产品分类', '产品小类', '封装', '描述', '价格', '库存'];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          
          if (missingColumns.length > 0) {
            throw new Error(`缺少必要的列: ${missingColumns.join(', ')}`);
          }

          setUploadProgress(50);

          // 解析产品数据
          const newProducts: Product[] = [];
          const timestamp = Date.now();

          rows.forEach((row, index) => {
            if (!row || row.length === 0) return;

            const product: Product = {
              id: `${timestamp}_${index}`,
              name: String(row[headers.indexOf('产品名称')] || ''),
              brand: String(row[headers.indexOf('品牌')] || selectedBrand || ''),
              category: String(row[headers.indexOf('产品分类')] || selectedMainCategory || ''),
              subcategory: String(row[headers.indexOf('产品小类')] || selectedSubCategory || ''),
              package: String(row[headers.indexOf('封装')] || ''),
              description: String(row[headers.indexOf('描述')] || ''),
              price: parseFloat(String(row[headers.indexOf('价格')] || '0')) || undefined,
              stock: parseInt(String(row[headers.indexOf('库存')] || '0')) || 0,
              datasheet: String(row[headers.indexOf('规格书链接')] || ''),
              specifications: {},
              createdAt: new Date().toISOString().split('T')[0]
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

            if (product.name) {
              newProducts.push(product);
            }
          });

          setUploadProgress(80);

          if (newProducts.length === 0) {
            throw new Error('没有找到有效的产品数据');
          }

          // 上传处理
          setTimeout(async () => {
            try {
              setUploadProgress(100);

              if (dataSource === 'sanity') {
                // 上传到Sanity
                const response = await fetch('/api/sanity/upload', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    data: newProducts,
                    type: 'products'
                  })
                });

                if (!response.ok) {
                  throw new Error('上传到Sanity失败');
                }

                const result = await response.json();
                alert(`成功导入 ${result.count} 个产品到Sanity！`);
                
                // 重新加载Sanity数据
                await loadSanityData();
              } else {
                // 本地存储
                setProducts(prev => [...prev, ...newProducts]);
                alert(`成功导入 ${newProducts.length} 个产品！`);
              }

              setIsUploadModalOpen(false);
              setUploadFile(null);
              setUploadProgress(0);
              setIsUploading(false);
              setSelectedMainCategory('');
              setSelectedSubCategory('');
              setSelectedBrand('');
            } catch (error) {
              setIsUploading(false);
              alert(`上传失败：${error instanceof Error ? error.message : '未知错误'}`);
            }
          }, 500);

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
  }, [uploadFile]);

  const downloadTemplate = useCallback(() => {
    // 创建模板数据
    const templateData = [
      [
        '产品名称', '品牌', '产品分类', '产品小类', '封装', '描述', 
        '价格', '库存', '规格书链接', '参数1', '参数2', '参数3', '参数4', '参数5'
      ],
      [
        'STM32F407VGT6', 'STMicroelectronics', 'microcontrollers', 'ARM Cortex-M4', 
        'LQFP100', '32位ARM Cortex-M4微控制器，168MHz，1MB Flash，192KB RAM',
        '25.50', '1000', '/datasheets/STM32F407VGT6.pdf',
        '内核:ARM Cortex-M4', '主频:168MHz', 'Flash:1MB', 'RAM:192KB', '工作电压:1.8-3.6V'
      ],
      [
        'TPS54360DDA', 'Texas Instruments', 'power-management', 'DC-DC转换器',
        'HSOP8', '3.5V至60V输入、3.5A同步降压转换器',
        '8.20', '500', '/datasheets/TPS54360DDA.pdf',
        '输入电压:3.5-60V', '输出电流:3.5A', '效率:95%', '开关频率:500kHz', '工作温度:-40 to +125°C'
      ],
      [
        'DHT22', '', 'sensors', '温湿度传感器',
        'DIP-4', '数字温湿度传感器，高精度，长期稳定性好',
        '15.80', '200', '/datasheets/DHT22.pdf',
        '温度范围:-40~80°C', '湿度范围:0~100%RH', '精度:±0.5°C', '供电电压:3.3-6V', '接口:单总线'
      ],
      [
        'ESP32-WROOM-32', '', 'rf-wireless', 'WiFi模块',
        'SMD-38', '集成WiFi和蓝牙的MCU模块',
        '28.50', '300', '/datasheets/ESP32-WROOM-32.pdf',
        '内核:双核32位', 'WiFi:802.11b/g/n', '蓝牙:BLE 4.2', 'Flash:4MB', 'RAM:520KB'
      ]
    ];

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 产品名称
      { wch: 20 }, // 品牌
      { wch: 15 }, // 产品分类
      { wch: 12 }, // 产品小类
      { wch: 10 }, // 封装
      { wch: 30 }, // 描述
      { wch: 8 },  // 价格
      { wch: 8 },  // 库存
      { wch: 25 }, // 规格书链接
      { wch: 15 }, // 参数1
      { wch: 15 }, // 参数2
      { wch: 15 }, // 参数3
      { wch: 15 }, // 参数4
      { wch: 15 }  // 参数5
    ];
    ws['!cols'] = colWidths;
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '产品导入模板');
    
    // 下载文件
    XLSX.writeFile(wb, 'LiTong产品导入模板.xlsx');
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableCategories = dataSource === 'sanity' && sanityCategories.length > 0
    ? [
        { value: 'all', label: '所有分类' },
        ...sanityCategories.map(cat => ({
          value: cat.slug?.current || cat.slug,
          label: cat.name
        }))
      ]
    : defaultCategories;

  const deleteProduct = (productId: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Don't render interactive elements until hydrated
  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
            <p className="mt-2 text-sm text-gray-700">
              管理电子元件产品库存，支持Excel批量导入
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理电子元件产品库存，支持Excel批量导入
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
            下载Excel模板
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            批量导入Excel
          </button>
        </div>
      </div>

      {/* Data Source Selection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700">数据源：</span>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="dataSource"
                value="local"
                checked={dataSource === 'local'}
                onChange={(e) => {
                  setDataSource(e.target.value as 'local' | 'sanity');
                  if (e.target.value === 'local') {
                    setProducts(sampleProducts);
                  }
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">本地演示数据</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="dataSource"
                value="sanity"
                checked={dataSource === 'sanity'}
                onChange={(e) => {
                  setDataSource(e.target.value as 'local' | 'sanity');
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Sanity CMS数据</span>
            </label>
          </div>
          {dataSource === 'sanity' && (
            <button
              onClick={loadSanityData}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? '加载中...' : '刷新数据'}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">搜索产品</label>
          <input
            type="text"
            placeholder="输入产品名称或品牌..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">产品分类</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {availableCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">
            共 {filteredProducts.length} 个产品
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                产品信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                规格
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                价格/库存
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.brand}</div>
                    <div className="text-sm text-gray-500">{product.package}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {product.description}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price ? `¥${product.price.toFixed(2)}` : '询价'}
                  </div>
                  <div className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `库存: ${product.stock}` : '缺货'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">编辑</button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">批量导入产品</h3>
              
              {!isUploading ? (
                <div className="space-y-6">
                  {/* 预设分类选择 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">批量设置产品分类（可选）</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">产品大类</label>
                        <select
                          value={selectedMainCategory}
                          onChange={(e) => {
                            setSelectedMainCategory(e.target.value);
                            setSelectedSubCategory(''); // 重置小类选择
                          }}
                          className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="">选择产品大类</option>
                          {Object.entries(productCategories).map(([key, category]) => (
                            <option key={key} value={key}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">产品小类</label>
                        <select
                          value={selectedSubCategory}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          disabled={!selectedMainCategory}
                        >
                          <option value="">选择产品小类</option>
                          {selectedMainCategory && productCategories[selectedMainCategory as keyof typeof productCategories]?.subcategories.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">品牌</label>
                        <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="">选择品牌</option>
                          {brandOptions.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      这些设置将应用到Excel文件中没有填写相应字段的产品。Excel文件中的数据优先级更高。
                    </p>
                  </div>

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
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Excel文件格式要求：</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• 第一行为表头，包含：产品名称、品牌、产品分类、产品小类、封装、描述、价格、库存、规格书链接</li>
                      <li>• 参数列：参数1, 参数2, 参数3... (格式: 参数名:参数值)</li>
                      <li>• 产品分类使用英文标识符 (如: microcontrollers, power-management, sensors, rf-wireless 等)</li>
                      <li>• 产品小类使用中文名称 (如: ARM Cortex-M4, DC-DC转换器, 温湿度传感器 等)</li>
                      <li>• 如果Excel中留空，将使用上方设置的默认分类和品牌</li>
                      <li>• 请先下载模板文件查看正确格式</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">正在导入产品...</div>
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
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadProgress(0);
                    setSelectedMainCategory('');
                    setSelectedSubCategory('');
                    setSelectedBrand('');
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={processExcelUpload}
                  disabled={!uploadFile || isUploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {isUploading ? '导入中...' : '开始导入'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}