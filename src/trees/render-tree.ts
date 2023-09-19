import { isTestReport, Report } from '../report'
import { Config } from '../config'
import { TestOutcome } from '../test-outcome'
import { TestReport } from '../test-report'

const dots: Record<TestOutcome, string> = {
  pass: '✓',
  wip: '?',
  fail: 'x',
}

export const renderTestReport = (config: Config, indentLevel: number) => (outcome: TestReport): void => {
  const dot = dots[outcome.outcome]
  const pen = config.pens[outcome.outcome]
  pen('  '.repeat(indentLevel))
  pen(`${dot} ${outcome.name}\n`)
}

const renderReport = (config: Config, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(config, indentLevel)(r)
  else {
    const pen = config.pens[r.outcome]
    pen('  '.repeat(indentLevel))
    pen(`${r.name}\n`)
    r.children.forEach(renderReport(config, indentLevel + 1))
  }
}

export const renderSuite = (report: Array<Report>, config: Config): void => {
  report.forEach(renderReport(config, 0))
}
