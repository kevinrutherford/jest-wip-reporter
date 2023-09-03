import chalk from 'chalk'
import { WriteStream } from 'tty'
import { TestReport } from './test-report'

export type Report = TestReport

export const isTestReport = (r: Report): r is TestReport => r._tag === 'test-report'

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
