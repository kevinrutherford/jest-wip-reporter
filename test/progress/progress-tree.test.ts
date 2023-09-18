import { Config } from '../../src/config'
import { renderTestReport } from '../../src/progress/progress-tree'
import { TestReport } from '../../src/report'
import { arbitraryString } from '../helpers'

describe('progress-tree', () => {
  describe('rendering a pass test', () => {
    it('does not render the standard dot', () => {
      let renderedLine = ''
      const write = (s: string) => { renderedLine += s }
      const name = arbitraryString()
      const config: Config = {
        write,
        pens: {
          pass: write,
          wip: write,
          fail: write,
        },
      }
      const t: TestReport = {
        _tag: 'test-report',
        name,
        fullyQualifiedName: arbitraryString(),
        ancestorNames: [],
        outcome: 'pass',
      }
      renderTestReport(config, 0)(t)

      expect(renderedLine).toContain(name)
      expect(renderedLine.startsWith('.')).toBe(false)
    })
  })
})
