import { TestOutcome } from './test-outcome'

export type TestReport = {
  _tag: 'test-report',
  name: string,
  fullyQualifiedName: string,
  ancestorNames: ReadonlyArray<string>,
  outcome: TestOutcome,
}
