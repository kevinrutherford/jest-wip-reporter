import chalk from 'chalk'
import { WriteStream } from 'tty'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import {
  isSuiteReport, isTestReport, Report, TestReport,
} from './report'

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

export const addToReport = (report: Array<Report>, t: TestReport): Array<Report> => (
  add(report, t, t.ancestorNames)
)

const renderTestReport = (out: WriteStream, indentLevel: number) => (outcome: TestReport): void => {
  out.write('  '.repeat(indentLevel))
  let indicator: string
  let pen: chalk.Chalk
  switch (outcome.outcome) {
    case 'pass':
      indicator = '✓'
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
  out.write(` ${pen(outcome.name)}\n`)
}

export const renderReport = (out: WriteStream, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out, indentLevel)(r)
  else {
    out.write('  '.repeat(indentLevel))
    out.write(`${r.name}\n`)
    r.children.forEach(renderReport(out, indentLevel + 1))
  }
}
