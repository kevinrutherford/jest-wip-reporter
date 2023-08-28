import { SuiteSummary } from './suite-summary'

export type TestOutcome = 'pass' | 'wip' | 'fail'

type TestReport = {
  title: string,
  outcome: TestOutcome,
}

export type SuiteReport = SuiteSummary & {
  outcomes: Array<TestReport>,
}
