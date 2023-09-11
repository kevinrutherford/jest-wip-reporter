import chalk from 'chalk'
import type {
  AggregatedResult, Reporter, TestCaseResult, TestResult,
} from '@jest/reporters'
import * as CS from './collection-summary'
import { renderCollectionSummary } from './render-collection-summary'
import { toTestReport } from './to-test-report'
import { recordOn } from './record-on'
import * as progressDots from './progress-dots'
import * as progressTree from './progress-tree'
import { Report } from './report'
import { Reporters } from './reporters'

export default class JestReporter implements Reporter {
  private _error?: Error
  private out = process.stdout
  private overallSummary = CS.create()
  private fileReport: Array<Report> = []
  private reporters: Reporters

  constructor() {
    this.reporters = {
      onSuiteStart: [],
      onTestFinish: [],
      onSuiteFinish: [],
      onRunFinish: [],
    }
    CS.register(this.reporters)
  }

  onRunStart(): void {
    this.out.write('\n')
  }

  onTestFileStart(): void {
    this.fileReport = []
    this.reporters.onSuiteStart.forEach((f) => f())
  }

  onTestCaseResult(_test: unknown, jestTestResult: TestCaseResult): void {
    const r = toTestReport(jestTestResult)
    recordOn(this.overallSummary)(r)
    switch (process.env.JWR_PROGRESS) {
      case 'tree':
        this.fileReport = progressTree.addToReport(this.fileReport, r)
        break
      default:
        progressDots.renderTestReport(this.out)(r)
        break
    }
    this.reporters.onTestFinish.forEach((f) => f(r))
  }

  onTestFileResult(): void {
    if (process.env.JWR_PROGRESS !== 'tree')
      return
    this.fileReport.forEach(progressTree.renderReport(this.out, 0))
    this.reporters.onSuiteStart.forEach((f) => f())
  }

  onRunComplete(_test?: unknown, runResults?: AggregatedResult): void {
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
    renderCollectionSummary(this.out)(this.overallSummary)
    this.out.write(`\nTime: ${runTime}s\n`)
    this.reporters.onSuiteStart.forEach((f) => f())
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
