module.exports = {
  parserOptions: {
    ecmaVersion: 8,
  },
  parser: 'babel-eslint',
  extends: 'standard',
  plugins: ['standard', 'promise', 'node', 'prettier', 'flowtype'],
  env: {
    node: true,
    mocha: true,
    browser: true,
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'ignore',
        asyncArrow: 'always',
      },
    ],
  },
}
