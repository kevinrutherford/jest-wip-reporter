import { TestOutcome } from '../test-outcome'

export type LeafNode = {
  _tag: 'test-report',
  label: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type SuiteReport = {
  _tag: 'suite-report',
  label: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type Report = LeafNode | SuiteReport
