import { NextRequest } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

export interface ValidationConfig {
  enableXSSProtection?: boolean
  enableSQLInjectionProtection?: boolean
  enableCSRFProtection?: boolean
  enableFileUploadValidation?: boolean
  maxInputLength?: number
  allowedFileTypes?: string[]
  maxFileSize?: number
  enableRateLimit?: boolean
  customSanitizers?: Record<string, (input: string) => string>
  debug?: boolean
}

export interface ValidationResult {
  isValid: boolean
  cleanedValue: any
  errors: string[]
  warnings: string[]
  metadata?: any
}

export interface FileValidationResult extends ValidationResult {
  fileInfo?: {
    originalName: string
    mimeType: string
    size: number
    extension: string
  }
}

// Input validation and sanitization
export class InputValidator {
  private config: Required<ValidationConfig>
  private suspiciousPatterns: RegExp[]
  private sqlInjectionPatterns: RegExp[]
  private xssPatterns: RegExp[]

  constructor(config: ValidationConfig = {}) {
    this.config = {
      enableXSSProtection: true,
      enableSQLInjectionProtection: true,
      enableCSRFProtection: true,
      enableFileUploadValidation: true,
      maxInputLength: 10000,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      enableRateLimit: true,
      customSanitizers: {},
      debug: process.env.NODE_ENV === 'development',
      ...config
    }

    this.initializePatterns()
  }

  private initializePatterns(): void {
    // SQL Injection patterns
    this.sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /('|('')|;|--|\||\/\*|\*\/)/,
      /(\b(WAITFOR|DELAY|BENCHMARK|SLEEP)\b)/i,
      /(INFORMATION_SCHEMA|SYS\.)/i,
      /(\bCHAR\s*\(\s*\d+\s*\))/i
    ]

    // XSS patterns
    this.xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*>/gi,
      /<link\b[^<]*>/gi,
      /<meta\b[^<]*>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<\s*\w+[^>]*\s+on\w+\s*=\s*["'][^"']*["'][^>]*>/gi
    ]

