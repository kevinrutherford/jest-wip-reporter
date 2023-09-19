import { classify } from './classify'
import { TestReport } from './test-report'
import { TestRun } from './test-run'

export const toTestReport = (run: TestRun): TestReport => ({
  name: run.title,
  fullyQualifiedName: run.fullName,
  ancestorNames: run.ancestorTitles,
  outcome: classify(run),
})
