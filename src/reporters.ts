import { WriteStream } from 'tty'
import { TestReport } from './report'

export type Config = {
  out: WriteStream,
}

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
