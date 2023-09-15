import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import {
  isSuiteReport, isTestReport, Report, SuiteReport, TestReport,
} from './report'
import { Reporters } from './reporters'
import { Config } from './config'

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

const renderTestReport = (config: Config, indentLevel: number) => (outcome: TestReport): void => {
  let indicator: string
  const pen = config.pens[outcome.outcome]
  switch (outcome.outcome) {
    case 'pass':
      indicator = '✓'
      break
    case 'wip':
      indicator = '?'
      break
    case 'fail':
      indicator = 'x'
      break
  }
  pen('  '.repeat(indentLevel))
  pen(indicator)
  pen(` ${outcome.name}\n`)
}

const renderReport = (config: Config, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(config, indentLevel)(r)
  else {
    const pen = config.pens[r.outcome]
    pen('  '.repeat(indentLevel))
    pen(`${r.name}\n`)
    r.children.forEach(renderReport(config, indentLevel + 1))
  }
}

const renderSuite = (report: Array<Report>, config: Config) => {
  report.forEach(renderReport(config, 0))
}

export const register = (host: Reporters, config: Config): void => {
  const fileReport: Array<Report> = []
  host.onSuiteStart.push(() => { fileReport.length = 0 })
  host.onTestFinish.push(addToReport(fileReport))
  host.onSuiteFinish.push(() => renderSuite(fileReport, config))
}
