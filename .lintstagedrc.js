export default {
  '*.ts': [() => 'pnpm type-check', 'eslint --fix'],
  '*.{mjs,js,json,md}': ['prettier --write']
};
