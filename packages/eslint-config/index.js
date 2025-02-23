// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['eslint-plugin-import', 'eslint-plugin-tsdoc', '@typescript-eslint'],

  globals: {
    $$: 'readonly',
    $ref: 'readonly',
    JSX: 'readonly',
    Nullable: 'readonly',
  },

  rules: {
    'no-var': 'warn',
    'no-undef': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-debugger': 'warn',
    'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],

    // eslint-plugin-vue
    'vue/no-v-html': 'off',
    'vue/attributes-order': 'off',
    'vue/require-v-for-key': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-unused-components': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'never',
          component: 'any',
        },
        svg: 'always',
        math: 'always',
      },
    ],

    // ts
    '@typescript-eslint/ban-ts-comment': 'off',

    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'warn',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        destructuredArrayIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
    '@typescript-eslint/ban-types': 'off',

    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],

    // import
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            group: 'builtin',
            pattern: '**/*.{css,scss,less}',
            position: 'before',
          },
          {
            pattern: 'vue',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@vue/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@mid-vue/**',
            group: 'internal',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        warnOnUnassignedImports: false,
        pathGroupsExcludedImportTypes: ['type'],
      },
    ],
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/named': 'off',

    // // tsdoc
    // 'tsdoc/syntax': 'warn',
  },

  overrides: [
    {
      files: ['*.vue'],
      parser: require.resolve('vue-eslint-parser'),
    },
  ],
})
