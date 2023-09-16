import { Config } from '../config'
import { TestReport } from '../report'
import { Reporters } from '../reporters'
import { TestOutcome } from '../test-outcome'

const dots: Record<TestOutcome, string> = {
  pass: '.',
  wip: '?',
  fail: 'x',
}

const renderTestReport = (config: Config) => (t: TestReport): void => {
  const dot = dots[t.outcome]
  config.pens[t.outcome](dot)
}

export const register = (host: Reporters, config: Config): void => {
  host.onTestFinish.push(renderTestReport(config))
}
