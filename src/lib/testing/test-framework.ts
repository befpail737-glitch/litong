export interface TestConfig {
  testTimeout?: number
  retries?: number
  parallel?: boolean
  verbose?: boolean
  coverage?: boolean
  testEnvironment?: 'jsdom' | 'node' | 'browser'
  setupFiles?: string[]
  teardownFiles?: string[]
  reporters?: string[]
  collectCoverageFrom?: string[]
  testPathIgnorePatterns?: string[]
}

export interface TestSuite {
  name: string
  description?: string
  tests: TestCase[]
  setup?: () => Promise<void> | void
  teardown?: () => Promise<void> | void
  beforeEach?: () => Promise<void> | void
  afterEach?: () => Promise<void> | void
}

export interface TestCase {
  name: string
  description?: string
  test: () => Promise<void> | void
  timeout?: number
  retries?: number
  skip?: boolean
  only?: boolean
  tags?: string[]
}

export interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: Error
  retries: number
  tags?: string[]
}

export interface TestSuiteResult {
  name: string
  passed: boolean
  tests: TestResult[]
  duration: number
  setup?: TestResult
  teardown?: TestResult
  coverage?: CoverageResult
}

export interface TestReport {
  timestamp: number
  duration: number
  totalTests: number
  passedTests: number
  failedTests: number
  skippedTests: number
  suites: TestSuiteResult[]
  coverage?: CoverageResult
  summary: {
    passRate: number
    failRate: number
    avgTestDuration: number
  }
}

export interface CoverageResult {
  lines: { covered: number; total: number; percentage: number }
  functions: { covered: number; total: number; percentage: number }
  branches: { covered: number; total: number; percentage: number }
  statements: { covered: number; total: number; percentage: number }
}

export interface MockFunction<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>
  mockReturnValue: (value: ReturnType<T>) => MockFunction<T>
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockFunction<T>
  mockRejectedValue: (error: any) => MockFunction<T>
  mockImplementation: (impl: T) => MockFunction<T>
  mockClear: () => void
  mockReset: () => void
  mockRestore: () => void
  calls: Parameters<T>[]
  results: Array<{ type: 'return' | 'throw'; value: any }>
  callCount: number
}

// Core testing framework
export class TestFramework {
  private config: Required<TestConfig>
  private suites: TestSuite[] = []
  private results: TestSuiteResult[] = []
  private mocks = new Map<string, MockFunction>()
  private spies = new Map<string, MockFunction>()

  constructor(config: TestConfig = {}) {
    this.config = {
      testTimeout: 5000,
      retries: 0,
      parallel: false,
      verbose: false,
      coverage: false,
      testEnvironment: 'jsdom',
      setupFiles: [],
      teardownFiles: [],
      reporters: ['console'],
      collectCoverageFrom: ['src/**/*.{ts,tsx}'],
      testPathIgnorePatterns: ['node_modules', 'dist', 'build'],
      ...config
    }
  }

  // Test suite creation
  public describe(name: string, callback: (suite: TestSuiteBuilder) => void, description?: string): void {
    const builder = new TestSuiteBuilder(name, description)
    callback(builder)
    this.suites.push(builder.build())
  }

  // Test execution
  public async run(): Promise<TestReport> {
    const startTime = performance.now()
    
    console.log(`🧪 Running ${this.getTotalTestCount()} tests in ${this.suites.length} suites...\n`)

    // Run setup files
    await this.runSetupFiles()

    // Run test suites
    if (this.config.parallel) {
      this.results = await this.runSuitesInParallel()
    } else {
      this.results = await this.runSuitesSequentially()
    }

    // Run teardown files
    await this.runTeardownFiles()

    const endTime = performance.now()
    const duration = endTime - startTime

    const report = this.generateReport(duration)
    this.printReport(report)

    return report
  }

  private async runSuitesSequentially(): Promise<TestSuiteResult[]> {
    const results: TestSuiteResult[] = []

    for (const suite of this.suites) {
      const result = await this.runSuite(suite)
      results.push(result)
    }

    return results
  }

  private async runSuitesInParallel(): Promise<TestSuiteResult[]> {
    const promises = this.suites.map(suite => this.runSuite(suite))
    return await Promise.all(promises)
  }

