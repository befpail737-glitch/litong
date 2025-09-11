/**
 * Production Monitoring and Alerting System
 * Comprehensive monitoring for deployed electronics distributor website
 *
 * Features:
 * - Application performance monitoring (APM)
 * - Server and infrastructure monitoring
 * - Database performance monitoring
 * - User experience monitoring
 * - Alert management and escalation
 * - Dashboard and reporting system
 */

export interface MonitoringConfig {
  application: {
    healthCheckEndpoints: HealthCheckEndpoint[]
    performanceThresholds: PerformanceThresholds
    errorTracking: ErrorTrackingConfig
    userExperienceMonitoring: UEMConfig
  }
  infrastructure: {
    serverMetrics: ServerMetricsConfig
    databaseMetrics: DatabaseMetricsConfig
    cdnMetrics: CDNMetricsConfig
    thirdPartyServices: ThirdPartyServiceConfig[]
  }
  alerting: {
    channels: AlertChannel[]
    rules: AlertRule[]
    escalationPolicies: EscalationPolicy[]
    silencingRules: SilencingRule[]
  }
  dashboard: {
    widgets: DashboardWidget[]
    customMetrics: CustomMetric[]
    reportSchedules: ReportSchedule[]
  }
}

export interface HealthCheckEndpoint {
  name: string
  url: string
  method: 'GET' | 'POST' | 'HEAD'
  expectedStatusCode: number
  expectedResponseTime: number
  headers?: Record<string, string>
  body?: string
  interval: number
  timeout: number
  retries: number
}

export interface PerformanceThresholds {
  responseTime: {
    p50: number
    p95: number
    p99: number
  }
  throughput: {
    requestsPerSecond: number
    concurrent: number
  }
  errorRate: {
    warning: number
    critical: number
  }
  availability: {
    target: number // e.g., 99.9%
    windowSize: number // in minutes
  }
}

export interface ErrorTrackingConfig {
  enabled: boolean
  sampleRate: number
  ignoreErrors: string[]
  groupingKeys: string[]
  notifications: {
    newError: boolean
    errorSpike: boolean
    errorResolution: boolean
  }
}

export interface UEMConfig {
  realUserMonitoring: {
    enabled: boolean
    sampleRate: number
    trackPageViews: boolean
    trackUserInteractions: boolean
    trackPerformanceMetrics: boolean
  }
  syntheticMonitoring: {
    enabled: boolean
    locations: string[]
    frequency: number
    scenarios: SyntheticScenario[]
  }
}

export interface SyntheticScenario {
  name: string
  steps: SyntheticStep[]
  frequency: number
  locations: string[]
}

export interface SyntheticStep {
  type: 'navigate' | 'click' | 'type' | 'wait' | 'assert'
  selector?: string
  value?: string
  timeout?: number
  assertion?: {
    type: 'text' | 'element' | 'status'
    expected: any
  }
}

export interface ServerMetricsConfig {
  cpu: {
    enabled: boolean
    warningThreshold: number
    criticalThreshold: number
  }
  memory: {
    enabled: boolean
    warningThreshold: number
    criticalThreshold: number
  }
  disk: {
    enabled: boolean
    warningThreshold: number
    criticalThreshold: number
  }
  network: {
    enabled: boolean
    bandwidthThreshold: number
  }
}

export interface DatabaseMetricsConfig {
  connectionPool: {
    enabled: boolean
    maxConnections: number
    warningThreshold: number
  }
  queryPerformance: {
    enabled: boolean
    slowQueryThreshold: number
    lockWaitThreshold: number
  }
  storage: {
    enabled: boolean
    sizeThreshold: number
    growthRate: number
  }
}

export interface CDNMetricsConfig {
  cacheHitRate: {
    enabled: boolean
    threshold: number
  }
  originRequestRate: {
    enabled: boolean
    threshold: number
  }
  errorRate: {
    enabled: boolean
    threshold: number
  }
}

export interface ThirdPartyServiceConfig {
  name: string
  url: string
  timeout: number
  expectedResponseTime: number
  criticality: 'high' | 'medium' | 'low'
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'pagerduty' | 'sms'
  name: string
  config: any
  enabled: boolean
}

export interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  condition: string
  threshold: number
  duration: number
  severity: 'info' | 'warning' | 'critical'
  channels: string[]
  enabled: boolean
  labels?: Record<string, string>
}

