import { Reporters } from '../reporters'
import { Config } from '../config'
import { addToReport, renderSuite, TreeNode } from '../trees'

export const register = (host: Reporters, config: Config): void => {
  const fileReport: Array<TreeNode> = []
  host.onSuiteStart.push(() => { fileReport.length = 0 })
  host.onTestFinish.push(addToReport(fileReport))
  host.onSuiteFinish.push(() => renderSuite(fileReport, config))
}
