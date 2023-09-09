import chalk from 'chalk'
import { WriteStream } from 'tty'
import { isTestReport, Report, TestReport } from './report'

const renderTestReport = (out: WriteStream) => (outcome: TestReport): void => {
  let indicator: string
  let pen: chalk.Chalk
  switch (outcome.outcome) {
    case 'pass':
      indicator = '.'
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
}

export const renderReport = (out: WriteStream) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out)(r)
  else
    r.children.forEach(renderReport(out))
}
