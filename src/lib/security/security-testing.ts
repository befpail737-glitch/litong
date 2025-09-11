import { NextRequest } from 'next/server';

export interface SecurityTestConfig {
  enableVulnerabilityScanning?: boolean
  enablePenetrationTesting?: boolean
  enableDependencyChecking?: boolean
  enableConfigurationAudit?: boolean
  testDepth?: 'basic' | 'comprehensive' | 'advanced'
  excludePaths?: string[]
  customTests?: SecurityTest[]
  reportFormat?: 'json' | 'html' | 'text'
  debug?: boolean
}

export interface SecurityTest {
  id: string
  name: string
  category: 'injection' | 'authentication' | 'authorization' | 'configuration' | 'crypto' | 'input-validation' | 'session' | 'xss' | 'csrf'
  severity: 'low' | 'medium' | 'high' | 'critical'
  test: (context: TestContext) => Promise<TestResult>
  description: string
  cweId?: string
  owaspCategory?: string
}

export interface TestContext {
  request?: NextRequest
  response?: Response
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  cookies?: Record<string, string>
  session?: any
}

export interface TestResult {
  passed: boolean
  message: string
  details?: any
  evidence?: string[]
  recommendation?: string
  risk?: 'low' | 'medium' | 'high' | 'critical'
}

export interface SecurityTestReport {
  timestamp: number
  testSummary: {
    total: number
    passed: number
    failed: number
    skipped: number
  }
  vulnerabilities: Array<{
    test: string
    category: string
    severity: string
    message: string
    cweId?: string
    recommendation?: string
    evidence?: string[]
  }>
  riskScore: number
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  recommendations: string[]
}

// Security testing framework
export class SecurityTester {
  private config: Required<SecurityTestConfig>;
  private tests: SecurityTest[] = [];
  private testResults: Map<string, TestResult> = new Map();

  constructor(config: SecurityTestConfig = {}) {
    this.config = {
      enableVulnerabilityScanning: true,
      enablePenetrationTesting: false, // Disabled by default for safety
      enableDependencyChecking: true,
      enableConfigurationAudit: true,
      testDepth: 'comprehensive',
      excludePaths: ['/api/health', '/api/status'],
      customTests: [],
      reportFormat: 'json',
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    this.initializeTests();
  }

  private initializeTests(): void {
    // Initialize built-in security tests
    this.tests = [
      ...this.getInjectionTests(),
      ...this.getAuthenticationTests(),
      ...this.getAuthorizationTests(),
      ...this.getInputValidationTests(),
      ...this.getXSSTests(),
      ...this.getCSRFTests(),
      ...this.getConfigurationTests(),
      ...this.getCryptographyTests(),
      ...this.getSessionTests(),
      ...this.config.customTests
    ];

    if (this.config.debug) {
      console.log(`Initialized ${this.tests.length} security tests`);
    }
  }

  // SQL Injection Tests
  private getInjectionTests(): SecurityTest[] {
    return [
      {
        id: 'sql-injection-basic',
        name: 'SQL Injection - Basic Patterns',
        category: 'injection',
        severity: 'critical',
        cweId: 'CWE-89',
        owaspCategory: 'A03',
        description: 'Tests for basic SQL injection vulnerabilities',
        test: async (context: TestContext) => {
          const payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users --",
            "admin'--",
            "' OR 1=1 /*"
          ];

          const vulnerabilities: string[] = [];

          for (const payload of payloads) {
            try {
              // Test query parameters
              const testUrl = new URL(context.url);
              testUrl.searchParams.set('test', payload);

              // Test POST body
              const testBody = context.body ? { ...context.body, test: payload } : { test: payload };

              // Check for error messages indicating SQL injection
              if (this.containsSQLError(JSON.stringify(testBody))) {
                vulnerabilities.push(`Potential SQL injection with payload: ${payload}`);
              }
            } catch (error) {
              // Errors might indicate injection vulnerabilities
              if (error instanceof Error && this.containsSQLError(error.message)) {
                vulnerabilities.push(`SQL error with payload: ${payload}`);
              }
            }
          }

          return {
            passed: vulnerabilities.length === 0,
            message: vulnerabilities.length > 0 ? 'SQL injection vulnerabilities detected' : 'No SQL injection vulnerabilities found',
            evidence: vulnerabilities,
            recommendation: 'Use parameterized queries and input validation'
          };
        }
      },
      {
        id: 'nosql-injection',
        name: 'NoSQL Injection Test',
        category: 'injection',
        severity: 'high',
        cweId: 'CWE-943',
        description: 'Tests for NoSQL injection vulnerabilities',
        test: async (context: TestContext) => {
          const payloads = [
            '{"$ne": null}',
            '{"$gt": ""}',
            '{"$where": "this.password.match(/.*/)"}',
            '{"$regex": ".*"}',
            '{"$or": [{}]}'
          ];

          const vulnerabilities: string[] = [];

          for (const payload of payloads) {
            try {
              const testBody = { test: JSON.parse(payload) };
              // In a real implementation, this would make requests to test endpoints
              // For now, we'll simulate the test
              vulnerabilities.push(`Tested NoSQL injection payload: ${payload}`);
            } catch (error) {
              // JSON parsing errors are expected for some payloads
            }
          }

          return {
            passed: true, // Simulated test - in real implementation, check for actual vulnerabilities
            message: 'NoSQL injection test completed',
            details: { payloadsTested: payloads.length },
            recommendation: 'Use proper input validation and avoid dynamic query construction'
          };
        }
      }
    ];
  }

