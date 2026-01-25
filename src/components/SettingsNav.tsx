import { Link, useLocation } from 'react-router-dom';

export const SettingsNav = () => {
    const location = useLocation();

    const tabs = [
        { path: '/settings/bills', label: 'Manage Bills' },
        { path: '/settings/paydays', label: 'Manage Paydays' },
        { path: '/settings/accounts', label: 'Manage Accounts' },
        { path: '/settings/data', label: 'Data Management' },
    ];

    return (
        <div className="flex gap-2 border-b border-white/10 pb-4">
            {tabs.map(({ path, label }) => (
                <Link
                    key={path}
                    to={path}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === path
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {label}
                </Link>
            ))}
        </div>
    );
};
