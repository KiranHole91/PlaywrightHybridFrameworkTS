// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier/flat';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-focused-test': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error', // catches missing `await`
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    languageOptions: {
      parserOptions: {
        projectService: true, // enables type-aware rules using tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettier, // must be last: disables ESLint rules that conflict with Prettier
);