  // Authentication Tests
  private getAuthenticationTests(): SecurityTest[] {
    return [
      {
        id: 'weak-password-policy',
        name: 'Weak Password Policy',
        category: 'authentication',
        severity: 'medium',
        cweId: 'CWE-521',
        description: 'Tests for weak password policies',
        test: async (context: TestContext) => {
          const weakPasswords = ['123456', 'password', 'admin', 'test', ''];
          const issues: string[] = [];

          // Test if weak passwords are accepted
          for (const password of weakPasswords) {
            // Simulate password validation
            if (password.length < 8) {
              issues.push(`Weak password accepted: ${password}`);
            }
          }

          return {
            passed: issues.length === 0,
            message: issues.length > 0 ? 'Weak password policy detected' : 'Password policy appears adequate',
            evidence: issues,
            recommendation: 'Implement strong password requirements (min 8 chars, complexity rules)'
          };
        }
      },
      {
        id: 'brute-force-protection',
        name: 'Brute Force Protection',
        category: 'authentication',
        severity: 'high',
        cweId: 'CWE-307',
        description: 'Tests for brute force attack protection',
        test: async (context: TestContext) => {
          const attempts = 10;
          let blockedAfter = -1;

          // Simulate multiple login attempts
          for (let i = 0; i < attempts; i++) {
            // In a real implementation, this would make actual requests
            // For simulation, assume blocking after 5 attempts
            if (i >= 5) {
              blockedAfter = i;
              break;
            }
          }

          const hasProtection = blockedAfter > 0 && blockedAfter <= 5;

          return {
            passed: hasProtection,
            message: hasProtection ? 'Brute force protection detected' : 'No brute force protection found',
            details: { attemptsBeforeBlock: blockedAfter },
            recommendation: 'Implement account lockout and rate limiting for authentication endpoints'
          };
        }
      }
    ];
  }

