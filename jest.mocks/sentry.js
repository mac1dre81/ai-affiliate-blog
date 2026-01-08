// jest.mocks/sentry.js
// Mock Sentry for tests

module.exports = {
  init: jest.fn(),
  captureException: jest.fn(),
};
