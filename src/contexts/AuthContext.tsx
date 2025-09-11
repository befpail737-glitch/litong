'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 用户类型定义
export interface User {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin'
  preferences: {
    language: 'zh' | 'en'
    currency: 'CNY' | 'USD'
    notifications: {
      email: boolean
      sms: boolean
      marketing: boolean
    }
  }
  createdAt: string
  lastLogin: string
}

// 认证状态类型
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// 认证上下文类型
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

// 注册数据类型
interface RegisterData {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
}

// 本地存储键
const AUTH_STORAGE_KEY = 'litong_auth'
const USER_STORAGE_KEY = 'litong_user'

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据库
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: '张工程师',
    company: '深圳科技有限公司',
    phone: '13800138000',
    role: 'customer',
    preferences: {
      language: 'zh',
      currency: 'CNY',
      notifications: {
        email: true,
        sms: true,
        marketing: false
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  }
]

// 模拟API调用
const mockApi = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      return { success: false, error: '用户不存在' }
    }
    
    // 在实际应用中，这里应该验证密码哈希
    if (password !== 'password123') {
      return { success: false, error: '密码错误' }
    }
    
    // 更新最后登录时间
    user.lastLogin = new Date().toISOString()
    
    return { success: true, user }
  },

  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查邮箱是否已存在
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
      return { success: false, error: '邮箱已被注册' }
    }
    
    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      company: userData.company,
      phone: userData.phone,
      role: 'customer',
      preferences: {
        language: 'zh',
        currency: 'CNY',
        notifications: {
          email: true,
          sms: false,
          marketing: false
        }
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    return { success: true, user: newUser }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      return { success: false, error: '用户不存在' }
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData }
    return { success: true, user: mockUsers[userIndex] }
  }
}

// 本地存储工具函数
const storage = {
  setAuth: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, token)
    }
  },
  getAuth: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY)
    }
    return null
  },
  removeAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  },
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
  },
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_STORAGE_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }
}

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.getAuth()
        const user = storage.getUser()
        
        if (token && user) {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      } catch (error) {
        console.error('认证初始化失败:', error)
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    }

    initAuth()
  }, [])

  // 登录
  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const result = await mockApi.login(email, password)
      
      if (result.success && result.user) {
        const token = `mock_token_${result.user.id}`
        storage.setAuth(token)
        storage.setUser(result.user)
        
        setState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true
        })
        
        return { success: true }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: '登录失败，请重试' }
    }
  }

  // 注册
  const register = async (userData: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const result = await mockApi.register(userData)
      
      if (result.success && result.user) {
        const token = `mock_token_${result.user.id}`
        storage.setAuth(token)
        storage.setUser(result.user)
        
        setState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true
        })
        
        return { success: true }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: '注册失败，请重试' }
    }
  }

  // 登出
  const logout = () => {
    storage.removeAuth()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) {
      return { success: false, error: '用户未登录' }
    }

    try {
      const result = await mockApi.updateUser(state.user.id, userData)
      
      if (result.success && result.user) {
        storage.setUser(result.user)
        setState(prev => ({ ...prev, user: result.user }))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: '更新失败，请重试' }
    }
  }

  // 刷新用户信息
  const refreshUser = async () => {
    // 在实际应用中，这里会从服务器重新获取用户信息
    // 现在只是从本地存储刷新
    const user = storage.getUser()
    if (user) {
      setState(prev => ({ ...prev, user }))
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 使用认证上下文的 Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 认证路由保护 Hook
export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // 可以在这里重定向到登录页
      console.log('用户未登录，需要重定向到登录页')
    }
  }, [auth.isLoading, auth.isAuthenticated])
  
  return auth
}