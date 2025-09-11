'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 搜索产品类型
export interface SearchProduct {
  id: string
  name: string
  model: string
  brand: string
  category: string
  subcategory?: string
  description: string
  specifications: Record<string, string>
  price: number
  stock: number
  imageUrl?: string
  tags: string[]
  manufacturer: string
  datasheet?: string
  lifecycle?: 'active' | 'discontinued' | 'preview'
  rohs?: boolean
  leadTime?: number
  minOrderQuantity?: number
  packageType?: string
  createdAt: string
  updatedAt: string
}

// 搜索过滤器类型
export interface SearchFilters {
  category?: string
  subcategory?: string
  brand?: string[]
  manufacturer?: string[]
  priceRange?: {
    min: number
    max: number
  }
  stockStatus?: 'inStock' | 'outOfStock' | 'all'
  lifecycle?: string[]
  rohs?: boolean
  packageType?: string[]
  specifications?: Record<string, string[]>
  leadTimeMax?: number
  minOrderQuantity?: number
}

// 搜索排序选项
export type SortOption = 
  | 'relevance'      // 相关性（默认）
  | 'price_asc'      // 价格低到高
  | 'price_desc'     // 价格高到低
  | 'stock_desc'     // 库存多到少
  | 'stock_asc'      // 库存少到多
  | 'newest'         // 最新添加
  | 'oldest'         // 最早添加
  | 'name_asc'       // 名称A-Z
  | 'name_desc'      // 名称Z-A
  | 'popularity'     // 热门程度
  | 'rating_desc'    // 评分高到低
  | 'leadtime_asc'   // 交期短到长
  | 'moq_asc'        // 最小起订量低到高

// 搜索结果类型
export interface SearchResult {
  products: SearchProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: {
    categories: Array<{ name: string; count: number }>
    brands: Array<{ name: string; count: number }>
    manufacturers: Array<{ name: string; count: number }>
    priceRange: { min: number; max: number }
    availableFilters: Record<string, Array<{ name: string; count: number }>>
  }
  searchTime: number
  suggestions?: string[]
}

// 搜索历史项目
export interface SearchHistoryItem {
  id: string
  query: string
  filters?: SearchFilters
  timestamp: string
  resultCount: number
}

// 搜索建议类型
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'keyword'
  text: string
  count?: number
  category?: string
}

// 搜索上下文类型
interface SearchContextType {
  // 搜索状态
  searchQuery: string
  searchResults: SearchResult | null
  currentFilters: SearchFilters
  sortBy: SortOption
  isLoading: boolean
  error: string | null
  
  // 搜索历史和建议
  searchHistory: SearchHistoryItem[]
  suggestions: SearchSuggestion[]
  searchSuggestions: string[] // 用于Header搜索框的简单建议
  
  // 搜索操作
  search: (query: string, filters?: SearchFilters, page?: number) => Promise<void>
  updateFilters: (filters: Partial<SearchFilters>) => void
  updateSort: (sort: SortOption) => void
  clearSearch: () => void
  clearFilters: () => void
  setSearchQuery: (query: string) => void
  
  // 搜索建议
  getSuggestions: (query: string) => Promise<SearchSuggestion[]>
  updateSearchSuggestions: (query: string) => void
  
