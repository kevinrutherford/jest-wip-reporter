import * as progressDots from '../progress-dots'
import * as progressTree from '../progress-tree'
import { Reporters } from '../reporters'
import { Config } from '../config'

export const register = (reporters: Reporters, config: Config): void => {
  switch (process.env.JWR_PROGRESS) {
    case 'tree':
      progressTree.register(reporters, config)
      break
    case 'dots':
    default:
      progressDots.register(reporters, config)
      break
  }
}
