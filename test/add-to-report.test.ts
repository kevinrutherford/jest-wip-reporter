import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { isTestReport, Report } from '../src/trees/tree'
import { arbitraryString } from './helpers'
import * as progressTree from '../src/progress/progress-tree'
import { TestOutcome } from '../src/test-outcome'
import { TestReport } from '../src/test-report'

const constructTreeOfSuites = (report: ReadonlyArray<TestReport>): Array<Report> => pipe(
  report,
  RA.reduce([], (fr: Array<Report>, r: TestReport) => {
    progressTree.addToReport(fr)(r)
    return fr
  }),
)

describe('addToReport', () => {
  describe('given a test with an ancestor', () => {
    const ancestorName = arbitraryString()
    const name = arbitraryString()
    const suiteNode = pipe(
      [
        {
          name,
          fullyQualifiedName: arbitraryString(),
          ancestorNames: [ancestorName],
          outcome: 'pass',
        },
      ],
      constructTreeOfSuites,
      RA.head,
      O.getOrElseW(() => { throw new Error('Expected at least one node in the tree') }),
    )

    it('adds a suite whose name is that of the ancestor', () => {
      expect(suiteNode.label).toBe(ancestorName)
    })

    it('adds the test as a child of the suite', () => {
      const firstChild = suiteNode.children[0]

      expect(isTestReport(firstChild)).toBe(true)
    })
  })

  describe('given two tests with the same single ancestor', () => {
    describe.each([
      ['pass', 'pass', 'pass'],
      ['pass', 'wip', 'wip'],
      ['pass', 'fail', 'fail'],
      ['wip', 'pass', 'wip'],
      ['wip', 'wip', 'wip'],
      ['wip', 'fail', 'fail'],
      ['fail', 'pass', 'fail'],
      ['fail', 'wip', 'fail'],
      ['fail', 'fail', 'fail'],
    ])('when the test outcomes are %s and %s', (outcome1, outcome2, expectedAncestorOutcome) => {
      const ancestorName = arbitraryString()
      const name1 = arbitraryString()
      const name2 = arbitraryString()
      const suiteNode = pipe(
        [
          {
            _tag: 'test-report',
            name: name1,
            fullyQualifiedName: arbitraryString(),
            ancestorNames: [ancestorName],
            outcome: outcome1 as TestOutcome,
          },
          {
            _tag: 'test-report',
            name: name2,
            fullyQualifiedName: arbitraryString(),
            ancestorNames: [ancestorName],
            outcome: outcome2 as TestOutcome,
          },
        ],
        constructTreeOfSuites,
        RA.head,
        O.getOrElseW(() => { throw new Error('Expected at least one node in the tree') }),
      )

      it('adds both tests as children of the same suite node', () => {
        expect(suiteNode.children).toHaveLength(2)
      })

      it(`sets the outcome of the suite to ${expectedAncestorOutcome}`, () => {
        expect(suiteNode.outcome).toBe(expectedAncestorOutcome)
      })
    })
  })

  describe('given a single test with a grandparent', () => {
    let parent: Report

    beforeEach(() => {
      const grandparentName = arbitraryString()
      const parentName = arbitraryString()
      const name = arbitraryString()
      parent = pipe(
        [
          {
            name,
            fullyQualifiedName: arbitraryString(),
            ancestorNames: [grandparentName, parentName],
            outcome: 'pass',
          },
        ],
        constructTreeOfSuites,
        RA.head,
        O.getOrElseW(() => { throw new Error('Expected at least one node in the tree') }),
        (grandparent) => grandparent.children,
        RA.head,
        O.getOrElseW(() => { throw new Error('Expected at least one intermediate parent') }),
      )
    })

    it('adds the test as a child of an intermediate parent', () => {
      expect(parent.children).toHaveLength(1)
    })
  })
})
