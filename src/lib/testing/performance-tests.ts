export interface PerformanceTestConfig {
  baseUrl?: string
  scenarios?: LoadTestScenario[]
  duration?: number
  maxUsers?: number
  rampUpTime?: number
  thresholds?: PerformanceThresholds
  enableMetrics?: boolean
  enableTracing?: boolean
  outputFormat?: 'json' | 'html' | 'console'
  reportPath?: string
}

export interface LoadTestScenario {
  name: string
  weight: number
  steps: LoadTestStep[]
  thinkTime?: number
  iterations?: number
}

export interface LoadTestStep {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  body?: any
  expectedStatus?: number
  timeout?: number
  checks?: Array<{
    name: string
    condition: (response: any) => boolean
  }>
}

export interface PerformanceThresholds {
  responseTime?: {
    max: number
    p95: number
    p99: number
  }
  throughput?: {
    min: number
  }
  errorRate?: {
    max: number
  }
  resourceUtilization?: {
    cpu: number
    memory: number
  }
}

export interface PerformanceMetrics {
  timestamp: number
  responseTime: {
    min: number
    max: number
    avg: number
    p50: number
    p95: number
    p99: number
  }
  throughput: {
    requestsPerSecond: number
    responsesPerSecond: number
  }
  errors: {
    total: number
    rate: number
    types: Record<string, number>
  }
  users: {
    active: number
    total: number
  }
  resources: {
    cpuUsage: number
    memoryUsage: number
    networkIO: number
  }
}

export interface PerformanceTestResult {
  scenario: string
  step: string
  success: boolean
  responseTime: number
  statusCode?: number
  error?: string
  metrics?: any
}

export interface PerformanceReport {
  timestamp: number
  duration: number
  configuration: PerformanceTestConfig
  summary: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
    maxResponseTime: number
    requestsPerSecond: number
    errorRate: number
  }
  metrics: PerformanceMetrics[]
  thresholdViolations: string[]
  recommendations: string[]
  scenarioResults: Array<{
    name: string
    results: PerformanceTestResult[]
    metrics: PerformanceMetrics
  }>
}

// Performance and load testing framework
export class PerformanceTester {
  private config: Required<PerformanceTestConfig>;
  private metrics: PerformanceMetrics[] = [];
  private results: PerformanceTestResult[] = [];
  private activeUsers = 0;
  private isRunning = false;
  private startTime = 0;

  constructor(config: PerformanceTestConfig = {}) {
    this.config = {
      baseUrl: 'http://localhost:3000',
      scenarios: [],
      duration: 300000, // 5 minutes
      maxUsers: 100,
      rampUpTime: 60000, // 1 minute
      thresholds: {
        responseTime: { max: 5000, p95: 3000, p99: 5000 },
        throughput: { min: 10 },
        errorRate: { max: 0.05 },
        resourceUtilization: { cpu: 0.8, memory: 0.8 }
      },
      enableMetrics: true,
      enableTracing: false,
      outputFormat: 'console',
      reportPath: './performance-report',
      ...config,
      thresholds: {
        responseTime: { max: 5000, p95: 3000, p99: 5000 },
        throughput: { min: 10 },
        errorRate: { max: 0.05 },
        resourceUtilization: { cpu: 0.8, memory: 0.8 },
        ...config.thresholds
      }
    };

    this.initializeDefaultScenarios();
  }

