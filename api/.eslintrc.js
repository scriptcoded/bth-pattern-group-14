module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    'import',
    'jest'
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
  env: {
    'jest/globals': true
  }
}
