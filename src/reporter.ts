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
  wipCount: number = 0
  passedCount: number = 0
  failedCount: number = 0

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
          if (testResult.testResults[i].numPassingAsserts === 0) {
            this.wipCount = this.wipCount + 1
            process.stdout.write(chalk.yellowBright('?'))
            if (process.env.JWR_VERBOSE) {
              process.stdout.write(` ${chalk.yellowBright(testResult.testResults[i].fullName)}\n`)
            }
          } else {
            this.passedCount = this.passedCount + 1
            process.stdout.write(chalk.greenBright('.'))
            if (process.env.JWR_VERBOSE) {
              process.stdout.write(` ${chalk.greenBright(testResult.testResults[i].fullName)}\n`)
            }
          }
          break
        case "todo":
        case "pending":
        case "skipped":
        case "disabled":
          this.wipCount = this.wipCount + 1
          process.stdout.write(chalk.yellowBright('?'))
          if (process.env.JWR_VERBOSE) {
            process.stdout.write(` ${chalk.yellowBright(testResult.testResults[i].fullName)}\n`)
          }
          break
        case "failed":
          this.failedCount = this.failedCount + 1
          process.stdout.write(chalk.redBright('x'))
          if (process.env.JWR_VERBOSE) {
            process.stdout.write(` ${chalk.redBright(testResult.testResults[i].fullName)}\n`)
          }
          break
        default:
          process.stdout.write(chalk.redBright('!'))
      }
    }
  }

  onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult
  ): Promise<void> | void {
    if (!runResults) {
      process.stdout.write(`${chalk.redBright('\n\nNo run results!')}\n`)
      return
    }
    process.stdout.write('\n')
    runResults.testResults.forEach(function (tr: TestResult) {
      process.stdout.write(tr.failureMessage ?? '')
    })
    const runTime = (Date.now() - runResults.startTime) / 1000
    process.stdout.write('Tests: ')
    const report = []
    if (this.passedCount > 0)
      report.push(chalk.greenBright(`${this.passedCount} passed`))
    if (this.wipCount > 0)
      report.push(chalk.yellowBright(`${this.wipCount} wip`))
    if (this.failedCount > 0)
      report.push(chalk.redBright(`${this.failedCount} failed`))
    process.stdout.write(report.join(', '))
    process.stdout.write(`\nTime: ${runTime}s\n`)
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