  private initializeDefaultScenarios(): void {
    if (this.config.scenarios.length === 0) {
      this.config.scenarios = [
        {
          name: 'Homepage Load Test',
          weight: 30,
          steps: [
            {
              name: 'Load Homepage',
              method: 'GET',
              url: '/',
              expectedStatus: 200,
              checks: [
                {
                  name: 'Has title',
                  condition: (response) => response.body.includes('<title>')
                }
              ]
            }
          ],
          thinkTime: 2000
        },
        {
          name: 'Product Browsing',
          weight: 40,
          steps: [
            {
              name: 'Load Products Page',
              method: 'GET',
              url: '/products',
              expectedStatus: 200
            },
            {
              name: 'Search Products',
              method: 'GET',
              url: '/api/products?search=capacitor',
              expectedStatus: 200,
              checks: [
                {
                  name: 'Has results',
                  condition: (response) => JSON.parse(response.body).results.length > 0
                }
              ]
            },
            {
              name: 'View Product Details',
              method: 'GET',
              url: '/products/1',
              expectedStatus: 200
            }
          ],
          thinkTime: 3000
        },
        {
          name: 'User Authentication',
          weight: 20,
          steps: [
            {
              name: 'Load Login Page',
              method: 'GET',
              url: '/login',
              expectedStatus: 200
            },
            {
              name: 'Submit Login',
              method: 'POST',
              url: '/api/auth/login',
              body: {
                email: 'test@example.com',
                password: 'testpassword'
              },
              expectedStatus: 200
            }
          ],
          thinkTime: 5000
        },
        {
          name: 'Inquiry Submission',
          weight: 10,
          steps: [
            {
              name: 'Load Inquiry Form',
              method: 'GET',
              url: '/contact',
              expectedStatus: 200
            },
            {
              name: 'Submit Inquiry',
              method: 'POST',
              url: '/api/inquiries',
              body: {
                productId: '1',
                message: 'Test inquiry message',
                quantity: 100
              },
              expectedStatus: 201
            }
          ],
          thinkTime: 10000
        }
      ];
    }
  }

  // Main test execution
  public async runPerformanceTests(): Promise<PerformanceReport> {
    console.log('🚀 Starting performance testing...');
    console.log('Configuration:');
    console.log(`  Duration: ${this.config.duration / 1000}s`);
    console.log(`  Max Users: ${this.config.maxUsers}`);
    console.log(`  Ramp-up Time: ${this.config.rampUpTime / 1000}s`);
    console.log(`  Scenarios: ${this.config.scenarios.length}`);

    this.startTime = Date.now();
    this.isRunning = true;

    // Start metrics collection
    if (this.config.enableMetrics) {
      this.startMetricsCollection();
    }

    // Start user ramp-up
    await this.rampUpUsers();

    // Run load test
    await this.runLoadTest();

    // Generate report
    const report = this.generateReport();

    console.log('\n📊 Performance test completed!');
    this.printSummary(report);

    return report;
  }

  private async rampUpUsers(): Promise<void> {
    const userIncrementInterval = this.config.rampUpTime / this.config.maxUsers;
    const usersToAdd = this.config.maxUsers;

    console.log(`\n⬆️  Ramping up ${usersToAdd} users over ${this.config.rampUpTime / 1000}s...`);

    for (let i = 0; i < usersToAdd && this.isRunning; i++) {
      this.activeUsers++;
      this.startUserSession();

      if (i < usersToAdd - 1) {
        await this.sleep(userIncrementInterval);
      }

      if (i % 10 === 0) {
        console.log(`  Active users: ${this.activeUsers}`);
      }
    }

    console.log(`✅ Ramp-up completed. ${this.activeUsers} users active.`);
  }

  private async runLoadTest(): Promise<void> {
    const testEndTime = this.startTime + this.config.duration;

    console.log(`\n🔄 Running load test for ${this.config.duration / 1000}s...`);

    while (Date.now() < testEndTime && this.isRunning) {
      await this.sleep(5000); // Report every 5 seconds

      const elapsed = Date.now() - this.startTime;
      const remaining = testEndTime - Date.now();

      console.log(`  Progress: ${(elapsed / this.config.duration * 100).toFixed(1)}% | ` +
                 `Active Users: ${this.activeUsers} | ` +
                 `Remaining: ${Math.max(0, remaining / 1000).toFixed(0)}s`);
    }

    this.isRunning = false;
    console.log('✅ Load test completed.');
  }

  private startUserSession(): void {
    // Start an independent user session
    this.simulateUserSession().catch(error => {
      console.warn('User session error:', error);
    }).finally(() => {
      this.activeUsers = Math.max(0, this.activeUsers - 1);
    });
  }

  private async simulateUserSession(): Promise<void> {
    while (this.isRunning) {
      // Select scenario based on weight
      const scenario = this.selectScenario();

      try {
        await this.executeScenario(scenario);
      } catch (error) {
        // Log error and continue
        console.warn(`Scenario execution error: ${error}`);
      }

      // Think time between scenario iterations
      if (scenario.thinkTime) {
        await this.sleep(scenario.thinkTime);
      }
    }
  }

