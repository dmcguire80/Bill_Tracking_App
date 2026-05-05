import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import type { DebtAccount, BalanceEntry, DebtAccountType } from '../types';

interface DataContextType {
  accounts: DebtAccount[];
  entries: BalanceEntry[];
  loading: boolean;
  error: string | null;
  // Account operations
  addAccount: (
    name: string,
    accountType: DebtAccountType,
    creditLimit?: number,
    interestRate?: number
  ) => Promise<string>;
  updateAccount: (id: string, data: Partial<DebtAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  toggleAccountActive: (id: string) => Promise<void>;
  reorderAccounts: (reorderedAccounts: DebtAccount[]) => Promise<void>;
  // Entry operations
  addEntry: (accountId: string, value: number, date: Date, note?: string) => Promise<void>;
  addEntries: (
    entries: { accountId: string; value: number; date: Date; note?: string }[]
  ) => Promise<void>;
  updateEntry: (id: string, data: Partial<BalanceEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  // Utility
  getActiveAccounts: () => DebtAccount[];
  getEntriesForAccount: (accountId: string) => BalanceEntry[];
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<DebtAccount[]>([]);
  const [entries, setEntries] = useState<BalanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to accounts
  useEffect(() => {
    if (!user) return;

    const accountsRef = collection(db, 'users', user.uid, 'accounts');
    const accountsQuery = query(accountsRef, orderBy('order'), orderBy('name'));

    const unsubscribe = onSnapshot(
      accountsQuery,
      (snapshot) => {
        const accountsData: DebtAccount[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: user.uid,
          name: doc.data().name,
          accountType: doc.data().accountType || 'OTHER',
          creditLimit: doc.data().creditLimit || undefined,
          interestRate: doc.data().interestRate || undefined,
          isActive: doc.data().isActive ?? true,
          order: doc.data().order ?? 0,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }));
        setAccounts(accountsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching accounts:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      setAccounts([]);
      setEntries([]);
    };
  }, [user]);

  // Subscribe to entries
  useEffect(() => {
    if (!user) return;

    const entriesRef = collection(db, 'users', user.uid, 'entries');
    const entriesQuery = query(entriesRef, orderBy('entryDate', 'desc'));

    const unsubscribe = onSnapshot(
      entriesQuery,
      (snapshot) => {
        const entriesData: BalanceEntry[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          accountId: doc.data().accountId,
          userId: user.uid,
          value: doc.data().value,
          entryDate: doc.data().entryDate?.toDate() || new Date(),
          note: doc.data().note || undefined,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setEntries(entriesData);
      },
      (err) => {
        console.error('Error fetching entries:', err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Account operations
  const addAccount = useCallback(
    async (
      name: string,
      accountType: DebtAccountType,
      creditLimit?: number,
      interestRate?: number
    ): Promise<string> => {
      if (!user) throw new Error('Not authenticated');
      const accountsRef = collection(db, 'users', user.uid, 'accounts');
      
      // Get current max order
      const snapshot = await getDocs(accountsRef);
      const maxOrder = snapshot.docs.reduce((max, doc) => {
        const order = doc.data().order ?? 0;
        return order > max ? order : max;
      }, 0);

      const docRef = await addDoc(accountsRef, {
        name,
        accountType,
        creditLimit: creditLimit || null,
        interestRate: interestRate || null,
        isActive: true,
        order: maxOrder + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    },
    [user]
  );

  const updateAccount = useCallback(
    async (id: string, data: Partial<DebtAccount>) => {
      if (!user) throw new Error('Not authenticated');
      const accountRef = doc(db, 'users', user.uid, 'accounts', id);
      await updateDoc(accountRef, { ...data, updatedAt: Timestamp.now() });
    },
    [user]
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      // Delete all entries for this account first
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const entriesQuery = query(entriesRef, where('accountId', '==', id));
      const snapshot = await getDocs(entriesQuery);

      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.docs.forEach((entryDoc) => batch.delete(entryDoc.ref));
        await batch.commit();
      }

      const accountRef = doc(db, 'users', user.uid, 'accounts', id);
      await deleteDoc(accountRef);
    },
    [user]
  );

  const toggleAccountActive = useCallback(
    async (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (!account) return;
      await updateAccount(id, { isActive: !account.isActive });
    },
    [accounts, updateAccount]
  );

  const reorderAccounts = useCallback(
    async (reorderedAccounts: DebtAccount[]) => {
      if (!user) throw new Error('Not authenticated');
      const batch = writeBatch(db);

      reorderedAccounts.forEach((account, index) => {
        const accountRef = doc(db, 'users', user.uid, 'accounts', account.id);
        batch.update(accountRef, { order: index });
      });

      await batch.commit();
    },
    [user]
  );

  // Entry operations
  const addEntry = useCallback(
    async (accountId: string, value: number, date: Date, note?: string) => {
      if (!user) throw new Error('Not authenticated');
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      await addDoc(entriesRef, {
        accountId,
        value,
        entryDate: Timestamp.fromDate(date),
        note: note || null,
        createdAt: Timestamp.now(),
      });
    },
    [user]
  );

  const addEntries = useCallback(
    async (entriesData: { accountId: string; value: number; date: Date; note?: string }[]) => {
      if (!user) throw new Error('Not authenticated');
      const batch = writeBatch(db);
      const entriesRef = collection(db, 'users', user.uid, 'entries');

      for (const entry of entriesData) {
        const docRef = doc(entriesRef);
        batch.set(docRef, {
          accountId: entry.accountId,
          value: entry.value,
          entryDate: Timestamp.fromDate(entry.date),
          note: entry.note || null,
          createdAt: Timestamp.now(),
        });
      }

      await batch.commit();
    },
    [user]
  );

  const updateEntry = useCallback(
    async (id: string, data: Partial<BalanceEntry>) => {
      if (!user) throw new Error('Not authenticated');
      const entryRef = doc(db, 'users', user.uid, 'entries', id);
      const updateData: Record<string, unknown> = { ...data };
      if (data.entryDate) {
        updateData.entryDate = Timestamp.fromDate(data.entryDate);
      }
      await updateDoc(entryRef, updateData);
    },
    [user]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const entryRef = doc(db, 'users', user.uid, 'entries', id);
      await deleteDoc(entryRef);
    },
    [user]
  );

  // Utility functions
  const getActiveAccounts = useCallback(() => {
    return accounts.filter((a) => a.isActive);
  }, [accounts]);

  const getEntriesForAccount = useCallback(
    (accountId: string) => {
      return entries.filter((e) => e.accountId === accountId);
    },
    [entries]
  );

  const value: DataContextType = {
    accounts,
    entries,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountActive,
    reorderAccounts,
    addEntry,
    addEntries,
    updateEntry,
    deleteEntry,
    getActiveAccounts,
    getEntriesForAccount,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
