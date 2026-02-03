---
name: Project Setup & Standards
description: ESLint, Prettier, TypeScript, and project structure standards from Bill Tracker
---

# Project Setup & Standards

## ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Directory Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── hooks/            # Custom hooks
├── contexts/         # React contexts
├── lib/              # Utilities and helpers
├── types/            # TypeScript types
└── App.tsx           # Main app component
```

## Naming Conventions

- **Components:** PascalCase (`BillCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useBills.ts`)
- **Utils:** camelCase (`formatCurrency.ts`)
- **Types:** PascalCase (`Bill.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`)
