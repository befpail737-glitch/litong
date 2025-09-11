'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// 询价产品项
export interface InquiryProduct {
  id: string
  productId: string
  name: string
  model: string
  brand: string
  manufacturer: string
  category: string
  specifications?: Record<string, string>
  quantity: number
  targetPrice?: number
  description?: string
  urgency: 'standard' | 'urgent' | 'very_urgent'
  image?: string
  datasheet?: string
}

// 公司信息
export interface CompanyInfo {
  companyName: string
  contactPerson: string
  position: string
  email: string
  phone: string
  website?: string
  address?: string
  industry?: string
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  annualVolume?: string
}

// 项目信息
export interface ProjectInfo {
  projectName?: string
  projectDescription?: string
  expectedVolume?: number
  targetPrice?: number
  timeline?: string
  budget?: string
  application?: string
  certificationRequirements?: string[]
  additionalRequirements?: string
}

// 询价表单状态
export type InquiryFormStep = 'products' | 'company' | 'project' | 'review' | 'submit'

// 询价记录
export interface InquiryRecord {
  id: string
  inquiryNumber: string
  products: InquiryProduct[]
  companyInfo: CompanyInfo
  projectInfo?: ProjectInfo
  status: 'draft' | 'submitted' | 'quoted' | 'accepted' | 'rejected' | 'expired'
  submittedAt?: Date
  quotedAt?: Date
  expiresAt?: Date
  totalItems: number
  expectedValue?: number
  notes?: string
  attachments?: Array<{
    id: string
    name: string
    type: string
    size: number
    url: string
  }>
  quotes?: Array<{
    id: string
    productId: string
    unitPrice: number
    moq: number
    leadTime: number
    validUntil: Date
    notes?: string
  }>
}

// BOM文件解析结果
export interface BOMParseResult {
  success: boolean
  products: InquiryProduct[]
  errors: Array<{
    row: number
    message: string
  }>
  warnings: Array<{
    row: number
    message: string
  }>
}

// 询价上下文状态
interface InquiryState {
  // 当前询价表单
  currentInquiry: {
    products: InquiryProduct[]
    companyInfo: Partial<CompanyInfo>
    projectInfo: Partial<ProjectInfo>
    currentStep: InquiryFormStep
    isSubmitting: boolean
  }

  // 询价历史
  inquiryHistory: InquiryRecord[]

  // 草稿询价
  drafts: InquiryRecord[]

  // 公司信息模板（用于快速填写）
  companyTemplates: CompanyInfo[]

  // 常用产品（快速添加）
  favoriteProducts: InquiryProduct[]

  // UI状态
  isLoading: boolean
  error: string | null
}

// 询价动作类型
type InquiryAction =
  | { type: 'ADD_PRODUCT'; product: InquiryProduct }
  | { type: 'REMOVE_PRODUCT'; productId: string }
  | { type: 'UPDATE_PRODUCT'; productId: string; updates: Partial<InquiryProduct> }
  | { type: 'UPDATE_COMPANY_INFO'; companyInfo: Partial<CompanyInfo> }
  | { type: 'UPDATE_PROJECT_INFO'; projectInfo: Partial<ProjectInfo> }
  | { type: 'SET_CURRENT_STEP'; step: InquiryFormStep }
  | { type: 'IMPORT_BOM'; products: InquiryProduct[] }
  | { type: 'SAVE_DRAFT'; inquiry: InquiryRecord }
  | { type: 'LOAD_DRAFT'; inquiry: InquiryRecord }
  | { type: 'SUBMIT_INQUIRY'; inquiry: InquiryRecord }
  | { type: 'LOAD_INQUIRY_HISTORY'; inquiries: InquiryRecord[] }
  | { type: 'ADD_COMPANY_TEMPLATE'; template: CompanyInfo }
  | { type: 'ADD_FAVORITE_PRODUCT'; product: InquiryProduct }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_CURRENT_INQUIRY' }

