import { WriteStream } from 'tty'
import { TestReport } from './report'

export type Config = {
  out: WriteStream,
}

export type RunResults = {
  startTime: number,
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
