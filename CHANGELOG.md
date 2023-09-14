# Change Log

## 1.2.0 (tbc)

### Changed

* When $JWR_PROGRESS=tree, test suites are coloured to match the "worst" outcome they contain

## 1.1.1 (2023-09-13)

### Changed

* Report tests that have been skipped with it.skip

## 1.1.0 (2023-09-11)

### Changed

* Always add tests to the tree when $JWR_PROGRESS=tree

## 1.0.0 (2023-09-11)

### Changed

* Replace $JWR_VERBOSE with $JWR_PROGRESS

## 0.2.1 (2023-09-07)

### Changed

* In verbose mode, test results are listed as an indented "tree" of describe blocks
* In verbose mode, passing tests are marked with a ✓ symbol
* A test with no passing assertions is now deemed to be WIP

## 0.1.1 (2023-08-21)

### Changed

* Typo in the README

## 0.1.0 (2023-08-21)

### Added

* Basic run display, modelled on JUnit v1
* Display fully qualified test names if $JWR_VERBOSE is set
* Display the fully qualified names of any WIP tests in the run summary
* Classify a passing test with 0 passing assertions as WIP

## 0.0.1 (2023-08-14)

### Added

* Empty package

