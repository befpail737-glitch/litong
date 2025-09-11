'use client'

import { lazy, ComponentType, LazyExoticComponent, Suspense } from 'react'
import dynamic from 'next/dynamic'

export interface CodeSplittingConfig {
  enablePreloading?: boolean
  chunkNamePrefix?: string
  retryAttempts?: number
  retryDelay?: number
  enableAnalytics?: boolean
  fallbackTimeout?: number
}

export interface LazyComponentOptions {
  loading?: ComponentType
  error?: ComponentType<{ error: Error; retry: () => void }>
  delay?: number
  timeout?: number
  ssr?: boolean
  suspense?: boolean
}

// Code splitting utilities
export class CodeSplittingManager {
  private config: Required<CodeSplittingConfig>
  private loadedChunks = new Set<string>()
  private preloadedChunks = new Set<string>()
  private chunkErrors = new Map<string, Error>()
  private retryAttempts = new Map<string, number>()

  constructor(config: CodeSplittingConfig = {}) {
    this.config = {
      enablePreloading: true,
      chunkNamePrefix: 'chunk',
      retryAttempts: 3,
      retryDelay: 1000,
      enableAnalytics: true,
      fallbackTimeout: 10000,
      ...config
    }
  }

  // Create a lazy-loaded component with retry logic
  createLazyComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    chunkName: string,
    options: LazyComponentOptions = {}
  ): LazyExoticComponent<T> {
    const {
      loading: LoadingComponent,
      error: ErrorComponent,
      delay = 200,
      timeout = this.config.fallbackTimeout,
      ssr = false,
      suspense = true
    } = options

    // Enhanced import function with retry logic
    const enhancedImportFn = async (): Promise<{ default: T }> => {
      const startTime = performance.now()
      let attempt = 0

      while (attempt < this.config.retryAttempts) {
        try {
          const module = await Promise.race([
            importFn(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Import timeout')), timeout)
            )
          ])

          // Track successful load
          this.loadedChunks.add(chunkName)
          this.trackChunkLoad(chunkName, performance.now() - startTime, true)
          
          return module
        } catch (error) {
          attempt++
          this.chunkErrors.set(chunkName, error as Error)
          this.retryAttempts.set(chunkName, attempt)

          if (attempt >= this.config.retryAttempts) {
            this.trackChunkLoad(chunkName, performance.now() - startTime, false, error as Error)
            throw error
          }

          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt - 1))
          )
        }
      }

      throw new Error(`Failed to load chunk ${chunkName} after ${this.config.retryAttempts} attempts`)
    }

    if (ssr) {
      // Use Next.js dynamic for SSR support
      return dynamic(() => enhancedImportFn(), {
        loading: LoadingComponent ? () => <LoadingComponent /> : undefined,
        ssr: true
      }) as LazyExoticComponent<T>
    }

    // Use React.lazy for client-side only
    const LazyComponent = lazy(enhancedImportFn)

    if (!suspense && (LoadingComponent || ErrorComponent)) {
      // Return a wrapper component that handles loading/error states
      const WrappedComponent = (props: any) => {
        return (
          <Suspense 
            fallback={LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>}
          >
            <ErrorBoundary
              fallback={ErrorComponent ? 
                (error, retry) => <ErrorComponent error={error} retry={retry} /> :
                undefined
              }
            >
              <LazyComponent {...props} />
            </ErrorBoundary>
          </Suspense>
        )
      }
      
      return WrappedComponent as LazyExoticComponent<T>
    }

    return LazyComponent
  }

  // Preload a chunk
  async preloadChunk(importFn: () => Promise<any>, chunkName: string): Promise<void> {
    if (this.preloadedChunks.has(chunkName) || this.loadedChunks.has(chunkName)) {
      return
    }

    try {
      await importFn()
      this.preloadedChunks.add(chunkName)
      this.trackChunkPreload(chunkName, true)
    } catch (error) {
      this.chunkErrors.set(chunkName, error as Error)
      this.trackChunkPreload(chunkName, false, error as Error)
    }
  }

  // Preload multiple chunks based on route
  async preloadRouteChunks(route: string): Promise<void> {
    const chunks = this.getRouteChunks(route)
    
    await Promise.all(
      chunks.map(({ importFn, chunkName }) => 
        this.preloadChunk(importFn, chunkName)
      )
    )
  }

  // Get chunks associated with a route
  private getRouteChunks(route: string): Array<{ importFn: () => Promise<any>; chunkName: string }> {
    const routeChunkMap: Record<string, Array<{ importFn: () => Promise<any>; chunkName: string }>> = {
      '/products': [
        {
          importFn: () => import('@/components/products/ProductList'),
          chunkName: 'product-list'
        },
        {
          importFn: () => import('@/components/products/ProductFilters'),
          chunkName: 'product-filters'
        }
      ],
      '/applications': [
        {
          importFn: () => import('@/components/applications/ApplicationGrid'),
          chunkName: 'application-grid'
        }
      ],
      '/solutions': [
        {
          importFn: () => import('@/components/solutions/SolutionModules'),
          chunkName: 'solution-modules'
        }
      ],
      '/contact': [
        {
          importFn: () => import('@/components/forms/ContactForm'),
          chunkName: 'contact-form'
        }
      ]
    }

    return routeChunkMap[route] || []
  }

  // Track chunk loading performance
  private trackChunkLoad(chunkName: string, loadTime: number, success: boolean, error?: Error): void {
    if (!this.config.enableAnalytics) return

    const data = {
      type: 'chunk-load',
      chunkName,
      loadTime,
      success,
      error: error?.message,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // Send to analytics
    this.sendAnalytics('performance/chunk-load', data)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const status = success ? '✅' : '❌'
      const time = loadTime.toFixed(2)
      console.log(`${status} Chunk "${chunkName}" loaded in ${time}ms`)
      
      if (error) {
        console.error(`Chunk load error:`, error)
      }
    }
  }

  private trackChunkPreload(chunkName: string, success: boolean, error?: Error): void {
    if (!this.config.enableAnalytics) return

    const data = {
      type: 'chunk-preload',
      chunkName,
      success,
      error: error?.message,
      timestamp: Date.now()
    }

    this.sendAnalytics('performance/chunk-preload', data)
  }

  private async sendAnalytics(endpoint: string, data: any): Promise<void> {
    try {
      // Store in localStorage as fallback
      const key = `chunk_analytics_${endpoint.replace('/', '_')}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(data)
      
      if (existing.length > 50) {
        existing.splice(0, existing.length - 50)
      }
      
      localStorage.setItem(key, JSON.stringify(existing))
    } catch (error) {
      // Analytics storage failed, ignore
    }
  }

  // Get chunk loading statistics
  getStats(): {
    loadedChunks: string[]
    preloadedChunks: string[]
    errors: Record<string, string>
    retryAttempts: Record<string, number>
  } {
    return {
      loadedChunks: Array.from(this.loadedChunks),
      preloadedChunks: Array.from(this.preloadedChunks),
      errors: Object.fromEntries(
        Array.from(this.chunkErrors.entries()).map(([chunk, error]) => [chunk, error.message])
      ),
      retryAttempts: Object.fromEntries(this.retryAttempts.entries())
    }
  }

  // Clear cache
  clearCache(): void {
    this.loadedChunks.clear()
    this.preloadedChunks.clear()
    this.chunkErrors.clear()
    this.retryAttempts.clear()
  }
}

// Error boundary for lazy components
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: (error: Error, retry: () => void) => React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry)
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Component failed to load
          </h3>
          <p className="text-red-600 text-sm mb-4 text-center">
            {this.state.error.message}
          </p>
          <button
            onClick={this.retry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Singleton instance
let codeSplittingManager: CodeSplittingManager | null = null

export function getCodeSplittingManager(config?: CodeSplittingConfig): CodeSplittingManager {
  if (!codeSplittingManager) {
    codeSplittingManager = new CodeSplittingManager(config)
  }
  return codeSplittingManager
}

// Utility functions
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string,
  options?: LazyComponentOptions
): LazyExoticComponent<T> {
  const manager = getCodeSplittingManager()
  return manager.createLazyComponent(importFn, chunkName, options)
}

export function preloadChunk(
  importFn: () => Promise<any>,
  chunkName: string
): Promise<void> {
  const manager = getCodeSplittingManager()
  return manager.preloadChunk(importFn, chunkName)
}

export function preloadRouteChunks(route: string): Promise<void> {
  const manager = getCodeSplittingManager()
  return manager.preloadRouteChunks(route)
}

// React hook for chunk preloading
export function useChunkPreloader() {
  const manager = getCodeSplittingManager()

  return {
    preloadChunk: manager.preloadChunk.bind(manager),
    preloadRouteChunks: manager.preloadRouteChunks.bind(manager),
    getStats: manager.getStats.bind(manager)
  }
}

// HOC for route-based preloading
export function withRoutePreloading<P extends object>(
  Component: ComponentType<P>,
  route: string
) {
  const WrappedComponent = (props: P) => {
    React.useEffect(() => {
      preloadRouteChunks(route)
    }, [])

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withRoutePreloading(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default CodeSplittingManager