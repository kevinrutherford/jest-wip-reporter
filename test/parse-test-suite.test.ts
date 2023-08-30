import { parseTestSuite } from '../src/parse-test-suite'
import { TestRun } from '../src/test-run'
import { arbitraryString } from './helpers'

describe('parseTestSuite', () => {
  describe.each([
    ['todo'],
    ['pending'],
    ['skipped'],
    ['disabled'],
  ])('given a single %s test with no ancestors', (status) => {
    const title = arbitraryString()
    const jestSuiteReport: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        numPassingAsserts: 1,
        status: status as TestRun['status'],
      },
    ]
    const parsed = parseTestSuite(jestSuiteReport)

    it('reports the test name', () => {
      expect(parsed.outcomes[0].title).toBe(title)
    })

    it('reports that the suite is in the WIP state', () => {
      expect(parsed.outcomes[0].outcome).toBe('wip')
    })

    it('reports that 0 tests passed', () => {
      expect(parsed.passedCount).toBe(0)
    })

    it('reports the name of the WIP test', () => {
      expect(parsed.wipTitles).toStrictEqual([title])
    })

    it('reports that 0 tests failed', () => {
      expect(parsed.failedCount).toBe(0)
    })
  })

  describe('given a single passing test with no ancestors', () => {
    const title = arbitraryString()
    const jestSuiteReport: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        numPassingAsserts: 1,
        status: 'passed',
      },
    ]
    const parsed = parseTestSuite(jestSuiteReport)

    it('reports the test name', () => {
      expect(parsed.outcomes[0].title).toBe(title)
    })

    it('reports that the suite is in the pass state', () => {
      expect(parsed.outcomes[0].outcome).toBe('pass')
    })

    it('reports that 1 test passed', () => {
      expect(parsed.passedCount).toBe(1)
    })

    it('reports that there are no WIP tests', () => {
      expect(parsed.wipTitles).toStrictEqual([])
    })

    it('reports that 0 tests failed', () => {
      expect(parsed.failedCount).toBe(0)
    })
  })

  describe('given a single failing test with no ancestors', () => {
    const title = arbitraryString()
    const jestSuiteReport: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        numPassingAsserts: 1,
        status: 'failed',
      },
    ]
    const parsed = parseTestSuite(jestSuiteReport)

    it('reports the test name', () => {
      expect(parsed.outcomes[0].title).toBe(title)
    })

    it('reports that the suite is in the pass state', () => {
      expect(parsed.outcomes[0].outcome).toBe('fail')
    })

    it('reports that 0 tests passed', () => {
      expect(parsed.passedCount).toBe(0)
    })

    it('reports that there are no WIP tests', () => {
      expect(parsed.wipTitles).toStrictEqual([])
    })

    it('reports that 1 test failed', () => {
      expect(parsed.failedCount).toBe(1)
    })
  })

  describe('given multiple tests with no ancestors', () => {
    const title0 = arbitraryString()
    const title1 = arbitraryString()
    const jestSuiteReport: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title0,
        numPassingAsserts: 1,
        status: 'failed',
      },
      {
        ancestorTitles: [],
        fullName: title1,
        numPassingAsserts: 1,
        status: 'pending',
      },
    ]
    const parsed = parseTestSuite(jestSuiteReport)

    it('reports the test names', () => {
      expect(parsed.outcomes[0].title).toBe(title0)
      expect(parsed.outcomes[1].title).toBe(title1)
    })

    it('reports that the tests are in the correct state', () => {
      expect(parsed.outcomes[0].outcome).toBe('fail')
      expect(parsed.outcomes[1].outcome).toBe('wip')
    })

    it('reports that 0 tests passed', () => {
      expect(parsed.passedCount).toBe(0)
    })

    it('reports that there are no WIP tests', () => {
      expect(parsed.wipTitles).toStrictEqual([title1])
    })

    it('reports that 1 test failed', () => {
      expect(parsed.failedCount).toBe(1)
    })
  })

  describe('given two tests in a suite', () => {
    const commonAncestor = arbitraryString()
    const title0 = arbitraryString()
    const title1 = arbitraryString()
    const jestSuiteReport: Array<TestRun> = [
      {
        ancestorTitles: [commonAncestor],
        fullName: title0,
        numPassingAsserts: 1,
        status: 'failed',
      },
      {
        ancestorTitles: [commonAncestor],
        fullName: title1,
        numPassingAsserts: 1,
        status: 'pending',
      },
    ]
    const parsed = parseTestSuite(jestSuiteReport)

    it.failing('the collection contains one item', () => {
      expect(parsed.outcomes).toHaveLength(1)
    })

    it.failing('the collection contains a suite', () => {
      expect(parsed.outcomes[0]._tag).toBe('suite-report')
    })
  })
})
