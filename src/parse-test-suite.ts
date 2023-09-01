/* eslint-disable no-param-reassign */
import { classify } from './classify'
import { SuiteReport, TestReport } from './suite-report'
import { SuiteSummary } from './suite-summary'
import { TestRun } from './test-run'

export const toTestReport = (run: TestRun): TestReport => ({
  _tag: 'test-report',
  title: run.fullName,
  outcome: classify(run),
})

export const recordOn = (report: SuiteSummary) => (t: TestReport): TestReport => {
  switch (t.outcome) {
    case 'pass':
      report.passedCount += 1
      break
    case 'wip':
      report.wipTitles.push(t.title)
      break
    case 'fail':
      report.failedCount += 1
      break
  }
  return t
}

export const parseTestSuite = (suite: Array<TestRun>): SuiteReport => {
  const result: SuiteReport = {
    passedCount: 0,
    failedCount: 0,
    wipTitles: [],
    outcomes: [],
  }
  suite.forEach((currentRun) => {
    const t = toTestReport(currentRun)
    recordOn(result)(t)
    result.outcomes.push(t)
  })
  return result
}
