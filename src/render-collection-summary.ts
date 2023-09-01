import chalk from 'chalk'
import { WriteStream } from 'tty'
import { CollectionSummary } from './collection-summary'

export const renderCollectionSummary = (out: WriteStream) => (summary: CollectionSummary): void => {
  out.write('Tests: ')
  const report = []
  if (summary.passedCount > 0)
    report.push(chalk.greenBright(`${summary.passedCount} passed`))
  if (summary.wipTitles.length > 0)
    report.push(chalk.yellowBright(`${summary.wipTitles.length} wip`))
  if (summary.failedCount > 0)
    report.push(chalk.redBright(`${summary.failedCount} failed`))
  out.write(report.join(', '))
}
