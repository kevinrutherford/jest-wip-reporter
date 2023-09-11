import { TestReport } from './report'

type SuiteStartReporter = () => void
type TestFinishReporter = (r: TestReport) => void
type SuiteFinishReporter = () => void
type RunFinishReporter = () => void

export type Reporters = {
  onSuiteStart: Array<SuiteStartReporter>,
  onTestFinish: Array<TestFinishReporter>,
  onSuiteFinish: Array<SuiteFinishReporter>,
  onRunFinish: Array<RunFinishReporter>,
}
