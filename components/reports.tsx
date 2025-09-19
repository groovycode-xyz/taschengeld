'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IconComponent } from './icon-component';
import { BarChart } from '@/components/ui/bar-chart';
import { LineChart } from '@/components/ui/line-chart';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionSummary {
  period: string;
  earned: number;
  spent: number;
}

interface BalancePoint {
  date: string;
  balance: number;
}

interface UserStats {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  savingsRate: number;
}

interface UserReport {
  user_id: number;
  name: string;
  icon: string;
  transactions: TransactionSummary[];
  balanceHistory: BalancePoint[];
  stats: UserStats;
}

type TimePeriod = 'all' | 'today' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'ytd';

export function Reports() {
  const [users, setUsers] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  useEffect(() => {
    fetchReportsData();
  }, [timePeriod]);

  const fetchReportsData = async () => {
    try {
      const response = await fetch(`/api/reports?period=${timePeriod}`);
      if (!response.ok) throw new Error('Failed to fetch reports data');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (_error) {
      setError('Failed to load reports data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-muted-foreground'>Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-red-500'>{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-muted-foreground'>No transaction data available</div>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='pb-6 border-b border-border'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-medium text-foreground'>Reports</h1>
              <p className='text-muted-foreground mt-2'>Transaction history and spending analytics</p>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-muted-foreground' />
              <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select time period' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Time</SelectItem>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='this-week'>This Week</SelectItem>
                  <SelectItem value='last-week'>Last Week</SelectItem>
                  <SelectItem value='this-month'>This Month</SelectItem>
                  <SelectItem value='last-month'>Last Month</SelectItem>
                  <SelectItem value='ytd'>Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
      <div className='space-y-6'>
      {users.map((user) => (
        <div key={user.user_id} className='space-y-4'>
          {/* User Header with Stats */}
          <div className='flex items-center gap-3'>
            <IconComponent icon={user.icon} className='w-10 h-10' />
            <h2 className='text-2xl font-bold'>{user.name}</h2>
          </div>

          {/* Summary Stats Cards */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Current Balance</p>
                    <p className='text-2xl font-bold'>
                      <CurrencyDisplay value={user.stats.currentBalance} />
                    </p>
                  </div>
                  <Wallet className='w-8 h-8 text-blue-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Earned</p>
                    <p className='text-2xl font-bold text-green-600'>
                      <CurrencyDisplay value={user.stats.totalEarned} />
                    </p>
                  </div>
                  <TrendingUp className='w-8 h-8 text-green-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Spent</p>
                    <p className='text-2xl font-bold text-red-600'>
                      <CurrencyDisplay value={user.stats.totalSpent} />
                    </p>
                  </div>
                  <TrendingDown className='w-8 h-8 text-red-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Savings Rate</p>
                    <p className='text-2xl font-bold'>
                      {user.stats.savingsRate.toFixed(0)}%
                    </p>
                  </div>
                  <PiggyBank className='w-8 h-8 text-purple-500' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {user.transactions.length > 0 ? (
                  <div className='w-full overflow-x-auto'>
                    <BarChart
                      data={user.transactions}
                      width={450}
                      height={300}
                      colors={{
                        earned: '#22c55e',
                        spent: '#ef4444',
                      }}
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-64 text-muted-foreground'>
                    No transactions yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Balance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {user.balanceHistory && user.balanceHistory.length > 0 ? (
                  <div className='w-full overflow-x-auto'>
                    <LineChart
                      data={user.balanceHistory}
                      width={450}
                      height={300}
                      color='#3b82f6'
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-64 text-muted-foreground'>
                    No balance history yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
}
