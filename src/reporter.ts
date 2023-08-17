import chalk = require('chalk')
import type {
  AggregatedResult,
  Config,
  TestContext,
  Reporter,
  Test,
  TestResult,
} from '@jest/reporters'

export default class JestReporter implements Reporter {
  private _error?: Error

  protected _globalConfig: Config.GlobalConfig

  private wipCount: number = 0

  private passedCount: number = 0

  private failedCount: number = 0

  constructor(globalConfig: Config.GlobalConfig) {
    this._globalConfig = globalConfig
  }

  // eslint-disable-next-line class-methods-use-this
  onRunStart(): void {
    process.stdout.write('\n')
  }

  // eslint-disable-next-line class-methods-use-this
  onTestStart(): void {
  }

  onTestResult(_test: Test, testResult: TestResult): void {
    testResult.testResults.forEach((run) => {
      switch (run.status) {
        case 'passed':
          if (run.numPassingAsserts === 0) {
            this.wipCount += 1
            process.stdout.write(chalk.yellowBright('?'))
            if (process.env.JWR_VERBOSE)
              process.stdout.write(` ${chalk.yellowBright(run.fullName)}\n`)
          } else {
            this.passedCount += 1
            process.stdout.write(chalk.greenBright('.'))
            if (process.env.JWR_VERBOSE)
              process.stdout.write(` ${chalk.greenBright(run.fullName)}\n`)
          }
          break
        case 'todo':
        case 'pending':
        case 'skipped':
        case 'disabled':
          this.wipCount += 1
          process.stdout.write(chalk.yellowBright('?'))
          if (process.env.JWR_VERBOSE)
            process.stdout.write(` ${chalk.yellowBright(run.fullName)}\n`)
          break
        case 'failed':
          this.failedCount += 1
          process.stdout.write(chalk.redBright('x'))
          if (process.env.JWR_VERBOSE)
            process.stdout.write(` ${chalk.redBright(run.fullName)}\n`)
          break
        default:
          process.stdout.write(chalk.redBright('!'))
      }
    })
  }

  onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult,
  ): Promise<void> | void {
    if (!runResults) {
      process.stdout.write(`${chalk.redBright('\n\nNo run results!')}\n`)
      return
    }
    process.stdout.write('\n')
    runResults.testResults.forEach((tr: TestResult) => {
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
