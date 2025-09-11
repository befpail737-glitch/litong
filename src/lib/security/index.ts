// Security module exports

// Input Validation and Sanitization
export {
  InputValidator,
  getInputValidator,
  validateInput,
  validateFile,
  sanitizeHTML,
  type ValidationConfig,
  type ValidationResult,
  type FileValidationResult
} from './input-validation'

// Security Headers Management
export {
  SecurityHeadersManager,
  getSecurityHeadersManager,
  createSecurityMiddleware,
  applySecurityHeaders,
  type SecurityHeadersConfig,
  type CSPDirectives,
  type SecurityAuditResult
} from './security-headers'

// CSRF Protection
export {
  CSRFProtection,
  DoubleSubmitCSRF,
  createCSRFProtection,
  createDoubleSubmitCSRF,
  generateCSRFSecret,
  createCSRFMiddleware,
  type CSRFConfig,
  type CSRFTokenInfo,
  type CSRFValidationResult
} from './csrf-protection'

// Security Testing
export {
  SecurityTester,
  createSecurityTester,
  runQuickSecurityScan,
  runComprehensiveSecurityScan,
  type SecurityTestConfig,
  type SecurityTest,
  type TestContext,
  type TestResult,
  type SecurityTestReport
} from './security-testing'

// Comprehensive security initialization
export function initializeSecurity(config: {
  inputValidation?: import('./input-validation').ValidationConfig
  securityHeaders?: import('./security-headers').SecurityHeadersConfig
  csrfProtection?: import('./csrf-protection').CSRFConfig
  securityTesting?: import('./security-testing').SecurityTestConfig
} = {}) {
  if (typeof window === 'undefined') {
    // Server-side initialization
    const { getInputValidator } = require('./input-validation')
    const { getSecurityHeadersManager } = require('./security-headers')
    const { createCSRFProtection } = require('./csrf-protection')
    const { createSecurityTester } = require('./security-testing')

    return {
      inputValidator: getInputValidator(config.inputValidation),
      securityHeadersManager: getSecurityHeadersManager(config.securityHeaders),
      csrfProtection: config.csrfProtection?.secretKey ? 
        createCSRFProtection(config.csrfProtection) : null,
      securityTester: createSecurityTester(config.securityTesting)
    }
  }

  // Client-side initialization (limited)
  const { getInputValidator } = require('./input-validation')
  
  return {
    inputValidator: getInputValidator(config.inputValidation),
    securityHeadersManager: null,
    csrfProtection: null,
    securityTester: null
  }
}

// Security middleware factory
export function createSecurityMiddlewareStack(config: {
  enableCSRF?: boolean
  enableSecurityHeaders?: boolean
  enableInputValidation?: boolean
  csrfSecret?: string
  securityHeaders?: import('./security-headers').SecurityHeadersConfig
  inputValidation?: import('./input-validation').ValidationConfig
} = {}) {
  const middlewares: Array<(request: any) => Promise<Response | null>> = []

  // CSRF Protection
  if (config.enableCSRF && config.csrfSecret) {
    const { createCSRFMiddleware } = require('./csrf-protection')
    middlewares.push(createCSRFMiddleware({
      secretKey: config.csrfSecret,
      debug: process.env.NODE_ENV === 'development'
    }))
  }

  // Security Headers
  if (config.enableSecurityHeaders) {
    const { createSecurityMiddleware } = require('./security-headers')
    middlewares.push(createSecurityMiddleware(config.securityHeaders))
  }

  // Combined middleware
  return async (request: any) => {
    for (const middleware of middlewares) {
      const result = await middleware(request)
      if (result) {
        return result // Middleware returned a response (likely an error)
      }
    }
    return null // All middleware passed
  }
}

