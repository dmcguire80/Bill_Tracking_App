import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Entry, BillTemplate, Account, PaydayTemplate, Bill } from '../types';
import { generateEntries } from '../utils/generator';
import { uuid } from '../utils/uuid';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch
} from 'firebase/firestore';

// No local defaults needed with Firebase


export interface BackupSettings {
    enabled: boolean;
    interval: 'daily' | 'weekly';
    lastBackup: string | null;
}

interface DataContextType {
    entries: Entry[];
    accounts: Account[];
    templates: BillTemplate[];
    paydayTemplates: PaydayTemplate[];
    addEntry: (entry: Entry) => void;
    updateEntry: (entry: Entry) => void;
    deleteEntry: (id: string) => void;
    addAccount: (name: string) => void;
    removeAccount: (id: string) => void;
    updateAccount: (id: string, name: string) => void;
    reorderAccounts: (accounts: Account[]) => void;
    addTemplate: (template: BillTemplate) => void;
    updateTemplate: (template: BillTemplate) => void;
    deleteTemplate: (id: string) => void;
    addPaydayTemplate: (template: PaydayTemplate) => void;
    updatePaydayTemplate: (template: PaydayTemplate) => void;
    deletePaydayTemplate: (id: string) => void;
    exportData: () => any;
    importData: (data: any) => Promise<void>;
    backupSettings: BackupSettings;
    updateBackupSettings: (settings: BackupSettings) => void;
    loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    // State
    const [entries, setEntries] = useState<Entry[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [templates, setTemplates] = useState<BillTemplate[]>([]);
    const [paydayTemplates, setPaydayTemplates] = useState<PaydayTemplate[]>([]);
    const [backupSettings, setBackupSettings] = useState<BackupSettings>({ enabled: false, interval: 'daily', lastBackup: null });
    const [loading, setLoading] = useState(true);

    // Initial Load & Real-time Sync (Firestore)
    useEffect(() => {
        if (!user) {
            setEntries([]);
            setAccounts([]);
            setTemplates([]);
            setPaydayTemplates([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Helper to subscribe to a collection
        const subscribe = (collectionName: string, setter: (data: any[]) => void) => {
            const q = query(collection(db, collectionName), where('userId', '==', user.uid));
            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id }));
                setter(data);
            });
        };

        const unsubEntries = subscribe('entries', (data) => setEntries(data as Entry[]));
        const unsubAccounts = subscribe('accounts', (data) => setAccounts(data.sort((a, b) => a.order - b.order) as Account[]));
        const unsubTemplates = subscribe('templates', (data) => setTemplates(data as BillTemplate[]));
        const unsubPaydayTemplates = subscribe('paydayTemplates', (data) => setPaydayTemplates(data as PaydayTemplate[]));

        // Backup settings are less critical, can be stored in user profile or separate doc
        // For now, simpler to not sync them or store in a 'settings' collection
        setLoading(false);

        return () => {
            unsubEntries();
            unsubAccounts();
            unsubTemplates();
            unsubPaydayTemplates();
        };
    }, [user]);

    // Firestore Actions Helper
    const addToFirestore = async (collectionName: string, data: any) => {
        if (!user) return;
        // Use the ID from the object as the Firestore document ID to ensure consistency
        // or let Firestore generate one. Here we use custom IDs so we might want to setDoc
        // But for simplicity of migration, we'll let Firestore generate IDs or filter by our internal UUIDs.
        // Actually, best practice: separate internal ID (application logic) from Firestore ID (database logic).
        await addDoc(collection(db, collectionName), { ...data, userId: user.uid });
    };

    const updateInFirestore = async (collectionName: string, _: string, data: any) => {
        if (!user) return;
        // We need to find the FIREBASE document ID that corresponds to our internal ID
        // This is inefficient (query before update), but necessary unless we store firebaseId on the object
        // NOTE: The subscribe logic above adds `firebaseId` to the object state!
        // So we can check if data has firebaseId.

        const firebaseId = (data as any).firebaseId;
        if (firebaseId) {
            // Remove firebaseId before saving
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { firebaseId: _fid, ...cleanData } = data;
            await updateDoc(doc(db, collectionName, firebaseId), cleanData);
        }
    };

    const deleteFromFirestore = async (collectionName: string, id: string, objects: any[]) => {
        if (!user) return;
        const obj = objects.find(o => o.id === id);
        const firebaseId = (obj as any)?.firebaseId;
        if (firebaseId) {
            await deleteDoc(doc(db, collectionName, firebaseId));
        }
    };

    // Actions
    const addEntry = (entry: Entry) => addToFirestore('entries', entry);
    const updateEntry = (entry: Entry) => updateInFirestore('entries', entry.id, entry);
    const deleteEntry = (id: string) => deleteFromFirestore('entries', id, entries);

    const addAccount = (name: string) => {
        if (!accounts.some(a => a.name === name)) {
            addToFirestore('accounts', { id: uuid(), name, order: accounts.length });
        }
    };

    const updateAccount = (id: string, name: string) => {
        const account = accounts.find(a => a.id === id);
        if (account) updateInFirestore('accounts', id, { ...account, name });
    };

    const removeAccount = (id: string) => deleteFromFirestore('accounts', id, accounts);

    const reorderAccounts = (newOrder: Account[]) => {
        // Batch update for reordering
        if (!user) return;
        const batch = writeBatch(db);
        newOrder.forEach((acc, index) => {
            if ((acc as any).firebaseId) {
                const ref = doc(db, 'accounts', (acc as any).firebaseId);
                batch.update(ref, { order: index });
            }
        });
        batch.commit();
    };

    const addTemplate = (template: BillTemplate) => {
        addToFirestore('templates', template);
        syncEntriesWithTemplate(template);
    };

    const updateTemplate = (template: BillTemplate) => {
        updateInFirestore('templates', template.id, template);
        syncEntriesWithTemplate(template);
    };

    const deleteTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        if (template) {
            deleteFromFirestore('templates', id, templates);
            syncEntriesWithTemplate(template, true);
        }
    };

    const addPaydayTemplate = (template: PaydayTemplate) => {
        addToFirestore('paydayTemplates', template);
        syncEntriesWithTemplate(template);
    };

    const updatePaydayTemplate = (template: PaydayTemplate) => {
        updateInFirestore('paydayTemplates', template.id, template);
        syncEntriesWithTemplate(template);
    };

    const deletePaydayTemplate = (id: string) => {
        const template = paydayTemplates.find(t => t.id === id);
        if (template) {
            deleteFromFirestore('paydayTemplates', id, paydayTemplates);
            syncEntriesWithTemplate(template, true);
        }
    };

    // Helper to sync entries when templates change
    // Note: This logic is tricky with Firestore. We generate entries LOCALLY, check duplicates LOCALLY,
    // and then push NEW entries to Firestore. We do NOT delete old manual entries automatically via DB.
    const syncEntriesWithTemplate = (template: BillTemplate | PaydayTemplate, isDeleted: boolean = false) => {
        if (isDeleted) {
            // Remove unpaid/future entries linked to this template
            entries
                .filter(e => e.templateId === template.id && !(e as Bill).paid)
                .forEach(e => deleteFromFirestore('entries', e.id, entries));
            return;
        }

        const isBillTemplate = 'amounts' in template;
        const newGenerated = generateEntries(
            isBillTemplate ? [template as BillTemplate] : [],
            !isBillTemplate ? [template as PaydayTemplate] : [],
            new Date().getFullYear()
        );

        newGenerated.forEach(gen => {
            const alreadyExists = entries.some(e =>
                e.templateId === template.id &&
                e.month === gen.month &&
                e.date === gen.date
            );

            if (!alreadyExists) {
                addToFirestore('entries', gen);
            }
        });
    };

    const importData = async (data: any) => {
        if (!user || !data) return;

        // Batch write is limited to 500 ops. We'll do simple loops for now.
        const batch = writeBatch(db);
        let count = 0;
        const commitBatch = async () => {
            if (count > 0) {
                await batch.commit();
                count = 0;
            }
        };

        // We can't easily use batch for ALL imports because we need to generate new Docs.
        // For simplicity in this migration step, we'll just loop and addDoc.
        // It's slower but safer for a one-time user migration.

        if (Array.isArray(data.entries)) {
            for (const item of data.entries) await addToFirestore('entries', item);
        }
        if (Array.isArray(data.accounts)) {
            for (const item of data.accounts) await addToFirestore('accounts', item);
        }
        if (Array.isArray(data.templates)) {
            for (const item of data.templates) await addToFirestore('templates', item);
        }
        if (Array.isArray(data.paydayTemplates)) {
            for (const item of data.paydayTemplates) await addToFirestore('paydayTemplates', item);
        }

        // To satisfy linter about unused commitBatch - although logic is changed to not use batch for now
        // we can just remove it or call it at end (empty op)
        await commitBatch();
    };

    const updateBackupSettings = (settings: BackupSettings) => setBackupSettings(settings);

    return (
        <DataContext.Provider value={{
            entries,
            accounts,
            templates,
            paydayTemplates,
            addEntry,
            updateEntry,
            deleteEntry,
            addAccount,
            removeAccount,
            updateAccount,
            reorderAccounts,
            addTemplate,
            updateTemplate,
            deleteTemplate,
            addPaydayTemplate,
            updatePaydayTemplate,
            deletePaydayTemplate,
            exportData: () => ({ entries, accounts, templates, paydayTemplates }),
            importData,
            backupSettings,
            updateBackupSettings,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};