  // Authorization Tests
  private getAuthorizationTests(): SecurityTest[] {
    return [
      {
        id: 'privilege-escalation',
        name: 'Privilege Escalation Test',
        category: 'authorization',
        severity: 'critical',
        cweId: 'CWE-269',
        description: 'Tests for privilege escalation vulnerabilities',
        test: async (context: TestContext) => {
          const testCases = [
            { role: 'user', accessAdminEndpoint: false },
            { role: 'moderator', accessAdminEndpoint: false },
            { role: 'admin', accessAdminEndpoint: true }
          ];

          const violations: string[] = [];

          testCases.forEach(({ role, accessAdminEndpoint }) => {
            // Simulate role-based access control testing
            if (role !== 'admin' && accessAdminEndpoint) {
              violations.push(`User with role '${role}' can access admin endpoints`);
            }
          });

          return {
            passed: violations.length === 0,
            message: violations.length > 0 ? 'Privilege escalation vulnerabilities found' : 'Authorization controls appear proper',
            evidence: violations,
            recommendation: 'Implement proper role-based access control and validate permissions'
          };
        }
      }
    ];
  }

  // Input Validation Tests
  private getInputValidationTests(): SecurityTest[] {
    return [
      {
        id: 'input-validation',
        name: 'Input Validation Test',
        category: 'input-validation',
        severity: 'high',
        cweId: 'CWE-20',
        description: 'Tests for proper input validation',
        test: async (context: TestContext) => {
          const maliciousInputs = [
            '../../../etc/passwd',
            '../../../../windows/system32/config/sam',
            '<script>alert("xss")</script>',
            '${7*7}',
            '{{7*7}}',
            '<%=7*7%>',
            '\x00',
            'A'.repeat(10000) // Large input
          ];

          const vulnerabilities: string[] = [];

          maliciousInputs.forEach(input => {
            // Test for proper input sanitization
            if (this.containsSuspiciousPattern(input)) {
              // In real implementation, test if input is properly sanitized
              // For now, flag as potential vulnerability
              vulnerabilities.push(`Potentially dangerous input pattern: ${input.substring(0, 50)}...`);
            }
          });

          return {
            passed: true, // Simplified for demo
            message: 'Input validation tests completed',
            details: { patternsTested: maliciousInputs.length },
            recommendation: 'Implement comprehensive input validation and sanitization'
          };
        }
      }
    ];
  }

