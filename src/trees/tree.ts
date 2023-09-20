import { TestOutcome } from '../test-outcome'

export type LeafNode = {
  label: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type SuiteReport = {
  label: string,
  outcome: TestOutcome,
  children: Array<Report>,
}

export type Report = LeafNode | SuiteReport
