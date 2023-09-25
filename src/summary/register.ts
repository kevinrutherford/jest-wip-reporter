import { Reporters } from '../reporters'
import { Config } from '../config'
import { create } from './create'
import { recordOn } from './record-on'
import { render } from './render'

export const register = (host: Reporters, config: Config): void => {
  const report = create()
  host.onTestFinish.push(recordOn(report))
  host.onRunFinish.push(render(report, config))
}
