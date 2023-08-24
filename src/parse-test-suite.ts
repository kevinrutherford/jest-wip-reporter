type TestStatus = 'pass' | 'wip' | 'fail'

type TestOutcome = {
  title: string,
  status: TestStatus,
}

type ParsedSuite = {
  outcome: TestOutcome,
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

export type TestRun = {
  ancestorTitles: Array<string>,
  fullName: string,
  status: string,
}

const identifyState = (input: string): TestStatus => {
  switch (input) {
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

export const parseTestSuite = (suite: Array<TestRun>): ParsedSuite => ({
  outcome: {
    title: suite[0].fullName,
    status: identifyState(suite[0].status),
  },
  passedCount: 0,
  failedCount: 0,
  wipTitles: [],
})
