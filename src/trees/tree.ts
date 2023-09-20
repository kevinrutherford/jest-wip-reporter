import { TestOutcome } from '../test-outcome'

export type TreeNode = {
  label: string,
  outcome: TestOutcome,
  children: Array<TreeNode>,
}
