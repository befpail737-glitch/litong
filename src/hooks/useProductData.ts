import { useState, useCallback } from 'react';

export interface ProductData {
  id: string;
  partNumber: string;
  description: string;
  brand: string;
  category: string;
  parameters: Record<string, string>;
  package: string;
  datasheet?: string;
  price?: string;
  stock?: number;
  image?: string;
}

export interface FilterColumn {
  key: string;
  name: string;
  type: 'select' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

// Excel文件解析 - 支持CSV, XLSX等格式
export const parseExcelData = (file: File): Promise<{ products: ProductData[], columns: FilterColumn[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let csvData: string;
        
        if (file.name.endsWith('.csv')) {
          csvData = e.target?.result as string;
        } else {
          // 对于Excel文件，这里应该使用xlsx库解析，目前先按CSV处理
          csvData = e.target?.result as string;
        }
        
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('文件格式错误或数据为空');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/["""]/g, ''));
        
        // 验证必需的列
        const requiredColumns = ['型号', 'partNumber', 'Part Number', 'part_number'];
        const hasRequiredColumn = requiredColumns.some(col => 
          headers.some(h => h.toLowerCase().includes(col.toLowerCase()))
        );
        
        if (!hasRequiredColumn) {
          throw new Error('文件必须包含型号列 (Part Number)');
        }
        
        // 生成产品数据
        const products: ProductData[] = [];
        const dynamicColumns: FilterColumn[] = [];
        
        // 标准化表头映射
        const headerMapping: Record<string, string> = {
          '型号': 'partNumber',
          'Part Number': 'partNumber', 
          'part_number': 'partNumber',
          '描述': 'description',
          'Description': 'description',
          '品牌': 'brand',
          'Brand': 'brand',
          '分类': 'category',
          'Category': 'category',
          '封装': 'package',
          'Package': 'package',
          '价格': 'price',
          'Price': 'price',
          '库存': 'stock',
          'Stock': 'stock'
        };
        
        // 解析表头，生成筛选列配置
        const baseFields = Object.values(headerMapping);
        headers.forEach((header, index) => {
          const normalizedHeader = headerMapping[header] || header.toLowerCase().replace(/[^\w]/g, '_');
          
          // 跳过基础字段，只为参数字段生成筛选配置
          if (baseFields.includes(normalizedHeader)) return;
          
          // 根据表头名称推断筛选类型
          let filterType: 'select' | 'range' = 'select';
          let options: string[] = [];
          let min: number | undefined;
          let max: number | undefined;
          let unit: string | undefined;
          
          // 智能推断字段类型
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('频率') || lowerHeader.includes('mhz') || lowerHeader.includes('frequency')) {
            filterType = 'range';
            min = 0;
            max = 1000;
            unit = 'MHz';
          } else if (lowerHeader.includes('电压') || lowerHeader.includes('voltage') || lowerHeader.includes('vdd')) {
            filterType = 'range';
            min = 0;
            max = 50;
            unit = 'V';
          } else if (lowerHeader.includes('电流') || lowerHeader.includes('current') || lowerHeader.includes('ma')) {
            filterType = 'range';
            min = 0;
            max = 1000;
            unit = 'mA';
          } else if (lowerHeader.includes('容量') || lowerHeader.includes('kb') || lowerHeader.includes('mb') || 
                     lowerHeader.includes('flash') || lowerHeader.includes('ram')) {
            filterType = 'select';
            options = ['8KB', '16KB', '32KB', '64KB', '128KB', '256KB', '512KB', '1MB', '2MB', '4MB'];
          } else if (lowerHeader.includes('温度') || lowerHeader.includes('temp') || lowerHeader.includes('°c')) {
            filterType = 'select';
            options = ['-40~85°C', '-40~105°C', '-40~125°C', '-55~150°C'];
          } else if (lowerHeader.includes('封装') || lowerHeader.includes('package')) {
            filterType = 'select';
            options = ['LQFP32', 'LQFP48', 'LQFP64', 'LQFP100', 'LQFP144', 'BGA64', 'BGA100', 'BGA144', 
                      'TQFP32', 'TQFP48', 'TQFP64', 'SOIC8', 'SOIC16', 'SOT23-5', 'SOT23-6', 'WLCSP'];
          } else if (lowerHeader.includes('内核') || lowerHeader.includes('core') || lowerHeader.includes('cpu')) {
            filterType = 'select';
            options = ['Cortex-M0', 'Cortex-M0+', 'Cortex-M3', 'Cortex-M4', 'Cortex-M7', 'Cortex-M33'];
          }
          
          dynamicColumns.push({
            key: normalizedHeader,
            name: header,
            type: filterType,
            options,
            min,
            max,
            unit
          });
        });
        
        // 解析数据行
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/["""]/g, ''));
          if (values.length < headers.length || !values[0]) continue; // 跳过空行或不完整行
          
