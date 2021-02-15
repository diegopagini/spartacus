const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.schematics');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },

  collectCoverage: false,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: '<rootDir>/../../coverage/schematics',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  roots: ['<rootDir>/src'],
  testMatch: ['**/+(*_)+(spec).+(ts)'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
};