  private async runSuite(suite: TestSuite): Promise<TestSuiteResult> {
    const startTime = performance.now()
    
    if (this.config.verbose) {
      console.log(`📋 ${suite.name}`)
    }

    const result: TestSuiteResult = {
      name: suite.name,
      passed: true,
      tests: [],
      duration: 0
    }

    try {
      // Run suite setup
      if (suite.setup) {
        const setupResult = await this.runWithTimeout('Setup', suite.setup, this.config.testTimeout)
        result.setup = setupResult
        if (!setupResult.passed) {
          result.passed = false
          return result
        }
      }

      // Run tests
      for (const testCase of suite.tests) {
        if (testCase.skip) {
          continue
        }

        // Run beforeEach
        if (suite.beforeEach) {
          await suite.beforeEach()
        }

        const testResult = await this.runTest(testCase)
        result.tests.push(testResult)

        if (!testResult.passed) {
          result.passed = false
        }

        // Run afterEach
        if (suite.afterEach) {
          await suite.afterEach()
        }
      }

      // Run suite teardown
      if (suite.teardown) {
        const teardownResult = await this.runWithTimeout('Teardown', suite.teardown, this.config.testTimeout)
        result.teardown = teardownResult
      }

    } catch (error) {
      result.passed = false
      console.error(`Suite ${suite.name} failed:`, error)
    }

    const endTime = performance.now()
    result.duration = endTime - startTime

    return result
  }

  private async runTest(testCase: TestCase): Promise<TestResult> {
    const timeout = testCase.timeout || this.config.testTimeout
    const maxRetries = testCase.retries ?? this.config.retries

    let lastError: Error | undefined
    let retries = 0

    while (retries <= maxRetries) {
      const result = await this.runWithTimeout(testCase.name, testCase.test, timeout)
      
      if (result.passed) {
        result.retries = retries
        result.tags = testCase.tags
        return result
      }

      lastError = result.error
      retries++

      if (retries <= maxRetries) {
        if (this.config.verbose) {
          console.log(`  🔄 Retrying ${testCase.name} (attempt ${retries + 1}/${maxRetries + 1})`)
        }
      }
    }

    return {
      name: testCase.name,
      passed: false,
      duration: 0,
      error: lastError,
      retries,
      tags: testCase.tags
    }
  }

  private async runWithTimeout(
    name: string,
    fn: () => Promise<void> | void,
    timeout: number
  ): Promise<TestResult> {
    const startTime = performance.now()

    try {
      const promise = Promise.resolve(fn())
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)
      )

      await Promise.race([promise, timeoutPromise])

      const endTime = performance.now()
      const duration = endTime - startTime

      if (this.config.verbose) {
        console.log(`  ✅ ${name} (${duration.toFixed(2)}ms)`)
      }

      return {
        name,
        passed: true,
        duration,
        retries: 0
      }
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (this.config.verbose) {
        console.log(`  ❌ ${name} (${duration.toFixed(2)}ms)`)
        console.log(`     ${error instanceof Error ? error.message : String(error)}`)
      }

