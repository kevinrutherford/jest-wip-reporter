import { Config } from '../config'
import { TestOutcome } from '../test-outcome'

const dots: Record<TestOutcome, string> = {
  pass: '.',
  wip: '?',
  fail: 'x',
}

type Reportable = {
  outcome: TestOutcome,
}

export const renderDot = (config: Config) => (t: Reportable): void => {
  const dot = dots[t.outcome]
  config.pens[t.outcome](dot)
}
