import { Config } from './config'
import { TestReport } from './report'
import { Reporters } from './reporters'

const renderTestReport = (config: Config) => (t: TestReport): void => {
  let indicator: string
  switch (t.outcome) {
    case 'pass':
      indicator = '.'
      break
    case 'wip':
      indicator = '?'
      break
    case 'fail':
      indicator = 'x'
      break
  }
  config.pens[t.outcome](indicator)
}

export const register = (host: Reporters, config: Config): void => {
  host.onTestFinish.push(renderTestReport(config))
}
