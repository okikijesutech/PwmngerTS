module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/packages", "<rootDir>/apps"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "packages/**/*.ts",
    "!packages/**/*.test.ts",
    "!packages/**/node_modules/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@pwmnger/crypto$": "<rootDir>/packages/crypto/src",
    "^@pwmnger/vault$": "<rootDir>/packages/vault/src",
    "^@pwmnger/storage$": "<rootDir>/packages/storage/src",
    "^@pwmnger/app-logic$": "<rootDir>/packages/appLogic/src",
    "^@pwmnger/ui$": "<rootDir>/packages/ui/src",
  },
};
