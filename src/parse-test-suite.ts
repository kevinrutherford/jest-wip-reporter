import { SuiteReport, TestOutcome } from './suite-report'

export type TestRun = {
  ancestorTitles: Array<string>,
  fullName: string,
  status: string,
}

const classify = (run: TestRun): TestOutcome => {
  switch (run.status) {
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

export const parseTestSuite = (suite: Array<TestRun>): SuiteReport => {
  const result: SuiteReport = {
    passedCount: 0,
    failedCount: 0,
    wipTitles: [],
    outcomes: [],
  }
  suite.forEach((currentRun) => {
    const outcome = classify(currentRun)
    switch (outcome) {
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
      outcome,
    })
  })
  return result
}
