import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Navigation } from '../components/Navigation';
import { SettingsNav } from '../components/SettingsNav';
import { Download, Upload, AlertTriangle, CheckCircle, FileJson } from 'lucide-react';

export const DataManagement = () => {
    const { exportData, importData, backupSettings, updateBackupSettings } = useData();
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `bill-tracker-data-${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Simple validation check
                if (!data.entries && !data.accounts && !data.templates) {
                    throw new Error('Invalid backup file format');
                }

                if (window.confirm('WARNING: This will overwrite all current data. This action cannot be undone. Are you sure?')) {
                    importData(data);
                    setImportStatus('success');
                    setErrorMessage('');
                    // Clear input
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } else {
                    // User cancelled, reset input
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            } catch (err) {
                console.error('Import error:', err);
                setImportStatus('error');
                setErrorMessage(err instanceof Error ? err.message : 'Failed to parse backup file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <Navigation />
            <div className="space-y-8">
                <SettingsNav />

                <div className="max-w-4xl mx-auto space-y-8">
                    <header>
                        <h2 className="text-2xl font-bold text-white mb-2">Data Management</h2>
                        <p className="text-neutral-400">Back up your data or restore from a previous backup.</p>
                    </header>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Auto-Backup Section */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                                    <CheckCircle className="text-fuchsia-400" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white">Automated Backups</h3>
                                    <p className="text-sm text-neutral-400">Automatically save backups to the server's local disk.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={backupSettings.enabled}
                                            onChange={(e) => updateBackupSettings({ ...backupSettings, enabled: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500"></div>
                                    </label>
                                </div>
                            </div>

                            {backupSettings.enabled && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-neutral-400 text-sm">Backup Frequency:</span>
                                        <select
                                            value={backupSettings.interval}
                                            onChange={(e) => updateBackupSettings({ ...backupSettings, interval: e.target.value as 'daily' | 'weekly' })}
                                            className="bg-black/20 border border-white/10 rounded px-3 py-1 text-white text-sm"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                        Last backup: {backupSettings.lastBackup ? new Date(backupSettings.lastBackup).toLocaleString() : 'Never'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Export Section */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-lg">
                                    <Download className="text-emerald-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Export Data</h3>
                            </div>
                            <p className="text-neutral-400 mb-6">
                                Download a JSON file containing all your accounts, bills, templates, and history.
                                Keep this file safe as a backup.
                            </p>
                            <button
                                onClick={handleExport}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Download Backup
                            </button>
                        </div>

                        {/* Import Section */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Upload className="text-blue-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Import Data</h3>
                            </div>
                            <p className="text-neutral-400 mb-6">
                                Restore your data from a previously exported JSON file.
                                <span className="block mt-2 text-amber-400 text-sm flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    Warning: This will overwrite current data.
                                </span>
                            </p>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                    id="backup-upload"
                                />
                                <label
                                    htmlFor="backup-upload"
                                    className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:border-white/20"
                                >
                                    <FileJson size={20} />
                                    Select Backup File
                                </label>
                            </div>

                            {importStatus === 'success' && (
                                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Data restored successfully!
                                </div>
                            )}

                            {importStatus === 'error' && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    {errorMessage || 'Failed to import data.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
