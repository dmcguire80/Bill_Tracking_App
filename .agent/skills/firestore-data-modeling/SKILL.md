---
name: Firestore Data Modeling
description: Patterns for structuring Firestore collections, security rules, and query optimization based on Bill Tracker
---

# Firestore Data Modeling Skill

## Core Principles

1. **User-scoped data** - Organize data under user IDs
2. **Denormalization** - Duplicate data for query performance
3. **Security first** - Design with security rules in mind
4. **Query optimization** - Structure for efficient queries

## Collection Structure Pattern

### User-Scoped Collections

```
users/{userId}/
  ├── bills/{billId}
  ├── accounts/{accountId}
  ├── templates/{templateId}
  └── settings/preferences
```

**Benefits:**
- Easy security rules
- Automatic data isolation
- Simple queries
- Clear ownership

### Document Structure

```typescript
// Bill document
interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Timestamp;
  isPaid: boolean;
  accountId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Account document
interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings';
  createdAt: Timestamp;
}
```

## Security Rules

### User-Scoped Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - only owner can access
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Validate data on write
    match /users/{userId}/bills/{billId} {
      allow create: if request.auth.uid == userId
                    && request.resource.data.keys().hasAll(['name', 'amount', 'dueDate'])
                    && request.resource.data.amount is number
                    && request.resource.data.amount >= 0;
      
      allow update: if request.auth.uid == userId
                    && request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['name', 'amount', 'dueDate', 'isPaid', 'updatedAt']);
    }
  }
}
```

## Query Patterns

### Basic Queries

```typescript
// Get all bills for user
const billsRef = collection(db, `users/${userId}/bills`);
const billsSnapshot = await getDocs(billsRef);

// Query with filter
const unpaidBills = query(
  billsRef,
  where('isPaid', '==', false),
  orderBy('dueDate', 'asc')
);

// Real-time listener
onSnapshot(billsRef, (snapshot) => {
  const bills = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

### Compound Queries

```typescript
// Multiple filters (requires composite index)
const upcomingBills = query(
  billsRef,
  where('isPaid', '==', false),
  where('dueDate', '>=', startDate),
  where('dueDate', '<=', endDate),
  orderBy('dueDate', 'asc')
);
```

## Best Practices

1. **Timestamps** - Always include createdAt/updatedAt
2. **IDs** - Use auto-generated IDs or meaningful slugs
3. **Arrays** - Limit array sizes, use subcollections for large lists
4. **Denormalization** - Duplicate data to avoid joins
5. **Indexes** - Create composite indexes for complex queries
6. **Batch writes** - Use batches for multiple operations

## Common Patterns

### Soft Delete

```typescript
interface Bill {
  // ... other fields
  deletedAt?: Timestamp;
}

// Query only active bills
const activeBills = query(billsRef, where('deletedAt', '==', null));
```

### Counters

```typescript
// Increment counter
await updateDoc(accountRef, {
  billCount: increment(1)
});
```

### Timestamps

```typescript
import { serverTimestamp } from 'firebase/firestore';

await addDoc(billsRef, {
  ...billData,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
```

## Resources

- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Query Data](https://firebase.google.com/docs/firestore/query-data/queries)