// Security audit functionality
export async function performSecurityAudit(options: {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: any
  includeVulnerabilityScanning?: boolean
  includeDependencyCheck?: boolean
  includeConfigurationAudit?: boolean
} = { url: '/' }) {
  const { createSecurityTester } = require('./security-testing')
  const { getSecurityHeadersManager } = require('./security-headers')

  const tester = createSecurityTester({
    enableVulnerabilityScanning: options.includeVulnerabilityScanning,
    enableDependencyChecking: options.includeDependencyCheck,
    enableConfigurationAudit: options.includeConfigurationAudit,
    debug: true
  })

  const testContext = {
    url: options.url,
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body
  }

  // Run security tests
  const securityReport = await tester.runSecurityTests(testContext)

  // Audit security headers
  const headersManager = getSecurityHeadersManager()
  const mockHeaders = new Headers(options.headers || {})
  const headerAudit = headersManager.auditSecurityHeaders(mockHeaders)
  const headerReport = headersManager.generateSecurityReport(mockHeaders)

  // Dependency scan
  const dependencyReport = await tester.scanDependencies()

  return {
    securityTests: securityReport,
    securityHeaders: headerReport,
    dependencies: dependencyReport,
    overallScore: Math.round(
      (securityReport.riskScore * 0.4 + 
       headerReport.score * 0.3 + 
       (dependencyReport.vulnerablePackages === 0 ? 100 : 70) * 0.3)
    ),
    recommendations: [
      ...securityReport.recommendations,
      ...headerReport.recommendations,
      ...(dependencyReport.vulnerablePackages > 0 ? 
        ['Update vulnerable dependencies to latest versions'] : [])
    ]
  }
}

// Security utilities
export const SecurityUtils = {
  // Generate secure random strings
  generateSecureToken: (length: number = 32): string => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback for Node.js
      const crypto = require('crypto')
      return crypto.randomBytes(length).toString('hex')
    }
  },

  // Hash password securely
  hashPassword: async (password: string, salt?: string): Promise<{ hash: string; salt: string }> => {
    const bcrypt = require('bcrypt')
    const saltRounds = 12
    const usedSalt = salt || await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, usedSalt)
    return { hash, salt: usedSalt }
  },

  // Verify password
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    const bcrypt = require('bcrypt')
    return await bcrypt.compare(password, hash)
  },

  // Constant time string comparison
  constantTimeCompare: (a: string, b: string): boolean => {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
  },

  // Escape HTML to prevent XSS
  escapeHTML: (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  },

  // Generate Content Security Policy nonce
  generateCSPNonce: (): string => {
    return SecurityUtils.generateSecureToken(16)
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email)
  },

  // Check password strength
  checkPasswordStrength: (password: string): {
    score: number
    feedback: string[]
    isStrong: boolean
  } => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 2
    } else {
      feedback.push('Password should be at least 8 characters long')
    }

    if (password.length >= 12) {
      score += 1
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include lowercase letters')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include uppercase letters')
    }

    if (/[0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include numbers')
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include special characters')
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'admin', 'test', 'qwerty']
    if (commonPasswords.includes(password.toLowerCase())) {
      score = 0
      feedback.push('Avoid common passwords')
    }

    const isStrong = score >= 5

    return { score, feedback, isStrong }
  }
}

// Security constants
export const SECURITY_CONSTANTS = {
  // OWASP Top 10 categories
  OWASP_TOP_10: {
    A01: 'Broken Access Control',
    A02: 'Cryptographic Failures',
    A03: 'Injection',
    A04: 'Insecure Design',
    A05: 'Security Misconfiguration',
    A06: 'Vulnerable and Outdated Components',
    A07: 'Identification and Authentication Failures',
    A08: 'Software and Data Integrity Failures',
    A09: 'Security Logging and Monitoring Failures',
    A10: 'Server-Side Request Forgery'
  },

  // Common CWE IDs
  CWE: {
    INJECTION: 'CWE-89',
    XSS: 'CWE-79',
    CSRF: 'CWE-352',
    AUTHENTICATION: 'CWE-287',
    AUTHORIZATION: 'CWE-269',
    CRYPTO: 'CWE-327',
    SESSION: 'CWE-613',
    INPUT_VALIDATION: 'CWE-20'
  },

  // Security headers
  SECURITY_HEADERS: {
    CSP: 'Content-Security-Policy',
    HSTS: 'Strict-Transport-Security',
    X_FRAME_OPTIONS: 'X-Frame-Options',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    REFERRER_POLICY: 'Referrer-Policy',
    PERMISSIONS_POLICY: 'Permissions-Policy'
  },

  // Recommended values
  RECOMMENDATIONS: {
    MIN_PASSWORD_LENGTH: 8,
    RECOMMENDED_PASSWORD_LENGTH: 12,
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CSRF_TOKEN_LENGTH: 32,
    BCRYPT_ROUNDS: 12
  }
} as const

export default {
  initializeSecurity,
  createSecurityMiddlewareStack,
  performSecurityAudit,
  SecurityUtils,
  SECURITY_CONSTANTS
}