'use client';

import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Palette } from 'lucide-react';

const themes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'ocean', label: 'Ocean Blue', icon: Palette },
  { id: 'forest', label: 'Forest Green', icon: Palette },
  { id: 'sunset', label: 'Sunset Orange', icon: Palette },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Palette },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 text-content-primary hover:text-content-primary hover:bg-background-secondary'
        >
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-background-primary border-border-primary'>
        {themes.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id)}
            className={`flex items-center gap-2 text-content-primary hover:text-content-primary hover:bg-background-secondary ${
              theme === id ? 'bg-background-secondary' : ''
            }`}
          >
            <Icon className='h-4 w-4' />
            <span>{label}</span>
            {theme === id && <span className='ml-auto'>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