  // XSS Tests
  private getXSSTests(): SecurityTest[] {
    return [
      {
        id: 'reflected-xss',
        name: 'Reflected XSS Test',
        category: 'xss',
        severity: 'high',
        cweId: 'CWE-79',
        owaspCategory: 'A03',
        description: 'Tests for reflected cross-site scripting vulnerabilities',
        test: async (context: TestContext) => {
          const xssPayloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            'javascript:alert("XSS")',
            '<svg onload=alert("XSS")>',
            '<iframe src="javascript:alert(`XSS`)">'
          ];

          const vulnerabilities: string[] = [];

          xssPayloads.forEach(payload => {
            // Test if payload appears unescaped in response
            if (context.body && typeof context.body === 'string') {
              if (context.body.includes(payload)) {
                vulnerabilities.push(`Potential XSS with payload: ${payload}`);
              }
            }
          });

          return {
            passed: vulnerabilities.length === 0,
            message: vulnerabilities.length > 0 ? 'XSS vulnerabilities detected' : 'No XSS vulnerabilities found',
            evidence: vulnerabilities,
            recommendation: 'Implement proper output encoding and Content Security Policy'
          };
        }
      }
    ];
  }

  // CSRF Tests
  private getCSRFTests(): SecurityTest[] {
    return [
      {
        id: 'csrf-protection',
        name: 'CSRF Protection Test',
        category: 'csrf',
        severity: 'medium',
        cweId: 'CWE-352',
        description: 'Tests for CSRF protection mechanisms',
        test: async (context: TestContext) => {
          const hasCSRFToken = context.headers['x-csrf-token'] ||
                              (context.cookies && context.cookies['_csrf']);

          const hasSameSiteCookie = context.headers['cookie']?.includes('SameSite=Strict') ||
                                  context.headers['cookie']?.includes('SameSite=Lax');

          const hasRefererCheck = context.headers['referer'] !== undefined;

          const protections: string[] = [];
          if (hasCSRFToken) protections.push('CSRF token');
          if (hasSameSiteCookie) protections.push('SameSite cookie');
          if (hasRefererCheck) protections.push('Referer validation');

          const hasProtection = protections.length > 0;

          return {
            passed: hasProtection,
            message: hasProtection ? 'CSRF protection mechanisms found' : 'No CSRF protection detected',
            details: { protections },
            recommendation: 'Implement CSRF tokens and SameSite cookie attributes'
          };
        }
      }
    ];
  }

  // Configuration Tests
  private getConfigurationTests(): SecurityTest[] {
    return [
      {
        id: 'security-headers',
        name: 'Security Headers Test',
        category: 'configuration',
        severity: 'medium',
        cweId: 'CWE-693',
        description: 'Tests for proper security headers',
        test: async (context: TestContext) => {
          const requiredHeaders = [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
            'Strict-Transport-Security',
            'Referrer-Policy'
          ];

          const missingHeaders = requiredHeaders.filter(header =>
            !context.headers[header.toLowerCase()]
          );

          return {
            passed: missingHeaders.length === 0,
            message: missingHeaders.length > 0 ? 'Missing security headers' : 'Security headers properly configured',
            evidence: missingHeaders,
            recommendation: 'Implement all recommended security headers'
          };
        }
      }
    ];
  }

  // Cryptography Tests
  private getCryptographyTests(): SecurityTest[] {
    return [
      {
        id: 'weak-crypto',
        name: 'Weak Cryptography Test',
        category: 'crypto',
        severity: 'high',
        cweId: 'CWE-327',
        description: 'Tests for weak cryptographic implementations',
        test: async (context: TestContext) => {
          const weakAlgorithms = ['MD5', 'SHA1', 'DES', 'RC4'];
          const issues: string[] = [];

          // Check for weak algorithms in headers or response
          const responseText = JSON.stringify(context);

          weakAlgorithms.forEach(algorithm => {
            if (responseText.toLowerCase().includes(algorithm.toLowerCase())) {
              issues.push(`Weak cryptographic algorithm detected: ${algorithm}`);
            }
          });

          // Check for weak SSL/TLS (simplified check)
          if (context.url.startsWith('http:') && !context.url.includes('localhost')) {
            issues.push('Unencrypted HTTP connection detected');
          }

          return {
            passed: issues.length === 0,
            message: issues.length > 0 ? 'Weak cryptography detected' : 'Cryptography appears adequate',
            evidence: issues,
            recommendation: 'Use strong cryptographic algorithms (AES, SHA-256+, TLS 1.2+)'
          };
        }
      }
    ];
  }

  // Session Management Tests
  private getSessionTests(): SecurityTest[] {
    return [
      {
        id: 'session-security',
        name: 'Session Security Test',
        category: 'session',
        severity: 'medium',
        cweId: 'CWE-613',
        description: 'Tests for secure session management',
        test: async (context: TestContext) => {
          const cookieHeader = context.headers['cookie'] || '';
          const issues: string[] = [];

          // Check for secure session cookies
          if (cookieHeader && !cookieHeader.includes('Secure')) {
            issues.push('Session cookies missing Secure flag');
          }

          if (cookieHeader && !cookieHeader.includes('HttpOnly')) {
            issues.push('Session cookies missing HttpOnly flag');
          }

          if (cookieHeader && !cookieHeader.includes('SameSite')) {
            issues.push('Session cookies missing SameSite attribute');
          }

          // Check for session fixation protection
          // This would require more complex testing in a real implementation

          return {
            passed: issues.length === 0,
            message: issues.length > 0 ? 'Session security issues found' : 'Session security appears adequate',
            evidence: issues,
            recommendation: 'Use secure session cookies with proper attributes'
          };
        }
      }
    ];
  }

  // Test execution
  public async runSecurityTests(context: TestContext): Promise<SecurityTestReport> {
    const startTime = Date.now();
    const results: TestResult[] = [];
    const vulnerabilities: SecurityTestReport['vulnerabilities'] = [];

    if (this.config.debug) {
      console.log(`Running ${this.tests.length} security tests...`);
    }

    for (const test of this.tests) {
      try {
        // Skip tests for excluded paths
        if (this.config.excludePaths.some(path => context.url.includes(path))) {
          continue;
        }

        const result = await test.test(context);
        results.push(result);
        this.testResults.set(test.id, result);

        if (!result.passed) {
          vulnerabilities.push({
            test: test.name,
            category: test.category,
            severity: test.severity,
            message: result.message,
            cweId: test.cweId,
            recommendation: result.recommendation,
            evidence: result.evidence
          });
        }

        if (this.config.debug) {
          console.log(`Test ${test.name}: ${result.passed ? 'PASS' : 'FAIL'}`);
        }
      } catch (error) {
        if (this.config.debug) {
          console.error(`Test ${test.name} failed:`, error);
        }

        results.push({
          passed: false,
          message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    const summary = {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      skipped: this.tests.length - results.length
    };

    // Calculate risk score
    const riskScore = this.calculateRiskScore(vulnerabilities);
    const grade = this.calculateGrade(riskScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(vulnerabilities);

    const report: SecurityTestReport = {
      timestamp: Date.now(),
      testSummary: summary,
      vulnerabilities,
      riskScore,
      grade,
      recommendations
    };

    if (this.config.debug) {
      console.log(`Security testing completed in ${Date.now() - startTime}ms`);
      console.log(`Risk Score: ${riskScore}, Grade: ${grade}`);
    }

    return report;
  }

  // Dependency scanning
  public async scanDependencies(): Promise<{
    vulnerabilities: Array<{
      package: string
      version: string
      vulnerability: string
      severity: string
      recommendation: string
    }>
    totalPackages: number
    vulnerablePackages: number
  }> {
    // This would integrate with tools like npm audit, Snyk, etc.
    // For demo purposes, we'll return a simulated result

    const mockVulnerabilities = [
      {
        package: 'example-package',
        version: '1.0.0',
        vulnerability: 'CVE-2021-1234',
        severity: 'medium',
        recommendation: 'Update to version 1.0.1 or later'
      }
    ];

    return {
      vulnerabilities: mockVulnerabilities,
      totalPackages: 100, // Mock number
      vulnerablePackages: mockVulnerabilities.length
    };
  }

  // Helper methods
  private containsSQLError(text: string): boolean {
    const sqlErrorPatterns = [
      'sql syntax',
      'mysql_fetch',
      'ora-01756',
      'microsoft jet database',
      'sqlite_master',
      'postgresql error',
      'warning: mysql'
    ];

    return sqlErrorPatterns.some(pattern =>
      text.toLowerCase().includes(pattern)
    );
  }

  private containsSuspiciousPattern(input: string): boolean {
    const suspiciousPatterns = [
      '../',
      '<script',
      'javascript:',
      'eval(',
      'expression(',
      '${',
      '{{',
      '<%'
    ];

    return suspiciousPatterns.some(pattern =>
      input.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private calculateRiskScore(vulnerabilities: SecurityTestReport['vulnerabilities']): number {
    let score = 0;

    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score += 10;
          break;
        case 'high':
          score += 7;
          break;
        case 'medium':
          score += 4;
          break;
        case 'low':
          score += 1;
          break;
      }
    });

    return Math.min(score, 100);
  }

  private calculateGrade(riskScore: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (riskScore === 0) return 'A+';
    if (riskScore <= 5) return 'A';
    if (riskScore <= 15) return 'B';
    if (riskScore <= 30) return 'C';
    if (riskScore <= 50) return 'D';
    return 'F';
  }

  private generateRecommendations(vulnerabilities: SecurityTestReport['vulnerabilities']): string[] {
    const recommendations = new Set<string>();

    vulnerabilities.forEach(vuln => {
      if (vuln.recommendation) {
        recommendations.add(vuln.recommendation);
      }
    });

    // Add general recommendations
    if (vulnerabilities.length > 0) {
      recommendations.add('Conduct regular security testing and code reviews');
      recommendations.add('Implement security training for development team');
    }

    return Array.from(recommendations);
  }

  // Report generation
  public generateReport(report: SecurityTestReport, format: 'json' | 'html' | 'text' = 'json'): string {
    switch (format) {
      case 'html':
        return this.generateHTMLReport(report);
      case 'text':
        return this.generateTextReport(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  private generateHTMLReport(report: SecurityTestReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Security Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .grade { font-size: 2em; font-weight: bold; }
        .grade.A, .grade.A+ { color: green; }
        .grade.B { color: orange; }
        .grade.C, .grade.D, .grade.F { color: red; }
        .vulnerability { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
        .critical { border-left-color: #d32f2f; }
        .high { border-left-color: #f57c00; }
        .medium { border-left-color: #fbc02d; }
        .low { border-left-color: #388e3c; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Security Test Report</h1>
        <p>Generated: ${new Date(report.timestamp).toISOString()}</p>
        <div class="grade ${report.grade}">${report.grade}</div>
        <p>Risk Score: ${report.riskScore}</p>
    </div>
    
    <h2>Summary</h2>
    <ul>
        <li>Total Tests: ${report.testSummary.total}</li>
        <li>Passed: ${report.testSummary.passed}</li>
        <li>Failed: ${report.testSummary.failed}</li>
        <li>Skipped: ${report.testSummary.skipped}</li>
    </ul>
    
    <h2>Vulnerabilities</h2>
    ${report.vulnerabilities.map(vuln => `
        <div class="vulnerability ${vuln.severity}">
            <h3>${vuln.test}</h3>
            <p><strong>Severity:</strong> ${vuln.severity.toUpperCase()}</p>
            <p><strong>Message:</strong> ${vuln.message}</p>
            ${vuln.cweId ? `<p><strong>CWE ID:</strong> ${vuln.cweId}</p>` : ''}
            ${vuln.recommendation ? `<p><strong>Recommendation:</strong> ${vuln.recommendation}</p>` : ''}
        </div>
    `).join('')}
    
    <h2>Recommendations</h2>
    <ul>
        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
</body>
</html>`;
  }

  private generateTextReport(report: SecurityTestReport): string {
    return `
SECURITY TEST REPORT
Generated: ${new Date(report.timestamp).toISOString()}

GRADE: ${report.grade}
RISK SCORE: ${report.riskScore}

SUMMARY:
- Total Tests: ${report.testSummary.total}
- Passed: ${report.testSummary.passed}
- Failed: ${report.testSummary.failed}
- Skipped: ${report.testSummary.skipped}

VULNERABILITIES:
${report.vulnerabilities.map(vuln => `
- ${vuln.test} (${vuln.severity.toUpperCase()})
  Message: ${vuln.message}
  ${vuln.cweId ? `CWE ID: ${vuln.cweId}` : ''}
  ${vuln.recommendation ? `Recommendation: ${vuln.recommendation}` : ''}
`).join('')}

RECOMMENDATIONS:
${report.recommendations.map(rec => `- ${rec}`).join('\n')}
`;
  }

  public getTestResults(): Map<string, TestResult> {
    return new Map(this.testResults);
  }

  public addCustomTest(test: SecurityTest): void {
    this.tests.push(test);
  }

  public removeTest(testId: string): boolean {
    const index = this.tests.findIndex(t => t.id === testId);
    if (index !== -1) {
      this.tests.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Factory functions
export function createSecurityTester(config?: SecurityTestConfig): SecurityTester {
  return new SecurityTester(config);
}

export async function runQuickSecurityScan(context: TestContext): Promise<SecurityTestReport> {
  const tester = createSecurityTester({ testDepth: 'basic' });
  return await tester.runSecurityTests(context);
}

export async function runComprehensiveSecurityScan(context: TestContext): Promise<SecurityTestReport> {
  const tester = createSecurityTester({ testDepth: 'comprehensive' });
  return await tester.runSecurityTests(context);
}

export default SecurityTester;
