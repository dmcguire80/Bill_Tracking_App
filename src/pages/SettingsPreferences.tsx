import { useData } from '../context/DataContext';
import { Navigation } from '../components/Navigation';
import { SettingsNav } from '../components/SettingsNav';
import { Eye, EyeOff } from 'lucide-react';

export const SettingsPreferences = () => {
  const { hideOldData, setHideOldData } = useData();

  return (
    <>
      <Navigation />
      <div className="space-y-6">
        <SettingsNav />
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Display Preferences</h2>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                  {hideOldData ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
                <div>
                  <h3 className="text-white font-medium">Hide Old Data</h3>
                  <p className="text-sm text-neutral-400">
                    Hide bill history older than 8 weeks to keep the dashboard clean.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideOldData}
                  onChange={e => setHideOldData(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
