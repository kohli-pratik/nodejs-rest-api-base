module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly', // es2017 added globals
    SharedArrayBuffer: 'readonly', // es2017 added globals
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'indent': ['error', 4, {'SwitchCase': 1}],
    'linebreak-style': 0, // 0 for switching between Windows and Mac
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-cond-assign': ['error', 'always'],
    'no-console': 1,
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
    'camelcase': 'off' // Messes with env variables like process.env.NODE_ENV, expects nodeEnv
  },
};
