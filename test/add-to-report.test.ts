import * as FR from '../src/file-report'
import { isTestReport } from '../src/report'
import { arbitraryString } from './helpers'

describe('addToReport', () => {
  describe('given a test with an ancestor', () => {
    const ancestorName = arbitraryString()
    const name = arbitraryString()
    const fileReport = FR.constructTreeOfSuites([
      {
        _tag: 'test-report',
        name,
        fullyQualifiedName: arbitraryString(),
        ancestorNames: [ancestorName],
        outcome: 'pass',
      },
    ])

    it.failing('adds a suite whose name is that of the ancestor', () => {
      expect(isTestReport(fileReport[0])).toBe(false)
    })

    it.todo('adds the test as a child of the suite')
  })
})
