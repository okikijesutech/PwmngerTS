module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/packages"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "packages/**/*.ts",
    "!packages/**/*.test.ts",
    "!packages/**/node_modules/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "test.ts"],
};
