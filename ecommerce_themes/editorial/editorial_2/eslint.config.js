import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Web Components API
        customElements: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import/export validation rules
      // Allow external URLs (CDN imports) - these are resolved at runtime
      'import/no-unresolved': ['error', {
        ignore: [
          '^https://',  // Allow CDN imports
          '^http://',   // Allow HTTP imports
        ],
        caseSensitive: true,
      }],
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': ['error', {
        ignore: ['^https://', '^http://'],  // Allow absolute URLs for CDN
      }],
      'import/no-dynamic-require': 'warn',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': ['warn', {
        noUselessIndex: true,
      }],

      // General rules
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.jsx', '.tsx'],
        },
      },
      'import/ignore': [
        '^https://',  // Ignore CDN imports
        '^http://',   // Ignore HTTP imports
      ],
    },
  },
];

