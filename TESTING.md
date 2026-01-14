# Testing Guide - Spelling Bee Game

## Overview

This project uses **Vitest** for unit testing with comprehensive test coverage for services and utilities. All tests are automatically run via GitHub Actions CI on push and pull requests.

## Installation

All testing dependencies are included in `package.json`:

```bash
npm install
```

This installs:
- `vitest` - Testing framework
- `@vitest/ui` - Visual test runner UI
- `@vitest/coverage-v8` - Code coverage reporting

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI
```bash
npm test:ui
```
Opens an interactive browser UI to visualize test results.

### Generate coverage report
```bash
npm run test:coverage
```
Generates coverage statistics showing how much of the code is tested.

## Test Files

Test files are located in `__tests__` directories next to the code they test:

- **Services Tests** (`src/services/__tests__/`)
  - `StorageService.test.ts` - localStorage persistence tests
  - `GameStateManager.test.ts` - State management tests
  - `Router.test.ts` - Navigation routing tests

- **Utils Tests** (`src/utils/__tests__/`)
  - `helpers.test.ts` - Game logic helper functions
  - `featureDetection.test.ts` - Browser feature detection

## Test Coverage

Current test coverage includes:

### StorageService (7 test suites)
- ✅ Default progress creation
- ✅ Loading saved progress
- ✅ Saving progress with timestamps
- ✅ Updating level progress and scores
- ✅ User settings management
- ✅ Clearing all progress
- ✅ Error handling for corrupted data

### GameStateManager (8 test suites)
- ✅ Immutable state access
- ✅ State updates with listeners
- ✅ Subscriber management (subscribe/unsubscribe)
- ✅ Game initialization
- ✅ Word selection and letter tracking
- ✅ Help system with reshuffle queue
- ✅ Score management

### Router (6 test suites)
- ✅ Route registration and navigation
- ✅ Hash parsing and validation
- ✅ Route parameters handling
- ✅ Handler invocation
- ✅ Current route tracking

### Helpers (4 test suites)
- ✅ Point calculation with level multipliers
- ✅ Help penalties (reduced points)
- ✅ Level multiplier progression
- ✅ Star rating calculation
- ✅ Promise-based delay utility

### Feature Detection (2 test suites)
- ✅ Feature capability detection
- ✅ Warning toast notifications

## GitHub Actions CI

Automated testing runs on every push and pull request to:
- `main` branch
- `claude/**` feature branches

### CI Workflow Steps

1. **Setup** - Uses Node 18 and 20
2. **Type Checking** - `npm run typecheck`
3. **Linting** - `npm run lint`
4. **Unit Tests** - `npm run test`
5. **Build Word Lists** - `npm run build:words`
6. **Build Project** - `npm run build`
7. **Coverage** - Optional Codecov reporting

### CI Configuration

See `.github/workflows/ci.yml` for full CI configuration.

## Writing New Tests

### Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MyFeature', () => {
  let feature: MyFeature;

  beforeEach(() => {
    // Setup before each test
    feature = new MyFeature();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something', () => {
    const result = feature.doSomething();
    expect(result).toBe(expectedValue);
  });
});
```

### Best Practices

1. **Test Organization** - Group related tests with `describe` blocks
2. **Clear Names** - Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert** - Setup, execute, verify
4. **DRY** - Use `beforeEach`/`afterEach` for common setup/cleanup
5. **Isolation** - Tests should not depend on each other
6. **Mocking** - Mock external dependencies (localStorage, fetch, etc.)

## Debugging Tests

### Run single test file
```bash
npm test -- src/services/__tests__/StorageService.test.ts
```

### Run tests matching pattern
```bash
npm test -- --grep "calculatePoints"
```

### Debug in Node inspector
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

## Continuous Integration Status

Tests are required to pass before merging pull requests. Check the CI status in the PR:

- ✅ All checks passed - Ready to merge
- ❌ Some checks failed - Review failures and fix code

## Test Metrics

- **Total Tests**: 25+
- **Test Files**: 5
- **Coverage Target**: 80%+
- **Frameworks**: Vitest (modern, fast, ESM-first)
- **Environment**: jsdom (browser-like testing)

## Troubleshooting

### Tests timing out
- Increase timeout: `{ timeout: 10000 }`
- Check for missing `done()` callbacks
- Verify async tests use `await`

### Import errors in tests
- Check that `vitest.config.ts` is present
- Verify `tsconfig.json` includes test files
- Ensure path aliases are correct

### localStorage errors
- Tests auto-clear localStorage in `beforeEach`
- No browser needed (jsdom provides localStorage mock)

## Future Improvements

- [ ] Add integration tests for components
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 90%+
- [ ] Add performance benchmarks
- [ ] Add visual regression testing

---

For more information on Vitest, visit: https://vitest.dev
