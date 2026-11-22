/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  // Source imports use `.js` extensions (required by NodeNext); point them back at the .ts files.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Tests run as CommonJS: tsconfig.test.json extends tsconfig.json and only overrides the module settings.
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
};

export default config;
