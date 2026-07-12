import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

const applyToTsFiles = (config) => ({
  ...config,
  files: [
    'apps/user-service/**/*.{ts,tsx}',
    'apps/vehicle-service/**/*.{ts,tsx}',
    'apps/auth-service/**/*.{ts,tsx}',
    'packages/backend-shared/**/*.{ts,tsx}',
  ],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      projectService: true,
      tsconfigRootDir,
    },
  },
});

export default defineConfig([
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/generated/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/openapi.json',
      '**/prisma/**/*.js',
    ],
  },

  {
    ...js.configs.recommended,
    files: [
      'apps/user-service/**/*.{js,mjs,cjs}',
      'apps/vehicle-service/**/*.{js,mjs,cjs}',
      'apps/auth-service/**/*.{ts,tsx}',
      'packages/backend-shared/**/*.{js,mjs,cjs}',
    ],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommendedTypeChecked.map(applyToTsFiles),
  ...tseslint.configs.stylisticTypeChecked.map(applyToTsFiles),

  {
    files: [
      'apps/user-service/**/*.{ts,tsx}',
      'apps/vehicle-service/**/*.{ts,tsx}',
       'apps/auth-service/**/*.{ts,tsx}',
      'packages/backend-shared/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      curly: ['error', 'all'],
      'no-console': 'off',
      'no-undef': 'off',
      'object-shorthand': ['error', 'always'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
    },
  },

  {
    files: [
      'apps/user-service/**/*.spec.{ts,tsx}',
      'apps/user-service/**/*.test.{ts,tsx}',
      'apps/vehicle-service/**/*.spec.{ts,tsx}',
      'apps/vehicle-service/**/*.test.{ts,tsx}',
      'apps/auth-service/**/*.spec.{ts,tsx}',
      'apps/auth-service/**/*.test.{ts,tsx}',
      'packages/backend-shared/**/*.spec.{ts,tsx}',
      'packages/backend-shared/**/*.test.{ts,tsx}',
    ],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  {
    files: [
      'apps/user-service/**/*.d.ts',
      'apps/vehicle-service/**/*.d.ts',
      'packages/backend-shared/**/*.d.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  prettierConfig,
]);
