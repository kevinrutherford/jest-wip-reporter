# jest-wip-reporter

[![npm version](https://badge.fury.io/js/jest-wip-reporter.svg)](https://www.npmjs.com/package/jest-wip-reporter)
[![Downloads](https://img.shields.io/npm/dm/jest-wip-reporter.svg)](https://www.npmjs.com/package/jest-wip-reporter)

An opinionated Jest reporter that treats all incomplete tests as WIP.

## Philosophy

This reporter considers every test to be in one of three states:
**passing**, **failing**, or **WIP** (work in progress).
WIP tests represent work that is still to be finished; they won't
fail your build, but the reporter will call them out and remind you loudly
that your work isn't done yet.

In Jest terms, this reporter marks a test as WIP if it:
* is marked as `.todo`, `.failing` or `.skip`, or
* is skipped due to some other `describe` or `it` being marked with `.only`, or
* contains no assertions.

Note that a `.failing` test that Jest would report as "passing"
(because the test run failed)
will be marked as WIP by this reporter, because the work related to it
is not yet finished.

## Output

![image](https://github.com/kevinrutherford/jest-wip-reporter/assets/23290/969d664c-4660-4e4b-b65e-7e4d582ecf2f)

The report generated comprises four parts:

1. A progress report in which the outcome of each test is represented by a single character:
   - Passing: a green '.'
   - WIP: an amber '?'
   - Failing: a red 'x'

2. A summary of WIP tests.

3. Details of any failures.

4. A summary of the test run.

### Configuring the progress report

By default the reporter emits a single character when each test runs:
- Passing: a green '.'
- WIP: an amber '?'
- Failing: a red 'x'

In this default view, the output contains a single character for each test,
but `describe` blocks and test names are not represented.

If you need to see more context, the progress report can be configured
to emit a tree of nested describe and test names
by setting the environment variable `$JWR_PROGRESS` to `tree`
(the default value is `dots`).

In the `tree` report, each describe is coloured to match the "worst" outcome
of the tests it contains.
For example, a describe block containing a WIP test and a failing test
would be rendered as failing, because a failing test is "worse" than a WIP test.

### Configuring the WIP report

If you have any WIP tests,
by default this reporter will list them as a tree of nested describe and test titles.
To replace this with a flat list of fully-qualified test names set the
environment variable `$JWR_WIP_REPORT` to `list` (the default value is `tree`).

## Installation

Install as a development dependency:

```bash
npm install --save-dev jest-simple-dot-reporter
```

or

```bash
yarn add --dev jest-simple-dot-reporter
```

Then [configure Jest](https://facebook.github.io/jest/docs/en/configuration.html)
to use this reporter.

For example, create a `jest.config.js` file containing:

```javascript
module.exports = {
  "verbose": false,
  "reporters": [
    "jest-wip-reporter",
  ]
};
```

