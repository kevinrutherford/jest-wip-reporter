const arbitraryNumber = (min: number, max: number): number => (
  Math.floor(Math.random() * (max - min + 1) + min)
)

export const arbitraryWord = (length: number = arbitraryNumber(3, 15)): string => (
  [...Array(length)]
    .map(() => Math.random().toString(36)[2])
    .join('')
    .replace(/^[0-9]/, 'x')
    .replace(/0x/, '0y')
)

export const arbitraryString = (): string => (
  [...Array(arbitraryNumber(3, 20))]
    .map(() => arbitraryWord())
    .join(' ')
)
