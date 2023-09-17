import { arbitraryString } from '../helpers'

describe('progress-tree', () => {
  describe('rendering a pass test', () => {
    it('does not render the standard dot', () => {
      const renderedLine = arbitraryString()

      expect(renderedLine.startsWith('.')).toBe(false)
    })
  })
})
