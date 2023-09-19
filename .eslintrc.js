module.exports = {
  root: true,
  extends: ['@spacecomx/eslint-config-antfu'],
  settings: {
    next: {
      rootDir: [
        'apps/*/',
        'aws/*/',
        'packages/*/',
      ],
    },
  },
}
