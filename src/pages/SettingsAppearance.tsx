import { useTheme } from '../hooks/useTheme';
import { Moon, Sun, Monitor } from 'lucide-react';

export const SettingsAppearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Appearance</h3>
        <p className="text-neutral-400">Customize how the app looks securely.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-4">Theme Preference</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
              theme === 'light'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-black/20 border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <Sun size={32} />
            <span className="font-medium">Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-black/20 border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <Moon size={32} />
            <span className="font-medium">Dark</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
              theme === 'system'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-black/20 border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <Monitor size={32} />
            <span className="font-medium">System</span>
          </button>
        </div>
      </div>
    </div>
  );
};
