'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { PiggyBankIcon } from 'lucide-react';
import { AccountCard } from './account-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GroupedAccount {
  user_id: number;
  user_name: string;
  user_icon: string;
  birthday: string;
  total_balance: number;
  accounts: PiggyBankAccount[];
}

export function PiggyBank() {
  const [accounts, setAccounts] = useState<PiggyBankAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<GroupedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterName, setFilterName] = useState('all');

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch('/api/piggy-bank');
      if (!response.ok) throw new Error('Failed to fetch account data');
      const data = await response.json();
      setAccounts(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching account data');
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const groupedAccounts = useMemo(() => {
    const grouped: { [key: number]: GroupedAccount } = {};
    accounts.forEach((account) => {
      if (account.role === 'child') {
        if (!grouped[account.user_id]) {
          grouped[account.user_id] = {
            user_id: account.user_id,
            user_name: account.user_name,
            user_icon: account.user_icon,
            birthday: account.birthday,
            total_balance: 0,
            accounts: [],
          };
        }
        grouped[account.user_id].total_balance += parseFloat(account.balance);
        grouped[account.user_id].accounts.push(account);
      }
    });
    return Object.values(grouped);
  }, [accounts]);

  useEffect(() => {
    const sorted = [...groupedAccounts].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.user_name.localeCompare(b.user_name);
        case 'name-desc':
          return b.user_name.localeCompare(a.user_name);
        case 'age-desc': // Oldest to youngest
          return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
        case 'age-asc': // Youngest to oldest
          return new Date(b.birthday).getTime() - new Date(a.birthday).getTime();
        default:
          return 0;
      }
    });

    const filtered =
      filterName === 'all' ? sorted : sorted.filter((account) => account.user_name === filterName);

    setFilteredAccounts(filtered);
  }, [groupedAccounts, sortOption, filterName]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const uniqueNames = Array.from(new Set(groupedAccounts.map((account) => account.user_name)));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        <PiggyBankIcon className="mr-3 h-10 w-10" />
        Sparkässeli
      </h1>
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={setSortOption} defaultValue={sortOption}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A to Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z to A)</SelectItem>
            <SelectItem value="age-desc">Age (Oldest to Youngest)</SelectItem>
            <SelectItem value="age-asc">Age (Youngest to Oldest)</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterName} value={filterName}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {uniqueNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((groupedAccount) => (
          <AccountCard
            key={groupedAccount.user_id}
            account={{
              ...groupedAccount.accounts[0],
              balance: groupedAccount.total_balance.toString(),
            }}
            onUpdate={fetchAccounts}
            allAccounts={groupedAccount.accounts}
          />
        ))}
      </div>
    </div>
  );
}
