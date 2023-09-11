import chalk from 'chalk'
import { WriteStream } from 'tty'
import { Reporters } from './reporters'

export type CollectionSummary = {
  passedCount: number,
  failedCount: number,
  wipTitles: Array<string>,
}

export const create = (): CollectionSummary => ({
  passedCount: 0,
  wipTitles: [],
  failedCount: 0,
})

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const register = (host: Reporters): void => {
}
