import { WriteStream } from 'tty'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { isTestReport, Report, TestReport } from './report'
import { renderTestReport } from './render-test-report'

export type FileReport = ReadonlyArray<Report>

const addToReport = (report: FileReport, t: TestReport): FileReport => [...report, t]

export const constructTreeOfSuites = (report: ReadonlyArray<TestReport>): FileReport => pipe(
  report,
  RA.reduce([], addToReport),
)

const renderReport = (out: WriteStream) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out)(r)
  else
    throw new Error('Unknown type of report')
}

export const render = (out: WriteStream) => (fr: FileReport): void => pipe(
  fr,
  RA.map(renderReport(out)),
  () => undefined,
)
