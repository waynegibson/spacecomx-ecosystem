module.exports = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-pnpm-scopes'
  ],
  "rules": {
    "type-enum": [2, "always", ["ci", "chore", "docs", "ticket","feat", "fix", "perf", "refactor", "revert", "style", "deps"]]
  }
};
