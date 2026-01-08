module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^pino$': '<rootDir>/jest.mocks/pino.js',
    '^@sentry/nextjs$': '<rootDir>/jest.mocks/sentry.js',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx|js)'],
};
