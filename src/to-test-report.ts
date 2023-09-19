import { classify } from './classify'
import { TestReport } from './test-report'
import { TestRun } from './test-run'

export const toTestReport = (run: TestRun): TestReport => ({
  _tag: 'test-report',
  name: run.title,
  fullyQualifiedName: run.fullName,
  ancestorNames: run.ancestorTitles,
  outcome: classify(run),
})