    // General suspicious patterns
    this.suspiciousPatterns = [
      /\.\.\//g, // Directory traversal
      /\\/g, // Backslash (potential path traversal)
      /%00/g, // Null byte
      /%2e%2e%2f/gi, // URL encoded directory traversal
      /\${.*}/g, // Template injection
      /{{.*}}/g, // Template injection
      /<%.*%>/g, // Server-side code
      /<\?.*\?>/g, // PHP/XML processing instruction
    ]
  }

  // Main validation method
  public validateInput(
    input: any,
    fieldName: string,
    options: {
      type?: 'string' | 'number' | 'email' | 'url' | 'html' | 'json'
      required?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
      allowHTML?: boolean
    } = {}
  ): ValidationResult {
    const {
      type = 'string',
      required = false,
      minLength = 0,
      maxLength = this.config.maxInputLength,
      pattern,
      allowHTML = false
    } = options

    const result: ValidationResult = {
      isValid: true,
      cleanedValue: input,
      errors: [],
      warnings: []
    }

    // Check if required
    if (required && (input === null || input === undefined || input === '')) {
      result.errors.push(`${fieldName} is required`)
      result.isValid = false
      return result
    }

    // Skip validation if empty and not required
    if (!required && (input === null || input === undefined || input === '')) {
      result.cleanedValue = ''
      return result
    }

    // Convert to string for validation
    let stringValue = String(input)

    // Length validation
    if (stringValue.length < minLength) {
      result.errors.push(`${fieldName} must be at least ${minLength} characters`)
      result.isValid = false
    }

    if (stringValue.length > maxLength) {
      result.errors.push(`${fieldName} must be no more than ${maxLength} characters`)
      result.isValid = false
      stringValue = stringValue.substring(0, maxLength)
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        result.cleanedValue = this.validateEmail(stringValue, result)
        break
      case 'url':
        result.cleanedValue = this.validateURL(stringValue, result)
        break
      case 'number':
        result.cleanedValue = this.validateNumber(stringValue, result)
        break
      case 'html':
        result.cleanedValue = this.sanitizeHTML(stringValue, result, allowHTML)
        break
      case 'json':
        result.cleanedValue = this.validateJSON(stringValue, result)
        break
      default:
        result.cleanedValue = this.sanitizeString(stringValue, result)
        break
    }

    // Pattern validation
    if (pattern && !pattern.test(String(result.cleanedValue))) {
      result.errors.push(`${fieldName} format is invalid`)
      result.isValid = false
    }

    // Security checks
    if (this.config.enableXSSProtection) {
      this.checkXSS(stringValue, result, fieldName)
    }

    if (this.config.enableSQLInjectionProtection) {
      this.checkSQLInjection(stringValue, result, fieldName)
    }

    // Suspicious pattern checks
    this.checkSuspiciousPatterns(stringValue, result, fieldName)

    // Custom sanitizers
    if (this.config.customSanitizers[fieldName]) {
      result.cleanedValue = this.config.customSanitizers[fieldName](String(result.cleanedValue))
    }

    return result
  }

  // Email validation
  private validateEmail(email: string, result: ValidationResult): string {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(email)) {
      result.errors.push('Invalid email format')
      result.isValid = false
    }

    // Additional email security checks
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      result.errors.push('Invalid email format')
      result.isValid = false
    }

    return email.toLowerCase().trim()
  }

  // URL validation
  private validateURL(url: string, result: ValidationResult): string {
    try {
      const urlObj = new URL(url)
      
      // Check for allowed protocols
      const allowedProtocols = ['http:', 'https:', 'ftp:', 'ftps:']
      if (!allowedProtocols.includes(urlObj.protocol)) {
        result.errors.push('Invalid URL protocol')
        result.isValid = false
      }

      // Check for suspicious URLs
      if (urlObj.hostname.includes('..') || urlObj.pathname.includes('../')) {
        result.errors.push('Suspicious URL detected')
        result.isValid = false
      }

      return urlObj.toString()
    } catch (error) {
      result.errors.push('Invalid URL format')
      result.isValid = false
      return url
    }
  }

  // Number validation
  private validateNumber(value: string, result: ValidationResult): number | string {
    const num = Number(value)
    
    if (isNaN(num)) {
      result.errors.push('Invalid number format')
      result.isValid = false
      return value
    }

    if (!isFinite(num)) {
      result.errors.push('Number must be finite')
      result.isValid = false
      return value
    }

    return num
  }

  // JSON validation
  private validateJSON(value: string, result: ValidationResult): any {
    try {
      const parsed = JSON.parse(value)
      
      // Check for potential prototype pollution
      if (this.checkPrototypePollution(parsed)) {
        result.errors.push('Potential prototype pollution detected')
        result.isValid = false
        return value
      }

      return parsed
    } catch (error) {
      result.errors.push('Invalid JSON format')
      result.isValid = false
      return value
    }
  }

  // HTML sanitization
  private sanitizeHTML(html: string, result: ValidationResult, allowHTML: boolean): string {
    if (!allowHTML) {
      // Strip all HTML tags
      return html.replace(/<[^>]*>/g, '')
    }

    try {
      // Use DOMPurify to sanitize HTML
      const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['href', 'title', 'target'],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      })

      if (clean !== html) {
        result.warnings.push('HTML content was sanitized')
      }

      return clean
    } catch (error) {
      result.warnings.push('HTML sanitization failed, content stripped')
      return html.replace(/<[^>]*>/g, '')
    }
  }

  // String sanitization
  private sanitizeString(str: string, result: ValidationResult): string {
    let cleaned = str

    // Remove null bytes
    cleaned = cleaned.replace(/\0/g, '')

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim()

    // Remove control characters except newline and tab
    cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

    if (cleaned !== str) {
      result.warnings.push('Input was sanitized')
    }

    return cleaned
  }

  // XSS detection
  private checkXSS(input: string, result: ValidationResult, fieldName: string): void {
    for (const pattern of this.xssPatterns) {
      if (pattern.test(input)) {
        result.errors.push(`Potential XSS attack detected in ${fieldName}`)
        result.isValid = false
        break
      }
    }
  }

  // SQL injection detection
  private checkSQLInjection(input: string, result: ValidationResult, fieldName: string): void {
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(input)) {
        result.errors.push(`Potential SQL injection detected in ${fieldName}`)
        result.isValid = false
        break
      }
    }
  }

  // Suspicious pattern detection
  private checkSuspiciousPatterns(input: string, result: ValidationResult, fieldName: string): void {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        result.warnings.push(`Suspicious pattern detected in ${fieldName}`)
        break
      }
    }
  }

  // Prototype pollution check
  private checkPrototypePollution(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false

    const dangerousKeys = ['__proto__', 'constructor', 'prototype']
    
    const check = (o: any): boolean => {
      if (typeof o !== 'object' || o === null) return false
      
      for (const key of Object.keys(o)) {
        if (dangerousKeys.includes(key)) return true
        if (typeof o[key] === 'object' && check(o[key])) return true
      }
      
      return false
    }

    return check(obj)
  }

  // File validation
  public validateFile(
    file: File,
    fieldName: string,
    options: {
      allowedTypes?: string[]
      maxSize?: number
      minSize?: number
      allowedMimeTypes?: string[]
    } = {}
  ): FileValidationResult {
    const {
      allowedTypes = this.config.allowedFileTypes,
      maxSize = this.config.maxFileSize,
      minSize = 0,
      allowedMimeTypes
    } = options

    const result: FileValidationResult = {
      isValid: true,
      cleanedValue: file,
      errors: [],
      warnings: [],
      fileInfo: {
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        extension: this.getFileExtension(file.name)
      }
    }

    // File size validation
    if (file.size > maxSize) {
      result.errors.push(`File size exceeds maximum limit of ${this.formatBytes(maxSize)}`)
      result.isValid = false
    }

    if (file.size < minSize) {
      result.errors.push(`File size below minimum limit of ${this.formatBytes(minSize)}`)
      result.isValid = false
    }

    // File type validation
    const extension = this.getFileExtension(file.name)
    if (!allowedTypes.includes(extension.toLowerCase())) {
      result.errors.push(`File type '${extension}' is not allowed`)
      result.isValid = false
    }

    // MIME type validation
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
      result.errors.push(`MIME type '${file.type}' is not allowed`)
      result.isValid = false
    }

    // File name validation
    if (this.hasSuspiciousFileName(file.name)) {
      result.errors.push('Suspicious file name detected')
      result.isValid = false
    }

    // Additional security checks
    if (this.hasDoubleExtension(file.name)) {
      result.warnings.push('File has double extension, potential security risk')
    }

    return result
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || ''
  }

  private hasSuspiciousFileName(fileName: string): boolean {
    const suspiciousPatterns = [
      /\.\./,
      /[<>:"|?*]/,
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i,
      /\.(exe|bat|cmd|scr|pif|com|vbs|js|jar|app|deb|dmg|iso|img)$/i
    ]

    return suspiciousPatterns.some(pattern => pattern.test(fileName))
  }

  private hasDoubleExtension(fileName: string): boolean {
    const parts = fileName.split('.')
    return parts.length > 2
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Batch validation
  public validateObject(
    obj: Record<string, any>,
    schema: Record<string, {
      type?: 'string' | 'number' | 'email' | 'url' | 'html' | 'json'
      required?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
      allowHTML?: boolean
    }>
  ): {
    isValid: boolean
    cleanedObject: Record<string, any>
    errors: Record<string, string[]>
    warnings: Record<string, string[]>
  } {
    const cleanedObject: Record<string, any> = {}
    const errors: Record<string, string[]> = {}
    const warnings: Record<string, string[]> = {}
    let isValid = true

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const result = this.validateInput(obj[fieldName], fieldName, fieldSchema)
      
      cleanedObject[fieldName] = result.cleanedValue
      
      if (result.errors.length > 0) {
        errors[fieldName] = result.errors
        isValid = false
      }
      
      if (result.warnings.length > 0) {
        warnings[fieldName] = result.warnings
      }
    }

    return { isValid, cleanedObject, errors, warnings }
  }

  // CSRF token validation
  public validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!this.config.enableCSRFProtection) return true

    // Simple CSRF token validation - in production, use proper crypto comparison
    return token === sessionToken && token.length > 32
  }

  // Request validation middleware
  public async validateRequest(
    request: NextRequest,
    schema?: Record<string, any>
  ): Promise<{
    isValid: boolean
    data: any
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []
    let data: any = {}

    try {
      // Validate Content-Type
      const contentType = request.headers.get('content-type') || ''
      
      if (request.method === 'POST' || request.method === 'PUT') {
        if (!contentType.includes('application/json') && 
            !contentType.includes('multipart/form-data') && 
            !contentType.includes('application/x-www-form-urlencoded')) {
          errors.push('Invalid content type')
          return { isValid: false, data, errors, warnings }
        }
      }

      // Parse request body
      if (contentType.includes('application/json')) {
        try {
          data = await request.json()
        } catch (error) {
          errors.push('Invalid JSON format')
          return { isValid: false, data, errors, warnings }
        }
      }

      // Validate against schema if provided
      if (schema && data) {
        const validation = this.validateObject(data, schema)
        data = validation.cleanedObject
        
        Object.values(validation.errors).forEach(fieldErrors => {
          errors.push(...fieldErrors)
        })
        
        Object.values(validation.warnings).forEach(fieldWarnings => {
          warnings.push(...fieldWarnings)
        })

        return { isValid: validation.isValid, data, errors, warnings }
      }

      return { isValid: errors.length === 0, data, errors, warnings }
    } catch (error) {
      errors.push('Request validation failed')
      return { isValid: false, data, errors, warnings }
    }
  }

  // Generate sanitization report
  public generateSecurityReport(): {
    patternsDetected: number
    totalValidations: number
    commonThreats: Array<{ type: string; count: number }>
    recommendations: string[]
  } {
    // This would typically track statistics over time
    return {
      patternsDetected: 0,
      totalValidations: 0,
      commonThreats: [],
      recommendations: [
        'Enable all security features for production',
        'Regularly update validation patterns',
        'Monitor for new attack vectors',
        'Implement rate limiting on sensitive endpoints'
      ]
    }
  }
}

// Singleton instance
let inputValidator: InputValidator | null = null

export function getInputValidator(config?: ValidationConfig): InputValidator {
  if (!inputValidator) {
    inputValidator = new InputValidator(config)
  }
  return inputValidator
}

export function validateInput(
  input: any,
  fieldName: string,
  options?: Parameters<InputValidator['validateInput']>[2]
): ValidationResult {
  const validator = getInputValidator()
  return validator.validateInput(input, fieldName, options)
}

export function validateFile(
  file: File,
  fieldName: string,
  options?: Parameters<InputValidator['validateFile']>[2]
): FileValidationResult {
  const validator = getInputValidator()
  return validator.validateFile(file, fieldName, options)
}

export function sanitizeHTML(html: string, allowHTML: boolean = false): string {
  const validator = getInputValidator()
  const result = validator.validateInput(html, 'html', { type: 'html', allowHTML })
  return result.cleanedValue
}

export default InputValidator