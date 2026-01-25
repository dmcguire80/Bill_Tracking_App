import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CloudUpload, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

export const MigrationTool = () => {
    const { importData } = useData();
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'fetching' | 'uploading' | 'done' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleMigrate = async () => {
        if (!confirm('This will upload data from the local server to your Cloud account. Continue?')) return;

        try {
            setStatus('fetching');
            setMessage('Fetching data from local server...');

            // 1. Fetch from the legacy API endpoint (which still reads db.json)
            const res = await fetch('/api/data');

            if (!res.ok) {
                if (res.status === 404) throw new Error('No local data found on server.');
                throw new Error('Failed to connect to local server.');
            }

            const data = await res.json();

            setStatus('uploading');
            setMessage(`Found ${data.entries?.length || 0} entries. Uploading to Cloud...`);

            // 2. Import into Firestore (using DataContext helper)
            await importData(data);

            setStatus('done');
            setMessage('Migration successful! Your data is now in the cloud.');

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'Migration failed.');
        }
    };

    if (!user) return null;

    return (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 shadow-lg shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <CloudUpload className="text-emerald-400" />
                Migrate to Cloud
            </h3>

            <p className="text-slate-400 mb-6">
                Move your existing local data (from the server) to your new secure Cloud account.
                You only need to do this once.
            </p>

            {status === 'error' && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    {message}
                </div>
            )}

            {status === 'done' && (
                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-lg mb-4 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {message}
                </div>
            )}

            <button
                onClick={handleMigrate}
                disabled={status === 'fetching' || status === 'uploading' || status === 'done'}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'fetching' || status === 'uploading' ? (
                    <>
                        <Loader className="animate-spin" size={20} />
                        {message}
                    </>
                ) : status === 'done' ? (
                    'Migration Complete'
                ) : (
                    'Start Migration'
                )}
            </button>
        </div>
    );
};
