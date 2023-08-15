import chalk = require('chalk')
import type {
  AggregatedResult,
  Config,
  TestContext,
  Reporter,
  ReporterOnStartOptions,
  Test,
  TestResult,
} from '@jest/reporters'

export default class JestReporter implements Reporter {
  private _error?: Error
  protected _globalConfig: Config.GlobalConfig
  protected _options?: any

  constructor(globalConfig: Config.GlobalConfig, options?: any) {
    this._globalConfig = globalConfig
    this._options = options
  }

  log(message: string): void {
    console.log(`log message: ${JSON.stringify(message, null, 2)}`)
  }

  onRunStart(
    aggregatedResults: AggregatedResult,
    options: ReporterOnStartOptions
  ): void {
    console.log('')
  }

  onTestStart(test?: Test): void {
  }

  onTestResult(
    test: Test,
    testResult: TestResult,
    aggregatedResults: AggregatedResult
  ): void {
    if (testResult.skipped) {
      console.log(testResult.testFilePath, ' skipped');
    }
    for (var i = 0; i < testResult.testResults.length; i++) {
      switch (testResult.testResults[i].status) {
        case "passed":
          process.stdout.write(chalk.greenBright('.'))
          break
        case "todo":
        case "pending":
          process.stdout.write(chalk.yellowBright('?'))
          break
        case "skipped":
        case "disabled":
          process.stdout.write("x")
          break
        case "failed":
          process.stdout.write(chalk.redBright('F'))
          break
        default:
          process.stdout.write(`(${testResult.testResults[i].status})`)
      }
    }
  }

  onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult
  ): Promise<void> | void {
    if (runResults) {
      console.log(`
Passed: ${runResults.numPassedTests}, pending: ${runResults.numPendingTests}, todo: ${runResults.numTodoTests}, failed: ${runResults.numFailedTests}
`)
      runResults.testResults.forEach(function (tr: TestResult) {
        process.stdout.write(tr.failureMessage ?? '')
      })
    } else {
      console.log('No runResults!')
    }
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
