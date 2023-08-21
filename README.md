# jest-wip-reporter
A Jest reporter that treats all incomplete tests as WIP

## Installation

Install as a development dependency:

```bash
npm install --save-dev jest-simple-dot-reporter
```

or

```bash
yarn add --dev jest-simple-dot-reporter
```

## Output

By default this reporter emits a single character for each executed test:
- Passing: a green '.'
- WIP: a yellow '?'
- Failing: a red 'x'

A WIP (work-in-progress) test is deemed to be any test that is marked as `todo`, `failing` or `skip`.

![image](https://github.com/kevinrutherford/jest-wip-reporter/assets/23290/b4a68372-19cc-481e-89e9-2e50203ac4e3)

## Configuration

Configure [Jest](https://facebook.github.io/jest/docs/en/configuration.html) to use the reporter.

For example, create a `jest.config.js` file containing:

```javascript
module.exports = {
  "verbose": false,
  "reporters": [
    "jest-simple-dot-reporter",
  ]
};
```

By default this reporter emits a single character for each executed test.
To see test titles instead, set the environment variable `$JWR_VERBOSE` to any non-empty string.

