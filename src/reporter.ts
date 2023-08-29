import chalk from 'chalk'
import { WriteStream } from 'tty'
import type { AggregatedResult, Reporter, TestResult } from '@jest/reporters'
import { parseTestSuite } from './parse-test-suite'
import * as SS from './suite-summary'
import { TestReport } from './suite-report'

const renderReport = (out: WriteStream) => (outcome: TestReport): void => {
  let indicator: string
  let pen: chalk.Chalk
  switch (outcome.outcome) {
    case 'pass':
      indicator = '.'
      pen = chalk.greenBright
      break
    case 'wip':
      indicator = '?'
      pen = chalk.yellowBright
      break
    case 'fail':
      indicator = 'x'
      pen = chalk.redBright
      break
  }
  out.write(pen(indicator))
  if (process.env.JWR_VERBOSE)
    out.write(` ${pen(outcome.title)}\n`)
}

export default class JestReporter implements Reporter {
  private _error?: Error
  private out = process.stdout
  private overallSummary: SS.SuiteSummary = {
    passedCount: 0,
    wipTitles: [],
    failedCount: 0,
  }

  onRunStart(): void {
    this.out.write('\n')
  }

  // eslint-disable-next-line class-methods-use-this
  onTestStart(): void {
  }

  onTestResult(_test: unknown, testResult: TestResult): void {
    const suite = parseTestSuite(testResult.testResults)
    this.overallSummary.passedCount += suite.passedCount
    this.overallSummary.failedCount += suite.failedCount
    this.overallSummary.wipTitles.push(...suite.wipTitles)
    suite.outcomes.forEach(renderReport(this.out))
  }

  onRunComplete(_test?: unknown, runResults?: AggregatedResult): Promise<void> | void {
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
