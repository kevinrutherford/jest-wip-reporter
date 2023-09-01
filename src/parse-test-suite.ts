/* eslint-disable no-param-reassign */
import { classify } from './classify'
import { TestReport } from './test-report'
import { CollectionSummary } from './collection-summary'
import { TestRun } from './test-run'

export const toTestReport = (run: TestRun): TestReport => ({
  _tag: 'test-report',
  title: run.fullName,
  outcome: classify(run),
})

export const recordOn = (report: CollectionSummary) => (t: TestReport): TestReport => {
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
