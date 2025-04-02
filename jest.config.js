/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/test/jest/setup.js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  }
};