// 初始状态
const initialState: InquiryState = {
  currentInquiry: {
    products: [],
    companyInfo: {},
    projectInfo: {},
    currentStep: 'products',
    isSubmitting: false
  },
  inquiryHistory: [],
  drafts: [],
  companyTemplates: [],
  favoriteProducts: [],
  isLoading: false,
  error: null
};

// Reducer
function inquiryReducer(state: InquiryState, action: InquiryAction): InquiryState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          products: [...state.currentInquiry.products, action.product]
        }
      };

    case 'REMOVE_PRODUCT':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          products: state.currentInquiry.products.filter(p => p.id !== action.productId)
        }
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          products: state.currentInquiry.products.map(p =>
            p.id === action.productId ? { ...p, ...action.updates } : p
          )
        }
      };

    case 'UPDATE_COMPANY_INFO':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          companyInfo: { ...state.currentInquiry.companyInfo, ...action.companyInfo }
        }
      };

    case 'UPDATE_PROJECT_INFO':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          projectInfo: { ...state.currentInquiry.projectInfo, ...action.projectInfo }
        }
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          currentStep: action.step
        }
      };

    case 'IMPORT_BOM':
      return {
        ...state,
        currentInquiry: {
          ...state.currentInquiry,
          products: [...state.currentInquiry.products, ...action.products]
        }
      };

    case 'SAVE_DRAFT':
      return {
        ...state,
        drafts: [action.inquiry, ...state.drafts.filter(d => d.id !== action.inquiry.id)]
      };

    case 'LOAD_DRAFT':
      return {
        ...state,
        currentInquiry: {
          products: action.inquiry.products,
          companyInfo: action.inquiry.companyInfo,
          projectInfo: action.inquiry.projectInfo || {},
          currentStep: 'products',
          isSubmitting: false
        }
      };

    case 'SUBMIT_INQUIRY':
      return {
        ...state,
        inquiryHistory: [action.inquiry, ...state.inquiryHistory],
        drafts: state.drafts.filter(d => d.id !== action.inquiry.id),
        currentInquiry: initialState.currentInquiry
      };

    case 'LOAD_INQUIRY_HISTORY':
      return {
        ...state,
        inquiryHistory: action.inquiries
      };

    case 'ADD_COMPANY_TEMPLATE':
      return {
        ...state,
        companyTemplates: [action.template, ...state.companyTemplates.slice(0, 4)] // 最多保存5个模板
      };

    case 'ADD_FAVORITE_PRODUCT':
      return {
        ...state,
        favoriteProducts: [action.product, ...state.favoriteProducts.slice(0, 9)] // 最多保存10个常用产品
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };

    case 'CLEAR_CURRENT_INQUIRY':
      return {
        ...state,
        currentInquiry: initialState.currentInquiry
      };

    default:
      return state;
  }
}

// 创建Context
const InquiryContext = createContext<{
  state: InquiryState
  dispatch: React.Dispatch<InquiryAction>
  // 便捷方法
  addProduct: (product: InquiryProduct) => void
  removeProduct: (productId: string) => void
  updateProduct: (productId: string, updates: Partial<InquiryProduct>) => void
  updateCompanyInfo: (companyInfo: Partial<CompanyInfo>) => void
  updateProjectInfo: (projectInfo: Partial<ProjectInfo>) => void
  setCurrentStep: (step: InquiryFormStep) => void
  importBOM: (file: File) => Promise<BOMParseResult>
  saveDraft: () => Promise<void>
  loadDraft: (draftId: string) => void
  submitInquiry: () => Promise<void>
  clearCurrentInquiry: () => void
} | null>(null);

