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

const add = (report: Array<Report>, t: TestReport, ancestorNames: TestReport['ancestorNames']): Array<Report> => {
  if (ancestorNames.length === 0)
    return [...report, t]
  const ancestor = pipe(
    report,
    RA.filter((node) => node.name === ancestorNames[0]),
    RA.head,
    O.filter(isSuiteReport),
    O.getOrElseW(() => undefined),
  )
  if (ancestor !== undefined) {
    ancestor.children = add(ancestor.children, t, ancestorNames.slice(1))
    return report
  }
  return [
    ...report,
    {
      _tag: 'suite-report',
      name: ancestorNames[0],
      outcome: t.outcome,
      children: add([], t, ancestorNames.slice(1)),
    },
  ]
}

const addToReport = (report: Array<Report>, t: TestReport): Array<Report> => (
  add(report, t, t.ancestorNames)
)

export const constructTreeOfSuites = (report: ReadonlyArray<TestReport>): Array<Report> => pipe(
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
    out.write('  '.repeat(indentLevel))
    out.write(`${r.name}\n`)
  }
  r.children.forEach(renderReport(out, indentLevel + 1))
}

export const render = (out: WriteStream) => (fr: FileReport): void => pipe(
  fr,
  RA.map(renderReport(out, 0)),
  () => undefined,
)
