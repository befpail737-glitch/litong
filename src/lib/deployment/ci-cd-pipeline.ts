/**
 * CI/CD Pipeline Management System
 * Comprehensive automation for continuous integration and deployment
 * 
 * Features:
 * - GitHub Actions workflow configuration
 * - Build process automation with testing integration
 * - Multi-environment deployment pipeline
 * - Rollback mechanism implementation
 * - Deployment monitoring and health checks
 */

export interface CICDConfig {
  repository: {
    owner: string
    name: string
    defaultBranch: string
    accessToken: string
  }
  environments: {
    [key: string]: EnvironmentConfig
  }
  pipeline: {
    buildSteps: BuildStep[]
    testSteps: TestStep[]
    deploymentSteps: DeploymentStep[]
    rollbackSteps: RollbackStep[]
  }
  notifications: {
    slack?: SlackNotificationConfig
    email?: EmailNotificationConfig
    webhook?: WebhookNotificationConfig[]
  }
  quality: {
    codeQuality: CodeQualityConfig
    security: SecurityScanConfig
    performance: PerformanceTestConfig
  }
}

export interface EnvironmentConfig {
  name: string
  url: string
  branch: string
  requiresApproval: boolean
  approvers: string[]
  environmentVariables: Record<string, string>
  deploymentStrategy: 'blue-green' | 'rolling' | 'canary' | 'recreate'
  healthChecks: HealthCheckConfig[]
}

export interface BuildStep {
  name: string
  command: string
  workingDirectory?: string
  environmentVariables?: Record<string, string>
  continueOnError: boolean
  timeout: number
}

export interface TestStep {
  name: string
  type: 'unit' | 'integration' | 'e2e' | 'security' | 'performance'
  command: string
  reportPath?: string
  coverageThreshold?: number
  failOnThreshold: boolean
}

export interface DeploymentStep {
  name: string
  environment: string
  strategy: string
  preDeploymentChecks: string[]
  postDeploymentChecks: string[]
  rollbackTriggers: string[]
}

export interface RollbackStep {
  name: string
  condition: string
  action: string
  notificationRequired: boolean
}

export interface HealthCheckConfig {
  name: string
  url: string
  method: 'GET' | 'POST' | 'HEAD'
  expectedStatusCode: number
  timeout: number
  retries: number
  interval: number
}

export interface SlackNotificationConfig {
  webhookUrl: string
  channel: string
  mentionUsers: string[]
  notifyOn: ('success' | 'failure' | 'start' | 'rollback')[]
}

export interface EmailNotificationConfig {
  smtpConfig: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  recipients: string[]
  notifyOn: ('success' | 'failure' | 'start' | 'rollback')[]
}

export interface WebhookNotificationConfig {
  url: string
  method: 'POST' | 'PUT'
  headers: Record<string, string>
  payload: any
  notifyOn: ('success' | 'failure' | 'start' | 'rollback')[]
}

export interface CodeQualityConfig {
  enabled: boolean
  sonarCloudProjectKey?: string
  eslintConfigPath: string
  prettierConfigPath: string
  qualityGates: {
    coverage: number
    duplicatedLines: number
    maintainabilityRating: string
    reliabilityRating: string
    securityRating: string
  }
}

export interface SecurityScanConfig {
  enabled: boolean
  tools: ('snyk' | 'codeql' | 'dependabot' | 'trivy')[]
  failOnHighSeverity: boolean
  allowedVulnerabilities: string[]
}

export interface PerformanceTestConfig {
  enabled: boolean
  budgets: {
    fcp: number // First Contentful Paint
    lcp: number // Largest Contentful Paint
    cls: number // Cumulative Layout Shift
    bundleSize: number
  }
  lighthouseThresholds: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
}

export interface PipelineExecution {
  id: string
  triggeredBy: string
  branch: string
  commit: string
  environment: string
  status: 'pending' | 'running' | 'success' | 'failure' | 'cancelled'
  startTime: Date
  endTime?: Date
  steps: PipelineStepResult[]
  artifacts: string[]
  logs: string[]
}

export interface PipelineStepResult {
  name: string
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped'
  startTime: Date
  endTime?: Date
  duration?: number
  output: string
  exitCode?: number
}

export class CICDPipeline {
  private config: CICDConfig
  private executions: Map<string, PipelineExecution> = new Map()

  constructor(config: CICDConfig) {
    this.config = config
  }

