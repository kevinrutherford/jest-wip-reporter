import { WriteStream } from 'tty'
import { TestReport } from './report'
import * as progressDots from './progress-dots'
import * as progressTree from './progress-tree'

export const renderTestReport = (out: WriteStream, indentLevel: number) => (outcome: TestReport): void => {
  if (process.env.JWR_VERBOSE)
    progressTree.renderTestReport(out, indentLevel)(outcome)
  else
    progressDots.renderTestReport(out)(outcome)
}
