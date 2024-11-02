import { Button } from '@/components/ui/button';
import { Menu, User, Cog } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className='flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground'>
      <div className='flex items-center'>
        <Button variant='ghost' size='icon' onClick={onMenuClick} className='md:hidden'>
          <Menu className='h-8 w-8' />
        </Button>
        <h1 className='text-xl font-bold ml-2'>Taschengeld</h1>
      </div>
      <div className='flex items-center space-x-6'>
        <Button variant='ghost' size='icon'>
          <User className='h-8 w-8' />
        </Button>
        <Button variant='ghost' size='icon'>
          <Cog className='h-8 w-8' />
        </Button>
      </div>
    </header>
  );
}
