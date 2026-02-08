import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Fingerprint, LogOut, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsSecurity = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Security</h3>
        <p className="text-neutral-400">Manage your account security and authentication methods.</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-sm">
        These features are coming in a future update.
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6 opacity-75">
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Key size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Password</h4>
              <p className="text-sm text-neutral-400">Last changed 3 months ago</p>
            </div>
          </div>
          <button className="text-sm bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/10 opacity-50 cursor-not-allowed">
            Update
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Multi-Factor Auth</h4>
              <p className="text-sm text-neutral-400">Add an extra layer of security</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Fingerprint size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Biometric Login</h4>
              <p className="text-sm text-neutral-400">Use FaceID or TouchID</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <LogOut size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Sign Out</h4>
              <p className="text-sm text-neutral-400">Sign out of your account on this device</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loggingOut ? (
              <>
                <Loader className="animate-spin" size={16} />
                Signing out...
              </>
            ) : (
              'Sign Out'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