export interface EscalationPolicy {
  id: string
  name: string
  rules: EscalationRule[]
  enabled: boolean
}

export interface EscalationRule {
  delayMinutes: number
  channels: string[]
  assignees: string[]
}

export interface SilencingRule {
  id: string
  name: string
  pattern: string
  duration: number
  reason: string
  enabled: boolean
}

export interface DashboardWidget {
  id: string
  type: 'chart' | 'number' | 'table' | 'status'
  title: string
  metrics: string[]
  timeRange: string
  refreshInterval: number
  size: 'small' | 'medium' | 'large'
}

export interface CustomMetric {
  name: string
  query: string
  unit: string
  description: string
}

export interface ReportSchedule {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  metrics: string[]
  enabled: boolean
}

export interface Alert {
  id: string
  ruleId: string
  metric: string
  currentValue: number
  threshold: number
  severity: 'info' | 'warning' | 'critical'
  status: 'active' | 'resolved' | 'silenced'
  startTime: Date
  endTime?: Date
  description: string
  labels: Record<string, string>
}

export interface Metric {
  name: string
  value: number
  timestamp: Date
  labels: Record<string, string>
}

export class MonitoringSystem {
  private config: MonitoringConfig;
  private activeAlerts: Map<string, Alert> = new Map();
  private metrics: Map<string, Metric[]> = new Map();
  private healthCheckStatus: Map<string, boolean> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  // Health Check System
  public async startHealthChecks(): Promise<void> {
    console.log('Starting health check monitoring...');

    for (const endpoint of this.config.application.healthCheckEndpoints) {
      this.scheduleHealthCheck(endpoint);
    }

    console.log(`Health checks started for ${this.config.application.healthCheckEndpoints.length} endpoints`);
  }

  private scheduleHealthCheck(endpoint: HealthCheckEndpoint): void {
    const checkHealth = async () => {
      const isHealthy = await this.performHealthCheck(endpoint);
      const previousStatus = this.healthCheckStatus.get(endpoint.name);

      this.healthCheckStatus.set(endpoint.name, isHealthy);

      // Trigger alert if status changed
      if (previousStatus !== undefined && previousStatus !== isHealthy) {
        if (!isHealthy) {
          await this.triggerAlert({
            metric: 'health_check_failed',
            currentValue: 0,
            threshold: 1,
            severity: 'critical',
            description: `Health check failed for ${endpoint.name}: ${endpoint.url}`,
            labels: {
              endpoint: endpoint.name,
              url: endpoint.url
            }
          });
        } else {
          await this.resolveAlert(`health_check_${endpoint.name}`);
        }
      }

      // Record metric
      this.recordMetric('health_check_status', isHealthy ? 1 : 0, {
        endpoint: endpoint.name,
        url: endpoint.url
      });
    };

    // Initial check
    checkHealth();

    // Schedule recurring checks
    setInterval(checkHealth, endpoint.interval);
  }

  private async performHealthCheck(endpoint: HealthCheckEndpoint): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Mock HTTP request - in real implementation, use actual HTTP client
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

      const responseTime = Date.now() - startTime;
      const success = responseTime < endpoint.expectedResponseTime && Math.random() > 0.02; // 2% failure rate for demo

      this.recordMetric('health_check_response_time', responseTime, {
        endpoint: endpoint.name
      });

