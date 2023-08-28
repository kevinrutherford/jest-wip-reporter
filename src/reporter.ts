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
import * as SS from './suite-summary'

export default class JestReporter implements Reporter {
  private _error?: Error
  protected _globalConfig: Config.GlobalConfig
  private out = process.stdout
  private overallSummary: SS.SuiteSummary = {
    passedCount: 0,
    wipTitles: [],
    failedCount: 0,
  }

  constructor(globalConfig: Config.GlobalConfig) {
    this._globalConfig = globalConfig
  }

  onRunStart(): void {
    this.out.write('\n')
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
            this.out.write(chalk.yellowBright('?'))
            if (process.env.JWR_VERBOSE)
              this.out.write(` ${chalk.yellowBright(run.fullName)}\n`)
          } else {
            this.out.write(chalk.greenBright('.'))
            if (process.env.JWR_VERBOSE)
              this.out.write(` ${chalk.greenBright(run.fullName)}\n`)
          }
          break
        case 'todo':
        case 'pending':
        case 'skipped':
        case 'disabled':
          this.out.write(chalk.yellowBright('?'))
          if (process.env.JWR_VERBOSE)
            this.out.write(` ${chalk.yellowBright(run.fullName)}\n`)
          break
        case 'failed':
          this.out.write(chalk.redBright('x'))
          if (process.env.JWR_VERBOSE)
            this.out.write(` ${chalk.redBright(run.fullName)}\n`)
          break
        default:
          this.out.write(chalk.redBright('!'))
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
      this.out.write(`${chalk.redBright('\n\nNo run results!')}\n`)
      return
    }
    if (this.overallSummary.wipTitles.length > 0) {
      this.out.write(chalk.yellowBright('\n\nWork in progress:\n'))
      this.overallSummary.wipTitles.forEach((title: string) => {
        this.out.write(chalk.yellowBright(`? ${title}\n`))
      })
    }
    this.out.write('\n')
    runResults.testResults.forEach((tr: TestResult) => {
      this.out.write(tr.failureMessage ?? '')
    })
    const runTime = (Date.now() - runResults.startTime) / 1000
    SS.summarise(this.out)(this.overallSummary)
    this.out.write(`\nTime: ${runTime}s\n`)
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
