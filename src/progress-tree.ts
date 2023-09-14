import chalk from 'chalk'
import { WriteStream } from 'tty'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import {
  isSuiteReport, isTestReport, Report, SuiteReport, TestReport,
} from './report'
import { Config, Reporters } from './reporters'

const add = (report: Array<Report>, t: TestReport, ancestorNames: TestReport['ancestorNames']): void => {
  if (ancestorNames.length === 0) {
    report.push(t)
    return
  }
  const ancestor = pipe(
    report,
    RA.filter((node) => node.name === ancestorNames[0]),
    RA.head,
    O.filter(isSuiteReport),
    O.getOrElseW(() => undefined),
  )
  if (ancestor !== undefined) {
    add(ancestor.children, t, ancestorNames.slice(1))
    switch (t.outcome) {
      case 'fail':
        ancestor.outcome = t.outcome
        break
      case 'wip':
        if (ancestor.outcome === 'pass')
          ancestor.outcome = t.outcome
        break
      case 'pass':
        break
    }
    return
  }
  const r = {
    _tag: 'suite-report',
    name: ancestorNames[0],
    outcome: t.outcome,
    children: [],
  } as SuiteReport
  add(r.children, t, ancestorNames.slice(1))
  report.push(r)
}

export const addToReport = (report: Array<Report>) => (t: TestReport): void => (
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

const renderReport = (out: WriteStream, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out, indentLevel)(r)
  else {
    out.write('  '.repeat(indentLevel))
    out.write(`${r.name}\n`)
    r.children.forEach(renderReport(out, indentLevel + 1))
  }
}

const renderSuite = (report: Array<Report>, config: Config) => {
  report.forEach(renderReport(config.out, 0))
}

export const register = (host: Reporters, config: Config): void => {
  const fileReport: Array<Report> = []
  host.onSuiteStart.push(() => { fileReport.length = 0 })
  host.onTestFinish.push(addToReport(fileReport))
  host.onSuiteFinish.push(() => renderSuite(fileReport, config))
}