          const parameters: Record<string, string> = {};
          let productData: any = {};
          
          // 解析所有列数据
          headers.forEach((header, index) => {
            if (!values[index]) return;
            
            const normalizedHeader = headerMapping[header] || header.toLowerCase().replace(/[^\w]/g, '_');
            
            if (baseFields.includes(normalizedHeader)) {
              // 基础字段
              if (normalizedHeader === 'price') {
                productData[normalizedHeader] = parseFloat(values[index].replace(/[^0-9.]/g, '')) || 0;
              } else if (normalizedHeader === 'stock') {
                productData[normalizedHeader] = parseInt(values[index]) || 0;
              } else {
                productData[normalizedHeader] = values[index];
              }
            } else {
              // 参数字段
              parameters[normalizedHeader] = values[index];
            }
          });
          
          // 确保必需字段
          if (!productData.partNumber) {
            console.warn(`第${i+1}行缺少型号，跳过`);
            continue;
          }
          
          products.push({
            id: `product_${Date.now()}_${i}`,
            partNumber: productData.partNumber,
            description: productData.description || productData.partNumber,
            brand: productData.brand || 'Unknown',
            category: productData.category || 'general',
            parameters,
            package: productData.package || '',
            price: productData.price ? `¥${productData.price}` : undefined,
            stock: productData.stock,
            datasheet: `/datasheets/${productData.partNumber?.toLowerCase().replace(/[^\w]/g, '-')}.pdf`,
            image: `/images/products/${productData.partNumber?.toLowerCase().replace(/[^\w]/g, '-')}.jpg`
          });
        }
        
        resolve({ products, columns: dynamicColumns });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

export const useProductData = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filterColumns, setFilterColumns] = useState<FilterColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 上传Excel文件
  const uploadExcelFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const { products: newProducts, columns } = await parseExcelData(file);
      setProducts(newProducts);
      setFilterColumns(columns);
      
      // 保存到localStorage作为临时存储
      localStorage.setItem('productData', JSON.stringify(newProducts));
      localStorage.setItem('filterColumns', JSON.stringify(columns));
      
      return { count: newProducts.length, products: newProducts, columns };
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 上传数据到Sanity CMS
  const uploadToSanity = useCallback(async (data: any[], type: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/sanity/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const result = await response.json();
      return result;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传到CMS失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 批量上传产品到Sanity
  const uploadProductsToSanity = useCallback(async (productsToUpload?: ProductData[]) => {
    const data = productsToUpload || products;
    if (data.length === 0) {
      throw new Error('没有产品数据可上传');
    }
    
    return uploadToSanity(data, 'products');
  }, [products, uploadToSanity]);

  // 从localStorage加载数据
  const loadStoredData = useCallback(() => {
    try {
      const storedProducts = localStorage.getItem('productData');
      const storedColumns = localStorage.getItem('filterColumns');
      
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
      if (storedColumns) {
        setFilterColumns(JSON.parse(storedColumns));
      }
    } catch (err) {
      console.error('加载存储数据失败:', err);
    }
  }, []);

  // 添加新产品
  const addProduct = useCallback((product: Omit<ProductData, 'id'>) => {
    const newProduct: ProductData = {
      ...product,
      id: `product_${Date.now()}`
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    // 同步到localStorage
    const updated = [...products, newProduct];
    localStorage.setItem('productData', JSON.stringify(updated));
  }, [products]);

  // 更新产品
  const updateProduct = useCallback((id: string, updates: Partial<ProductData>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    // 同步到localStorage
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('productData', JSON.stringify(updated));
  }, [products]);

  // 删除产品
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    
    // 同步到localStorage
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('productData', JSON.stringify(updated));
  }, [products]);

  // 批量导入产品
  const importProducts = useCallback((newProducts: ProductData[]) => {
    setProducts(prev => [...prev, ...newProducts]);
    
    // 同步到localStorage
    const updated = [...products, ...newProducts];
    localStorage.setItem('productData', JSON.stringify(updated));
  }, [products]);

  return {
    products,
    filterColumns,
    loading,
    error,
    uploadExcelFile,
    uploadToSanity,
    uploadProductsToSanity,
    loadStoredData,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts
  };
};