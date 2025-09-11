import { NextRequest } from 'next/server'
import { createHash, randomBytes } from 'crypto'

export interface CSRFConfig {
  secretKey: string
  tokenName?: string
  headerName?: string
  cookieName?: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  maxAge?: number
  saltLength?: number
  ignoredMethods?: string[]
  ignoredPaths?: string[]
  enableDoubleSubmit?: boolean
  debug?: boolean
}

export interface CSRFTokenInfo {
  token: string
  hash: string
  timestamp: number
  sessionId?: string
}

export interface CSRFValidationResult {
  isValid: boolean
  error?: string
  tokenInfo?: CSRFTokenInfo
}

// CSRF Protection implementation
export class CSRFProtection {
  private config: Required<CSRFConfig>
  private tokenStore = new Map<string, CSRFTokenInfo>()

  constructor(config: CSRFConfig) {
    if (!config.secretKey) {
      throw new Error('CSRF secret key is required')
    }

    this.config = {
      secretKey: config.secretKey,
      tokenName: 'csrfToken',
      headerName: 'X-CSRF-Token',
      cookieName: '_csrf',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour in seconds
      saltLength: 32,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
      ignoredPaths: ['/api/health', '/api/status'],
      enableDoubleSubmit: true,
      debug: process.env.NODE_ENV === 'development',
      ...config
    }

    // Cleanup expired tokens periodically
    setInterval(() => this.cleanupExpiredTokens(), 300000) // Every 5 minutes
  }

  // Generate CSRF token
  public generateToken(sessionId?: string): CSRFTokenInfo {
    const salt = randomBytes(this.config.saltLength).toString('hex')
    const timestamp = Date.now()
    const payload = `${sessionId || 'anonymous'}:${timestamp}:${salt}`
    
    // Create HMAC hash
    const hash = this.createHMAC(payload)
    const token = Buffer.from(`${payload}:${hash}`).toString('base64url')

    const tokenInfo: CSRFTokenInfo = {
      token,
      hash,
      timestamp,
      sessionId
    }

    // Store token for validation
    this.tokenStore.set(token, tokenInfo)

    if (this.config.debug) {
      console.log('Generated CSRF token:', { token: token.substring(0, 20) + '...', sessionId })
    }

    return tokenInfo
  }

  // Validate CSRF token
  public validateToken(token: string, sessionId?: string): CSRFValidationResult {
    if (!token) {
      return {
        isValid: false,
        error: 'CSRF token is missing'
      }
    }

    try {
      // Decode token
      const decoded = Buffer.from(token, 'base64url').toString('utf8')
      const parts = decoded.split(':')
      
      if (parts.length !== 4) {
        return {
          isValid: false,
          error: 'Invalid CSRF token format'
        }
      }

      const [tokenSessionId, timestampStr, salt, hash] = parts
      const timestamp = parseInt(timestampStr)

      // Check if token is expired
      const now = Date.now()
      if (now - timestamp > this.config.maxAge * 1000) {
        return {
          isValid: false,
          error: 'CSRF token has expired'
        }
      }

      // Validate session ID
      if (sessionId && tokenSessionId !== sessionId && tokenSessionId !== 'anonymous') {
        return {
          isValid: false,
          error: 'CSRF token session mismatch'
        }
      }

      // Verify HMAC
      const payload = `${tokenSessionId}:${timestamp}:${salt}`
      const expectedHash = this.createHMAC(payload)

      if (!this.constantTimeCompare(hash, expectedHash)) {
        return {
          isValid: false,
          error: 'CSRF token validation failed'
        }
      }

      const tokenInfo: CSRFTokenInfo = {
        token,
        hash,
        timestamp,
        sessionId: tokenSessionId !== 'anonymous' ? tokenSessionId : undefined
      }

      return {
        isValid: true,
        tokenInfo
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('CSRF token validation error:', error)
      }
      
      return {
        isValid: false,
        error: 'CSRF token validation failed'
      }
    }
  }

  // Validate request
  public validateRequest(
    request: NextRequest,
    sessionId?: string
  ): CSRFValidationResult {
    const method = request.method.toUpperCase()
    const pathname = request.nextUrl.pathname

    // Skip validation for ignored methods
    if (this.config.ignoredMethods.includes(method)) {
      return { isValid: true }
    }

    // Skip validation for ignored paths
    if (this.config.ignoredPaths.some(path => pathname.startsWith(path))) {
      return { isValid: true }
    }

    // Get token from header or form data
    let token = request.headers.get(this.config.headerName)

    if (!token && this.config.enableDoubleSubmit) {
      // Try to get token from cookie
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = this.parseCookies(cookieHeader)
        token = cookies[this.config.cookieName]
      }
    }

