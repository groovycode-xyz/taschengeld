import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, User, Cog } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Taschengeld</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-[200px] bg-primary-foreground text-primary"
          />
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