      return {
        name,
        passed: false,
        duration,
        error: error instanceof Error ? error : new Error(String(error)),
        retries: 0
      }
    }
  }

  // Mock and spy functionality
  public mock<T extends (...args: any[]) => any>(name: string): MockFunction<T> {
    const mock = this.createMockFunction<T>()
    this.mocks.set(name, mock as MockFunction)
    return mock
  }

  public spy<T extends (...args: any[]) => any>(obj: any, method: string): MockFunction<T> {
    const original = obj[method]
    const spy = this.createMockFunction<T>()
    
    spy.mockImplementation((...args) => {
      return original.apply(obj, args)
    })

    obj[method] = spy
    this.spies.set(`${obj.constructor.name}.${method}`, spy as MockFunction)
    
    return spy
  }

  private createMockFunction<T extends (...args: any[]) => any>(): MockFunction<T> {
    let implementation: T | undefined
    let returnValue: ReturnType<T> | undefined
    let resolvedValue: Awaited<ReturnType<T>> | undefined
    let rejectedValue: any
    
    const calls: Parameters<T>[] = []
    const results: Array<{ type: 'return' | 'throw'; value: any }> = []

    const mockFn = ((...args: Parameters<T>): ReturnType<T> => {
      calls.push(args)

      try {
        let result: ReturnType<T>

        if (rejectedValue !== undefined) {
          throw rejectedValue
        } else if (resolvedValue !== undefined) {
          result = Promise.resolve(resolvedValue) as ReturnType<T>
        } else if (returnValue !== undefined) {
          result = returnValue
        } else if (implementation) {
          result = implementation(...args)
        } else {
          result = undefined as ReturnType<T>
        }

        results.push({ type: 'return', value: result })
        return result
      } catch (error) {
        results.push({ type: 'throw', value: error })
        throw error
      }
    }) as MockFunction<T>

    mockFn.mockReturnValue = (value: ReturnType<T>) => {
      returnValue = value
      return mockFn
    }

    mockFn.mockResolvedValue = (value: Awaited<ReturnType<T>>) => {
      resolvedValue = value
      return mockFn
    }

    mockFn.mockRejectedValue = (error: any) => {
      rejectedValue = error
      return mockFn
    }

    mockFn.mockImplementation = (impl: T) => {
      implementation = impl
      return mockFn
    }

    mockFn.mockClear = () => {
      calls.length = 0
      results.length = 0
    }

    mockFn.mockReset = () => {
      mockFn.mockClear()
      implementation = undefined
      returnValue = undefined
      resolvedValue = undefined
      rejectedValue = undefined
    }

    mockFn.mockRestore = () => {
      // This would restore original implementation for spies
      mockFn.mockReset()
    }

    Object.defineProperty(mockFn, 'calls', {
      get: () => [...calls]
    })

    Object.defineProperty(mockFn, 'results', {
      get: () => [...results]
    })

    Object.defineProperty(mockFn, 'callCount', {
      get: () => calls.length
    })

    return mockFn
  }

  public clearAllMocks(): void {
    this.mocks.forEach(mock => mock.mockClear())
    this.spies.forEach(spy => spy.mockClear())
  }

  public resetAllMocks(): void {
    this.mocks.forEach(mock => mock.mockReset())
    this.spies.forEach(spy => spy.mockReset())
  }

  public restoreAllMocks(): void {
    this.mocks.forEach(mock => mock.mockRestore())
    this.spies.forEach(spy => spy.mockRestore())
  }

  // Assertion helpers
  public expect<T>(actual: T): Expectation<T> {
    return new Expectation(actual)
  }

  // Utility methods
  private async runSetupFiles(): Promise<void> {
    for (const file of this.config.setupFiles) {
      try {
        await import(file)
      } catch (error) {
        console.error(`Failed to run setup file ${file}:`, error)
      }
    }
  }

  private async runTeardownFiles(): Promise<void> {
    for (const file of this.config.teardownFiles) {
      try {
        await import(file)
      } catch (error) {
        console.error(`Failed to run teardown file ${file}:`, error)
      }
    }
  }

  private getTotalTestCount(): number {
    return this.suites.reduce((count, suite) => count + suite.tests.length, 0)
  }

  private generateReport(duration: number): TestReport {
    const allTests = this.results.flatMap(suite => suite.tests)
    const passedTests = allTests.filter(test => test.passed).length
    const failedTests = allTests.filter(test => !test.passed).length

    return {
      timestamp: Date.now(),
      duration,
      totalTests: allTests.length,
      passedTests,
      failedTests,
      skippedTests: 0, // TODO: implement skip counting
      suites: this.results,
      summary: {
        passRate: allTests.length > 0 ? passedTests / allTests.length : 0,
        failRate: allTests.length > 0 ? failedTests / allTests.length : 0,
        avgTestDuration: allTests.length > 0 ? 
          allTests.reduce((sum, test) => sum + test.duration, 0) / allTests.length : 0
      }
    }
  }

  private printReport(report: TestReport): void {
    console.log('\n📊 Test Results:')
    console.log(`   Duration: ${report.duration.toFixed(2)}ms`)
    console.log(`   Tests: ${report.passedTests} passed, ${report.failedTests} failed, ${report.totalTests} total`)
    console.log(`   Pass Rate: ${(report.summary.passRate * 100).toFixed(1)}%`)

    if (report.failedTests > 0) {
      console.log('\n❌ Failed Tests:')
      this.results.forEach(suite => {
        suite.tests.filter(test => !test.passed).forEach(test => {
          console.log(`   ${suite.name} > ${test.name}`)
          if (test.error) {
            console.log(`     ${test.error.message}`)
          }
        })
      })
    }

    console.log()
  }
}

// Test suite builder
export class TestSuiteBuilder {
  private suite: TestSuite

  constructor(name: string, description?: string) {
    this.suite = {
      name,
      description,
      tests: []
    }
  }

  public beforeAll(fn: () => Promise<void> | void): void {
    this.suite.setup = fn
  }

  public afterAll(fn: () => Promise<void> | void): void {
    this.suite.teardown = fn
  }

  public beforeEach(fn: () => Promise<void> | void): void {
    this.suite.beforeEach = fn
  }

  public afterEach(fn: () => Promise<void> | void): void {
    this.suite.afterEach = fn
  }

  public test(name: string, fn: () => Promise<void> | void, options?: {
    timeout?: number
    retries?: number
    skip?: boolean
    only?: boolean
    tags?: string[]
  }): void {
    this.suite.tests.push({
      name,
      test: fn,
      ...options
    })
  }

  public it(name: string, fn: () => Promise<void> | void, options?: {
    timeout?: number
    retries?: number
    skip?: boolean
    only?: boolean
    tags?: string[]
  }): void {
    this.test(name, fn, options)
  }

  public build(): TestSuite {
    return this.suite
  }
}

// Expectation class for assertions
export class Expectation<T> {
  constructor(private actual: T) {}

  public toBe(expected: T): void {
    if (this.actual !== expected) {
      throw new Error(`Expected ${this.actual} to be ${expected}`)
    }
  }

