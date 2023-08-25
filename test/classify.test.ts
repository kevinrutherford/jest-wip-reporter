import { classify } from '../src/classify'
import { TestRun } from '../src/test-run'
import { arbitraryString } from './helpers'

describe('classify', () => {
  describe.each([
    ['todo'],
    ['pending'],
    ['skipped'],
    ['disabled'],
  ])('given a single %s test with no ancestors', (status) => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      status: status as TestRun['status'],
    }
    const outcome = classify(jestTestRun)

    it('reports that the suite is in the WIP state', () => {
      expect(outcome).toBe('wip')
    })
  })

  describe('given a single passing test with no ancestors', () => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      status: 'passed',
    }
    const outcome = classify(jestTestRun)

    it('reports that the suite is in the pass state', () => {
      expect(outcome).toBe('pass')
    })
  })

  describe('given a single failing test with no ancestors', () => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      status: 'failed',
    }
    const outcome = classify(jestTestRun)

    it('reports that the suite is in the pass state', () => {
      expect(outcome).toBe('fail')
    })
  })
})