      console.log(`Health check ${endpoint.name}: ${success ? 'PASS' : 'FAIL'} (${responseTime}ms)`);
      return success;

    } catch (error) {
      console.error(`Health check failed for ${endpoint.name}:`, error);
      return false;
    }
  }

  // Application Performance Monitoring
  public startAPMMonitoring(): void {
    console.log('Starting application performance monitoring...');

    // Start performance metrics collection
    this.startPerformanceMetricsCollection();

    // Start error tracking
    this.startErrorTracking();

    // Start user experience monitoring
    this.startUEMMonitoring();

    console.log('APM monitoring started');
  }

  private startPerformanceMetricsCollection(): void {
    setInterval(() => {
      // Mock performance metrics
      const responseTimeP50 = Math.random() * 200 + 100; // 100-300ms
      const responseTimeP95 = Math.random() * 500 + 300; // 300-800ms
      const responseTimeP99 = Math.random() * 1000 + 500; // 500-1500ms
      const throughput = Math.random() * 1000 + 500; // 500-1500 req/s
      const errorRate = Math.random() * 2; // 0-2%

      this.recordMetric('response_time_p50', responseTimeP50);
      this.recordMetric('response_time_p95', responseTimeP95);
      this.recordMetric('response_time_p99', responseTimeP99);
      this.recordMetric('throughput', throughput);
      this.recordMetric('error_rate', errorRate);

      // Check thresholds
      this.checkPerformanceThresholds({
        p50: responseTimeP50,
        p95: responseTimeP95,
        p99: responseTimeP99,
        throughput,
        errorRate
      });
    }, 60000); // Every minute
  }

  private checkPerformanceThresholds(metrics: any): void {
    const thresholds = this.config.application.performanceThresholds;

    if (metrics.p95 > thresholds.responseTime.p95) {
      this.triggerAlert({
        metric: 'response_time_p95',
        currentValue: metrics.p95,
        threshold: thresholds.responseTime.p95,
        severity: 'warning',
        description: `Response time P95 exceeded threshold: ${metrics.p95}ms > ${thresholds.responseTime.p95}ms`,
        labels: { metric_type: 'response_time' }
      });
    }

    if (metrics.errorRate > thresholds.errorRate.critical) {
      this.triggerAlert({
        metric: 'error_rate',
        currentValue: metrics.errorRate,
        threshold: thresholds.errorRate.critical,
        severity: 'critical',
        description: `Error rate exceeded critical threshold: ${metrics.errorRate}% > ${thresholds.errorRate.critical}%`,
        labels: { metric_type: 'error_rate' }
      });
    }
  }

  private startErrorTracking(): void {
    if (!this.config.application.errorTracking.enabled) return;

    console.log('Starting error tracking...');

    // Mock error generation for demonstration
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of error
        this.trackError({
          type: 'application_error',
          message: 'Sample error for monitoring demo',
          stack: 'Error stack trace...',
          url: '/api/products',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date()
        });
      }
    }, 10000);
  }

  private trackError(error: any): void {
    console.log('Error tracked:', error.message);

    this.recordMetric('error_count', 1, {
      error_type: error.type,
      url: error.url
    });

    // Trigger alert for new errors
    if (this.config.application.errorTracking.notifications.newError) {
      this.triggerAlert({
        metric: 'new_error',
        currentValue: 1,
        threshold: 1,
        severity: 'warning',
        description: `New error detected: ${error.message}`,
        labels: {
          error_type: error.type,
          url: error.url
        }
      });
    }
  }

  private startUEMMonitoring(): void {
    const uemConfig = this.config.application.userExperienceMonitoring;

    if (uemConfig.realUserMonitoring.enabled) {
      console.log('Starting real user monitoring...');
      this.startRealUserMonitoring();
    }

    if (uemConfig.syntheticMonitoring.enabled) {
      console.log('Starting synthetic monitoring...');
      this.startSyntheticMonitoring();
    }
  }

  private startRealUserMonitoring(): void {
    setInterval(() => {
      // Mock RUM metrics
      const pageLoadTime = Math.random() * 3000 + 1000; // 1-4 seconds
      const domContentLoaded = Math.random() * 2000 + 500; // 0.5-2.5 seconds
      const firstContentfulPaint = Math.random() * 2000 + 800; // 0.8-2.8 seconds

      this.recordMetric('page_load_time', pageLoadTime, { source: 'rum' });
      this.recordMetric('dom_content_loaded', domContentLoaded, { source: 'rum' });
      this.recordMetric('first_contentful_paint', firstContentfulPaint, { source: 'rum' });
    }, 30000); // Every 30 seconds
  }

  private startSyntheticMonitoring(): void {
    for (const scenario of this.config.application.userExperienceMonitoring.syntheticMonitoring.scenarios) {
      this.scheduleSyntheticScenario(scenario);
    }
  }

  private scheduleSyntheticScenario(scenario: SyntheticScenario): void {
    const executeScenario = async () => {
      const startTime = Date.now();

      try {
        for (const step of scenario.steps) {
          await this.executeSyntheticStep(step);
        }

        const duration = Date.now() - startTime;
        this.recordMetric('synthetic_scenario_duration', duration, {
          scenario: scenario.name,
          status: 'success'
        });

        console.log(`Synthetic scenario '${scenario.name}' completed successfully in ${duration}ms`);

      } catch (error) {
        const duration = Date.now() - startTime;
        this.recordMetric('synthetic_scenario_duration', duration, {
          scenario: scenario.name,
          status: 'failure'
        });

        this.triggerAlert({
          metric: 'synthetic_scenario_failed',
          currentValue: 1,
          threshold: 1,
          severity: 'warning',
          description: `Synthetic scenario '${scenario.name}' failed: ${error.message}`,
          labels: {
            scenario: scenario.name
          }
        });

        console.error(`Synthetic scenario '${scenario.name}' failed:`, error);
      }
    };

    // Initial execution
    executeScenario();

    // Schedule recurring executions
    setInterval(executeScenario, scenario.frequency);
  }

  private async executeSyntheticStep(step: SyntheticStep): Promise<void> {
    // Mock synthetic step execution
    console.log(`Executing synthetic step: ${step.type}`);

    const executionTime = Math.random() * 1000 + 200; // 200-1200ms
    await new Promise(resolve => setTimeout(resolve, executionTime));

    // Simulate random failures
    if (Math.random() < 0.02) { // 2% failure rate
      throw new Error(`Synthetic step failed: ${step.type}`);
    }
  }

  // Infrastructure Monitoring
  public startInfrastructureMonitoring(): void {
    console.log('Starting infrastructure monitoring...');

    this.startServerMetricsCollection();
    this.startDatabaseMonitoring();
    this.startCDNMonitoring();
    this.startThirdPartyServiceMonitoring();

    console.log('Infrastructure monitoring started');
  }

  private startServerMetricsCollection(): void {
    setInterval(() => {
      // Mock server metrics
      const cpuUsage = Math.random() * 80 + 10; // 10-90%
      const memoryUsage = Math.random() * 85 + 10; // 10-95%
      const diskUsage = Math.random() * 70 + 20; // 20-90%
      const networkIn = Math.random() * 1000 + 100; // 100-1100 Mbps
      const networkOut = Math.random() * 500 + 50; // 50-550 Mbps

      this.recordMetric('cpu_usage', cpuUsage, { server: 'web-server-1' });
      this.recordMetric('memory_usage', memoryUsage, { server: 'web-server-1' });
      this.recordMetric('disk_usage', diskUsage, { server: 'web-server-1' });
      this.recordMetric('network_in', networkIn, { server: 'web-server-1' });
      this.recordMetric('network_out', networkOut, { server: 'web-server-1' });

      // Check thresholds
      this.checkServerMetricThresholds({ cpuUsage, memoryUsage, diskUsage });
    }, 60000); // Every minute
  }

  private checkServerMetricThresholds(metrics: any): void {
    const serverConfig = this.config.infrastructure.serverMetrics;

    if (serverConfig.cpu.enabled && metrics.cpuUsage > serverConfig.cpu.criticalThreshold) {
      this.triggerAlert({
        metric: 'cpu_usage',
        currentValue: metrics.cpuUsage,
        threshold: serverConfig.cpu.criticalThreshold,
        severity: 'critical',
        description: `CPU usage critical: ${metrics.cpuUsage}% > ${serverConfig.cpu.criticalThreshold}%`,
        labels: { server: 'web-server-1' }
      });
    }

    if (serverConfig.memory.enabled && metrics.memoryUsage > serverConfig.memory.criticalThreshold) {
      this.triggerAlert({
        metric: 'memory_usage',
        currentValue: metrics.memoryUsage,
        threshold: serverConfig.memory.criticalThreshold,
        severity: 'critical',
        description: `Memory usage critical: ${metrics.memoryUsage}% > ${serverConfig.memory.criticalThreshold}%`,
        labels: { server: 'web-server-1' }
      });
    }
  }

  private startDatabaseMonitoring(): void {
    setInterval(() => {
      // Mock database metrics
      const connectionCount = Math.floor(Math.random() * 50 + 10); // 10-60 connections
      const slowQueries = Math.floor(Math.random() * 5); // 0-5 slow queries
      const lockWaitTime = Math.random() * 100 + 10; // 10-110ms
      const databaseSize = Math.random() * 1000 + 5000; // 5-6GB

      this.recordMetric('db_connections', connectionCount, { database: 'main' });
      this.recordMetric('db_slow_queries', slowQueries, { database: 'main' });
      this.recordMetric('db_lock_wait_time', lockWaitTime, { database: 'main' });
      this.recordMetric('db_size', databaseSize, { database: 'main' });

      // Check thresholds
      this.checkDatabaseMetricThresholds({ connectionCount, slowQueries, lockWaitTime });
    }, 60000); // Every minute
  }

  private checkDatabaseMetricThresholds(metrics: any): void {
    const dbConfig = this.config.infrastructure.databaseMetrics;

    if (dbConfig.connectionPool.enabled &&
        metrics.connectionCount > dbConfig.connectionPool.warningThreshold) {
      this.triggerAlert({
        metric: 'db_connections',
        currentValue: metrics.connectionCount,
        threshold: dbConfig.connectionPool.warningThreshold,
        severity: 'warning',
        description: `Database connection count high: ${metrics.connectionCount} > ${dbConfig.connectionPool.warningThreshold}`,
        labels: { database: 'main' }
      });
    }
  }

  private startCDNMonitoring(): void {
    setInterval(() => {
      // Mock CDN metrics
      const cacheHitRate = Math.random() * 30 + 70; // 70-100%
      const originRequestRate = Math.random() * 20 + 5; // 5-25%
      const errorRate = Math.random() * 1; // 0-1%

      this.recordMetric('cdn_cache_hit_rate', cacheHitRate);
      this.recordMetric('cdn_origin_request_rate', originRequestRate);
      this.recordMetric('cdn_error_rate', errorRate);
    }, 300000); // Every 5 minutes
  }

  private startThirdPartyServiceMonitoring(): void {
    for (const service of this.config.infrastructure.thirdPartyServices) {
      this.scheduleThirdPartyServiceCheck(service);
    }
  }

  private scheduleThirdPartyServiceCheck(service: ThirdPartyServiceConfig): void {
    const checkService = async () => {
      const startTime = Date.now();
      const isHealthy = Math.random() > 0.05; // 95% uptime
      const responseTime = Math.random() * 2000 + 100; // 100-2100ms

      this.recordMetric('third_party_service_response_time', responseTime, {
        service: service.name
      });

      this.recordMetric('third_party_service_status', isHealthy ? 1 : 0, {
        service: service.name
      });

      if (!isHealthy || responseTime > service.expectedResponseTime) {
        const severity = service.criticality === 'high' ? 'critical' : 'warning';
        this.triggerAlert({
          metric: 'third_party_service_issue',
          currentValue: isHealthy ? responseTime : 0,
          threshold: service.expectedResponseTime,
          severity,
          description: `Third-party service issue: ${service.name}`,
          labels: {
            service: service.name,
            criticality: service.criticality
          }
        });
      }
    };

    // Initial check
    checkService();

    // Schedule recurring checks
    setInterval(checkService, 300000); // Every 5 minutes
  }

  // Alert Management
  private async triggerAlert(alertData: Partial<Alert>): Promise<string> {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const alert: Alert = {
      id: alertId,
      ruleId: 'auto-generated',
      startTime: new Date(),
      status: 'active',
      ...alertData
    } as Alert;

    this.activeAlerts.set(alertId, alert);

    console.log(`🚨 ALERT TRIGGERED: ${alert.description}`);

    // Send notifications
    await this.sendAlertNotifications(alert);

    return alertId;
  }

  private async resolveAlert(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.endTime = new Date();

      console.log(`✅ ALERT RESOLVED: ${alert.description}`);

      await this.sendAlertNotifications(alert);
    }
  }

  private async sendAlertNotifications(alert: Alert): Promise<void> {
    // Find matching alert rules and send notifications
    for (const channel of this.config.alerting.channels) {
      if (channel.enabled) {
        await this.sendNotification(channel, alert);
      }
    }
  }

  private async sendNotification(channel: AlertChannel, alert: Alert): Promise<void> {
    const message = this.formatAlertMessage(alert);

    switch (channel.type) {
      case 'slack':
        console.log(`Sending Slack notification to ${channel.name}: ${message}`);
        break;
      case 'email':
        console.log(`Sending email notification to ${channel.name}: ${message}`);
        break;
      case 'webhook':
        console.log(`Sending webhook notification to ${channel.name}: ${message}`);
        break;
      case 'pagerduty':
        console.log(`Sending PagerDuty notification to ${channel.name}: ${message}`);
        break;
      case 'sms':
        console.log(`Sending SMS notification to ${channel.name}: ${message}`);
        break;
    }

    // Mock notification delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private formatAlertMessage(alert: Alert): string {
    const status = alert.status === 'resolved' ? '✅ RESOLVED' : '🚨 ACTIVE';
    const severity = alert.severity.toUpperCase();

    return `${status} [${severity}] ${alert.description}
Metric: ${alert.metric}
Current: ${alert.currentValue}
Threshold: ${alert.threshold}
Started: ${alert.startTime.toISOString()}
${alert.endTime ? `Resolved: ${alert.endTime.toISOString()}` : ''}
`;
  }

  // Metrics Management
  private recordMetric(name: string, value: number, labels: Record<string, string> = {}): void {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      labels
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(metric);

    // Keep only last 1000 data points per metric
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }
  }

  public getMetric(name: string, timeRange?: { start: Date; end: Date }): Metric[] {
    const metrics = this.metrics.get(name) || [];

    if (!timeRange) {
      return metrics;
    }

    return metrics.filter(metric =>
      metric.timestamp >= timeRange.start &&
      metric.timestamp <= timeRange.end
    );
  }

  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.status === 'active');
  }

  public getHealthStatus(): Record<string, boolean> {
    return Object.fromEntries(this.healthCheckStatus.entries());
  }

  // Dashboard and Reporting
  public generateDashboardData(): any {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      overview: {
        healthStatus: this.getOverallHealthStatus(),
        activeAlerts: this.getActiveAlerts().length,
        responseTime: this.getAverageMetric('response_time_p95', oneHourAgo, now),
        errorRate: this.getAverageMetric('error_rate', oneHourAgo, now),
        throughput: this.getAverageMetric('throughput', oneHourAgo, now)
      },
      infrastructure: {
        cpuUsage: this.getAverageMetric('cpu_usage', oneHourAgo, now),
        memoryUsage: this.getAverageMetric('memory_usage', oneHourAgo, now),
        diskUsage: this.getAverageMetric('disk_usage', oneHourAgo, now)
      },
      thirdPartyServices: this.getThirdPartyServiceStatus()
    };
  }

  private getOverallHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const healthStatuses = Array.from(this.healthCheckStatus.values());
    const activeAlerts = this.getActiveAlerts();

    if (healthStatuses.some(status => !status)) {
      return 'unhealthy';
    }

    if (activeAlerts.some(alert => alert.severity === 'critical')) {
      return 'unhealthy';
    }

    if (activeAlerts.length > 0) {
      return 'degraded';
    }

    return 'healthy';
  }

  private getAverageMetric(name: string, start: Date, end: Date): number {
    const metrics = this.getMetric(name, { start, end });
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return Math.round(sum / metrics.length * 100) / 100;
  }

  private getThirdPartyServiceStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};

    for (const service of this.config.infrastructure.thirdPartyServices) {
      const metrics = this.getMetric('third_party_service_status')
        .filter(metric => metric.labels.service === service.name);

      if (metrics.length > 0) {
        status[service.name] = metrics[metrics.length - 1].value === 1;
      } else {
        status[service.name] = true; // Default to healthy if no data
      }
    }

    return status;
  }

  public generateReport(type: 'daily' | 'weekly' | 'monthly'): any {
    const now = new Date();
    let startDate: Date;

    switch (type) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    return {
      period: { start: startDate, end: now },
      availability: this.calculateAvailability(startDate, now),
      performanceSummary: this.calculatePerformanceSummary(startDate, now),
      errorSummary: this.calculateErrorSummary(startDate, now),
      alertSummary: this.calculateAlertSummary(startDate, now),
      trends: this.calculateTrends(startDate, now)
    };
  }

  private calculateAvailability(start: Date, end: Date): number {
    // Mock availability calculation
    return Math.random() * 2 + 98; // 98-100%
  }

  private calculatePerformanceSummary(start: Date, end: Date): any {
    return {
      averageResponseTime: this.getAverageMetric('response_time_p95', start, end),
      maxResponseTime: Math.max(...this.getMetric('response_time_p95', { start, end }).map(m => m.value)),
      averageThroughput: this.getAverageMetric('throughput', start, end)
    };
  }

  private calculateErrorSummary(start: Date, end: Date): any {
    const errorMetrics = this.getMetric('error_rate', { start, end });

    return {
      averageErrorRate: this.getAverageMetric('error_rate', start, end),
      totalErrors: errorMetrics.reduce((sum, m) => sum + m.value, 0),
      errorSpikes: errorMetrics.filter(m => m.value > 5).length
    };
  }

  private calculateAlertSummary(start: Date, end: Date): any {
    const alerts = Array.from(this.activeAlerts.values())
      .filter(alert => alert.startTime >= start && alert.startTime <= end);

    return {
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      warningAlerts: alerts.filter(a => a.severity === 'warning').length,
      averageResolutionTime: this.calculateAverageResolutionTime(alerts)
    };
  }

  private calculateAverageResolutionTime(alerts: Alert[]): number {
    const resolvedAlerts = alerts.filter(alert => alert.endTime);
    if (resolvedAlerts.length === 0) return 0;

    const totalTime = resolvedAlerts.reduce((sum, alert) =>
      sum + (alert.endTime!.getTime() - alert.startTime.getTime()), 0);

    return Math.round(totalTime / resolvedAlerts.length / 60000); // minutes
  }

  private calculateTrends(start: Date, end: Date): any {
    // Mock trend calculation
    return {
      responseTimeTrend: Math.random() > 0.5 ? 'improving' : 'degrading',
      errorRateTrend: Math.random() > 0.7 ? 'improving' : 'stable',
      availabilityTrend: Math.random() > 0.8 ? 'stable' : 'improving'
    };
  }
}