  public toEqual(expected: T): void {
    if (!this.deepEqual(this.actual, expected)) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} to equal ${JSON.stringify(expected)}`)
    }
  }

  public toBeNull(): void {
    if (this.actual !== null) {
      throw new Error(`Expected ${this.actual} to be null`)
    }
  }

  public toBeUndefined(): void {
    if (this.actual !== undefined) {
      throw new Error(`Expected ${this.actual} to be undefined`)
    }
  }

  public toBeTruthy(): void {
    if (!this.actual) {
      throw new Error(`Expected ${this.actual} to be truthy`)
    }
  }

  public toBeFalsy(): void {
    if (this.actual) {
      throw new Error(`Expected ${this.actual} to be falsy`)
    }
  }

  public toThrow(expectedError?: string | RegExp | Error): void {
    if (typeof this.actual !== 'function') {
      throw new Error('Expected value must be a function')
    }

    let didThrow = false
    let thrownError: any

    try {
      (this.actual as any)()
    } catch (error) {
      didThrow = true
      thrownError = error
    }

    if (!didThrow) {
      throw new Error('Expected function to throw an error')
    }

    if (expectedError) {
      if (typeof expectedError === 'string') {
        if (thrownError.message !== expectedError) {
          throw new Error(`Expected error message "${thrownError.message}" to be "${expectedError}"`)
        }
      } else if (expectedError instanceof RegExp) {
        if (!expectedError.test(thrownError.message)) {
          throw new Error(`Expected error message "${thrownError.message}" to match ${expectedError}`)
        }
      } else if (expectedError instanceof Error) {
        if (thrownError.constructor !== expectedError.constructor) {
          throw new Error(`Expected error type ${thrownError.constructor.name} to be ${expectedError.constructor.name}`)
        }
      }
    }
  }

  public async toResolve(): Promise<void> {
    if (!this.isPromise(this.actual)) {
      throw new Error('Expected value must be a Promise')
    }

    try {
      await this.actual
    } catch (error) {
      throw new Error(`Expected Promise to resolve but it rejected with: ${error}`)
    }
  }

  public async toReject(): Promise<void> {
    if (!this.isPromise(this.actual)) {
      throw new Error('Expected value must be a Promise')
    }

    try {
      await this.actual
      throw new Error('Expected Promise to reject but it resolved')
    } catch (error) {
      // Expected to reject
    }
  }

  public toHaveLength(expectedLength: number): void {
    const actualLength = (this.actual as any)?.length
    if (actualLength !== expectedLength) {
      throw new Error(`Expected length ${actualLength} to be ${expectedLength}`)
    }
  }

  public toContain(expected: any): void {
    const actualArray = this.actual as any
    if (!Array.isArray(actualArray)) {
      throw new Error('Expected value must be an array')
    }

    if (!actualArray.includes(expected)) {
      throw new Error(`Expected array to contain ${expected}`)
    }
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true
    
    if (a == null || b == null) return a === b
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item, index) => this.deepEqual(item, b[index]))
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      
      if (keysA.length !== keysB.length) return false
      
      return keysA.every(key => keysB.includes(key) && this.deepEqual(a[key], b[key]))
    }
    
    return false
  }

  private isPromise(value: any): value is Promise<any> {
    return value && typeof value.then === 'function'
  }
}

// Global test framework instance
let globalTestFramework: TestFramework | null = null

export function createTestFramework(config?: TestConfig): TestFramework {
  return new TestFramework(config)
}

export function getGlobalTestFramework(): TestFramework {
  if (!globalTestFramework) {
    globalTestFramework = new TestFramework()
  }
  return globalTestFramework
}

// Global test functions
export function describe(name: string, callback: (suite: TestSuiteBuilder) => void, description?: string): void {
  const framework = getGlobalTestFramework()
  framework.describe(name, callback, description)
}

export function test(name: string, fn: () => Promise<void> | void, options?: {
  timeout?: number
  retries?: number
  skip?: boolean
  only?: boolean
  tags?: string[]
}): void {
  // This would be used within a describe block
  throw new Error('test() must be called within a describe() block')
}

export function it(name: string, fn: () => Promise<void> | void, options?: {
  timeout?: number
  retries?: number
  skip?: boolean
  only?: boolean
  tags?: string[]
}): void {
  test(name, fn, options)
}

export function expect<T>(actual: T): Expectation<T> {
  const framework = getGlobalTestFramework()
  return framework.expect(actual)
}

export function mock<T extends (...args: any[]) => any>(name: string): MockFunction<T> {
  const framework = getGlobalTestFramework()
  return framework.mock<T>(name)
}

export function spy<T extends (...args: any[]) => any>(obj: any, method: string): MockFunction<T> {
  const framework = getGlobalTestFramework()
  return framework.spy<T>(obj, method)
}

export default TestFramework