// Provider组件
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inquiryReducer, initialState);

  // 从localStorage加载数据
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedHistory = localStorage.getItem('inquiry_history');
        if (storedHistory) {
          const history = JSON.parse(storedHistory);
          dispatch({ type: 'LOAD_INQUIRY_HISTORY', inquiries: history });
        }

        const storedDrafts = localStorage.getItem('inquiry_drafts');
        if (storedDrafts) {
          const drafts = JSON.parse(storedDrafts);
          drafts.forEach((draft: InquiryRecord) => {
            dispatch({ type: 'SAVE_DRAFT', inquiry: draft });
          });
        }

        const storedTemplates = localStorage.getItem('company_templates');
        if (storedTemplates) {
          const templates = JSON.parse(storedTemplates);
          templates.forEach((template: CompanyInfo) => {
            dispatch({ type: 'ADD_COMPANY_TEMPLATE', template });
          });
        }

        const storedFavorites = localStorage.getItem('favorite_products');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          favorites.forEach((product: InquiryProduct) => {
            dispatch({ type: 'ADD_FAVORITE_PRODUCT', product });
          });
        }
      } catch (error) {
        console.error('Failed to load stored inquiry data:', error);
      }
    };

    loadStoredData();
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('inquiry_history', JSON.stringify(state.inquiryHistory));
  }, [state.inquiryHistory]);

  useEffect(() => {
    localStorage.setItem('inquiry_drafts', JSON.stringify(state.drafts));
  }, [state.drafts]);

  useEffect(() => {
    localStorage.setItem('company_templates', JSON.stringify(state.companyTemplates));
  }, [state.companyTemplates]);

  useEffect(() => {
    localStorage.setItem('favorite_products', JSON.stringify(state.favoriteProducts));
  }, [state.favoriteProducts]);

  // 便捷方法
  const addProduct = (product: InquiryProduct) => {
    dispatch({ type: 'ADD_PRODUCT', product });
  };

  const removeProduct = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', productId });
  };

  const updateProduct = (productId: string, updates: Partial<InquiryProduct>) => {
    dispatch({ type: 'UPDATE_PRODUCT', productId, updates });
  };

  const updateCompanyInfo = (companyInfo: Partial<CompanyInfo>) => {
    dispatch({ type: 'UPDATE_COMPANY_INFO', companyInfo });

    // 如果公司信息完整，保存为模板
    if (companyInfo.companyName && companyInfo.email && companyInfo.contactPerson) {
      const template: CompanyInfo = {
        companyName: companyInfo.companyName,
        contactPerson: companyInfo.contactPerson,
        email: companyInfo.email,
        phone: companyInfo.phone || '',
        position: companyInfo.position || '',
        ...companyInfo
      };
      dispatch({ type: 'ADD_COMPANY_TEMPLATE', template });
    }
  };

  const updateProjectInfo = (projectInfo: Partial<ProjectInfo>) => {
    dispatch({ type: 'UPDATE_PROJECT_INFO', projectInfo });
  };

  const setCurrentStep = (step: InquiryFormStep) => {
    dispatch({ type: 'SET_CURRENT_STEP', step });
  };

  const importBOM = async (file: File): Promise<BOMParseResult> => {
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      // 这里实现BOM文件解析逻辑
      // 支持CSV, Excel格式
      const result = await parseBOMFile(file);

      if (result.success) {
        dispatch({ type: 'IMPORT_BOM', products: result.products });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '解析BOM文件失败';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
      return {
        success: false,
        products: [],
        errors: [{ row: 0, message: errorMessage }],
        warnings: []
      };
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const saveDraft = async () => {
    const draft: InquiryRecord = {
      id: `draft_${Date.now()}`,
      inquiryNumber: `DRAFT-${Date.now()}`,
      products: state.currentInquiry.products,
      companyInfo: state.currentInquiry.companyInfo as CompanyInfo,
      projectInfo: state.currentInquiry.projectInfo,
      status: 'draft',
      totalItems: state.currentInquiry.products.length,
      submittedAt: new Date()
    };

    dispatch({ type: 'SAVE_DRAFT', inquiry: draft });
  };

  const loadDraft = (draftId: string) => {
    const draft = state.drafts.find(d => d.id === draftId);
    if (draft) {
      dispatch({ type: 'LOAD_DRAFT', inquiry: draft });
    }
  };

  const submitInquiry = async () => {
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const inquiry: InquiryRecord = {
        id: `inquiry_${Date.now()}`,
        inquiryNumber: `INQ-${Date.now().toString().slice(-8)}`,
        products: state.currentInquiry.products,
        companyInfo: state.currentInquiry.companyInfo as CompanyInfo,
        projectInfo: state.currentInquiry.projectInfo,
        status: 'submitted',
        totalItems: state.currentInquiry.products.length,
        submittedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后过期
      };

      // 这里会调用API提交询价
      // await submitInquiryAPI(inquiry)

      dispatch({ type: 'SUBMIT_INQUIRY', inquiry });
      dispatch({ type: 'SET_ERROR', error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交询价失败';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const clearCurrentInquiry = () => {
    dispatch({ type: 'CLEAR_CURRENT_INQUIRY' });
  };

  return (
    <InquiryContext.Provider
      value={{
        state,
        dispatch,
        addProduct,
        removeProduct,
        updateProduct,
        updateCompanyInfo,
        updateProjectInfo,
        setCurrentStep,
        importBOM,
        saveDraft,
        loadDraft,
        submitInquiry,
        clearCurrentInquiry
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

// Hook
export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
}

// BOM文件解析函数
async function parseBOMFile(file: File): Promise<BOMParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          resolve({
            success: false,
            products: [],
            errors: [{ row: 0, message: '文件内容不足，至少需要标题行和一行数据' }],
            warnings: []
          });
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const products: InquiryProduct[] = [];
        const errors: Array<{ row: number; message: string }> = [];
        const warnings: Array<{ row: number; message: string }> = [];

        // 检查必需的列
        const requiredColumns = ['part_number', 'quantity'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col) && !headers.includes(col.replace('_', '')));

        if (missingColumns.length > 0) {
          resolve({
            success: false,
            products: [],
            errors: [{ row: 0, message: `缺少必需的列: ${missingColumns.join(', ')}` }],
            warnings: []
          });
          return;
        }

        // 解析数据行
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());

          if (values.length !== headers.length) {
            errors.push({ row: i + 1, message: '列数不匹配' });
            continue;
          }

          const rowData: Record<string, string> = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          // 解析产品数据
          const partNumber = rowData['part_number'] || rowData['partnumber'] || rowData['model'];
          const quantity = parseInt(rowData['quantity'] || rowData['qty'] || '1');

          if (!partNumber) {
            errors.push({ row: i + 1, message: '缺少零件号' });
            continue;
          }

          if (!quantity || quantity <= 0) {
            warnings.push({ row: i + 1, message: '数量无效，已设置为1' });
          }

          const product: InquiryProduct = {
            id: `bom_${Date.now()}_${i}`,
            productId: partNumber,
            name: rowData['description'] || rowData['name'] || partNumber,
            model: partNumber,
            brand: rowData['manufacturer'] || rowData['brand'] || '待确认',
            manufacturer: rowData['manufacturer'] || rowData['brand'] || '待确认',
            category: rowData['category'] || '电子元器件',
            quantity: Math.max(1, quantity),
            urgency: 'standard',
            description: rowData['remarks'] || rowData['notes'],
            specifications: {}
          };

          // 添加其他规格信息
          Object.entries(rowData).forEach(([key, value]) => {
            if (!['part_number', 'partnumber', 'model', 'quantity', 'qty', 'description', 'name', 'manufacturer', 'brand', 'category', 'remarks', 'notes'].includes(key) && value) {
              product.specifications![key] = value;
            }
          });

          products.push(product);
        }

        resolve({
          success: errors.length === 0,
          products,
          errors,
          warnings
        });
      } catch (error) {
        resolve({
          success: false,
          products: [],
          errors: [{ row: 0, message: '解析文件失败' }],
          warnings: []
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        products: [],
        errors: [{ row: 0, message: '读取文件失败' }],
        warnings: []
      });
    };

    reader.readAsText(file);
  });
}
