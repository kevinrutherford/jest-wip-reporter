import { Config } from '../../src/config'
import { renderTestReport } from '../../src/trees/render-tree'
import { LeafNode } from '../../src/trees/tree'
import { arbitraryString } from '../helpers'

describe('progress-tree', () => {
  describe('rendering a pass test', () => {
    const label = arbitraryString()
    const t: LeafNode = {
      _tag: 'test-report',
      label,
      outcome: 'pass',
      children: [],
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

      expect(renderedLine).toContain(label)
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
