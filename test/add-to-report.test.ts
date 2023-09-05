import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as FR from '../src/file-report'
import { isSuiteReport, isTestReport } from '../src/report'
import { arbitraryString } from './helpers'

describe('addToReport', () => {
  describe('given a test with an ancestor', () => {
    const ancestorName = arbitraryString()
    const name = arbitraryString()
    const suiteNode = pipe(
      [
        {
          _tag: 'test-report',
          name,
          fullyQualifiedName: arbitraryString(),
          ancestorNames: [ancestorName],
          outcome: 'pass',
        },
      ],
      FR.constructTreeOfSuites,
      RA.head,
      O.getOrElseW(() => { throw new Error('Expected at least one node in the tree') }),
      O.fromPredicate(isSuiteReport),
      O.getOrElseW(() => { throw new Error('Expected the root node to be a suite') }),
    )

    it('adds a suite whose name is that of the ancestor', () => {
      expect(suiteNode.name).toBe(ancestorName)
    })

    it('adds the test as a child of the suite', () => {
      const firstChild = suiteNode.children[0]

      expect(isTestReport(firstChild)).toBe(true)
    })
  })

  describe('given two tests with the same single ancestor', () => {
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
          outcome: 'pass',
        },
        {
          _tag: 'test-report',
          name: name2,
          fullyQualifiedName: arbitraryString(),
          ancestorNames: [ancestorName],
          outcome: 'pass',
        },
      ],
      FR.constructTreeOfSuites,
      RA.head,
      O.getOrElseW(() => { throw new Error('Expected at least one node in the tree') }),
      O.fromPredicate(isSuiteReport),
      O.getOrElseW(() => { throw new Error('Expected the root node to be a suite') }),
    )

    it.failing('adds both tests as children of the same suite node', () => {
      expect(suiteNode.children).toHaveLength(2)
    })
  })
})
