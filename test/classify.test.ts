import { classify } from '../src/classify'
import { TestRun } from '../src/test-run'
import { arbitraryString } from './helpers'

describe('classify', () => {
  describe('given a passing test', () => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      numPassingAsserts: 1,
      status: 'passed',
    }
    const outcome = classify(jestTestRun)

    it('reports that the test is in the pass state', () => {
      expect(outcome).toBe('pass')
    })
  })

  describe('given a passing test with no passing assertions', () => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      numPassingAsserts: 0,
      status: 'passed',
    }
    const outcome = classify(jestTestRun)

    it.failing('reports that the test is in the WIP state', () => {
      expect(outcome).toBe('wip')
    })
  })

  describe.each([
    ['todo'],
    ['pending'],
    ['skipped'],
    ['disabled'],
  ])('given a %s test', (status) => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      numPassingAsserts: 1,
      status: status as TestRun['status'],
    }
    const outcome = classify(jestTestRun)

    it('reports that the test is in the WIP state', () => {
      expect(outcome).toBe('wip')
    })
  })

  describe('given a failing test', () => {
    const jestTestRun: TestRun = {
      ancestorTitles: [],
      fullName: arbitraryString(),
      numPassingAsserts: 1,
      status: 'failed',
    }
    const outcome = classify(jestTestRun)

    it('reports that the test is in the pass state', () => {
      expect(outcome).toBe('fail')
    })
  })
})
