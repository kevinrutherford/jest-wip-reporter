import chalk from 'chalk'
import { WriteStream } from 'tty'
import { TestReport } from './report'
import { Config, Reporters } from './reporters'

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
export const register = (host: Reporters, config: Config): void => {
  host.onTestFinish.push(renderTestReport(config.out))
}
