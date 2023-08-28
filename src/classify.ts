import { TestOutcome } from './suite-report'
import { TestRun } from './test-run'

export const classify = (run: TestRun): TestOutcome => {
  if (run.numPassingAsserts === 0)
    return 'wip'
  switch (run.status) {
    case 'passed':
      return 'pass'
    case 'todo':
    case 'pending':
    case 'skipped':
    case 'disabled':
      return 'wip'
    default:
      return 'fail'
  }
}
