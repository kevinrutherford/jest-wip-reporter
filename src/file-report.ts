import { TestReport } from './test-report'

export type FileReport = ReadonlyArray<TestReport>

export const initialState = (): FileReport => []

export const addToReport = (report: FileReport, t: TestReport): FileReport => [...report, t]
