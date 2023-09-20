import { TestOutcome } from '../test-outcome'

export type LeafNode = {
  _tag: 'test-report',
  name: string,
  outcome: TestOutcome,
}

export type SuiteReport = {
  _tag: 'suite-report',
  name: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type Report = LeafNode | SuiteReport

export const isTestReport = (r: Report): r is LeafNode => r._tag === 'test-report'

export const isSuiteReport = (r: Report): r is SuiteReport => r._tag === 'suite-report'
