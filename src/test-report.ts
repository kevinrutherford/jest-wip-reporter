import { TestOutcome } from './test-outcome'

export type TestReport = {
  name: string,
  fullyQualifiedName: string,
  ancestorNames: ReadonlyArray<string>,
  outcome: TestOutcome,
}