// Factory function for creating monitoring configuration
export function createProductionMonitoringConfig(): MonitoringConfig {
  return {
    application: {
      healthCheckEndpoints: [
        {
          name: 'Homepage',
          url: 'https://elec-distributor.com',
          method: 'GET',
          expectedStatusCode: 200,
          expectedResponseTime: 2000,
          interval: 60000,
          timeout: 10000,
          retries: 3
        },
        {
          name: 'API Health',
          url: 'https://elec-distributor.com/api/health',
          method: 'GET',
          expectedStatusCode: 200,
          expectedResponseTime: 1000,
          interval: 30000,
          timeout: 5000,
          retries: 2
        },
        {
          name: 'Product Search',
          url: 'https://elec-distributor.com/api/products/search',
          method: 'GET',
          expectedStatusCode: 200,
          expectedResponseTime: 3000,
          interval: 120000,
          timeout: 15000,
          retries: 2
        }
      ],
      performanceThresholds: {
        responseTime: {
          p50: 500,
          p95: 2000,
          p99: 5000
        },
        throughput: {
          requestsPerSecond: 100,
          concurrent: 500
        },
        errorRate: {
          warning: 1,
          critical: 5
        },
        availability: {
          target: 99.9,
          windowSize: 60
        }
      },
      errorTracking: {
        enabled: true,
        sampleRate: 1.0,
        ignoreErrors: ['NetworkError', 'AbortError'],
        groupingKeys: ['error.type', 'error.message', 'url.pathname'],
        notifications: {
          newError: true,
          errorSpike: true,
          errorResolution: false
        }
      },
      userExperienceMonitoring: {
        realUserMonitoring: {
          enabled: true,
          sampleRate: 0.1,
          trackPageViews: true,
          trackUserInteractions: true,
          trackPerformanceMetrics: true
        },
        syntheticMonitoring: {
          enabled: true,
          locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
          frequency: 300000,
          scenarios: [
            {
              name: 'Product Search Journey',
              frequency: 300000,
              locations: ['us-east-1', 'eu-west-1'],
              steps: [
                {
                  type: 'navigate',
                  selector: 'https://elec-distributor.com'
                },
                {
                  type: 'click',
                  selector: '#search-input'
                },
                {
                  type: 'type',
                  selector: '#search-input',
                  value: 'STM32'
                },
                {
                  type: 'click',
                  selector: '#search-button'
                },
                {
                  type: 'assert',
                  assertion: {
                    type: 'element',
                    expected: '.product-results'
                  }
                }
              ]
            }
          ]
        }
      }
    },
    infrastructure: {
      serverMetrics: {
        cpu: {
          enabled: true,
          warningThreshold: 70,
          criticalThreshold: 90
        },
        memory: {
          enabled: true,
          warningThreshold: 80,
          criticalThreshold: 95
        },
        disk: {
          enabled: true,
          warningThreshold: 85,
          criticalThreshold: 95
        },
        network: {
          enabled: true,
          bandwidthThreshold: 1000
        }
      },
      databaseMetrics: {
        connectionPool: {
          enabled: true,
          maxConnections: 100,
          warningThreshold: 80
        },
        queryPerformance: {
          enabled: true,
          slowQueryThreshold: 1000,
          lockWaitThreshold: 500
        },
        storage: {
          enabled: true,
          sizeThreshold: 10000, // 10GB
          growthRate: 20 // 20% per month
        }
      },
      cdnMetrics: {
        cacheHitRate: {
          enabled: true,
          threshold: 85
        },
        originRequestRate: {
          enabled: true,
          threshold: 15
        },
        errorRate: {
          enabled: true,
          threshold: 1
        }
      },
      thirdPartyServices: [
        {
          name: 'Sanity CMS',
          url: 'https://api.sanity.io/health',
          timeout: 5000,
          expectedResponseTime: 1000,
          criticality: 'high'
        },
        {
          name: 'Payment Gateway',
          url: 'https://api.stripe.com/v1/ping',
          timeout: 3000,
          expectedResponseTime: 500,
          criticality: 'high'
        }
      ]
    },
    alerting: {
      channels: [
        {
          type: 'slack',
          name: 'alerts-channel',
          config: {
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            channel: '#alerts'
          },
          enabled: true
        },
        {
          type: 'email',
          name: 'ops-team',
          config: {
            recipients: ['ops@company.com', 'devops@company.com']
          },
          enabled: true
        },
        {
          type: 'pagerduty',
          name: 'critical-alerts',
          config: {
            integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY
          },
          enabled: true
        }
      ],
      rules: [
        {
          id: 'high-error-rate',
          name: 'High Error Rate',
          description: 'Alert when error rate exceeds threshold',
          metric: 'error_rate',
          condition: '>',
          threshold: 5,
          duration: 300, // 5 minutes
          severity: 'critical',
          channels: ['slack', 'email', 'pagerduty'],
          enabled: true
        },
        {
          id: 'slow-response-time',
          name: 'Slow Response Time',
          description: 'Alert when response time is consistently slow',
          metric: 'response_time_p95',
          condition: '>',
          threshold: 3000,
          duration: 600, // 10 minutes
          severity: 'warning',
          channels: ['slack', 'email'],
          enabled: true
        }
      ],
      escalationPolicies: [
        {
          id: 'critical-escalation',
          name: 'Critical Alert Escalation',
          enabled: true,
          rules: [
            {
              delayMinutes: 0,
              channels: ['slack', 'pagerduty'],
              assignees: ['on-call-engineer']
            },
            {
              delayMinutes: 15,
              channels: ['email', 'pagerduty'],
              assignees: ['tech-lead', 'engineering-manager']
            },
            {
              delayMinutes: 30,
              channels: ['email', 'sms'],
              assignees: ['cto']
            }
          ]
        }
      ],
      silencingRules: [
        {
          id: 'maintenance-window',
          name: 'Maintenance Window Silencing',
          pattern: 'maintenance',
          duration: 3600000, // 1 hour
          reason: 'Scheduled maintenance',
          enabled: false
        }
      ]
    },
    dashboard: {
      widgets: [
        {
          id: 'overview-status',
          type: 'status',
          title: 'System Status',
          metrics: ['health_status', 'active_alerts'],
          timeRange: '1h',
          refreshInterval: 30000,
          size: 'medium'
        },
        {
          id: 'response-time-chart',
          type: 'chart',
          title: 'Response Time (P95)',
          metrics: ['response_time_p95'],
          timeRange: '4h',
          refreshInterval: 60000,
          size: 'large'
        },
        {
          id: 'error-rate-number',
          type: 'number',
          title: 'Error Rate',
          metrics: ['error_rate'],
          timeRange: '1h',
          refreshInterval: 60000,
          size: 'small'
        }
      ],
      customMetrics: [
        {
          name: 'business_conversion_rate',
          query: 'inquiries_submitted / unique_visitors',
          unit: '%',
          description: 'Rate of visitors who submit product inquiries'
        }
      ],
      reportSchedules: [
        {
          id: 'daily-ops-report',
          name: 'Daily Operations Report',
          type: 'daily',
          recipients: ['ops@company.com'],
          metrics: ['availability', 'error_rate', 'response_time'],
          enabled: true
        },
        {
          id: 'weekly-executive-report',
          name: 'Weekly Executive Summary',
          type: 'weekly',
          recipients: ['cto@company.com', 'ceo@company.com'],
          metrics: ['availability', 'performance_summary', 'business_metrics'],
          enabled: true
        }
      ]
    }
  };
}
