import { NavLink, Outlet } from 'react-router-dom';
import { User, Shield, HardDrive, Palette, FileText, Calendar, CreditCard } from 'lucide-react';
import { Navigation } from './Navigation';

export const SettingsLayout = () => {
    const navItems = [
        { icon: User, label: 'Profile', path: '/settings/profile' },
        { icon: Palette, label: 'Appearance', path: '/settings/appearance' },
        { icon: FileText, label: 'Bills', path: '/settings/bills' },
        { icon: Calendar, label: 'Paydays', path: '/settings/paydays' },
        { icon: CreditCard, label: 'Accounts', path: '/settings/accounts' },
        { icon: HardDrive, label: 'Data', path: '/settings/data' },
        { icon: Shield, label: 'Security', path: '/settings/security' },
    ];

    return (
        <>
            <Navigation />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-neutral-400 mt-2">Manage your account preferences and application settings.</p>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};
