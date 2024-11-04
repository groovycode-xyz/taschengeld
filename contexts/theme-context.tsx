'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define available themes
export type Theme = 'light' | 'ocean' | 'forest' | 'sunset' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Exclude<Theme, 'system'>; // The actual theme being applied
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props type
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<Exclude<Theme, 'system'>>(
    defaultTheme === 'system' ? 'light' : (defaultTheme as Exclude<Theme, 'system'>)
  );

  // Handle system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme as Exclude<Theme, 'system'>);
      }
    };

    // Initial check
    updateResolvedTheme();

    // Listen for system theme changes
    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    const themeClass = `theme-${resolvedTheme}`;

    // Remove all theme classes
    root.classList.remove(
      'theme-light',
      'theme-ocean',
      'theme-forest',
      'theme-sunset',
      'theme-dark'
    );

    // Add new theme class
    root.classList.add(themeClass);

    // Store preference
    localStorage.setItem('theme-preference', theme);
  }, [resolvedTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
