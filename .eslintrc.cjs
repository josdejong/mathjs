module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      extends: [
        'standard',
        'plugin:prettier/recommended', // this should come last
      ],
    },
    {
      files: ['types/*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // this should come last
      ],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'types/tsconfig.json',
      },
    },
  ],
}
