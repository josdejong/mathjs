module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: ['*.generated.js'],
  rules: {},
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      extends: [
        'standard'
      ]
    },
    {
      files: ['*.test.js'],
      plugins: ['mocha'],
      extends: [
        'standard',
        'plugin:mocha/recommended'
      ],
      rules: {
        'mocha/no-skipped-tests': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-setup-in-describe': 'off',
        'mocha/no-identical-title': 'off' // TODO: Remove this
      }
    },
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended' // this should come last
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
        ]
      },
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'tsconfig.json'
      }
    }
  ]
}
