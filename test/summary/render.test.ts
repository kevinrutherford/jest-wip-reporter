import { Config } from '../../src/config'
import { render } from '../../src/summary/render'

describe('render', () => {
  describe('when there were no tests', () => {
    it('reports that 0 tests were run', () => {
      let output = ''
      const write = (s: string) => { output += s }
      const config: Config = {
        write,
        pens: {
          pass: write,
          wip: write,
          fail: write,
        },
      }
      render({
        passedCount: 0,
        failedCount: 0,
        wipTitles: [],
      }, config)({
        startTime: 0,
        testResults: [],
      })

      expect(output).toContain('0 run')
    })
  })
})
