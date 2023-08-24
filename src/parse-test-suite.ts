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
  const result: ParsedSuite = {
    passedCount: 0,
    failedCount: 0,
    wipTitles: [],
    outcomes: [],
  }
  suite.forEach((currentRun) => {
    const status = identifyState(currentRun.status)
    switch (status) {
      case 'pass':
        result.passedCount += 1
        break
      case 'wip':
        result.wipTitles.push(currentRun.fullName)
        break
      case 'fail':
        result.failedCount += 1
        break
    }
    result.outcomes.push({
      title: currentRun.fullName,
      status,
    })
  })
  return result
}