  private selectScenario(): LoadTestScenario {
    const totalWeight = this.config.scenarios.reduce((sum, s) => sum + s.weight, 0);
    const random = Math.random() * totalWeight;

    let currentWeight = 0;
    for (const scenario of this.config.scenarios) {
      currentWeight += scenario.weight;
      if (random <= currentWeight) {
        return scenario;
      }
    }

    return this.config.scenarios[0];
  }

  private async executeScenario(scenario: LoadTestScenario): Promise<void> {
    for (const step of scenario.steps) {
      const result = await this.executeStep(scenario.name, step);
      this.results.push(result);

      // Small delay between steps
      await this.sleep(100);
    }
  }

  private async executeStep(scenarioName: string, step: LoadTestStep): Promise<PerformanceTestResult> {
    const startTime = Date.now();

    try {
      // Construct full URL
      const fullUrl = step.url.startsWith('http') ? step.url : `${this.config.baseUrl}${step.url}`;

      // Make HTTP request (mock implementation)
      const response = await this.makeHttpRequest(step.method, fullUrl, {
        headers: step.headers,
        body: step.body,
        timeout: step.timeout || 10000
      });

      const responseTime = Date.now() - startTime;

      // Validate response
      let success = true;
      let error: string | undefined;

      if (step.expectedStatus && response.status !== step.expectedStatus) {
        success = false;
        error = `Expected status ${step.expectedStatus}, got ${response.status}`;
      }

      // Run custom checks
      if (step.checks && success) {
        for (const check of step.checks) {
          try {
            const checkPassed = check.condition(response);
            if (!checkPassed) {
              success = false;
              error = `Check failed: ${check.name}`;
              break;
            }
          } catch (checkError) {
            success = false;
            error = `Check error: ${check.name} - ${checkError}`;
            break;
          }
        }
      }

      return {
        scenario: scenarioName,
        step: step.name,
        success,
        responseTime,
        statusCode: response.status,
        error
      };

    } catch (requestError) {
      return {
        scenario: scenarioName,
        step: step.name,
        success: false,
        responseTime: Date.now() - startTime,
        error: requestError instanceof Error ? requestError.message : String(requestError)
      };
    }
  }

  private async makeHttpRequest(
    method: string,
    url: string,
    options: {
      headers?: Record<string, string>
      body?: any
      timeout?: number
    }
  ): Promise<{ status: number; body: string; headers: Record<string, string> }> {
    // Mock HTTP request implementation
    // In a real implementation, this would use fetch or axios

    const delay = Math.random() * 1000 + 100; // Random delay between 100-1100ms
    await this.sleep(delay);

    // Mock response based on URL patterns
    if (url.includes('/api/')) {
      // API endpoints
      if (url.includes('/auth/login')) {
        return {
          status: 200,
          body: JSON.stringify({ success: true, token: 'mock-token' }),
          headers: { 'content-type': 'application/json' }
        };
      } else if (url.includes('/products')) {
        return {
          status: 200,
          body: JSON.stringify({
            results: [
              { id: 1, name: 'Product 1' },
              { id: 2, name: 'Product 2' }
            ],
            total: 2
          }),
          headers: { 'content-type': 'application/json' }
        };
      } else if (url.includes('/inquiries')) {
        return {
          status: 201,
          body: JSON.stringify({ success: true, id: Math.random() }),
          headers: { 'content-type': 'application/json' }
        };
      }
    }

    // Static pages
    return {
      status: 200,
      body: `<html><head><title>Test Page</title></head><body>Mock content for ${url}</body></html>`,
      headers: { 'content-type': 'text/html' }
    };
  }

