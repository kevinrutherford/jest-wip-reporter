export type TestOutcome = 'pass' | 'wip' | 'fail'

export type TestReport = {
  _tag: 'test-report',
  name: string,
  fullyQualifiedName: string,
  outcome: TestOutcome,
}
