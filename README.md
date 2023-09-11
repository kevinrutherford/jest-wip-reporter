# jest-wip-reporter

[![npm version](https://badge.fury.io/js/jest-wip-reporter.svg)](https://www.npmjs.com/package/jest-wip-reporter)
[![Downloads](https://img.shields.io/npm/dm/jest-wip-reporter.svg)](https://www.npmjs.com/package/jest-wip-reporter)

An opinionated Jest reporter that treats all incomplete tests as WIP.

## Philosophy

This reporter considers every test to be in one of exactly three states:
passing, failing, or WIP (work in progress).
WIP tests represent work that is still to be finished; they won't
fail your build, but the reporter will call them out and remind you loudly
that your work isn't done yet.

In Jest terms,
a WIP test is deemed to be any test that is marked as `.todo`, `.failing` or `.skip`,
or any test that is skipped due to some `describe` or `it` being marked with `.only`.

Note that a `.failing` test that Jest would report as "passing"
(because the test run failed)
will be marked as WIP by this reporter, because the work related to it
is not yet finished.

## Output

![image](https://github.com/kevinrutherford/jest-wip-reporter/assets/23290/5bf37aa3-186e-4015-9dae-a82da62e08cd)

The report generated comprises four parts:

1. A progress report.
   By default the reporter emits a single character when each test runs:
   - Passing: a green '.'
   - WIP: an amber '?'
   - Failing: a red 'x'
   This can be changed to emit a tree of nested describe and test titles
   by setting the environment variable `$JWR_PROGRESS` to `tree`
   (the default value is `dots`).

2. A summary of WIP tests.

3. Details of any failures.

4. A summary of the test run.

### Configuration

By default this reporter emits a single character for each executed test.
To see test titles instead, set the environment variable `$JWR_PROGRESS` to `tree`.

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

