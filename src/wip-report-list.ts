import chalk from 'chalk'
import { Config } from './config'
import { TestReport } from './report'
import { Reporters } from './reporters'

const rememberWipTests = (wipTests: Array<TestReport>) => (r: TestReport): void => {
  if (r.outcome === 'wip')
    wipTests.push(r)
}

const renderWipTitles = (wipTests: Array<TestReport>, config: Config): void => {
  const wipPen = (s: string) => config.out.write(chalk.yellowBright(s))
  if (wipTests.length > 0) {
    wipPen('\n\nWork in progress:\n')
    wipTests.forEach((r: TestReport) => {
      wipPen(`? ${r.fullyQualifiedName}\n`)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const register = (host: Reporters, config: Config): void => {
  const wipTests: Array<TestReport> = []
  host.onTestFinish.push(rememberWipTests(wipTests))
  host.onRunFinish.push(() => renderWipTitles(wipTests, config))
}
