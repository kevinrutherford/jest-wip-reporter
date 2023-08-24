import { parseTestSuite, TestRun } from '../src/parse-test-suite'
import { arbitraryString } from './helpers'

describe('parseTestSuite', () => {
  describe.each([
    ['todo'],
    ['pending'],
    ['skipped'],
    ['disabled'],
  ])('given a single WIP test with no ancestors', (status) => {
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
  })
})
