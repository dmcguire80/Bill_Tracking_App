import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Entry, BillTemplate, Account, PaydayTemplate, Bill } from '../types';
import { initialData } from '../data/initialData';
import { generateEntries } from '../utils/generator';
import { uuid } from '../utils/uuid';

// Initial hardcoded accounts until we have persistence - UPDATED to object format
const DEFAULT_ACCOUNTS: Account[] = [];

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
    importData: (data: any) => void;
    backupSettings: BackupSettings;
    updateBackupSettings: (settings: BackupSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to migrate old string arrays to objects
const migrateAccounts = (saved: string): Account[] => {
    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
            return parsed.map((name: string, index: number) => ({
                id: uuid(),
                name,
                order: index
            }));
        }
        return parsed as Account[];
    } catch {
        return DEFAULT_ACCOUNTS;
    }
};

// Helper to migrate templates to include isActive field
const migrateTemplates = <T extends BillTemplate | PaydayTemplate>(templates: T[]): T[] => {
    return templates.map(t => ({
        ...t,
        isActive: t.isActive ?? true,  // Default to active
        endMonth: t.endMonth ?? undefined
    }));
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
    // State
    const [entries, setEntries] = useState<Entry[]>(() => {
        const saved = localStorage.getItem('entries');
        return saved ? JSON.parse(saved) : initialData;
    });

    const [accounts, setAccounts] = useState<Account[]>(() => {
        const saved = localStorage.getItem('accounts');
        return saved ? migrateAccounts(saved) : DEFAULT_ACCOUNTS;
    });

    const [templates, setTemplates] = useState<BillTemplate[]>(() => {
        const saved = localStorage.getItem('templates');
        const parsed = saved ? JSON.parse(saved) : [];
        return migrateTemplates(parsed);
    });

    const [paydayTemplates, setPaydayTemplates] = useState<PaydayTemplate[]>(() => {
        const saved = localStorage.getItem('paydayTemplates');
        const parsed = saved ? JSON.parse(saved) : [];
        return migrateTemplates(parsed);
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('templates', JSON.stringify(templates));
    }, [templates]);

    useEffect(() => {
        localStorage.setItem('paydayTemplates', JSON.stringify(paydayTemplates));
    }, [paydayTemplates]);

    // Actions
    const addEntry = (entry: Entry) => setEntries(prev => [...prev, entry]);

    const updateEntry = (updatedEntry: Entry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    };

    const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

    // Helper to sync entries when templates change
    const syncEntriesWithTemplate = (template: BillTemplate | PaydayTemplate, isDeleted: boolean = false) => {
        setEntries(prev => {
            // 1. Remove entries linked to this template ID (that are not paid)
            // If deleted, remove all unpaid. If updated, we'll replace them.
            const filtered = prev.filter(e => e.templateId !== template.id || (e.templateId === template.id && (e as Bill).paid));

            if (isDeleted) return filtered;

            // 2. Generate new entries for the current year
            const isBillTemplate = 'amounts' in template;
            const newGenerated = generateEntries(
                isBillTemplate ? [template as BillTemplate] : [],
                !isBillTemplate ? [template as PaydayTemplate] : [],
                new Date().getFullYear() // 2026 or current year
            );

            // 3. Filter out generated entries that already exist in "paid" state
            const toAdd = newGenerated.filter(gen => {
                const alreadyExistsPaid = prev.some(e =>
                    e.templateId === template.id &&
                    e.month === gen.month &&
                    e.date === gen.date &&
                    (e as Bill).paid
                );
                return !alreadyExistsPaid;
            });

            return [...filtered, ...toAdd];
        });
    };

    const addAccount = (name: string) => {
        if (!accounts.some(a => a.name === name)) {
            setAccounts(prev => [
                ...prev,
                { id: uuid(), name, order: prev.length }
            ]);
        }
    };

    const updateAccount = (id: string, name: string) => {
        setAccounts(prev => prev.map(a => a.id === id ? { ...a, name } : a));
    };

    const removeAccount = (id: string) => {
        setAccounts(prev => prev.filter(a => a.id !== id));
    };

    const reorderAccounts = (newOrder: Account[]) => {
        const reindexed = newOrder.map((a, i) => ({ ...a, order: i }));
        setAccounts(reindexed);
    };

    const addTemplate = (template: BillTemplate) => {
        setTemplates(prev => [...prev, template]);
        syncEntriesWithTemplate(template);
    };

    const updateTemplate = (updated: BillTemplate) => {
        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
        syncEntriesWithTemplate(updated);
    };

    const deleteTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        if (template) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            syncEntriesWithTemplate(template, true);
        }
    };

    const addPaydayTemplate = (template: PaydayTemplate) => {
        setPaydayTemplates(prev => [...prev, template]);
        syncEntriesWithTemplate(template);
    };

    const updatePaydayTemplate = (updated: PaydayTemplate) => {
        setPaydayTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
        syncEntriesWithTemplate(updated);
    };

    const deletePaydayTemplate = (id: string) => {
        const template = paydayTemplates.find(t => t.id === id);
        if (template) {
            setPaydayTemplates(prev => prev.filter(t => t.id !== id));
            syncEntriesWithTemplate(template, true);
        }
    };

    // Backup Settings
    const [backupSettings, setBackupSettings] = useState<BackupSettings>(() => {
        const stored = localStorage.getItem('backupSettings');
        return stored ? JSON.parse(stored) : { enabled: false, interval: 'daily', lastBackup: null };
    });

    useEffect(() => {
        localStorage.setItem('backupSettings', JSON.stringify(backupSettings));
    }, [backupSettings]);

    const updateBackupSettings = (settings: BackupSettings) => {
        setBackupSettings(settings);
    };

    // Auto-Backup Logic
    useEffect(() => {
        if (!backupSettings.enabled) return;

        const performBackup = async () => {
            const now = new Date();
            const last = backupSettings.lastBackup ? new Date(backupSettings.lastBackup) : new Date(0);
            const daysDiff = (now.getTime() - last.getTime()) / (1000 * 3600 * 24);

            const shouldBackup =
                (backupSettings.interval === 'daily' && daysDiff >= 1) ||
                (backupSettings.interval === 'weekly' && daysDiff >= 7) ||
                !backupSettings.lastBackup; // First time

            if (shouldBackup) {
                try {
                    const data = {
                        entries,
                        accounts,
                        templates,
                        paydayTemplates,
                        meta: {
                            version: 'v0.7.4',
                            backupDate: now.toISOString(),
                            auto: true
                        }
                    };

                    const res = await fetch('/api/backup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (res.ok) {
                        console.log('Auto-backup successful');
                        setBackupSettings(prev => ({ ...prev, lastBackup: now.toISOString() }));
                    } else {
                        console.error('Auto-backup failed:', await res.text());
                    }
                } catch (err) {
                    console.error('Auto-backup error:', err);
                }
            }
        };

        // Check immediately on load/change, and could set interval but simple check is enough for SPA
        performBackup();

        // Also set an interval to check every hour while the app is open
        const intervalId = setInterval(performBackup, 3600000); // 1 hour
        return () => clearInterval(intervalId);

    }, [backupSettings, entries, accounts, templates, paydayTemplates]);

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
            exportData: () => ({
                entries,
                accounts,
                templates,
                paydayTemplates
            }),
            importData: (data: any) => {
                if (!data || typeof data !== 'object') throw new Error('Invalid data format');

                // Basic validation
                if (Array.isArray(data.entries)) setEntries(data.entries);
                if (Array.isArray(data.accounts)) setAccounts(data.accounts);
                if (Array.isArray(data.templates)) setTemplates(migrateTemplates(data.templates));
                if (Array.isArray(data.paydayTemplates)) setPaydayTemplates(migrateTemplates(data.paydayTemplates));
            },
            backupSettings,
            updateBackupSettings
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
