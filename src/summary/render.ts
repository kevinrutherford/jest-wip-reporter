import chalk from 'chalk'
import { FailureMessage, RunResults } from '../reporters'
import { Config } from '../config'
import { CollectionSummary } from './collection-summary'

export const render = (summary: CollectionSummary, config: Config) => (runResults: RunResults): void => {
  runResults.testResults.forEach((tr: FailureMessage) => {
    config.write(tr.failureMessage ?? '')
  })
  config.write('\nTests: ')
  const report = []
  if (summary.passedCount + summary.wipTitles.length + summary.failedCount === 0)
    report.push(chalk.yellowBright('0 run'))
  else {
    if (summary.passedCount > 0)
      report.push(chalk.greenBright(`${summary.passedCount} passed`))
    if (summary.wipTitles.length > 0)
      report.push(chalk.yellowBright(`${summary.wipTitles.length} wip`))
    if (summary.failedCount > 0)
      report.push(chalk.redBright(`${summary.failedCount} failed`))
  }
  config.write(report.join(', '))
  const runTime = (Date.now() - runResults.startTime) / 1000
  config.write(`\nTime: ${runTime}s\n`)
}