  // 搜索历史管理
  addToHistory: (query: string, filters?: SearchFilters, resultCount?: number) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  
  // 工具函数
  formatPrice: (price: number) => string
  formatStock: (stock: number) => string
  getSortText: (sort: SortOption) => string
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// 模拟产品数据
const mockProducts: SearchProduct[] = [
  {
    id: '1',
    name: 'STM32F401RET6',
    model: 'STM32F401RET6',
    brand: 'STMicroelectronics',
    category: '微控制器',
    subcategory: 'ARM Cortex-M4',
    description: '32位ARM Cortex-M4微控制器，84MHz，512KB Flash，96KB SRAM',
    specifications: {
      '核心': 'ARM Cortex-M4',
      '频率': '84MHz',
      'Flash': '512KB',
      'SRAM': '96KB',
      '封装': 'LQFP64',
      '工作电压': '1.7V-3.6V',
      '工作温度': '-40°C to +85°C'
    },
    price: 28.50,
    stock: 1500,
    imageUrl: '/images/products/stm32f401ret6.jpg',
    tags: ['ARM', 'Cortex-M4', '微控制器', '32位'],
    manufacturer: 'STMicroelectronics',
    datasheet: '/datasheets/stm32f401ret6.pdf',
    lifecycle: 'active',
    rohs: true,
    leadTime: 7,
    minOrderQuantity: 10,
    packageType: 'LQFP64',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'ESP32-WROOM-32D',
    model: 'ESP32-WROOM-32D',
    brand: 'Espressif',
    category: '微控制器',
    subcategory: 'WiFi模块',
    description: '集成WiFi和蓝牙的ESP32模块，240MHz双核，4MB Flash',
    specifications: {
      '核心': '双核Xtensa LX6',
      '频率': '240MHz',
      'Flash': '4MB',
      'SRAM': '520KB',
      '封装': 'SMD模块',
      '工作电压': '3.0V-3.6V',
      '工作温度': '-40°C to +85°C'
    },
    price: 15.80,
    stock: 2800,
    imageUrl: '/images/products/esp32-wroom-32d.jpg',
    tags: ['ESP32', 'WiFi', '蓝牙', '物联网'],
    manufacturer: 'Espressif Systems',
    datasheet: '/datasheets/esp32-wroom-32d.pdf',
    lifecycle: 'active',
    rohs: true,
    leadTime: 5,
    minOrderQuantity: 5,
    packageType: 'SMD',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '3',
    name: 'STC89C52RC',
    model: 'STC89C52RC-40I-PDIP40',
    brand: 'STC',
    category: '微控制器',
    subcategory: '8051内核',
    description: '8位51内核单片机，40MHz，8KB Flash，512B RAM',
    specifications: {
      '核心': '8051',
      '频率': '40MHz',
      'Flash': '8KB',
      'RAM': '512B',
      '封装': 'PDIP40',
      '工作电压': '5V',
      '工作温度': '-40°C to +85°C'
    },
    price: 3.20,
    stock: 5000,
    imageUrl: '/images/products/stc89c52rc.jpg',
    tags: ['8051', '单片机', '8位'],
    manufacturer: 'STC Microelectronics',
    datasheet: '/datasheets/stc89c52rc.pdf',
    lifecycle: 'active',
    rohs: true,
    leadTime: 3,
    minOrderQuantity: 20,
    packageType: 'PDIP40',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-25T11:20:00Z'
  },
  {
    id: '4',
    name: 'Arduino Uno R3',
    model: 'A000066',
    brand: 'Arduino',
    category: '开发板',
    subcategory: '微控制器开发板',
    description: '基于ATmega328P的开发板，14个数字IO，6个模拟输入',
    specifications: {
      '微控制器': 'ATmega328P',
      '频率': '16MHz',
      'Flash': '32KB',
      'SRAM': '2KB',
      '数字IO': '14',
      '模拟输入': '6',
      'USB': 'Type-B'
    },
    price: 89.00,
    stock: 800,
    imageUrl: '/images/products/arduino-uno-r3.jpg',
    tags: ['Arduino', '开发板', 'ATmega328P', '教育'],
    manufacturer: 'Arduino',
    datasheet: '/datasheets/arduino-uno-r3.pdf',
    lifecycle: 'active',
    rohs: true,
    leadTime: 1,
    minOrderQuantity: 1,
    packageType: '开发板',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-28T10:15:00Z'
  },
  {
    id: '5',
    name: 'Raspberry Pi 4B 4GB',
    model: 'RPI4-MODBP-4GB',
    brand: 'Raspberry Pi',
    category: '单板计算机',
    subcategory: 'Linux开发板',
    description: '四核ARM Cortex-A72，4GB LPDDR4，双4K显示输出',
    specifications: {
      'CPU': 'Cortex-A72 1.5GHz',
      'RAM': '4GB LPDDR4',
      'GPU': 'VideoCore VI',
      '存储': 'microSD',
      'USB': '2×USB3.0 + 2×USB2.0',
      '网络': '千兆以太网 + WiFi + 蓝牙',
      'HDMI': '2×micro HDMI 4K60'
    },
    price: 399.00,
    stock: 200,
    imageUrl: '/images/products/raspberry-pi-4b.jpg',
    tags: ['Raspberry Pi', 'Linux', 'ARM', '单板计算机'],
    manufacturer: 'Raspberry Pi Foundation',
    datasheet: '/datasheets/raspberry-pi-4b.pdf',
    lifecycle: 'active',
    rohs: true,
    leadTime: 14,
    minOrderQuantity: 1,
    packageType: '单板计算机',
    createdAt: '2024-01-08T16:40:00Z',
    updatedAt: '2024-01-30T09:25:00Z'
  }
]

// 排序选项文本映射
const SORT_OPTION_MAP: Record<SortOption, string> = {
  relevance: '相关性',
  price_asc: '价格：低到高',
  price_desc: '价格：高到低',
  stock_desc: '库存：多到少',
  newest: '最新添加',
  name_asc: '名称：A-Z',
  name_desc: '名称：Z-A'
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({})
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])

  // 从本地存储加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('litong_search_history')
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to load search history:', error)
      }
    }
  }, [])

  // 保存搜索历史到本地存储
  useEffect(() => {
    localStorage.setItem('litong_search_history', JSON.stringify(searchHistory))
  }, [searchHistory])

  // 模拟搜索功能
  const search = async (query: string, filters: SearchFilters = {}, page: number = 1) => {
    setIsLoading(true)
    setError(null)
    setSearchQuery(query)
    
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 过滤产品
      let filteredProducts = mockProducts
      
      // 文本搜索
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ')
        filteredProducts = filteredProducts.filter(product => {
          const searchText = [
            product.name,
            product.model,
            product.brand,
            product.category,
            product.description,
            ...product.tags,
            ...Object.values(product.specifications)
          ].join(' ').toLowerCase()
          
          return searchTerms.some(term => searchText.includes(term))
        })
      }
      
      // 应用过滤器
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category)
      }
      
      if (filters.brand?.length) {
        filteredProducts = filteredProducts.filter(p => filters.brand!.includes(p.brand))
      }
      
      if (filters.manufacturer?.length) {
        filteredProducts = filteredProducts.filter(p => filters.manufacturer!.includes(p.manufacturer))
      }
      
      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p => 
          p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
        )
      }
      
      if (filters.stockStatus === 'inStock') {
        filteredProducts = filteredProducts.filter(p => p.stock > 0)
      } else if (filters.stockStatus === 'outOfStock') {
        filteredProducts = filteredProducts.filter(p => p.stock === 0)
      }
      
      if (filters.lifecycle?.length) {
        filteredProducts = filteredProducts.filter(p => filters.lifecycle!.includes(p.lifecycle || ''))
      }
      
      if (filters.rohs !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.rohs === filters.rohs)
      }
      
      // 排序
      filteredProducts = sortProducts(filteredProducts, sortBy)
      
      // 分页
      const pageSize = 20
      const startIndex = (page - 1) * pageSize
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize)
      
      // 生成过滤器选项
      const filterOptions = generateFilterOptions(mockProducts)
      
      const result: SearchResult = {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredProducts.length / pageSize),
        filters: filterOptions,
        searchTime: Math.random() * 100 + 50, // 模拟搜索时间
        suggestions: query.trim() ? generateSuggestions(query) : undefined
      }
      
      setSearchResults(result)
      setCurrentFilters(filters)
      
      // 添加到搜索历史
      if (query.trim()) {
        addToHistory(query, filters, result.total)
      }
      
    } catch (err) {
      setError('搜索失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 排序产品
  const sortProducts = (products: SearchProduct[], sort: SortOption): SearchProduct[] => {
    const sorted = [...products]
    
    switch (sort) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'stock_desc':
        return sorted.sort((a, b) => b.stock - a.stock)
      case 'stock_asc':
        return sorted.sort((a, b) => a.stock - b.stock)
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'popularity':
        // 基于浏览量和评分的热门度排序
        return sorted.sort((a, b) => ((b.viewCount || 0) * 0.7 + (b.rating || 0) * 0.3) - ((a.viewCount || 0) * 0.7 + (a.rating || 0) * 0.3))
      case 'rating_desc':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'leadtime_asc':
        return sorted.sort((a, b) => (a.leadTime || 999) - (b.leadTime || 999))
      case 'moq_asc':
        return sorted.sort((a, b) => (a.moq || 1) - (b.moq || 1))
      case 'relevance':
      default:
        // 相关性排序 - 基于搜索词匹配程度和权重
        return sorted.sort((a, b) => {
          const aScore = calculateRelevanceScore(a, searchQuery)
          const bScore = calculateRelevanceScore(b, searchQuery)
          return bScore - aScore
        })
    }
  }

  // 计算相关性得分
  const calculateRelevanceScore = (product: SearchProduct, query: string): number => {
    if (!query) return 0
    
    const searchTerms = query.toLowerCase().split(' ')
    let score = 0
    
    searchTerms.forEach(term => {
      // 产品名称匹配权重最高
      if (product.name.toLowerCase().includes(term)) score += 10
      // 型号匹配权重较高
      if (product.model.toLowerCase().includes(term)) score += 8
      // 品牌匹配权重中等
      if (product.brand.toLowerCase().includes(term)) score += 6
      // 分类匹配权重较低
      if (product.category.toLowerCase().includes(term)) score += 4
      // 描述匹配权重最低
      if (product.description?.toLowerCase().includes(term)) score += 2
    })
    
    // 添加其他因素的权重
    score += (product.rating || 0) * 0.5 // 评分影响
    score += Math.log(product.viewCount || 1) * 0.3 // 浏览量影响
    score += product.stock > 0 ? 2 : -5 // 有库存加分，无库存扣分
    
    return score
  }

  // 生成过滤器选项
  const generateFilterOptions = (products: SearchProduct[]) => {
    const categories: Record<string, number> = {}
    const brands: Record<string, number> = {}
    const manufacturers: Record<string, number> = {}
    let minPrice = Infinity
    let maxPrice = 0
    
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1
      brands[product.brand] = (brands[product.brand] || 0) + 1
      manufacturers[product.manufacturer] = (manufacturers[product.manufacturer] || 0) + 1
      minPrice = Math.min(minPrice, product.price)
      maxPrice = Math.max(maxPrice, product.price)
    })
    
    return {
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      brands: Object.entries(brands).map(([name, count]) => ({ name, count })),
      manufacturers: Object.entries(manufacturers).map(([name, count]) => ({ name, count })),
      priceRange: { min: minPrice, max: maxPrice },
      availableFilters: {}
    }
  }

  // 生成搜索建议
  const generateSuggestions = (query: string): string[] => {
    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()
    
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name)
      }
      if (product.brand.toLowerCase().includes(queryLower)) {
        suggestions.add(product.brand)
      }
      if (product.category.toLowerCase().includes(queryLower)) {
        suggestions.add(product.category)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }

  const updateFilters = (filters: Partial<SearchFilters>) => {
    const newFilters = { ...currentFilters, ...filters }
    setCurrentFilters(newFilters)
    if (searchQuery) {
      search(searchQuery, newFilters, 1)
    }
  }

  const updateSort = (sort: SortOption) => {
    setSortBy(sort)
    if (searchQuery) {
      search(searchQuery, currentFilters, 1)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults(null)
    setCurrentFilters({})
    setError(null)
  }

  const clearFilters = () => {
    setCurrentFilters({})
    if (searchQuery) {
      search(searchQuery, {}, 1)
    }
  }

  const getSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
    // 模拟异步搜索建议
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const suggestions: SearchSuggestion[] = []
    const queryLower = query.toLowerCase()
    
    // 产品建议
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'product',
          text: product.name,
          category: product.category
        })
      }
    })
    
    // 品牌建议
    const brands = new Set(mockProducts.map(p => p.brand))
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'brand',
          text: brand
        })
      }
    })
    
    // 分类建议
    const categories = new Set(mockProducts.map(p => p.category))
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'category',
          text: category
        })
      }
    })
    
    return suggestions.slice(0, 8)
  }

  const addToHistory = (query: string, filters?: SearchFilters, resultCount: number = 0) => {
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      query,
      filters,
      timestamp: new Date().toISOString(),
      resultCount
    }
    
    setSearchHistory(prev => {
      // 移除重复的搜索
      const filtered = prev.filter(item => 
        item.query !== query || JSON.stringify(item.filters) !== JSON.stringify(filters)
      )
      // 添加新搜索到开头，限制最多50条
      return [historyItem, ...filtered].slice(0, 50)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id))
  }

  // 工具函数
  const formatPrice = (price: number): string => {
    return `¥${price.toFixed(2)}`
  }

  const formatStock = (stock: number): string => {
    if (stock === 0) return '无库存'
    if (stock < 10) return `库存紧张 (${stock})`
    if (stock < 100) return `少量库存 (${stock})`
    return `现货 (${stock}+)`
  }

  const getSortText = (sort: SortOption): string => {
    return SORT_OPTION_MAP[sort] || sort
  }

  // 更新搜索建议（用于Header实时建议）
  const updateSearchSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([])
      return
    }

    const queryLower = query.toLowerCase()
    const suggestions: string[] = []

    // 产品名称建议
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.push(product.name)
      }
      if (product.model.toLowerCase().includes(queryLower)) {
        suggestions.push(product.model)
      }
    })

    // 品牌建议
    const brands = new Set(mockProducts.map(p => p.brand))
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(queryLower)) {
        suggestions.push(brand)
      }
    })

    // 分类建议
    const categories = new Set(mockProducts.map(p => p.category))
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push(category)
      }
    })

    // 去重并限制数量
    setSearchSuggestions([...new Set(suggestions)].slice(0, 8))
  }

  const value: SearchContextType = {
    // 搜索状态
    searchQuery,
    searchResults,
    currentFilters,
    sortBy,
    isLoading,
    error,
    
    // 搜索历史和建议
    searchHistory,
    suggestions,
    searchSuggestions,
    
    // 搜索操作
    search,
    updateFilters,
    updateSort,
    clearSearch,
    clearFilters,
    setSearchQuery,
    
    // 搜索建议
    getSuggestions,
    updateSearchSuggestions,
    
    // 搜索历史管理
    addToHistory,
    clearHistory,
    removeFromHistory,
    
    // 工具函数
    formatPrice,
    formatStock,
    getSortText
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}