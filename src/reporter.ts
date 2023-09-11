import chalk from 'chalk'
import type {
  AggregatedResult, Reporter, TestCaseResult,
} from '@jest/reporters'
import * as summaryReport from './summary-report'
import { toTestReport } from './to-test-report'
import * as progressDots from './progress-dots'
import * as progressTree from './progress-tree'
import { Config, Reporters } from './reporters'
import * as wipReportList from './wip-report-list'

export default class JestReporter implements Reporter {
  private _error?: Error
  private reporters: Reporters
  private config: Config = {
    out: process.stdout,
  }

  constructor() {
    this.reporters = {
      onSuiteStart: [],
      onTestFinish: [],
      onSuiteFinish: [],
      onRunFinish: [],
    }
    switch (process.env.JWR_PROGRESS) {
      case 'tree':
        progressTree.register(this.reporters, this.config)
        break
      case 'dots':
      default:
        progressDots.register(this.reporters, this.config)
        break
    }
    wipReportList.register(this.reporters, this.config)
    summaryReport.register(this.reporters, this.config)
  }

  onRunStart(): void {
    this.config.out.write('\n')
  }

  onTestFileStart(): void {
    this.reporters.onSuiteStart.forEach((f) => f())
  }

  onTestCaseResult(_test: unknown, jestTestResult: TestCaseResult): void {
    const r = toTestReport(jestTestResult)
    this.reporters.onTestFinish.forEach((f) => f(r))
  }

  onTestFileResult(): void {
    this.reporters.onSuiteStart.forEach((f) => f())
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
