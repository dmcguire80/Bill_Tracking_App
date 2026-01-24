import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isOnSettings = location.pathname.startsWith('/settings');

    return (
        <div className="min-h-screen bg-[#0f172a] text-neutral-100 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Bill Tracker
                </h1>
                {isOnSettings && (
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                )}
            </header>

            {/* Main Content */}
            <main className="p-8">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

