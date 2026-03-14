module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  // Run tests sequentially — all suites share .data/ directory
  maxWorkers: 1,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^pg$': '<rootDir>/__mocks__/pg.js',
  },
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.d.ts',
    '!lib/data.ts',
    '!lib/game-engine.ts',
    '!lib/seed.ts',
    '!lib/types.ts',
    // Exclude files requiring external services (pg, ZeroDB API)
    '!lib/zerodb.ts',
    '!lib/db.ts',
    '!lib/memory-storage.ts',
    '!lib/aikit.ts',
    '!lib/data-session-extension.ts',
    '!lib/session-types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
