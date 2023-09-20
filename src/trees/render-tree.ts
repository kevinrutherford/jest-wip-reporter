import { Config } from '../config'
import { TestOutcome } from '../test-outcome'
import { isTestReport, LeafNode, Report } from './tree'

const dots: Record<TestOutcome, string> = {
  pass: '✓',
  wip: '?',
  fail: 'x',
}

export const renderTestReport = (config: Config, indentLevel: number) => (node: LeafNode): void => {
  const dot = dots[node.outcome]
  const pen = config.pens[node.outcome]
  pen('  '.repeat(indentLevel))
  pen(`${dot} ${node.name}\n`)
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
