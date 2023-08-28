import chalk = require('chalk')
import { WriteStream } from 'tty'

export type SuiteSummary = {
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

export const summarise = (out: WriteStream) => (ss: SuiteSummary): void => {
  out.write('Tests: ')
  const report = []
  if (ss.passedCount > 0)
    report.push(chalk.greenBright(`${ss.passedCount} passed`))
  if (ss.wipTitles.length > 0)
    report.push(chalk.yellowBright(`${ss.wipTitles.length} wip`))
  if (ss.failedCount > 0)
    report.push(chalk.redBright(`${ss.failedCount} failed`))
  out.write(report.join(', '))
}
