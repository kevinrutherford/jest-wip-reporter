import { Config } from '../../src/config'
import { renderTestReport } from '../../src/progress/progress-tree'
import { TestReport } from '../../src/report'
import { arbitraryString } from '../helpers'

describe('progress-tree', () => {
  describe('rendering a pass test', () => {
    const name = arbitraryString()
    const t: TestReport = {
      _tag: 'test-report',
      name,
      fullyQualifiedName: arbitraryString(),
      ancestorNames: [],
      outcome: 'pass',
    }

    it('includes the name of the test', () => {
      let renderedLine = ''
      const write = (s: string) => { renderedLine += s }
      const config: Config = {
        write,
        pens: {
          pass: write,
          wip: write,
          fail: write,
        },
      }
      renderTestReport(config, 0)(t)

      expect(renderedLine).toContain(name)
    })

    it('does not render the standard dot', () => {
      let renderedLine = ''
      const write = (s: string) => { renderedLine += s }
      const config: Config = {
        write,
        pens: {
          pass: write,
          wip: write,
          fail: write,
        },
      }
      renderTestReport(config, 0)(t)

      expect(renderedLine.startsWith('.')).toBe(false)
    })
  })
})
