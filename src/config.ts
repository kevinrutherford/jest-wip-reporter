import { TestOutcome } from './test-outcome'

type Pen = (s: string) => void

export type Config = {
  write: (s: string) => void,
  pens: Record<TestOutcome, Pen>,
}