  private startMetricsCollection(): void {
    const metricsInterval = 5000; // Collect metrics every 5 seconds

    const collectMetrics = () => {
      if (!this.isRunning) return;

      const currentTime = Date.now();
      const recentResults = this.results.filter(r => currentTime - r.responseTime < metricsInterval);

      if (recentResults.length === 0) {
        setTimeout(collectMetrics, metricsInterval);
        return;
      }

      const responseTimes = recentResults.map(r => r.responseTime).sort((a, b) => a - b);
      const successfulResults = recentResults.filter(r => r.success);
      const failedResults = recentResults.filter(r => !r.success);

      const metrics: PerformanceMetrics = {
        timestamp: currentTime,
        responseTime: {
          min: Math.min(...responseTimes),
          max: Math.max(...responseTimes),
          avg: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
          p50: this.percentile(responseTimes, 50),
          p95: this.percentile(responseTimes, 95),
          p99: this.percentile(responseTimes, 99)
        },
        throughput: {
          requestsPerSecond: recentResults.length / (metricsInterval / 1000),
          responsesPerSecond: successfulResults.length / (metricsInterval / 1000)
        },
        errors: {
          total: failedResults.length,
          rate: failedResults.length / recentResults.length,
          types: this.categorizeErrors(failedResults)
        },
        users: {
          active: this.activeUsers,
          total: this.config.maxUsers
        },
        resources: {
          cpuUsage: Math.random() * 0.8, // Mock CPU usage
          memoryUsage: Math.random() * 0.6, // Mock memory usage
          networkIO: recentResults.length * 1024 // Mock network I/O
        }
      };

      this.metrics.push(metrics);
      setTimeout(collectMetrics, metricsInterval);
    };

    collectMetrics();
  }

