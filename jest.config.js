/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testRegex: '.*test.ts',
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  // setupFilesAfterEnv: ['./src/jest.setup.ts'],
  modulePathIgnorePatterns: ['/dist/', '/node_modules/', '/src/docs'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: false,
  // collectCoverageFrom: [
  //   'src/**/*.ts',
  //   '!**/*.mock.ts',
  //   '!**/*.types.ts',
  //   '!**/*.schemas.ts',
  //   '!**/*.test.ts',
  //   '!**/node_modules/**',
  //   '!**/*.d.ts'
  // ],
  // coveragePathIgnorePatterns: ['/node_modules/'],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80
  //   }
  // }
};
