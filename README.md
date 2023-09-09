# jest-wip-reporter

An opinionated Jest reporter that treats all incomplete tests as WIP.

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

## Output

By default this reporter emits a single character for each executed test:
- Passing: a green '.'
- WIP: a yellow '?'
- Failing: a red 'x'

A WIP (work-in-progress) test is deemed to be any test that is marked as `todo`, `failing` or `skip`,
or any test that is skipped due to a different `describe` or `it` being marked with `.only`.

![image](https://github.com/kevinrutherford/jest-wip-reporter/assets/23290/b4a68372-19cc-481e-89e9-2e50203ac4e3)

### Configuration

By default this reporter emits a single character for each executed test.
To see test titles instead, set the environment variable `$JWR_PROGRESS` to `tree`.

