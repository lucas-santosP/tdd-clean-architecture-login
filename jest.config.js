module.exports = {
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  preset: "@shelf/jest-mongodb",
  roots: ["__tests__"],
  collectCoverageFrom: ["**/src/**/*.js", "!**/src/main/config/**"],
};
