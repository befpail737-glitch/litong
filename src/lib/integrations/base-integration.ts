import { EventEmitter } from 'events'

export interface IntegrationConfig {
  apiKey?: string
  apiSecret?: string
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
  webhookSecret?: string
  environment?: 'development' | 'staging' | 'production'
  customHeaders?: Record<string, string>
  rateLimiting?: {
    requestsPerMinute: number
    requestsPerHour: number
  }
}

export interface IntegrationResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    requestId?: string
    rateLimitRemaining?: number
    rateLimitReset?: number
    processingTime?: number
  }
}

export interface IntegrationEvent {
  type: string
  timestamp: string
  data: any
  source: string
  metadata?: any
}

export interface WebhookPayload {
  event: string
  timestamp: string
  data: any
  signature?: string
  id?: string
}

export abstract class BaseIntegration extends EventEmitter {
  protected config: IntegrationConfig
  protected name: string
  protected version: string
  protected isConnected: boolean = false
  protected lastError: Error | null = null
  protected requestCount: number = 0
  protected rateLimitWindow: Map<string, number[]> = new Map()

  constructor(name: string, version: string, config: IntegrationConfig) {
    super()
    this.name = name
    this.version = version
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    }
  }

  // Abstract methods that must be implemented by subclasses
  abstract connect(): Promise<IntegrationResponse<void>>
  abstract disconnect(): Promise<IntegrationResponse<void>>
  abstract healthCheck(): Promise<IntegrationResponse<{ status: string; details?: any }>>
  abstract validateConfig(): Promise<IntegrationResponse<void>>

  // Common utility methods
  protected async makeRequest<T = any>(
    method: string,
    url: string,
    data?: any,
    options?: {
      headers?: Record<string, string>
      timeout?: number
      retries?: number
    }
  ): Promise<IntegrationResponse<T>> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()
    
    try {
      // Check rate limiting
      if (!this.checkRateLimit()) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please try again later.'
          }
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': `${this.name}-integration/${this.version}`,
        ...this.config.customHeaders,
        ...options?.headers
      }

      // Add authentication headers if available
      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`
      }

      const requestConfig = {
        method,
        headers,
        timeout: options?.timeout || this.config.timeout,
        ...(data && { body: JSON.stringify(data) })
      }

      let lastError: Error | null = null
      const maxRetries = options?.retries ?? this.config.retryAttempts ?? 3

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          this.emit('request:start', {
            requestId,
            method,
            url,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1
          })

          const response = await fetch(url, requestConfig)
          const responseData = await this.parseResponse<T>(response)

          this.requestCount++
          this.emit('request:success', {
            requestId,
            method,
            url,
            statusCode: response.status,
            processingTime: Date.now() - startTime
          })

          return {
            success: true,
            data: responseData,
            metadata: {
              requestId,
              processingTime: Date.now() - startTime,
              rateLimitRemaining: this.getRateLimitRemaining(),
              rateLimitReset: this.getRateLimitReset()
            }
          }

        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          
          this.emit('request:error', {
            requestId,
            method,
            url,
            attempt: attempt + 1,
            error: lastError.message,
            willRetry: attempt < maxRetries
          })

          if (attempt < maxRetries) {
            await this.delay((this.config.retryDelay || 1000) * Math.pow(2, attempt))
          }
        }
      }

      // All retries failed
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: lastError?.message || 'Request failed after all retries',
          details: { attempts: maxRetries + 1 }
        },
        metadata: {
          requestId,
          processingTime: Date.now() - startTime
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      this.emit('request:error', {
        requestId,
        method,
        url,
        error: errorMessage,
        fatal: true
      })

      return {
        success: false,
        error: {
          code: 'INTEGRATION_ERROR',
          message: errorMessage
        },
        metadata: {
          requestId,
          processingTime: Date.now() - startTime
        }
      }
    }
  }

  protected async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    
    if (!response.ok) {
      let errorBody: any
      try {
        errorBody = contentType?.includes('application/json') 
          ? await response.json()
          : await response.text()
      } catch {
        errorBody = null
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}${errorBody ? ` - ${JSON.stringify(errorBody)}` : ''}`)
    }

    if (contentType?.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text() as unknown as T
    }
  }

  protected checkRateLimit(): boolean {
    if (!this.config.rateLimiting) return true

    const now = Date.now()
    const windowKey = `${Math.floor(now / 60000)}` // 1-minute window
    const requests = this.rateLimitWindow.get(windowKey) || []
    
    // Clean old windows
    const tenMinutesAgo = now - 10 * 60 * 1000
    for (const [key, timestamps] of this.rateLimitWindow.entries()) {
      if (parseInt(key) * 60000 < tenMinutesAgo) {
        this.rateLimitWindow.delete(key)
      }
    }

    // Check requests per minute
    if (requests.length >= this.config.rateLimiting.requestsPerMinute) {
      return false
    }

    // Check requests per hour
    const hourRequests = Array.from(this.rateLimitWindow.values())
      .flat()
      .filter(timestamp => timestamp > now - 60 * 60 * 1000)
    
    if (hourRequests.length >= this.config.rateLimiting.requestsPerHour) {
      return false
    }

    // Add current request
    requests.push(now)
    this.rateLimitWindow.set(windowKey, requests)
    
    return true
  }

  protected getRateLimitRemaining(): number {
    if (!this.config.rateLimiting) return -1

    const now = Date.now()
    const windowKey = `${Math.floor(now / 60000)}`
    const requests = this.rateLimitWindow.get(windowKey) || []
    
    return Math.max(0, this.config.rateLimiting.requestsPerMinute - requests.length)
  }

  protected getRateLimitReset(): number {
    const now = Date.now()
    const currentMinute = Math.floor(now / 60000)
    return (currentMinute + 1) * 60000 // Next minute
  }

  protected generateRequestId(): string {
    return `${this.name}_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Webhook handling
  protected verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    // Implementation depends on the specific signature algorithm used by the service
    // This is a placeholder implementation
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload, 'utf8')
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }

  protected async processWebhook(payload: WebhookPayload): Promise<IntegrationResponse<void>> {
    try {
      this.emit('webhook:received', {
        event: payload.event,
        timestamp: payload.timestamp,
        id: payload.id,
        source: this.name
      })

      // Process webhook based on event type
      await this.handleWebhookEvent(payload)

      this.emit('webhook:processed', {
        event: payload.event,
        timestamp: payload.timestamp,
        id: payload.id,
        source: this.name
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      this.emit('webhook:error', {
        event: payload.event,
        timestamp: payload.timestamp,
        id: payload.id,
        error: errorMessage,
        source: this.name
      })

      return {
        success: false,
        error: {
          code: 'WEBHOOK_PROCESSING_ERROR',
          message: errorMessage
        }
      }
    }
  }

  protected abstract handleWebhookEvent(payload: WebhookPayload): Promise<void>

  // Public methods
  public getName(): string {
    return this.name
  }

  public getVersion(): string {
    return this.version
  }

  public getConfig(): Partial<IntegrationConfig> {
    // Return config without sensitive information
    const { apiKey, apiSecret, webhookSecret, ...safeConfig } = this.config
    return {
      ...safeConfig,
      apiKey: apiKey ? '***masked***' : undefined,
      apiSecret: apiSecret ? '***masked***' : undefined,
      webhookSecret: webhookSecret ? '***masked***' : undefined
    }
  }

  public isHealthy(): boolean {
    return this.isConnected && !this.lastError
  }

  public getLastError(): Error | null {
    return this.lastError
  }

  public getRequestCount(): number {
    return this.requestCount
  }

  public async updateConfig(newConfig: Partial<IntegrationConfig>): Promise<IntegrationResponse<void>> {
    try {
      this.config = { ...this.config, ...newConfig }
      
      // Validate new configuration
      const validationResult = await this.validateConfig()
      if (!validationResult.success) {
        return validationResult
      }

      this.emit('config:updated', {
        timestamp: new Date().toISOString(),
        changes: Object.keys(newConfig)
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: {
          code: 'CONFIG_UPDATE_ERROR',
          message: errorMessage
        }
      }
    }
  }

  public getStats(): {
    name: string
    version: string
    isConnected: boolean
    isHealthy: boolean
    requestCount: number
    rateLimitRemaining: number
    lastError: string | null
  } {
    return {
      name: this.name,
      version: this.version,
      isConnected: this.isConnected,
      isHealthy: this.isHealthy(),
      requestCount: this.requestCount,
      rateLimitRemaining: this.getRateLimitRemaining(),
      lastError: this.lastError?.message || null
    }
  }

  // Event handling
  public onEvent(event: string, callback: (...args: any[]) => void): void {
    this.on(event, callback)
  }

  public removeEventListener(event: string, callback: (...args: any[]) => void): void {
    this.off(event, callback)
  }
}