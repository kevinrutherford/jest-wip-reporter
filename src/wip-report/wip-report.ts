import { Config } from '../config'
import { addToReport } from '../progress/progress-tree'
import { Report, TestReport } from '../report'
import { Reporters } from '../reporters'
import { renderSuite } from '../trees/render-tree'

const rememberWipTests = (wipTests: Array<TestReport>) => (r: TestReport): void => {
  if (r.outcome === 'wip')
    wipTests.push(r)
}

const renderWipTitles = (wipTests: Array<TestReport>, config: Config): void => {
  const wipPen = config.pens.wip
  if (wipTests.length > 0) {
    wipPen('\n\nWork in progress:\n\n')
    wipTests.forEach((r: TestReport) => {
      wipPen(`? ${r.fullyQualifiedName}\n`)
    })
  }
}

const renderWipTree = (wipTests: Array<TestReport>, config: Config): void => {
  if (wipTests.length > 0) {
    const fileReport: Array<Report> = []
    wipTests.forEach(addToReport(fileReport))
    const wipPen = config.pens.wip
    wipPen('\n\nWork in progress:\n\n')
    renderSuite(fileReport, config)
  }
}

export const register = (host: Reporters, config: Config): void => {
  const wipTests: Array<TestReport> = []
  host.onTestFinish.push(rememberWipTests(wipTests))
  const renderer = process.env.JWR_WIP_REPORT === 'list'
    ? () => renderWipTitles(wipTests, config)
    : () => renderWipTree(wipTests, config)
  host.onRunFinish.push(renderer)
}
