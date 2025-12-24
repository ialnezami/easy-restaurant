# Testing Guide

This project includes comprehensive testing setup with unit tests, integration tests, and E2E tests.

## Test Structure

```
tests/
├── setup.ts              # Test setup and configuration
├── utils.test.ts         # Utility function tests
├── models/               # Model tests
│   ├── User.test.ts
│   ├── Restaurant.test.ts
│   └── Menu.test.ts
└── MANUAL_TESTING.md     # Manual testing checklist

e2e/
├── auth.spec.ts          # Authentication E2E tests
├── restaurant.spec.ts    # Restaurant management E2E tests
└── menu.spec.ts          # Menu management E2E tests
```

## Running Tests

### Unit Tests (Vitest)

Run all unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Run tests with UI:
```bash
npm run test:ui
```

Run specific test file:
```bash
npm test -- tests/utils.test.ts
```

### E2E Tests (Playwright)

Run all E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI:
```bash
npm run test:e2e:ui
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

View test report:
```bash
npx playwright show-report
```

## Test Coverage

### Unit Tests

- **Utility Functions**: Tests for `generateSlug` and `formatPrice`
- **User Model**: User creation, validation, password hashing, and comparison
- **Restaurant Model**: Restaurant creation, validation, and address management
- **Menu Model**: Menu creation, validation, and menu item management

### E2E Tests

- **Authentication Flow**: Registration, login, logout, and error handling
- **Restaurant Management**: Creating, editing, and viewing restaurants
- **Menu Management**: Creating menus, adding items, and viewing public menus

### Manual Testing

See `tests/MANUAL_TESTING.md` for a comprehensive manual testing checklist covering:
- Browser compatibility (Chrome, Firefox, Safari)
- Mobile device testing (iOS, Android)
- QR code scanning
- Form validation
- Error handling
- User flows
- Performance
- Accessibility
- Security

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('expected-output');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should perform user action', async ({ page }) => {
  await page.goto('/page');
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});
```

## Test Environment

- **Unit Tests**: Use Vitest with jsdom environment
- **E2E Tests**: Use Playwright with Chromium, Firefox, and WebKit
- **Database**: Tests use the same MongoDB connection (ensure database is running)

## Notes

- E2E tests require the development server to be running (handled automatically)
- Some tests create test data - ensure test database is separate or cleanup is working
- Manual testing checklist should be completed before production deployment

