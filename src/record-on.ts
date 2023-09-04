/* eslint-disable no-param-reassign */
import { TestReport } from './test-report'
import { CollectionSummary } from './collection-summary'

export const recordOn = (report: CollectionSummary) => (t: TestReport): TestReport => {
  switch (t.outcome) {
    case 'pass':
      report.passedCount += 1
      break
    case 'wip':
      report.wipTitles.push(t.fullyQualifiedName)
      break
    case 'fail':
      report.failedCount += 1
      break
  }
  return t
}
