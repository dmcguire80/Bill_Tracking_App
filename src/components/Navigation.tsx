import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings } from 'lucide-react';

export const Navigation = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <div className="flex gap-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                        key={path}
                        to={path === '/settings' ? '/settings/bills' : path}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${isActive(path)
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon size={18} />
                        <span className="hidden sm:inline">{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};
