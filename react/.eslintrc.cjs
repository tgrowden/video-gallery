const path = require("path");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'index.html'],
  parser: '@typescript-eslint/parser',
  "parserOptions": {
    "project": path.join(__dirname, "tsconfig.app.json"),
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  plugins: ['react-refresh', "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "eol-last": ["error", "always"],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
