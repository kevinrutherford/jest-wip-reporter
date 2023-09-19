import { Config } from '../config'
import { Reporters } from '../reporters'
import { renderDot } from './render-dot'

export const register = (host: Reporters, config: Config): void => {
  host.onTestFinish.push(renderDot(config))
}
