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

// 模拟Excel文件解析
export const parseExcelData = (file: File): Promise<{ products: ProductData[], columns: FilterColumn[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // 生成产品数据
        const products: ProductData[] = [];
        const dynamicColumns: FilterColumn[] = [];
        
        // 解析表头，生成筛选列配置
        headers.forEach((header, index) => {
          if (index < 5) return; // 跳过基础字段
          
          // 根据表头名称推断筛选类型
          let filterType: 'select' | 'range' = 'select';
          let options: string[] = [];
          let min: number | undefined;
          let max: number | undefined;
          let unit: string | undefined;
          
          // 推断字段类型
          if (header.includes('频率') || header.includes('MHz') || header.includes('频率')) {
            filterType = 'range';
            min = 0;
            max = 1000;
            unit = 'MHz';
          } else if (header.includes('电压') || header.includes('V')) {
            filterType = 'range';
            min = 0;
            max = 50;
            unit = 'V';
          } else if (header.includes('容量') || header.includes('KB') || header.includes('MB')) {
            filterType = 'select';
            options = ['16KB', '32KB', '64KB', '128KB', '256KB', '512KB', '1MB', '2MB'];
          } else if (header.includes('温度') || header.includes('°C')) {
            filterType = 'select';
            options = ['-40~85°C', '-40~105°C', '-40~125°C'];
          } else if (header.includes('封装')) {
            filterType = 'select';
            options = ['LQFP32', 'LQFP48', 'LQFP64', 'LQFP100', 'BGA100', 'SOT23-5', 'SOIC8'];
          }
          
          dynamicColumns.push({
            key: header.toLowerCase().replace(/[^\w]/g, '_'),
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
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length < 5) continue;
          
          const parameters: Record<string, string> = {};
          
          // 动态参数
          headers.forEach((header, index) => {
            if (index >= 5 && values[index]) {
              parameters[header.toLowerCase().replace(/[^\w]/g, '_')] = values[index];
            }
          });
          
          products.push({
            id: `product_${i}`,
            partNumber: values[0] || '',
            description: values[1] || '',
            brand: values[2] || 'STMicroelectronics',
            category: values[3] || 'microcontrollers',
            parameters,
            package: values[4] || '',
            price: values[5] ? `¥${values[5]}` : undefined,
            stock: values[6] ? parseInt(values[6]) : undefined,
            datasheet: `/datasheets/${values[0]?.toLowerCase()}.pdf`
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
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    } finally {
      setLoading(false);
    }
  }, []);

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
    loadStoredData,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts
  };
};