import { parseTestSuite, TestRun } from '../src/parse-test-suite'
import { arbitraryString } from './helpers'

describe('parseTestSuite', () => {
  describe.each([
    ['passed', 'pass'],
    ['todo', 'wip'],
    ['pending', 'wip'],
    ['skipped', 'wip'],
    ['disabled', 'wip'],
    ['failed', 'fail'],
  ])('given a single test with no ancestors and state %s', (status, expected) => {
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
      expect(parsed.title).toBe(title)
    })

    it(`reports that the suite is in the ${expected} state`, () => {
      expect(parsed.status).toBe(expected)
    })
  })
})
