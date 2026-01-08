// jest.mocks/pino.js
// Mock pino logger for tests

module.exports = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});
