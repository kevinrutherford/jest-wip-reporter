import chalk from 'chalk'
import { WriteStream } from 'tty'
import { TestReport } from './suite-report'

type Report = TestReport

const isTestReport = (r: Report): r is TestReport => r._tag === 'test-report'

export const renderTestReport = (out: WriteStream) => (outcome: TestReport): void => {
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
  if (process.env.JWR_VERBOSE)
    out.write(` ${pen(outcome.title)}\n`)
}

export const renderReport = (out: WriteStream) => (r: Report): void => {
  if (isTestReport(r))
    renderTestReport(out)(r)
  else
    throw new Error('Unknown type of report')
}
