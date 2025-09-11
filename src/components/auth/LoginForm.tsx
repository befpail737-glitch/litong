'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  showRegisterLink?: boolean
}

export function LoginForm({ onSuccess, redirectTo = '/', showRegisterLink = true }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        onSuccess?.()
        router.push(redirectTo)
      } else {
        setError(result.error || '登录失败')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // 清除错误信息
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <LogIn className="h-6 w-6 text-blue-600" />
          登录账号
        </CardTitle>
        <p className="text-gray-600 text-sm">
          登录力通电子，享受专业服务
        </p>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱输入 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="请输入邮箱地址"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="请输入密码"
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 记住密码和忘记密码 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                记住我
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              忘记密码？
            </button>
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                登录中...
              </>
            ) : (
              '立即登录'
            )}
          </Button>

          {/* 注册链接 */}
          {showRegisterLink && (
            <div className="text-center pt-4 border-t">
              <span className="text-sm text-gray-600">
                还没有账号？{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isLoading}
                >
                  立即注册
                </button>
              </span>
            </div>
          )}
        </form>

        {/* 演示账号提示 */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 font-medium mb-1">演示账号：</p>
          <p className="text-xs text-blue-600">
            邮箱：test@example.com<br />
            密码：password123
          </p>
        </div>
      </CardContent>
    </Card>
  )
}