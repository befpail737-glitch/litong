import { NextRequest, NextResponse } from 'next/server';

export interface SecurityHeadersConfig {
  enableCSP?: boolean
  enableHSTS?: boolean
  enableXFrameOptions?: boolean
  enableXContentTypeOptions?: boolean
  enableReferrerPolicy?: boolean
  enablePermissionsPolicy?: boolean
  enableXXSSProtection?: boolean
  cspDirectives?: CSPDirectives
  hstsMaxAge?: number
  hstsIncludeSubDomains?: boolean
  hstsPreload?: boolean
  frameOptions?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM'
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  debug?: boolean
}

export interface CSPDirectives {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'connect-src'?: string[]
  'font-src'?: string[]
  'object-src'?: string[]
  'media-src'?: string[]
  'frame-src'?: string[]
  'child-src'?: string[]
  'worker-src'?: string[]
  'form-action'?: string[]
  'base-uri'?: string[]
  'manifest-src'?: string[]
  'upgrade-insecure-requests'?: boolean
  'block-all-mixed-content'?: boolean
}

export interface SecurityAuditResult {
  headerName: string
  status: 'missing' | 'present' | 'weak' | 'strong'
  currentValue?: string
  recommendedValue?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  cweId?: string
}

// Security headers management
export class SecurityHeadersManager {
  private config: Required<SecurityHeadersConfig>;

