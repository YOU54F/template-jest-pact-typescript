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
  testMatch: ["**/*.test.(ts|js)", "**/*.it.(ts|js)", "**/*.pacttest.(ts|js)"],
  testEnvironment: "node",
  reporters: ["default", "jest-junit"]
};
