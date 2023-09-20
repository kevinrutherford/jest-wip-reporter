import { Config } from '../config'
import { TestOutcome } from '../test-outcome'
import { TreeNode } from './tree'

const dots: Record<TestOutcome, string> = {
  pass: '✓',
  wip: '?',
  fail: 'x',
}

export const renderTestReport = (config: Config, indentLevel: number) => (node: TreeNode): void => {
  const dot = dots[node.outcome]
  const pen = config.pens[node.outcome]
  pen('  '.repeat(indentLevel))
  pen(`${dot} ${node.label}\n`)
}

const renderReport = (config: Config, indentLevel: number) => (r: TreeNode): void => {
  if (r.children.length === 0)
    renderTestReport(config, indentLevel)(r)
  else {
    const pen = config.pens[r.outcome]
    pen('  '.repeat(indentLevel))
    pen(`${r.label}\n`)
    r.children.forEach(renderReport(config, indentLevel + 1))
  }
}

export const renderSuite = (report: Array<TreeNode>, config: Config): void => {
  report.forEach(renderReport(config, 0))
}
