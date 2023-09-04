export type TestOutcome = 'pass' | 'wip' | 'fail'

export type TestReport = {
  _tag: 'test-report',
  name: string,
  fullyQualifiedName: string,
  outcome: TestOutcome,
}

export type Report = TestReport

export const isTestReport = (r: Report): r is TestReport => r._tag === 'test-report'
