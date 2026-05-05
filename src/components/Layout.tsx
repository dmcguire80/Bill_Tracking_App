import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, DollarSign, Target, Clock, Settings as SettingsIcon } from 'lucide-react';

export function Layout() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/data-entry', icon: DollarSign, label: 'Update' },
    { to: '/manage-accounts', icon: Target, label: 'Accounts' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📉</div>
              <div>
                <h1 className="text-2xl font-bold">Descent</h1>
                <p className="text-sm opacity-90">Debt Reduction Tracker</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[var(--bg-secondary)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-wide py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--border)]">
        <p>Descent &copy; 2026 · Track your journey to debt freedom</p>
      </footer>
    </div>
  );
}
