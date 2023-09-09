/* eslint-disable @typescript-eslint/no-use-before-define */
import { WriteStream } from 'tty'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import {
  isSuiteReport, Report, TestReport,
} from './report'
import * as progressDots from './progress-dots'
import * as progressTree from './progress-tree'

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
  if (process.env.JWR_VERBOSE)
    progressTree.renderReport(out, indentLevel)(r)
  else
    progressDots.renderReport(out)(r)
}

export const render = (out: WriteStream) => (fr: FileReport): void => pipe(
  fr,
  RA.map(renderReport(out, 0)),
  () => undefined,
)