  constructor(config: SecurityHeadersConfig = {}) {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableXFrameOptions: true,
      enableXContentTypeOptions: true,
      enableReferrerPolicy: true,
      enablePermissionsPolicy: true,
      enableXXSSProtection: true,
      cspDirectives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://api.litong.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ["'self'"],
        'child-src': ["'self'"],
        'worker-src': ["'self'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': true,
        'block-all-mixed-content': false
      },
      hstsMaxAge: 31536000, // 1 year
      hstsIncludeSubDomains: true,
      hstsPreload: true,
      frameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      debug: process.env.NODE_ENV === 'development',
      ...config,
      cspDirectives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://api.litong.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ["'self'"],
        'child-src': ["'self'"],
        'worker-src': ["'self'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': true,
        'block-all-mixed-content': false,
        ...config.cspDirectives
      }
    };
  }

  // Apply security headers to response
  public applySecurityHeaders(
    response: NextResponse,
    request?: NextRequest,
    options: { reportOnly?: boolean } = {}
  ): NextResponse {
    const { reportOnly = false } = options;

    try {
      // Content Security Policy
      if (this.config.enableCSP) {
        const cspHeader = this.generateCSPHeader(reportOnly);
        if (cspHeader) {
          const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
          response.headers.set(headerName, cspHeader);
        }
      }

      // HTTP Strict Transport Security
      if (this.config.enableHSTS && this.shouldApplyHSTS(request)) {
        const hstsHeader = this.generateHSTSHeader();
        response.headers.set('Strict-Transport-Security', hstsHeader);
      }

      // X-Frame-Options
      if (this.config.enableXFrameOptions) {
        response.headers.set('X-Frame-Options', this.config.frameOptions);
      }

      // X-Content-Type-Options
      if (this.config.enableXContentTypeOptions) {
        response.headers.set('X-Content-Type-Options', 'nosniff');
      }

      // Referrer Policy
      if (this.config.enableReferrerPolicy) {
        response.headers.set('Referrer-Policy', this.config.referrerPolicy);
      }

      // Permissions Policy
      if (this.config.enablePermissionsPolicy) {
        const permissionsPolicy = this.generatePermissionsPolicyHeader();
        response.headers.set('Permissions-Policy', permissionsPolicy);
      }

      // X-XSS-Protection (deprecated but still used by some browsers)
      if (this.config.enableXXSSProtection) {
        response.headers.set('X-XSS-Protection', '1; mode=block');
      }

      // Additional security headers
      response.headers.set('X-DNS-Prefetch-Control', 'off');
      response.headers.set('X-Download-Options', 'noopen');
      response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

      // Remove server identification
      response.headers.delete('Server');
      response.headers.delete('X-Powered-By');

      if (this.config.debug) {
        console.log('Applied security headers:', Object.fromEntries(response.headers.entries()));
      }

      return response;
    } catch (error) {
      if (this.config.debug) {
        console.error('Failed to apply security headers:', error);
      }
      return response;
    }
  }

  // Generate Content Security Policy header
  private generateCSPHeader(reportOnly: boolean = false): string {
    const directives: string[] = [];

    Object.entries(this.config.cspDirectives).forEach(([directive, value]) => {
      if (directive === 'upgrade-insecure-requests' && value) {
        directives.push('upgrade-insecure-requests');
      } else if (directive === 'block-all-mixed-content' && value) {
        directives.push('block-all-mixed-content');
      } else if (Array.isArray(value) && value.length > 0) {
        directives.push(`${directive} ${value.join(' ')}`);
      }
    });

    // Add report-uri for CSP violations (if in report-only mode)
    if (reportOnly) {
      directives.push('report-uri /api/security/csp-report');
    }

    return directives.join('; ');
  }

  // Generate HSTS header
  private generateHSTSHeader(): string {
    let hsts = `max-age=${this.config.hstsMaxAge}`;

    if (this.config.hstsIncludeSubDomains) {
      hsts += '; includeSubDomains';
    }

    if (this.config.hstsPreload) {
      hsts += '; preload';
    }

    return hsts;
  }

  // Generate Permissions Policy header
  private generatePermissionsPolicyHeader(): string {
    const policies = [
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'battery=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'document-domain=()',
      'encrypted-media=()',
      'execution-while-not-rendered=()',
      'execution-while-out-of-viewport=()',
      'fullscreen=(self)',
      'geolocation=()',
      'gyroscope=()',
      'keyboard-map=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'navigation-override=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=()',
      'xr-spatial-tracking=()'
    ];

    return policies.join(', ');
  }

  // Check if HSTS should be applied
  private shouldApplyHSTS(request?: NextRequest): boolean {
    if (!request) return true;

    // Only apply HSTS to HTTPS requests
    const protocol = request.headers.get('x-forwarded-proto') ||
                    request.nextUrl.protocol;

    return protocol === 'https:';
  }

  // Security headers middleware
  public middleware() {
    return (request: NextRequest) => {
      const response = NextResponse.next();
      return this.applySecurityHeaders(response, request);
    };
  }

  // Audit security headers
  public auditSecurityHeaders(headers: Headers): SecurityAuditResult[] {
    const results: SecurityAuditResult[] = [];

    // Audit Content Security Policy
    results.push(this.auditCSP(headers));

    // Audit HSTS
    results.push(this.auditHSTS(headers));

    // Audit X-Frame-Options
    results.push(this.auditXFrameOptions(headers));

    // Audit X-Content-Type-Options
    results.push(this.auditXContentTypeOptions(headers));

    // Audit Referrer-Policy
    results.push(this.auditReferrerPolicy(headers));

    // Audit X-XSS-Protection
    results.push(this.auditXXSSProtection(headers));

    return results;
  }

  private auditCSP(headers: Headers): SecurityAuditResult {
    const csp = headers.get('Content-Security-Policy') || headers.get('Content-Security-Policy-Report-Only');

    if (!csp) {
      return {
        headerName: 'Content-Security-Policy',
        status: 'missing',
        severity: 'high',
        description: 'Content Security Policy header is missing, leaving the application vulnerable to XSS attacks',
        cweId: 'CWE-79'
      };
    }

    // Check for unsafe directives
    const hasUnsafeInline = csp.includes("'unsafe-inline'");
    const hasUnsafeEval = csp.includes("'unsafe-eval'");

    if (hasUnsafeInline || hasUnsafeEval) {
      return {
        headerName: 'Content-Security-Policy',
        status: 'weak',
        currentValue: csp,
        severity: 'medium',
        description: 'CSP contains unsafe directives that may allow XSS attacks',
        cweId: 'CWE-79'
      };
    }

    return {
      headerName: 'Content-Security-Policy',
      status: 'strong',
      currentValue: csp,
      severity: 'low',
      description: 'Content Security Policy is properly configured'
    };
  }

  private auditHSTS(headers: Headers): SecurityAuditResult {
    const hsts = headers.get('Strict-Transport-Security');

    if (!hsts) {
      return {
        headerName: 'Strict-Transport-Security',
        status: 'missing',
        severity: 'medium',
        description: 'HSTS header is missing, connections may be vulnerable to downgrade attacks',
        cweId: 'CWE-319'
      };
    }

    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;

    if (maxAge < 31536000) { // Less than 1 year
      return {
        headerName: 'Strict-Transport-Security',
        status: 'weak',
        currentValue: hsts,
        recommendedValue: 'max-age=31536000; includeSubDomains; preload',
        severity: 'low',
        description: 'HSTS max-age is less than recommended 1 year (31536000 seconds)'
      };
    }

    return {
      headerName: 'Strict-Transport-Security',
      status: 'strong',
      currentValue: hsts,
      severity: 'low',
      description: 'HSTS is properly configured'
    };
  }

  private auditXFrameOptions(headers: Headers): SecurityAuditResult {
    const xFrameOptions = headers.get('X-Frame-Options');

    if (!xFrameOptions) {
      return {
        headerName: 'X-Frame-Options',
        status: 'missing',
        severity: 'medium',
        description: 'X-Frame-Options header is missing, page may be vulnerable to clickjacking attacks',
        cweId: 'CWE-1021'
      };
    }

    if (xFrameOptions.toUpperCase() === 'DENY' || xFrameOptions.toUpperCase() === 'SAMEORIGIN') {
      return {
        headerName: 'X-Frame-Options',
        status: 'strong',
        currentValue: xFrameOptions,
        severity: 'low',
        description: 'X-Frame-Options is properly configured'
      };
    }

    return {
      headerName: 'X-Frame-Options',
      status: 'weak',
      currentValue: xFrameOptions,
      recommendedValue: 'DENY',
      severity: 'low',
      description: 'X-Frame-Options value could be more restrictive'
    };
  }

  private auditXContentTypeOptions(headers: Headers): SecurityAuditResult {
    const xContentTypeOptions = headers.get('X-Content-Type-Options');

    if (!xContentTypeOptions || xContentTypeOptions.toLowerCase() !== 'nosniff') {
      return {
        headerName: 'X-Content-Type-Options',
        status: 'missing',
        recommendedValue: 'nosniff',
        severity: 'low',
        description: 'X-Content-Type-Options header is missing or incorrect, may allow MIME sniffing attacks',
        cweId: 'CWE-79'
      };
    }

    return {
      headerName: 'X-Content-Type-Options',
      status: 'strong',
      currentValue: xContentTypeOptions,
      severity: 'low',
      description: 'X-Content-Type-Options is properly configured'
    };
  }

  private auditReferrerPolicy(headers: Headers): SecurityAuditResult {
    const referrerPolicy = headers.get('Referrer-Policy');

    if (!referrerPolicy) {
      return {
        headerName: 'Referrer-Policy',
        status: 'missing',
        recommendedValue: 'strict-origin-when-cross-origin',
        severity: 'low',
        description: 'Referrer-Policy header is missing, may leak sensitive information in referrer'
      };
    }

    const strictPolicies = [
      'no-referrer',
      'strict-origin',
      'strict-origin-when-cross-origin'
    ];

    if (strictPolicies.includes(referrerPolicy.toLowerCase())) {
      return {
        headerName: 'Referrer-Policy',
        status: 'strong',
        currentValue: referrerPolicy,
        severity: 'low',
        description: 'Referrer-Policy is properly configured'
      };
    }

    return {
      headerName: 'Referrer-Policy',
      status: 'weak',
      currentValue: referrerPolicy,
      recommendedValue: 'strict-origin-when-cross-origin',
      severity: 'low',
      description: 'Referrer-Policy could be more restrictive to prevent information leakage'
    };
  }

  private auditXXSSProtection(headers: Headers): SecurityAuditResult {
    const xXSSProtection = headers.get('X-XSS-Protection');

    // Note: This header is deprecated in favor of CSP, but still checked for completeness
    if (!xXSSProtection || !xXSSProtection.includes('1')) {
      return {
        headerName: 'X-XSS-Protection',
        status: 'missing',
        recommendedValue: '1; mode=block',
        severity: 'low',
        description: 'X-XSS-Protection header is missing (deprecated, use CSP instead)'
      };
    }

    return {
      headerName: 'X-XSS-Protection',
      status: 'present',
      currentValue: xXSSProtection,
      severity: 'low',
      description: 'X-XSS-Protection is present (deprecated, CSP is preferred)'
    };
  }

  // Generate security report
  public generateSecurityReport(headers: Headers): {
    score: number
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
    results: SecurityAuditResult[]
    recommendations: string[]
  } {
    const results = this.auditSecurityHeaders(headers);

    // Calculate score based on security headers
    let score = 100;
    let criticalIssues = 0;
    let highIssues = 0;
    let mediumIssues = 0;

    results.forEach(result => {
      switch (result.severity) {
        case 'critical':
          score -= 30;
          criticalIssues++;
          break;
        case 'high':
          score -= 20;
          highIssues++;
          break;
        case 'medium':
          score -= 10;
          mediumIssues++;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    score = Math.max(0, score);

    // Assign grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 95) grade = 'A+';
    else if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    // Generate recommendations
    const recommendations: string[] = [];

    if (criticalIssues > 0) {
      recommendations.push('Address critical security vulnerabilities immediately');
    }

    if (highIssues > 0) {
      recommendations.push('Fix high-severity security issues');
    }

    if (mediumIssues > 0) {
      recommendations.push('Resolve medium-severity security concerns');
    }

    // Specific recommendations based on missing headers
    const missingHeaders = results.filter(r => r.status === 'missing');
    missingHeaders.forEach(header => {
      recommendations.push(`Implement ${header.headerName} header`);
    });

    if (recommendations.length === 0) {
      recommendations.push('Security headers are well configured');
      recommendations.push('Continue monitoring for new security best practices');
    }

    return { score, grade, results, recommendations };
  }

  // Update CSP directives
  public updateCSPDirectives(newDirectives: Partial<CSPDirectives>): void {
    this.config.cspDirectives = {
      ...this.config.cspDirectives,
      ...newDirectives
    };
  }

  // Get current configuration
  public getConfig(): SecurityHeadersConfig {
    return { ...this.config };
  }
}

// Singleton instance
let securityHeadersManager: SecurityHeadersManager | null = null;

export function getSecurityHeadersManager(config?: SecurityHeadersConfig): SecurityHeadersManager {
  if (!securityHeadersManager) {
    securityHeadersManager = new SecurityHeadersManager(config);
  }
  return securityHeadersManager;
}

export function createSecurityMiddleware(config?: SecurityHeadersConfig) {
  const manager = getSecurityHeadersManager(config);
  return manager.middleware();
}

export function applySecurityHeaders(
  response: NextResponse,
  request?: NextRequest,
  options?: { reportOnly?: boolean }
): NextResponse {
  const manager = getSecurityHeadersManager();
  return manager.applySecurityHeaders(response, request, options);
}

export default SecurityHeadersManager;
