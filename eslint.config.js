const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
