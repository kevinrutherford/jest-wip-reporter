import { arbitraryWord } from './helpers'

describe('sample output for visual inspection', () => {
  describe('a passing test', () => {
    const word = arbitraryWord()

    it('passes', () => {
      expect(word).toBe(word)
    })
  })

  describe('a WIP test', () => {
    it.todo('is rendered as WIP')
  })
})