  private percentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[Math.min(index, values.length - 1)];
  }

  private categorizeErrors(failedResults: PerformanceTestResult[]): Record<string, number> {
    const errorTypes: Record<string, number> = {};

    failedResults.forEach(result => {
      let category = 'unknown';

      if (result.error) {
        if (result.error.includes('timeout')) {
          category = 'timeout';
        } else if (result.error.includes('status')) {
          category = 'http_error';
        } else if (result.error.includes('network')) {
          category = 'network_error';
        } else if (result.error.includes('Check failed')) {
          category = 'validation_error';
        }
      }

      errorTypes[category] = (errorTypes[category] || 0) + 1;
    });

    return errorTypes;
  }

  // Report generation
  private generateReport(): PerformanceReport {
    const totalRequests = this.results.length;
    const successfulRequests = this.results.filter(r => r.success).length;
    const failedRequests = totalRequests - successfulRequests;

    const allResponseTimes = this.results.map(r => r.responseTime);
    const averageResponseTime = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;
    const maxResponseTime = Math.max(...allResponseTimes);

    const duration = Date.now() - this.startTime;
    const requestsPerSecond = totalRequests / (duration / 1000);
    const errorRate = failedRequests / totalRequests;

    // Group results by scenario
    const scenarioResults = this.config.scenarios.map(scenario => ({
      name: scenario.name,
      results: this.results.filter(r => r.scenario === scenario.name),
      metrics: this.calculateScenarioMetrics(scenario.name)
    }));

    // Check threshold violations
    const thresholdViolations = this.checkThresholdViolations({
      averageResponseTime,
      maxResponseTime,
      requestsPerSecond,
      errorRate
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      averageResponseTime,
      maxResponseTime,
      requestsPerSecond,
      errorRate,
      thresholdViolations
    });

    return {
      timestamp: Date.now(),
      duration,
      configuration: this.config,
      summary: {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime,
        maxResponseTime,
        requestsPerSecond,
        errorRate
      },
      metrics: this.metrics,
      thresholdViolations,
      recommendations,
      scenarioResults
    };
  }

  private calculateScenarioMetrics(scenarioName: string): PerformanceMetrics {
    const scenarioResults = this.results.filter(r => r.scenario === scenarioName);
    const responseTimes = scenarioResults.map(r => r.responseTime).sort((a, b) => a - b);
    const successfulResults = scenarioResults.filter(r => r.success);
    const failedResults = scenarioResults.filter(r => !r.success);

    const duration = Date.now() - this.startTime;

    return {
      timestamp: Date.now(),
      responseTime: {
        min: Math.min(...responseTimes) || 0,
        max: Math.max(...responseTimes) || 0,
        avg: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0,
        p50: this.percentile(responseTimes, 50),
        p95: this.percentile(responseTimes, 95),
        p99: this.percentile(responseTimes, 99)
      },
      throughput: {
        requestsPerSecond: scenarioResults.length / (duration / 1000),
        responsesPerSecond: successfulResults.length / (duration / 1000)
      },
      errors: {
        total: failedResults.length,
        rate: failedResults.length / scenarioResults.length || 0,
        types: this.categorizeErrors(failedResults)
      },
      users: {
        active: this.activeUsers,
        total: this.config.maxUsers
      },
      resources: {
        cpuUsage: 0.5, // Mock value
        memoryUsage: 0.4, // Mock value
        networkIO: scenarioResults.length * 1024
      }
    };
  }

  private checkThresholdViolations(summary: {
    averageResponseTime: number
    maxResponseTime: number
    requestsPerSecond: number
    errorRate: number
  }): string[] {
    const violations: string[] = [];
    const thresholds = this.config.thresholds;

    if (summary.maxResponseTime > thresholds.responseTime!.max) {
      violations.push(`Maximum response time (${summary.maxResponseTime}ms) exceeds threshold (${thresholds.responseTime!.max}ms)`);
    }

    const p95ResponseTime = this.metrics.length > 0 ?
      Math.max(...this.metrics.map(m => m.responseTime.p95)) : 0;

    if (p95ResponseTime > thresholds.responseTime!.p95) {
      violations.push(`95th percentile response time (${p95ResponseTime}ms) exceeds threshold (${thresholds.responseTime!.p95}ms)`);
    }

    if (summary.requestsPerSecond < thresholds.throughput!.min) {
      violations.push(`Throughput (${summary.requestsPerSecond.toFixed(2)} RPS) below minimum threshold (${thresholds.throughput!.min} RPS)`);
    }

    if (summary.errorRate > thresholds.errorRate!.max) {
      violations.push(`Error rate (${(summary.errorRate * 100).toFixed(2)}%) exceeds threshold (${(thresholds.errorRate!.max * 100).toFixed(2)}%)`);
    }

    // Check resource utilization
    const maxCpuUsage = this.metrics.length > 0 ?
      Math.max(...this.metrics.map(m => m.resources.cpuUsage)) : 0;

    if (maxCpuUsage > thresholds.resourceUtilization!.cpu) {
      violations.push(`CPU usage (${(maxCpuUsage * 100).toFixed(1)}%) exceeds threshold (${(thresholds.resourceUtilization!.cpu * 100).toFixed(1)}%)`);
    }

    return violations;
  }

  private generateRecommendations(summary: {
    averageResponseTime: number
    maxResponseTime: number
    requestsPerSecond: number
    errorRate: number
    thresholdViolations: string[]
  }): string[] {
    const recommendations: string[] = [];

    // Performance recommendations
    if (summary.averageResponseTime > 2000) {
      recommendations.push('Optimize slow endpoints - average response time is high');
      recommendations.push('Consider implementing caching strategies');
      recommendations.push('Review database query performance');
    }

    if (summary.maxResponseTime > 10000) {
      recommendations.push('Investigate extremely slow responses - some requests are taking over 10 seconds');
    }

    if (summary.requestsPerSecond < 50) {
      recommendations.push('Consider horizontal scaling to improve throughput');
      recommendations.push('Optimize server configuration for higher concurrency');
    }

    if (summary.errorRate > 0.01) {
      recommendations.push('Investigate and fix errors to improve reliability');
      recommendations.push('Implement better error handling and retry mechanisms');
    }

    // Scenario-specific recommendations
    const failuresByScenario = new Map<string, number>();
    this.results.filter(r => !r.success).forEach(r => {
      failuresByScenario.set(r.scenario, (failuresByScenario.get(r.scenario) || 0) + 1);
    });

    const worstScenario = Array.from(failuresByScenario.entries())
      .sort(([,a], [,b]) => b - a)[0];

    if (worstScenario && worstScenario[1] > 10) {
      recommendations.push(`Focus optimization efforts on "${worstScenario[0]}" scenario (${worstScenario[1]} failures)`);
    }

    // Resource recommendations
    const avgCpuUsage = this.metrics.reduce((sum, m) => sum + m.resources.cpuUsage, 0) / this.metrics.length;
    if (avgCpuUsage > 0.7) {
      recommendations.push('High CPU usage detected - consider optimizing computational workloads');
    }

    const avgMemoryUsage = this.metrics.reduce((sum, m) => sum + m.resources.memoryUsage, 0) / this.metrics.length;
    if (avgMemoryUsage > 0.7) {
      recommendations.push('High memory usage detected - investigate memory leaks and optimize memory allocation');
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable thresholds');
      recommendations.push('Continue monitoring and establish baseline metrics');
    } else {
      recommendations.push('Set up continuous performance monitoring');
      recommendations.push('Implement automated performance testing in CI/CD pipeline');
    }

    return recommendations;
  }

  private printSummary(report: PerformanceReport): void {
    const summary = report.summary;

    console.log('\n📈 Performance Test Summary:');
    console.log(`   Duration: ${(report.duration / 1000).toFixed(1)}s`);
    console.log(`   Total Requests: ${summary.totalRequests}`);
    console.log(`   Successful: ${summary.successfulRequests} (${((summary.successfulRequests / summary.totalRequests) * 100).toFixed(1)}%)`);
    console.log(`   Failed: ${summary.failedRequests} (${((summary.failedRequests / summary.totalRequests) * 100).toFixed(1)}%)`);
    console.log(`   Average Response Time: ${summary.averageResponseTime.toFixed(0)}ms`);
    console.log(`   Max Response Time: ${summary.maxResponseTime.toFixed(0)}ms`);
    console.log(`   Throughput: ${summary.requestsPerSecond.toFixed(1)} requests/second`);

    if (report.thresholdViolations.length > 0) {
      console.log('\n⚠️  Threshold Violations:');
      report.thresholdViolations.forEach(violation => {
        console.log(`   • ${violation}`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(recommendation => {
        console.log(`   • ${recommendation}`);
      });
    }

    console.log('\n📊 Scenario Performance:');
    report.scenarioResults.forEach(scenario => {
      const scenarioSummary = {
        total: scenario.results.length,
        successful: scenario.results.filter(r => r.success).length,
        avgResponseTime: scenario.results.reduce((sum, r) => sum + r.responseTime, 0) / scenario.results.length
      };

      console.log(`   ${scenario.name}:`);
      console.log(`     Requests: ${scenarioSummary.successful}/${scenarioSummary.total}`);
      console.log(`     Avg Response Time: ${scenarioSummary.avgResponseTime.toFixed(0)}ms`);
      console.log(`     Success Rate: ${((scenarioSummary.successful / scenarioSummary.total) * 100).toFixed(1)}%`);
    });
  }

  // Utility methods
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public stop(): void {
    this.isRunning = false;
    console.log('🛑 Performance test stopped.');
  }

  public getResults(): PerformanceTestResult[] {
    return [...this.results];
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

// Specialized test types
export class StressTest extends PerformanceTester {
  constructor(config: PerformanceTestConfig = {}) {
    super({
      ...config,
      maxUsers: config.maxUsers || 500,
      duration: config.duration || 600000, // 10 minutes
      rampUpTime: config.rampUpTime || 120000, // 2 minutes
    });
  }
}

export class SpikeTest extends PerformanceTester {
  constructor(config: PerformanceTestConfig = {}) {
    super({
      ...config,
      maxUsers: config.maxUsers || 1000,
      duration: config.duration || 60000, // 1 minute
      rampUpTime: config.rampUpTime || 10000, // 10 seconds - very fast ramp-up
    });
  }
}

export class EnduranceTest extends PerformanceTester {
  constructor(config: PerformanceTestConfig = {}) {
    super({
      ...config,
      maxUsers: config.maxUsers || 100,
      duration: config.duration || 3600000, // 1 hour
      rampUpTime: config.rampUpTime || 300000, // 5 minutes
    });
  }
}

// Factory functions
export function createLoadTest(config?: PerformanceTestConfig): PerformanceTester {
  return new PerformanceTester(config);
}

export function createStressTest(config?: PerformanceTestConfig): StressTest {
  return new StressTest(config);
}

export function createSpikeTest(config?: PerformanceTestConfig): SpikeTest {
  return new SpikeTest(config);
}

export function createEnduranceTest(config?: PerformanceTestConfig): EnduranceTest {
  return new EnduranceTest(config);
}

export default PerformanceTester;
