export type TestOutcome = 'pass' | 'wip' | 'fail'

export type TestReport = {
  _tag: 'test-report',
  title: string,
  outcome: TestOutcome,
}
