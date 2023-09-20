import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { TestReport } from '../test-report'
import { TreeNode } from './tree'

const add = (forest: Array<TreeNode>, newLeaf: TreeNode, ancestorNames: TestReport['ancestorNames']): void => {
  if (ancestorNames.length === 0) {
    forest.push(newLeaf)
    return
  }
  const ancestor = pipe(
    forest,
    RA.filter((node) => node.label === ancestorNames[0]),
    RA.head,
    O.getOrElseW(() => undefined),
  )
  if (ancestor !== undefined) {
    add(ancestor.children, newLeaf, ancestorNames.slice(1))
    switch (newLeaf.outcome) {
      case 'fail':
        ancestor.outcome = newLeaf.outcome
        break
      case 'wip':
        if (ancestor.outcome === 'pass')
          ancestor.outcome = newLeaf.outcome
        break
      case 'pass':
        break
    }
    return
  }
  const r: TreeNode = {
    label: ancestorNames[0],
    outcome: newLeaf.outcome,
    children: [],
  }
  add(r.children, newLeaf, ancestorNames.slice(1))
  forest.push(r)
}

export const addToReport = (forest: Array<TreeNode>) => (t: TestReport): void => {
  const newLeaf: TreeNode = {
    label: t.name,
    outcome: t.outcome,
    children: [],
  }
  add(forest, newLeaf, t.ancestorNames)
}
