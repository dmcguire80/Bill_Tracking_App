import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail } from 'lucide-react';

export const SettingsProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        try {
            await updateUserProfile(displayName);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                <p className="text-neutral-400">Manage your public profile information.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-3xl font-bold border border-emerald-500/20">
                        {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div>
                        <button className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                            Change Avatar
                        </button>
                        <p className="text-xs text-neutral-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Display Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={user?.email || ''}
                                readOnly
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-neutral-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Email cannot be changed securely yet.</p>
                    </div>

                    {successMessage && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                            {successMessage}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
