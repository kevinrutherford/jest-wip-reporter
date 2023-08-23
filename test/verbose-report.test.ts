import { parseTestSuite } from '../src/parse-test-suite'
import { arbitraryString } from './helpers'

describe('parseTestSuite', () => {
  describe('given a single test with no ancestors', () => {
    const title = arbitraryString()
    const testResults = [
      {
        ancestorTitles: [],
        fullName: title,
      },
    ]
    const parsed = parseTestSuite(testResults)

    it('reports the test name', () => {
      expect(parsed.title).toBe(title)
    })

    it('reports that the suite is passing', () => {
      expect(parsed.status).toBe('pass')
    })
  })
})
