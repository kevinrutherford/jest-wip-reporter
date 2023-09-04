import { AssertionResult } from '@jest/test-result'

export type TestRun = Pick<AssertionResult,
| 'ancestorTitles'
| 'fullName'
| 'numPassingAsserts'
| 'status'
| 'title'
>
