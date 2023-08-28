export type TestOutcome = 'pass' | 'wip' | 'fail'

type TestReport = {
  title: string,
  outcome: TestOutcome,
}

export type SuiteSummary = {
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

export type SuiteReport = SuiteSummary & {
  outcomes: Array<TestReport>,
}
