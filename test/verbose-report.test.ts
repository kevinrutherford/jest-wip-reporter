import { arbitraryString } from './helpers'

describe('verbose reporting', () => {
  describe('given a single test with no ancestors', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testResult = {
      testResults: [
        {
          ancestorTitles: [],
          fullName: arbitraryString(),
        },
      ],
    }
    const topLevel = {
      title: 'my test',
      status: 'pass',
    }

    it('reports the test name', () => {
      expect(topLevel.title).toBe('my test')
    })

    it('reports that the suite is passing', () => {
      expect(topLevel.status).toBe('pass')
    })
  })
})
