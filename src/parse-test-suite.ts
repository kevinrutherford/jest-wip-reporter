type TestStatus = 'pass' | 'wip' | 'fail'

type TestOutcome = {
  title: string,
  status: TestStatus,
}

type SuiteSummary = {
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

type ParsedSuite = SuiteSummary & {
  outcomes: Array<TestOutcome>,
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

export const parseTestSuite = (suite: Array<TestRun>): ParsedSuite => {
  const summary: SuiteSummary = {
    passedCount: 0,
    failedCount: 0,
    wipTitles: [],
  }
  const currentRun = suite[0]
  const status = identifyState(currentRun.status)
  switch (status) {
    case 'pass':
      summary.passedCount += 1
      break
    case 'wip':
      summary.wipTitles.push(currentRun.fullName)
      break
    case 'fail':
      summary.failedCount += 1
      break
  }
  return ({
    outcomes: [
      {
        title: currentRun.fullName,
        status,
      },
    ],
    ...summary,
  })
}
