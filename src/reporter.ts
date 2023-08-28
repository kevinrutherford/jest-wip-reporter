import chalk = require('chalk')
import type {
  AggregatedResult,
  Config,
  TestContext,
  Reporter,
  Test,
  TestResult,
} from '@jest/reporters'
import { parseTestSuite } from './parse-test-suite'
import { SuiteSummary } from './suite-summary'

export default class JestReporter implements Reporter {
  private _error?: Error
  protected _globalConfig: Config.GlobalConfig
  private overallSummary: SuiteSummary = {
    passedCount: 0,
    wipTitles: [],
    failedCount: 0,
  }

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const suite = parseTestSuite(testResult.testResults)
    testResult.testResults.forEach((run) => {
      switch (run.status) {
        case 'passed':
          if (run.numPassingAsserts === 0) {
            process.stdout.write(chalk.yellowBright('?'))
            if (process.env.JWR_VERBOSE)
              process.stdout.write(` ${chalk.yellowBright(run.fullName)}\n`)
          } else {
            process.stdout.write(chalk.greenBright('.'))
            if (process.env.JWR_VERBOSE)
              process.stdout.write(` ${chalk.greenBright(run.fullName)}\n`)
          }
          break
        case 'todo':
        case 'pending':
        case 'skipped':
        case 'disabled':
          process.stdout.write(chalk.yellowBright('?'))
          if (process.env.JWR_VERBOSE)
            process.stdout.write(` ${chalk.yellowBright(run.fullName)}\n`)
          break
        case 'failed':
          process.stdout.write(chalk.redBright('x'))
          if (process.env.JWR_VERBOSE)
            process.stdout.write(` ${chalk.redBright(run.fullName)}\n`)
          break
        default:
          process.stdout.write(chalk.redBright('!'))
      }
    })
    this.overallSummary.passedCount += suite.passedCount
    this.overallSummary.failedCount += suite.failedCount
    this.overallSummary.wipTitles.push(...suite.wipTitles)
  }

  onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult,
  ): Promise<void> | void {
    if (!runResults) {
      process.stdout.write(`${chalk.redBright('\n\nNo run results!')}\n`)
      return
    }
    if (this.overallSummary.wipTitles.length > 0) {
      process.stdout.write(chalk.yellowBright('\n\nWork in progress:\n'))
      this.overallSummary.wipTitles.forEach((title: string) => {
        process.stdout.write(chalk.yellowBright(`? ${title}\n`))
      })
    }
    process.stdout.write('\n')
    runResults.testResults.forEach((tr: TestResult) => {
      process.stdout.write(tr.failureMessage ?? '')
    })
    const runTime = (Date.now() - runResults.startTime) / 1000
    process.stdout.write('Tests: ')
    const report = []
    if (this.overallSummary.passedCount > 0)
      report.push(chalk.greenBright(`${this.overallSummary.passedCount} passed`))
    if (this.overallSummary.wipTitles.length > 0)
      report.push(chalk.yellowBright(`${this.overallSummary.wipTitles.length} wip`))
    if (this.overallSummary.failedCount > 0)
      report.push(chalk.redBright(`${this.overallSummary.failedCount} failed`))
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
