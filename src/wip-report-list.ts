import chalk from 'chalk'
import { TestReport } from './report'
import { Config, Reporters } from './reporters'

const rememberWipTests = (wipTests: Array<TestReport>) => (r: TestReport): void => {
  if (r.outcome === 'wip')
    wipTests.push(r)
}

const renderWipTitles = (wipTests: Array<TestReport>, config: Config): void => {
  if (wipTests.length > 0) {
    config.out.write(chalk.yellowBright('\n\nWork in progress:\n'))
    wipTests.forEach((r: TestReport) => {
      config.out.write(chalk.yellowBright(`? ${r.fullyQualifiedName}\n`))
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const register = (host: Reporters, config: Config): void => {
  const wipTests: Array<TestReport> = []
  host.onTestFinish.push(rememberWipTests(wipTests))
  host.onRunFinish.push(() => renderWipTitles(wipTests, config))
}
