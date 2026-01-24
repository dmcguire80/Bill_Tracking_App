# ADR-002: React Context for State Management

## Status
Accepted

## Context
Need centralized state management for bills, paydays, accounts, and entries that can be accessed across multiple components.

## Decision
Use React Context API with a single DataContext provider.

## Consequences

### Positive
- **Built-in** - No additional dependencies
- **Simple** - Easy to understand and maintain
- **Type-safe** - Works well with TypeScript
- **Sufficient** - Handles current app complexity

### Negative
- **Re-renders** - Context changes trigger re-renders of all consumers
- **No middleware** - No built-in dev tools or time-travel debugging
- **Scalability** - May need refactoring for larger apps

## Alternatives Considered

### 1. Redux/Redux Toolkit
- More powerful
- Better dev tools
- More boilerplate
- **Rejected**: Too complex for current needs

### 2. Zustand
- Simpler than Redux
- Better performance
- Additional dependency
- **Rejected**: Context API sufficient

### 3. Jotai/Recoil
- Atomic state management
- Good performance
- Learning curve
- **Rejected**: Overkill for current app

## Implementation Details

```typescript
interface DataContextType {
    entries: Entry[];
    templates: BillTemplate[];
    accounts: Account[];
    addEntry: (entry: Entry) => void;
    updateEntry: (entry: Entry) => void;
    deleteEntry: (id: string) => void;
    // ... other methods
}
```

## Performance Optimization
- Use `useMemo` for expensive calculations
- Split context if performance issues arise
- Consider moving to Zustand if app grows significantly

## Notes
- Single source of truth for all data
- Handles localStorage persistence
- Automatic entry generation from templates
