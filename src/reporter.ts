import chalk from 'chalk'
import type { AggregatedResult, Reporter, TestResult } from '@jest/reporters'
import * as summaryReport from './summary-report'
import { toTestReport } from './to-test-report'
import * as progress from './progress'
import { Reporters } from './reporters'
import * as wipReportList from './wip-report-list'
import { Config } from './config'

export default class JestReporter implements Reporter {
  private _error?: Error
  private reporters: Reporters
  private config: Config = {
    out: process.stdout,
    pens: {
      pass: (s) => process.stdout.write(chalk.greenBright(s)),
      wip: (s) => process.stdout.write(chalk.yellowBright(s)),
      fail: (s) => process.stdout.write(chalk.redBright(s)),
    },
  }

  constructor() {
    this.reporters = {
      onSuiteStart: [],
      onTestFinish: [],
      onSuiteFinish: [],
      onRunFinish: [],
    }
    progress.register(this.reporters, this.config)
    wipReportList.register(this.reporters, this.config)
    summaryReport.register(this.reporters, this.config)
  }

  onRunStart(): void {
    this.config.out.write('\n')
  }

  onTestFileResult(_test: unknown, jestTestFileResult: TestResult): void {
    this.reporters.onSuiteStart.forEach((f) => f())
    jestTestFileResult.testResults.forEach((jestTestResult) => {
      const r = toTestReport(jestTestResult)
      this.reporters.onTestFinish.forEach((f) => f(r))
    })
    this.reporters.onSuiteFinish.forEach((f) => f())
  }

  onRunComplete(_test?: unknown, runResults?: AggregatedResult): void {
    if (runResults)
      this.reporters.onRunFinish.forEach((f) => f(runResults))
    else
      this.config.out.write(`${chalk.redBright('\n\nNo run results!')}\n`)
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
