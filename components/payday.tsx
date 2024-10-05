import { PaydayInterface } from './payday-interface';
import { BanknoteIcon } from 'lucide-react';

export function Payday() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <BanknoteIcon className="mr-3 h-10 w-10" />
          Payday
        </h1>
      </div>
      <PaydayInterface />
    </div>
  );
}
