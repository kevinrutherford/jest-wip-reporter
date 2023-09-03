import chalk from 'chalk'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import type { AggregatedResult, Reporter, TestResult } from '@jest/reporters'
import * as CS from './collection-summary'
import * as FR from './file-report'
import { renderCollectionSummary } from './render-collection-summary'
import { toTestReport } from './to-test-report'
import { recordOn } from './record-on'

export default class JestReporter implements Reporter {
  private _error?: Error
  private out = process.stdout
  private overallSummary = CS.create()

  onRunStart(): void {
    this.out.write('\n')
  }

  onTestFileResult(_test: unknown, jestTestFileResult: TestResult): void {
    pipe(
      jestTestFileResult.testResults,
      RA.map(toTestReport),
      RA.map(recordOn(this.overallSummary)),
      FR.constructTreeOfSuites,
      RA.map(FR.renderReport(this.out)),
    )
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
  }

  getLastError(): Error | undefined {
    return this._error
  }

  protected _setError(error: Error): void {
    this._error = error
  }
}
