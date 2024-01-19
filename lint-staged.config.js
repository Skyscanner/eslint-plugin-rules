module.exports = {
  '!(LICENSE)*.md': ['prettier --write'],
  '**/!(package|package-lock).json': 'prettier --write',
  '**/*.js': 'npm run lint:js:fix',
  '**/*.yml': 'prettier --write',
};
