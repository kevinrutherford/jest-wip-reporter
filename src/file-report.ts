/* eslint-disable @typescript-eslint/no-use-before-define */
import { WriteStream } from 'tty'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import {
  isSuiteReport,
  isTestReport, Report, SuiteReport, TestReport,
} from './report'
import { renderTestReport } from './render-test-report'

export type FileReport = ReadonlyArray<Report>

const addToReport = (report: FileReport, t: TestReport): FileReport => {
  if (t.ancestorNames.length === 0)
    return [...report, t]
  const ancestor = pipe(
    report,
    RA.filter((node) => node.name === t.ancestorNames[0]),
    RA.head,
    O.filter(isSuiteReport),
    O.getOrElseW(() => undefined),
  )
  if (ancestor !== undefined) {
    ancestor.children.push(t)
    return report
  }
  return [
    ...report,
    {
      _tag: 'suite-report',
      name: t.ancestorNames[0],
      outcome: t.outcome,
      children: [t],
    },
  ]
}

export const constructTreeOfSuites = (report: ReadonlyArray<TestReport>): FileReport => pipe(
  report,
  RA.reduce([], addToReport),
)

const renderReport = (out: WriteStream, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out, indentLevel)(r)
  else
    renderSuite(out, indentLevel)(r)
}

const renderSuite = (out: WriteStream, indentLevel: number) => (r: SuiteReport): void => {
  if (process.env.JWR_VERBOSE) {
    out.write(`${r.name}\n`)
    r.children.forEach(renderReport(out, indentLevel + 1))
  }
}

export const render = (out: WriteStream) => (fr: FileReport): void => pipe(
  fr,
  RA.map(renderReport(out, 0)),
  () => undefined,
)
