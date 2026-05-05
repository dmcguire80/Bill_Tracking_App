import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src-mountain-backup']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // react-hooks v7 added this rule. It catches a real anti-pattern, but
      // it also flags legitimate uses of setState in mount/unmount sync
      // (e.g. `setLoading(false)` after attaching Firestore subscriptions).
      // Downgraded to warn while we incrementally refactor effects to derive
      // these states instead of storing them.
      'react-hooks/set-state-in-effect': 'warn',
      // Disable for Context providers that export hooks
      'react-refresh/only-export-components': 'off',
      // Allow 'any' for recharts types compatibility
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