  // GitHub Actions Workflow Generation
  public generateGitHubActionsWorkflow(): string {
    const workflow = {
      name: 'CI/CD Pipeline',
      on: {
        push: {
          branches: [this.config.repository.defaultBranch, 'develop', 'staging']
        },
        pull_request: {
          branches: [this.config.repository.defaultBranch]
        }
      },
      env: {
        NODE_VERSION: '18',
        NEXT_TELEMETRY_DISABLED: '1'
      },
      jobs: {
        build: this.generateBuildJob(),
        test: this.generateTestJob(),
        'code-quality': this.generateCodeQualityJob(),
        'security-scan': this.generateSecurityScanJob(),
        'deploy-staging': this.generateDeploymentJob('staging'),
        'deploy-production': this.generateDeploymentJob('production')
      }
    }

    return `# Auto-generated GitHub Actions Workflow
# Electronics Distributor Website CI/CD Pipeline

${JSON.stringify(workflow, null, 2).replace(/"/g, '').replace(/\n/g, '\n')}
`
  }

  private generateBuildJob(): any {
    return {
      'runs-on': 'ubuntu-latest',
      'if': "!contains(github.event.head_commit.message, '[skip ci]')",
      strategy: {
        matrix: {
          'node-version': ['18.x', '20.x']
        }
      },
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4'
        },
        {
          name: 'Setup Node.js',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': '${{ matrix.node-version }}',
            'cache': 'npm'
          }
        },
        {
          name: 'Install dependencies',
          run: 'npm ci'
        },
        {
          name: 'Build application',
          run: 'npm run build',
          env: {
            'NEXT_PUBLIC_API_URL': '${{ secrets.NEXT_PUBLIC_API_URL }}',
            'SANITY_PROJECT_ID': '${{ secrets.SANITY_PROJECT_ID }}',
            'SANITY_DATASET': '${{ secrets.SANITY_DATASET }}'
          }
        },
        {
          name: 'Upload build artifacts',
          uses: 'actions/upload-artifact@v4',
          with: {
            name: 'build-files',
            path: 'out/',
            'retention-days': 30
          }
        }
      ]
    }
  }

  private generateTestJob(): any {
    return {
      'runs-on': 'ubuntu-latest',
      needs: 'build',
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4'
        },
        {
          name: 'Setup Node.js',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': '18.x',
            'cache': 'npm'
          }
        },
        {
          name: 'Install dependencies',
          run: 'npm ci'
        },
        {
          name: 'Run unit tests',
          run: 'npm run test:unit -- --coverage'
        },
        {
          name: 'Run integration tests',
          run: 'npm run test:integration'
        },
        {
          name: 'Run E2E tests',
          run: 'npm run test:e2e'
        },
        {
          name: 'Upload test results',
          uses: 'actions/upload-artifact@v4',
          if: 'always()',
          with: {
            name: 'test-results',
            path: 'test-results/'
          }
        },
        {
          name: 'Upload coverage reports',
          uses: 'codecov/codecov-action@v3',
          with: {
            file: './coverage/lcov.info'
          }
        }
      ]
    }
  }

  private generateCodeQualityJob(): any {
    if (!this.config.quality.codeQuality.enabled) {
      return null
    }

    return {
      'runs-on': 'ubuntu-latest',
      needs: 'build',
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4',
          with: {
            'fetch-depth': 0
          }
        },
        {
          name: 'Setup Node.js',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': '18.x',
            'cache': 'npm'
          }
        },
        {
          name: 'Install dependencies',
          run: 'npm ci'
        },
        {
          name: 'Run ESLint',
          run: 'npm run lint:check'
        },
        {
          name: 'Check Prettier formatting',
          run: 'npm run format:check'
        },
        {
          name: 'Run TypeScript check',
          run: 'npx tsc --noEmit'
        },
        {
          name: 'SonarCloud Scan',
          uses: 'SonarSource/sonarcloud-github-action@master',
          env: {
            GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
            SONAR_TOKEN: '${{ secrets.SONAR_TOKEN }}'
          }
        }
      ]
    }
  }

  private generateSecurityScanJob(): any {
    if (!this.config.quality.security.enabled) {
      return null
    }

    return {
      'runs-on': 'ubuntu-latest',
      needs: 'build',
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4'
        },
        {
          name: 'Run Snyk security scan',
          uses: 'snyk/actions/node@master',
          env: {
            SNYK_TOKEN: '${{ secrets.SNYK_TOKEN }}'
          }
        },
        {
          name: 'Initialize CodeQL',
          uses: 'github/codeql-action/init@v3',
          with: {
            languages: 'javascript'
          }
        },
        {
          name: 'Perform CodeQL Analysis',
          uses: 'github/codeql-action/analyze@v3'
        },
        {
          name: 'Run Trivy vulnerability scanner',
          uses: 'aquasecurity/trivy-action@master',
          with: {
            'scan-type': 'fs',
            'scan-ref': '.'
          }
        }
      ]
    }
  }

  private generateDeploymentJob(environment: string): any {
    const envConfig = this.config.environments[environment]
    if (!envConfig) {
      return null
    }

    const job: any = {
      'runs-on': 'ubuntu-latest',
      needs: ['build', 'test', 'code-quality'],
      if: `github.ref == 'refs/heads/${envConfig.branch}'`,
      environment: {
        name: environment,
        url: envConfig.url
      },
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4'
        },
        {
          name: 'Download build artifacts',
          uses: 'actions/download-artifact@v4',
          with: {
            name: 'build-files',
            path: 'out/'
          }
        }
      ]
    }

    // Add approval requirement for production
    if (envConfig.requiresApproval) {
      job.environment.reviewers = envConfig.approvers
    }

    // Add environment-specific deployment steps
    if (environment === 'staging') {
      job.steps.push(
        {
          name: 'Deploy to Cloudflare Pages (Staging)',
          uses: 'cloudflare/pages-action@v1',
          with: {
            'api-token': '${{ secrets.CLOUDFLARE_API_TOKEN }}',
            'account-id': '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
            'project-name': 'elec-distributor-staging',
            directory: 'out'
          }
        }
      )
    } else if (environment === 'production') {
      job.steps.push(
        {
          name: 'Deploy to Cloudflare Pages (Production)',
          uses: 'cloudflare/pages-action@v1',
          with: {
            'api-token': '${{ secrets.CLOUDFLARE_API_TOKEN }}',
            'account-id': '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
            'project-name': 'elec-distributor-website',
            directory: 'out'
          }
        },
        {
          name: 'Purge Cloudflare Cache',
          run: `
            curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
                 -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
                 -H "Content-Type: application/json" \
                 --data '{"purge_everything":true}'
          `
        }
      )
    }

    // Add post-deployment health checks
    job.steps.push(
      {
        name: 'Wait for deployment',
        run: 'sleep 30'
      },
      {
        name: 'Health check',
        run: `
          for i in {1..10}; do
            if curl -f ${envConfig.url}/api/health; then
              echo "Health check passed"
              exit 0
            fi
            echo "Health check failed, retrying in 10s..."
            sleep 10
          done
          exit 1
        `
      }
    )

    return job
  }

  // Pipeline Execution Management
  public async triggerPipeline(options: {
    branch: string
    commit: string
    environment: string
    triggeredBy: string
  }): Promise<string> {
    const executionId = `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    
    const execution: PipelineExecution = {
      id: executionId,
      triggeredBy: options.triggeredBy,
      branch: options.branch,
      commit: options.commit,
      environment: options.environment,
      status: 'pending',
      startTime: new Date(),
      steps: [],
      artifacts: [],
      logs: []
    }

    this.executions.set(executionId, execution)
    
    // Start pipeline execution
    this.executePipeline(executionId).catch(error => {
      console.error(`Pipeline execution failed: ${executionId}`, error)
    })

    console.log(`Pipeline triggered: ${executionId}`)
    return executionId
  }

  private async executePipeline(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`)
    }

    execution.status = 'running'
    execution.logs.push('Pipeline execution started')

    try {
      // Execute build steps
      await this.executeBuildSteps(execution)
      
      // Execute test steps
      await this.executeTestSteps(execution)
      
      // Execute deployment steps
      await this.executeDeploymentSteps(execution)
      
      execution.status = 'success'
      execution.endTime = new Date()
      execution.logs.push('Pipeline execution completed successfully')
      
      await this.sendNotification('success', execution)
      
    } catch (error) {
      execution.status = 'failure'
      execution.endTime = new Date()
      execution.logs.push(`Pipeline execution failed: ${error.message}`)
      
      await this.sendNotification('failure', execution)
      
      // Check if rollback is needed
      if (this.shouldTriggerRollback(execution)) {
        await this.triggerRollback(execution)
      }
    }
  }

  private async executeBuildSteps(execution: PipelineExecution): Promise<void> {
    execution.logs.push('Starting build phase')
    
    for (const step of this.config.pipeline.buildSteps) {
      const stepResult = await this.executeStep(step.name, step.command, execution)
      execution.steps.push(stepResult)
      
      if (stepResult.status === 'failure' && !step.continueOnError) {
        throw new Error(`Build step failed: ${step.name}`)
      }
    }
    
    execution.logs.push('Build phase completed')
  }

  private async executeTestSteps(execution: PipelineExecution): Promise<void> {
    execution.logs.push('Starting test phase')
    
    for (const step of this.config.pipeline.testSteps) {
      const stepResult = await this.executeStep(step.name, step.command, execution)
      execution.steps.push(stepResult)
      
      if (stepResult.status === 'failure' && step.failOnThreshold) {
        throw new Error(`Test step failed: ${step.name}`)
      }
    }
    
    execution.logs.push('Test phase completed')
  }

  private async executeDeploymentSteps(execution: PipelineExecution): Promise<void> {
    execution.logs.push('Starting deployment phase')
    
    for (const step of this.config.pipeline.deploymentSteps) {
      if (step.environment !== execution.environment) {
        continue
      }

      // Run pre-deployment checks
      for (const check of step.preDeploymentChecks) {
        const checkResult = await this.executeStep(`Pre-check: ${check}`, check, execution)
        execution.steps.push(checkResult)
        
        if (checkResult.status === 'failure') {
          throw new Error(`Pre-deployment check failed: ${check}`)
        }
      }

      // Execute deployment
      const deployResult = await this.executeStep(step.name, `deploy-${step.strategy}`, execution)
      execution.steps.push(deployResult)
      
      if (deployResult.status === 'failure') {
        throw new Error(`Deployment failed: ${step.name}`)
      }

      // Run post-deployment checks
      for (const check of step.postDeploymentChecks) {
        const checkResult = await this.executeStep(`Post-check: ${check}`, check, execution)
        execution.steps.push(checkResult)
        
        if (checkResult.status === 'failure') {
          throw new Error(`Post-deployment check failed: ${check}`)
        }
      }
    }
    
    execution.logs.push('Deployment phase completed')
  }

  private async executeStep(name: string, command: string, execution: PipelineExecution): Promise<PipelineStepResult> {
    const startTime = new Date()
    execution.logs.push(`Executing step: ${name}`)
    
    const stepResult: PipelineStepResult = {
      name,
      status: 'running',
      startTime,
      output: ''
    }

    try {
      // Mock step execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500))
      
      // Simulate random failures for demo
      if (Math.random() < 0.05) { // 5% failure rate
        throw new Error(`Command failed: ${command}`)
      }
      
      stepResult.status = 'success'
      stepResult.output = `Successfully executed: ${command}`
      
    } catch (error) {
      stepResult.status = 'failure'
      stepResult.output = error.message
      stepResult.exitCode = 1
    }

    stepResult.endTime = new Date()
    stepResult.duration = stepResult.endTime.getTime() - startTime.getTime()
    
    execution.logs.push(`Step ${name} completed with status: ${stepResult.status}`)
    
    return stepResult
  }

  // Rollback Management
  private shouldTriggerRollback(execution: PipelineExecution): boolean {
    // Check rollback conditions
    const hasDeploymentFailure = execution.steps.some(step => 
      step.name.includes('deploy') && step.status === 'failure'
    )
    
    return hasDeploymentFailure && execution.environment === 'production'
  }

  private async triggerRollback(execution: PipelineExecution): Promise<void> {
    execution.logs.push('Triggering automatic rollback')
    
    for (const rollbackStep of this.config.pipeline.rollbackSteps) {
      const stepResult = await this.executeStep(rollbackStep.name, rollbackStep.action, execution)
      execution.steps.push(stepResult)
      
      if (stepResult.status === 'failure') {
        execution.logs.push(`Rollback step failed: ${rollbackStep.name}`)
        
        if (rollbackStep.notificationRequired) {
          await this.sendNotification('rollback', execution)
        }
      }
    }
    
    execution.logs.push('Rollback process completed')
  }

  // Notification System
  private async sendNotification(type: 'success' | 'failure' | 'start' | 'rollback', execution: PipelineExecution): Promise<void> {
    const message = this.formatNotificationMessage(type, execution)
    
    // Slack notifications
    if (this.config.notifications.slack?.notifyOn.includes(type)) {
      await this.sendSlackNotification(message)
    }
    
    // Email notifications
    if (this.config.notifications.email?.notifyOn.includes(type)) {
      await this.sendEmailNotification(message, type)
    }
    
    // Webhook notifications
    if (this.config.notifications.webhook) {
      for (const webhook of this.config.notifications.webhook) {
        if (webhook.notifyOn.includes(type)) {
          await this.sendWebhookNotification(webhook, message, execution)
        }
      }
    }
  }

  private formatNotificationMessage(type: string, execution: PipelineExecution): string {
    const duration = execution.endTime ? 
      Math.round((execution.endTime.getTime() - execution.startTime.getTime()) / 1000) : 0
    
    const statusIcon = {
      success: '✅',
      failure: '❌',
      start: '🚀',
      rollback: '🔄'
    }[type] || '📋'

    return `${statusIcon} **Pipeline ${type.toUpperCase()}**

**Project**: ${this.config.repository.name}
**Environment**: ${execution.environment}
**Branch**: ${execution.branch}
**Commit**: ${execution.commit.substring(0, 8)}
**Triggered by**: ${execution.triggeredBy}
**Duration**: ${duration}s

**Steps**:
${execution.steps.map(step => 
  `${step.status === 'success' ? '✅' : step.status === 'failure' ? '❌' : '⏳'} ${step.name}`
).join('\n')}
`
  }

  private async sendSlackNotification(message: string): Promise<void> {
    if (!this.config.notifications.slack) return
    
    console.log('Sending Slack notification...')
    console.log(`Channel: ${this.config.notifications.slack.channel}`)
    console.log(`Message: ${message}`)
    
    // Mock Slack API call
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  private async sendEmailNotification(message: string, type: string): Promise<void> {
    if (!this.config.notifications.email) return
    
    console.log('Sending email notification...')
    console.log(`Recipients: ${this.config.notifications.email.recipients.join(', ')}`)
    console.log(`Subject: Pipeline ${type} - ${this.config.repository.name}`)
    console.log(`Body: ${message}`)
    
    // Mock email sending
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  private async sendWebhookNotification(webhook: WebhookNotificationConfig, message: string, execution: PipelineExecution): Promise<void> {
    console.log(`Sending webhook notification to: ${webhook.url}`)
    
    const payload = {
      ...webhook.payload,
      message,
      execution: {
        id: execution.id,
        status: execution.status,
        environment: execution.environment,
        branch: execution.branch,
        commit: execution.commit
      }
    }
    
    console.log('Webhook payload:', JSON.stringify(payload, null, 2))
    
    // Mock webhook call
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Monitoring and Status
  public getPipelineStatus(executionId: string): PipelineExecution | null {
    return this.executions.get(executionId) || null
  }

  public getActivePipelines(): PipelineExecution[] {
    return Array.from(this.executions.values())
      .filter(execution => execution.status === 'running')
  }

  public getPipelineHistory(limit: number = 50): PipelineExecution[] {
    return Array.from(this.executions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)
  }

  public generatePipelineReport(timeRange: { start: Date; end: Date }): any {
    const executions = Array.from(this.executions.values())
      .filter(ex => ex.startTime >= timeRange.start && ex.startTime <= timeRange.end)

    return {
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(ex => ex.status === 'success').length,
      failedExecutions: executions.filter(ex => ex.status === 'failure').length,
      averageDuration: this.calculateAverageDuration(executions),
      deploymentFrequency: this.calculateDeploymentFrequency(executions),
      failureRate: executions.length > 0 ? 
        executions.filter(ex => ex.status === 'failure').length / executions.length : 0,
      mostCommonFailures: this.analyzeMostCommonFailures(executions)
    }
  }

  private calculateAverageDuration(executions: PipelineExecution[]): number {
    const completedExecutions = executions.filter(ex => ex.endTime)
    if (completedExecutions.length === 0) return 0
    
    const totalDuration = completedExecutions.reduce((sum, ex) => 
      sum + (ex.endTime!.getTime() - ex.startTime.getTime()), 0)
    
    return Math.round(totalDuration / completedExecutions.length / 1000) // seconds
  }

  private calculateDeploymentFrequency(executions: PipelineExecution[]): number {
    const deployments = executions.filter(ex => 
      ex.status === 'success' && ex.environment === 'production'
    )
    
    return deployments.length
  }

  private analyzeMostCommonFailures(executions: PipelineExecution[]): string[] {
    const failures: Record<string, number> = {}
    
    executions.filter(ex => ex.status === 'failure').forEach(execution => {
      execution.steps.filter(step => step.status === 'failure').forEach(step => {
        failures[step.name] = (failures[step.name] || 0) + 1
      })
    })
    
    return Object.entries(failures)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name)
  }
}

// Factory function for creating CI/CD configuration
export function createCICDConfiguration(): CICDConfig {
  return {
    repository: {
      owner: 'your-organization',
      name: 'elec-distributor-website',
      defaultBranch: 'main',
      accessToken: process.env.GITHUB_TOKEN || ''
    },
    environments: {
      staging: {
        name: 'Staging',
        url: 'https://staging.elec-distributor.com',
        branch: 'develop',
        requiresApproval: false,
        approvers: [],
        environmentVariables: {
          NODE_ENV: 'staging',
          NEXT_PUBLIC_API_URL: 'https://staging-api.elec-distributor.com'
        },
        deploymentStrategy: 'rolling',
        healthChecks: [
          {
            name: 'API Health Check',
            url: 'https://staging.elec-distributor.com/api/health',
            method: 'GET',
            expectedStatusCode: 200,
            timeout: 5000,
            retries: 3,
            interval: 10000
          }
        ]
      },
      production: {
        name: 'Production',
        url: 'https://elec-distributor.com',
        branch: 'main',
        requiresApproval: true,
        approvers: ['devops-team', 'tech-lead'],
        environmentVariables: {
          NODE_ENV: 'production',
          NEXT_PUBLIC_API_URL: 'https://api.elec-distributor.com'
        },
        deploymentStrategy: 'blue-green',
        healthChecks: [
          {
            name: 'Homepage Health Check',
            url: 'https://elec-distributor.com',
            method: 'GET',
            expectedStatusCode: 200,
            timeout: 5000,
            retries: 5,
            interval: 30000
          },
          {
            name: 'API Health Check',
            url: 'https://elec-distributor.com/api/health',
            method: 'GET',
            expectedStatusCode: 200,
            timeout: 5000,
            retries: 5,
            interval: 30000
          }
        ]
      }
    },
    pipeline: {
      buildSteps: [
        {
          name: 'Install Dependencies',
          command: 'npm ci',
          continueOnError: false,
          timeout: 300000
        },
        {
          name: 'Build Application',
          command: 'npm run build',
          continueOnError: false,
          timeout: 600000
        }
      ],
      testSteps: [
        {
          name: 'Unit Tests',
          type: 'unit',
          command: 'npm run test:unit',
          coverageThreshold: 80,
          failOnThreshold: true
        },
        {
          name: 'Integration Tests',
          type: 'integration',
          command: 'npm run test:integration',
          failOnThreshold: true
        },
        {
          name: 'E2E Tests',
          type: 'e2e',
          command: 'npm run test:e2e',
          failOnThreshold: false
        }
      ],
      deploymentSteps: [
        {
          name: 'Deploy to Environment',
          environment: 'production',
          strategy: 'blue-green',
          preDeploymentChecks: ['health-check', 'database-migration'],
          postDeploymentChecks: ['smoke-test', 'performance-check'],
          rollbackTriggers: ['health-check-failure', 'error-rate-spike']
        }
      ],
      rollbackSteps: [
        {
          name: 'Rollback Deployment',
          condition: 'deployment-failure',
          action: 'rollback-to-previous',
          notificationRequired: true
        }
      ]
    },
    notifications: {
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
        channel: '#deployments',
        mentionUsers: ['@devops-team'],
        notifyOn: ['success', 'failure', 'rollback']
      },
      email: {
        smtpConfig: {
          host: 'smtp.company.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
          }
        },
        recipients: ['devops@company.com', 'tech-lead@company.com'],
        notifyOn: ['failure', 'rollback']
      }
    },
    quality: {
      codeQuality: {
        enabled: true,
        sonarCloudProjectKey: 'elec-distributor-website',
        eslintConfigPath: '.eslintrc.json',
        prettierConfigPath: '.prettierrc',
        qualityGates: {
          coverage: 80,
          duplicatedLines: 3,
          maintainabilityRating: 'A',
          reliabilityRating: 'A',
          securityRating: 'A'
        }
      },
      security: {
        enabled: true,
        tools: ['snyk', 'codeql', 'dependabot'],
        failOnHighSeverity: true,
        allowedVulnerabilities: []
      },
      performance: {
        enabled: true,
        budgets: {
          fcp: 1500, // 1.5 seconds
          lcp: 2500, // 2.5 seconds
          cls: 0.1,  // 0.1
          bundleSize: 500000 // 500KB
        },
        lighthouseThresholds: {
          performance: 90,
          accessibility: 95,
          bestPractices: 95,
          seo: 90
        }
      }
    }
  }
}