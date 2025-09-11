'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'

interface SearchInputProps {
  placeholder: string
  defaultValue?: string
  locale: string
  basePath: string
}

export default function SearchInput({ placeholder, defaultValue = '', locale, basePath }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(defaultValue)

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    if (value.trim()) {
      current.set('search', value.trim())
    } else {
      current.delete('search')
    }
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    
    router.replace(`${basePath}${query}`)
  }, [router, searchParams, basePath])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}