    if (!token) {
      // Try to get token from form data or JSON body
      const contentType = request.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        // For JSON requests, token should be in header
        return {
          isValid: false,
          error: 'CSRF token required in header for JSON requests'
        }
      } else if (contentType.includes('application/x-www-form-urlencoded') || 
                 contentType.includes('multipart/form-data')) {
        // For form requests, we'll need to parse the body
        // This is a simplified version - in practice, you'd parse the form data
        return {
          isValid: false,
          error: 'CSRF token required in form data'
        }
      }
    }

    return this.validateToken(token || '', sessionId)
  }

  // Create CSRF middleware
  public middleware() {
    return async (request: NextRequest) => {
      const validation = this.validateRequest(request)
      
      if (!validation.isValid) {
        return new Response(
          JSON.stringify({
            error: 'CSRF validation failed',
            message: validation.error
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      return null // Allow request to continue
    }
  }

  // Generate secure cookie string
  public generateCookieString(token: string): string {
    const options = [
      `${this.config.cookieName}=${token}`,
      `Max-Age=${this.config.maxAge}`,
      `SameSite=${this.config.sameSite}`,
      'Path=/'
    ]

    if (this.config.httpOnly) {
      options.push('HttpOnly')
    }

    if (this.config.secure) {
      options.push('Secure')
    }

    return options.join('; ')
  }

  // Refresh token
  public refreshToken(oldToken: string, sessionId?: string): CSRFTokenInfo | null {
    const validation = this.validateToken(oldToken, sessionId)
    
    if (!validation.isValid) {
      return null
    }

    // Remove old token
    this.tokenStore.delete(oldToken)

    // Generate new token
    return this.generateToken(sessionId)
  }

  // Revoke token
  public revokeToken(token: string): boolean {
    return this.tokenStore.delete(token)
  }

  // Get token information
  public getTokenInfo(token: string): CSRFTokenInfo | null {
    return this.tokenStore.get(token) || null
  }

  // Private helper methods
  private createHMAC(data: string): string {
    return createHash('sha256')
      .update(this.config.secretKey + data)
      .digest('hex')
  }

  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {}
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=')
      if (name && rest.length > 0) {
        cookies[name] = rest.join('=')
      }
    })

    return cookies
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now()
    const maxAge = this.config.maxAge * 1000
    
    for (const [token, info] of this.tokenStore.entries()) {
      if (now - info.timestamp > maxAge) {
        this.tokenStore.delete(token)
      }
    }

    if (this.config.debug) {
      console.log(`CSRF cleanup: ${this.tokenStore.size} active tokens`)
    }
  }

  // Static methods for form integration
  public static generateHiddenInput(tokenName: string, token: string): string {
    return `<input type="hidden" name="${tokenName}" value="${token}" />`
  }

  public static generateMetaTag(token: string): string {
    return `<meta name="csrf-token" content="${token}" />`
  }

  // Security audit methods
  public getSecurityStatus(): {
    activeTokens: number
    expiredTokens: number
    configuration: {
      secure: boolean
      httpOnly: boolean
      sameSite: string
      maxAge: number
    }
    recommendations: string[]
  } {
    const now = Date.now()
    const maxAge = this.config.maxAge * 1000
    let expiredTokens = 0

    for (const info of this.tokenStore.values()) {
      if (now - info.timestamp > maxAge) {
        expiredTokens++
      }
    }

    const recommendations: string[] = []

    if (!this.config.secure && process.env.NODE_ENV === 'production') {
      recommendations.push('Enable secure flag for CSRF cookies in production')
    }

    if (!this.config.httpOnly) {
      recommendations.push('Enable HttpOnly flag to prevent XSS attacks on CSRF tokens')
    }

    if (this.config.sameSite !== 'strict') {
      recommendations.push('Consider using SameSite=Strict for maximum protection')
    }

    if (this.config.maxAge > 3600) {
      recommendations.push('Consider shorter token expiration time for better security')
    }

    return {
      activeTokens: this.tokenStore.size - expiredTokens,
      expiredTokens,
      configuration: {
        secure: this.config.secure,
        httpOnly: this.config.httpOnly,
        sameSite: this.config.sameSite,
        maxAge: this.config.maxAge
      },
      recommendations
    }
  }

  // Test methods for development
  public __testOnly_getTokenStore(): Map<string, CSRFTokenInfo> {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      throw new Error('Test methods should only be used in test/development environment')
    }
    return this.tokenStore
  }

  public destroy(): void {
    this.tokenStore.clear()
  }
}

// Double Submit Cookie Pattern implementation
export class DoubleSubmitCSRF extends CSRFProtection {
  public validateDoubleSubmitRequest(
    request: NextRequest
  ): CSRFValidationResult {
    const method = request.method.toUpperCase()
    
    if (this.config.ignoredMethods.includes(method)) {
      return { isValid: true }
    }

    // Get token from header
    const headerToken = request.headers.get(this.config.headerName)
    
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie')
    let cookieToken: string | undefined

    if (cookieHeader) {
      const cookies = this.parseCookies(cookieHeader)
      cookieToken = cookies[this.config.cookieName]
    }

    if (!headerToken || !cookieToken) {
      return {
        isValid: false,
        error: 'CSRF tokens missing from header or cookie'
      }
    }

    if (headerToken !== cookieToken) {
      return {
        isValid: false,
        error: 'CSRF token mismatch between header and cookie'
      }
    }

    return this.validateToken(headerToken)
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {}
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=')
      if (name && rest.length > 0) {
        cookies[name] = rest.join('=')
      }
    })

    return cookies
  }
}

// Factory functions
export function createCSRFProtection(config: CSRFConfig): CSRFProtection {
  return new CSRFProtection(config)
}

export function createDoubleSubmitCSRF(config: CSRFConfig): DoubleSubmitCSRF {
  return new DoubleSubmitCSRF(config)
}

// Utility functions
export function generateCSRFSecret(): string {
  return randomBytes(32).toString('hex')
}

export function createCSRFMiddleware(config: CSRFConfig) {
  const csrf = createCSRFProtection(config)
  return csrf.middleware()
}

export default CSRFProtection