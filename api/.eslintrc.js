module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    'import'
  ],
  rules: {
    'import/order': ['error', {
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '@/**',
          group: 'parent'
        }
      ],
      pathGroupsExcludedImportTypes: ['builtin']
    }],
    'no-process-env': 'error'
  },
}
