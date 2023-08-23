type TestStatus = 'pass' | 'wip' | 'fail'

type ParsedSuite = {
  title: string,
  status: TestStatus,
}

type TestRun = {
  ancestorTitles: Array<string>,
  fullName: string,
}

export const parseTestSuite = (suite: Array<TestRun>): ParsedSuite => ({
  title: suite[0].fullName,
  status: 'pass',
})
