import { WriteStream } from 'tty'
import { TestOutcome } from './report'

type Pen = (s: string) => void

export type Config = {
  out: WriteStream,
  pens: Record<TestOutcome, Pen>,
}
