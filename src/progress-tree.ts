import chalk from 'chalk'
import { WriteStream } from 'tty'
import { isTestReport, Report, TestReport } from './report'

const renderTestReport = (out: WriteStream, indentLevel: number) => (outcome: TestReport): void => {
  out.write('  '.repeat(indentLevel))
  let indicator: string
  let pen: chalk.Chalk
  switch (outcome.outcome) {
    case 'pass':
      indicator = '✓'
      pen = chalk.greenBright
      break
    case 'wip':
      indicator = '?'
      pen = chalk.yellowBright
      break
    case 'fail':
      indicator = 'x'
      pen = chalk.redBright
      break
  }
  out.write(pen(indicator))
  out.write(` ${pen(outcome.name)}\n`)
}

export const renderReport = (out: WriteStream, indentLevel: number) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out, indentLevel)(r)
  else {
    out.write('  '.repeat(indentLevel))
    out.write(`${r.name}\n`)
    r.children.forEach(renderReport(out, indentLevel + 1))
  }
}
