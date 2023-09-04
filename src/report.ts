export type TestOutcome = 'pass' | 'wip' | 'fail'

export type TestReport = {
  _tag: 'test-report',
  name: string,
  fullyQualifiedName: string,
  outcome: TestOutcome,
}

export type SuiteReport = {
  _tag: 'suite-report',
  name: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type Report = TestReport | SuiteReport

export const isTestReport = (r: Report): r is TestReport => r._tag === 'test-report'
