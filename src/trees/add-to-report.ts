import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { TestReport } from '../test-report'
import { TreeNode } from './tree'

const add = (report: Array<TreeNode>, t: TestReport, ancestorNames: TestReport['ancestorNames']): void => {
  if (ancestorNames.length === 0) {
    report.push({
      label: t.name,
      outcome: t.outcome,
      children: [],
    })
    return
  }
  const ancestor = pipe(
    report,
    RA.filter((node) => node.label === ancestorNames[0]),
    RA.head,
    O.getOrElseW(() => undefined),
  )
  if (ancestor !== undefined) {
    add(ancestor.children, t, ancestorNames.slice(1))
    switch (t.outcome) {
      case 'fail':
        ancestor.outcome = t.outcome
        break
      case 'wip':
        if (ancestor.outcome === 'pass')
          ancestor.outcome = t.outcome
        break
      case 'pass':
        break
    }
    return
  }
  const r: TreeNode = {
    label: ancestorNames[0],
    outcome: t.outcome,
    children: [],
  }
  add(r.children, t, ancestorNames.slice(1))
  report.push(r)
}

export const addToReport = (report: Array<TreeNode>) => (t: TestReport): void => (
  add(report, t, t.ancestorNames)
)
