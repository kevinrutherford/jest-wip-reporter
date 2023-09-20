import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Reporters } from '../reporters'
import { Config } from '../config'
import { TestReport } from '../test-report'
import {
  isSuiteReport, renderSuite, Report, SuiteReport,
} from '../trees'

const add = (report: Array<Report>, t: TestReport, ancestorNames: TestReport['ancestorNames']): void => {
  if (ancestorNames.length === 0) {
    report.push({
      _tag: 'test-report',
      label: t.name,
      outcome: t.outcome,
    })
    return
  }
  const ancestor = pipe(
    report,
    RA.filter((node) => node.label === ancestorNames[0]),
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
    label: ancestorNames[0],
    outcome: t.outcome,
    children: [],
  } as SuiteReport
  add(r.children, t, ancestorNames.slice(1))
  report.push(r)
}

export const addToReport = (report: Array<Report>) => (t: TestReport): void => (
  add(report, t, t.ancestorNames)
)

export const register = (host: Reporters, config: Config): void => {
  const fileReport: Array<Report> = []
  host.onSuiteStart.push(() => { fileReport.length = 0 })
  host.onTestFinish.push(addToReport(fileReport))
  host.onSuiteFinish.push(() => renderSuite(fileReport, config))
}
