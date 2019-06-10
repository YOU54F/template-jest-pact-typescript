module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/*.test.(ts)", "**/*.it.(ts)", "**/*.pacttest.(ts)"],
  testEnvironment: "node",
  reporters: ["default", "jest-junit"],
  watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]
};
