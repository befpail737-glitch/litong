import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新账号</h1>
          <p className="text-gray-600">注册力通电子，享受专业服务</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}