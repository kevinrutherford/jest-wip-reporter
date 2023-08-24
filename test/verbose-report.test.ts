import { parseTestSuite, TestRun } from '../src/parse-test-suite'
import { arbitraryString } from './helpers'

describe('parseTestSuite', () => {
  describe.each([
    ['todo'],
    ['pending'],
    ['skipped'],
    ['disabled'],
  ])('given a single %s test with no ancestors', (status) => {
    const title = arbitraryString()
    const testResults: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        status,
      },
    ]
    const parsed = parseTestSuite(testResults)

    it('reports the test name', () => {
      expect(parsed.outcome.title).toBe(title)
    })

    it('reports that the suite is in the WIP state', () => {
      expect(parsed.outcome.status).toBe('wip')
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
    const testResults: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        status: 'passed',
      },
    ]
    const parsed = parseTestSuite(testResults)

    it('reports the test name', () => {
      expect(parsed.outcome.title).toBe(title)
    })

    it('reports that the suite is in the pass state', () => {
      expect(parsed.outcome.status).toBe('pass')
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
    const testResults: Array<TestRun> = [
      {
        ancestorTitles: [],
        fullName: title,
        status: 'failed',
      },
    ]
    const parsed = parseTestSuite(testResults)

    it('reports the test name', () => {
      expect(parsed.outcome.title).toBe(title)
    })

    it('reports that the suite is in the pass state', () => {
      expect(parsed.outcome.status).toBe('fail')
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
})
