import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'system';
        }
        return 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        const removeOldTheme = () => {
            root.classList.remove('light', 'dark');
        };

        const applyTheme = (targetTheme: 'light' | 'dark') => {
            removeOldTheme();
            root.classList.add(targetTheme);
        };

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            applyTheme(systemTheme);

            // Listener for system changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                applyTheme(e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            applyTheme(theme);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    return { theme, setTheme };
}
