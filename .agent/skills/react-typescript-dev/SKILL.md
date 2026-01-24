---
name: React TypeScript Development
description: Expert guidance for building React applications with TypeScript, covering component architecture, state management, hooks, and best practices learned from Bill Tracker
---

# React TypeScript Development Skill

## Purpose

This skill provides expert guidance for building modern React applications with TypeScript, based on patterns and best practices from the Bill Tracker project.

## Core Principles

### 1. Component Architecture

**Functional Components Only**
- Use functional components with hooks
- Avoid class components
- Keep components focused and single-purpose

**Component Organization**:
```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components (routes)
├── context/        # React Context providers
├── hooks/          # Custom hooks
└── utils/          # Utility functions
```

### 2. TypeScript Best Practices

**Strict Mode**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Type Definitions**:
- Define types in `src/types/index.ts`
- Use interfaces for object shapes
- Use type aliases for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown

**Example from Bill Tracker**:
```typescript
export interface Bill extends Entry {
    type: 'bill';
    paid: boolean;
    amounts: Partial<Record<string, number>>;
}

export interface BillTemplate {
    id: string;
    name: string;
    recurrence: RecurrenceType | 'one-time';
    day: number;
    amounts: Partial<Record<string, number>>;
    autoGenerate: boolean;
    isActive: boolean;
    endMonth?: string;
}
```

### 3. State Management

**React Context for Global State**:
```typescript
// Pattern from DataContext.tsx
interface DataContextType {
    entries: Entry[];
    templates: BillTemplate[];
    addEntry: (entry: Entry) => void;
    updateEntry: (entry: Entry) => void;
    deleteEntry: (id: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};
```

**Local State with useState**:
- Use for component-specific state
- Initialize with functions for expensive computations
- Batch related state into objects when appropriate

**Example**:
```typescript
const [setupComplete, setSetupComplete] = useState(() => {
    return localStorage.getItem('setupComplete') === 'true';
});
```

### 4. Custom Hooks

**Extract Reusable Logic**:
```typescript
// hooks/useCalculations.ts
export const useCalculations = (entries: Entry[], accounts: Account[]) => {
    return useMemo(() => {
        // Complex calculation logic
        return calculatedData;
    }, [entries, accounts]);
};
```

**Hook Naming**: Always prefix with `use`
**Hook Rules**: 
- Only call at top level
- Only call from React functions
- Can call other hooks

### 5. Performance Optimization

**useMemo for Expensive Calculations**:
```typescript
const sortedEntries = useMemo(() => {
    return entries.sort((a, b) => a.date.localeCompare(b.date));
}, [entries]);
```

**useCallback for Function Props**:
```typescript
const handleSubmit = useCallback((data: FormData) => {
    // Handle submission
}, [dependencies]);
```

**React.memo for Component Optimization**:
```typescript
export const ExpensiveComponent = React.memo(({ data }: Props) => {
    // Component logic
});
```

### 6. Form Handling

**Controlled Components**:
```typescript
const [name, setName] = useState('');

<input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="..."
/>
```

**Form Submission**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!name.trim()) return;
    // Submit logic
    onSave({ name, ...otherData });
};
```

### 7. Conditional Rendering

**Prefer && for Simple Conditions**:
```typescript
{isOpen && <Modal />}
```

**Use Ternary for If/Else**:
```typescript
{isLoading ? <Spinner /> : <Content />}
```

**Early Returns for Complex Logic**:
```typescript
if (!data) return <EmptyState />;
if (error) return <ErrorState />;
return <SuccessState data={data} />;
```

### 8. Event Handling

**Type Event Handlers**:
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Logic
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
};
```

### 9. Component Props

**Define Props Interface**:
```typescript
interface BillFormProps {
    initialData?: Bill;
    onSave: (bill: Bill) => void;
    onClose: () => void;
}

export const BillForm = ({ initialData, onSave, onClose }: BillFormProps) => {
    // Component logic
};
```

**Optional Props with Defaults**:
```typescript
interface Props {
    title?: string;
    count?: number;
}

export const Component = ({ title = 'Default', count = 0 }: Props) => {
    // Use title and count
};
```

### 10. Error Boundaries

**Create Error Boundary Component**:
```typescript
class ErrorBoundary extends React.Component<Props, State> {
    state = { hasError: false };
    
    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }
    
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }
        return this.props.children;
    }
}
```

## Common Patterns from Bill Tracker

### Modal/Dialog Pattern
```typescript
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
            {/* Modal content */}
            <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
    </div>
)}
```

### List Rendering with Keys
```typescript
{items.map(item => (
    <div key={item.id}>
        {item.name}
    </div>
))}
```

### Conditional CSS Classes
```typescript
<div className={`base-class ${isActive ? 'active' : 'inactive'}`}>
```

### Data Fetching Pattern (for future API integration)
```typescript
const [data, setData] = useState<Data[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('/api/data');
            const json = await response.json();
            setData(json);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

## Anti-Patterns to Avoid

❌ **Don't mutate state directly**
```typescript
// Bad
state.push(item);

// Good
setState([...state, item]);
```

❌ **Don't use index as key**
```typescript
// Bad
{items.map((item, index) => <div key={index}>...)}

// Good
{items.map(item => <div key={item.id}>...)}
```

❌ **Don't forget dependencies in useEffect**
```typescript
// Bad
useEffect(() => {
    doSomething(value);
}, []); // Missing dependency

// Good
useEffect(() => {
    doSomething(value);
}, [value]);
```

❌ **Don't use inline object/array literals in dependencies**
```typescript
// Bad - creates new object every render
useEffect(() => {
    // ...
}, [{ id: 1 }]);

// Good
const config = useMemo(() => ({ id: 1 }), []);
useEffect(() => {
    // ...
}, [config]);
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BillForm } from './BillForm';

describe('BillForm', () => {
    it('should call onSave with form data', () => {
        const onSave = vi.fn();
        render(<BillForm onSave={onSave} onClose={() => {}} />);
        
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test Bill' }
        });
        fireEvent.click(screen.getByText('Save'));
        
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Test Bill' })
        );
    });
});
```

### Hook Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useCalculations } from './useCalculations';

describe('useCalculations', () => {
    it('should calculate totals correctly', () => {
        const { result } = renderHook(() => 
            useCalculations(mockEntries, mockAccounts)
        );
        
        expect(result.current.total).toBe(100);
    });
});
```

## Accessibility

- Use semantic HTML elements
- Add ARIA labels when needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper heading hierarchy
- Provide alt text for images

## Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
