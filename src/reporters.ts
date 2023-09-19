import { TestReport } from './test-report'

export type FailureMessage = {
  failureMessage?: string | null,
}

export type RunResults = {
  startTime: number,
  testResults: Array<FailureMessage>,
}

type SuiteStartReporter = () => void
type TestFinishReporter = (r: TestReport) => void
type SuiteFinishReporter = () => void
type RunFinishReporter = (runResults: RunResults) => void

export type Reporters = {
  onSuiteStart: Array<SuiteStartReporter>,
  onTestFinish: Array<TestFinishReporter>,
  onSuiteFinish: Array<SuiteFinishReporter>,
  onRunFinish: Array<RunFinishReporter>,
}
