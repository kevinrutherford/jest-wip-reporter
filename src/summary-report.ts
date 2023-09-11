/* eslint-disable no-param-reassign */
import chalk from 'chalk'
import {
  Config, FailureMessage, Reporters, RunResults,
} from './reporters'
import { TestReport } from './report'

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

const recordOn = (report: CollectionSummary) => (t: TestReport): TestReport => {
  switch (t.outcome) {
    case 'pass':
      report.passedCount += 1
      break
    case 'wip':
      report.wipTitles.push(t.fullyQualifiedName)
      break
    case 'fail':
      report.failedCount += 1
      break
  }
  return t
}

const renderCollectionSummary = (summary: CollectionSummary, config: Config) => (runResults: RunResults): void => {
  runResults.testResults.forEach((tr: FailureMessage) => {
    config.out.write(tr.failureMessage ?? '')
  })
  config.out.write('\nTests: ')
  const report = []
  if (summary.passedCount > 0)
    report.push(chalk.greenBright(`${summary.passedCount} passed`))
  if (summary.wipTitles.length > 0)
    report.push(chalk.yellowBright(`${summary.wipTitles.length} wip`))
  if (summary.failedCount > 0)
    report.push(chalk.redBright(`${summary.failedCount} failed`))
  config.out.write(report.join(', '))
  const runTime = (Date.now() - runResults.startTime) / 1000
  config.out.write(`\nTime: ${runTime}s\n`)
}

export const register = (host: Reporters, config: Config): void => {
  const report = create()
  host.onTestFinish.push(recordOn(report))
  host.onRunFinish.push(renderCollectionSummary(report, config))
}