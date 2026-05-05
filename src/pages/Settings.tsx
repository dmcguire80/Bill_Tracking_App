import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6" />
          Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Display Name</label>
            <p className="font-medium">{user?.displayName || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">User ID</label>
            <p className="font-mono text-sm text-[var(--text-secondary)]">{user?.uid}</p>
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">About Descent</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Track your debt reduction journey. Update your balances weekly and watch your progress
          toward financial freedom.
        </p>
        <div className="text-sm text-[var(--text-secondary)]">
          <p>Version 1.0.0</p>
          <p>Built with React, TypeScript, and Firebase</p>
        </div>
      </div>

      {/* Logout */}
      <div className="card p-6">
        <button
          onClick={handleLogout}
          className="btn btn-danger w-full flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
