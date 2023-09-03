import { WriteStream } from 'tty'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { TestReport } from './test-report'
import { isTestReport, renderTestReport, Report } from './render-test-report'

export type FileReport = ReadonlyArray<TestReport>

const addToReport = (report: FileReport, t: TestReport): FileReport => [...report, t]

export const constructTreeOfSuites = (report: FileReport): FileReport => pipe(
  report,
  RA.reduce([], addToReport),
)

export const renderReport = (out: WriteStream) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out)(r)
  else
    throw new Error('Unknown type of report')
}
