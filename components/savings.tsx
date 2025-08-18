'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMode } from '@/components/context/mode-context';
import { Target, Plus, Filter, SortAsc, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavingsGoal } from '@/app/types/savingsGoal';
import { User } from '@/app/types/user';
import { SavingsGoalCard } from './savings-goal-card';
import { CreateEditGoalModal } from './create-edit-goal-modal';

export function Savings() {
  const { isParentMode, enforceRoles } = useMode();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  
  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'inactive'
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchSavingsData();
    fetchUsers();
  }, []);

  const fetchSavingsData = async () => {
    try {
      const response = await fetch('/api/savings-goals');
      if (!response.ok) throw new Error('Failed to fetch savings goals');
      const data = await response.json();
      setGoals(data || []);
    } catch (_error) {
      setError('Failed to load savings goals');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data || []);
    } catch (_error) {
      // Users will be empty array, handled gracefully in the UI
    }
  };

  const handleCreateGoal = async (goalData: {
    user_id: number;
    title: string;
    description?: string;
    icon_name: string;
    target_amount: number;
  }) => {
    try {
      const response = await fetch('/api/savings-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) throw new Error('Failed to create savings goal');
      await fetchSavingsData(); // Refresh data
      setIsCreateGoalModalOpen(false);
    } catch (_error) {
      // Error creating goal - handled by the modal component
    }
  };

  const handleUpdateGoal = async () => {
    await fetchSavingsData(); // Refresh data after any updates
  };

  // Filter and sort logic
  const filteredAndSortedGoals = React.useMemo(() => {
    let filtered = [...goals];
    
    // Filter by active/inactive status
    if (statusFilter === 'active') {
      filtered = filtered.filter(goal => goal.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(goal => !goal.is_active);
    }
    // 'all' shows both active and inactive
    
    // Filter by user
    if (selectedUser !== 'all') {
      filtered = filtered.filter(goal => goal.user_id.toString() === selectedUser);
    }
    
    // Sort goals
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'progress':
          const aProgress = Math.min((parseFloat(a.current_balance) / parseFloat(a.target_amount)) * 100, 100);
          const bProgress = Math.min((parseFloat(b.current_balance) / parseFloat(b.target_amount)) * 100, 100);
          comparison = aProgress - bProgress;
          break;
        case 'user':
          comparison = a.user_name.localeCompare(b.user_name);
          break;
        case 'target':
          comparison = parseFloat(a.target_amount) - parseFloat(b.target_amount);
          break;
        default:
          return 0;
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [goals, statusFilter, selectedUser, sortBy, sortOrder]);

  const activeGoals = filteredAndSortedGoals.filter(goal => goal.is_active);
  const inactiveGoals = filteredAndSortedGoals.filter(goal => !goal.is_active);
  
  // Clear filters function
  const clearFilters = () => {
    setStatusFilter('all');
    setSelectedUser('all');
    setSortBy('name');
    setSortOrder('asc');
  };
  
  const hasActiveFilters = statusFilter !== 'all' || selectedUser !== 'all' || sortBy !== 'name' || sortOrder !== 'asc';

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <Target className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>Savings Goals</h1>
          </div>
          {(!enforceRoles || isParentMode) && (
            <Button
              onClick={() => setIsCreateGoalModalOpen(true)}
              className={cn(
                'bg-blue-600 hover:bg-blue-700',
                'dark:bg-blue-700 dark:hover:bg-blue-600',
                'text-white'
              )}
            >
              <Plus className='h-4 w-4 mr-2' />
              Create New Goal
            </Button>
          )}
        </div>

        {/* Filter and Sort Controls - Always Visible */}
        <div className='flex items-center gap-4 pt-6'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Filter by user' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All goals</SelectItem>
                <SelectItem value='active'>Active only</SelectItem>
                <SelectItem value='inactive'>Inactive only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <SortAsc className='h-4 w-4 text-muted-foreground' />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Goal title</SelectItem>
                <SelectItem value='progress'>Progress %</SelectItem>
                <SelectItem value='user'>User name</SelectItem>
                <SelectItem value='target'>Target amount</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>
                  {sortBy === 'progress' || sortBy === 'target' ? 'Low to High' : 'A-Z'}
                </SelectItem>
                <SelectItem value='desc'>
                  {sortBy === 'progress' || sortBy === 'target' ? 'High to Low' : 'Z-A'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='flex items-center gap-1'
            >
              <X className='h-4 w-4' />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        {goals.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-center'>
            <Target className='h-16 w-16 text-muted-foreground mb-4' />
            <h2 className='text-xl font-medium text-foreground mb-2'>No Savings Goals Yet</h2>
            <p className='text-muted-foreground mb-6'>
              Create your first savings goal to start saving for something special!
            </p>
            {(!enforceRoles || isParentMode) && (
              <Button
                onClick={() => setIsCreateGoalModalOpen(true)}
                className={cn(
                  'bg-blue-600 hover:bg-blue-700',
                  'dark:bg-blue-700 dark:hover:bg-blue-600',
                  'text-white'
                )}
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Your First Goal
              </Button>
            )}
          </div>
        ) : filteredAndSortedGoals.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-center'>
            <Filter className='h-16 w-16 text-muted-foreground mb-4' />
            <h2 className='text-xl font-medium text-foreground mb-2'>No Goals Match Your Filters</h2>
            <p className='text-muted-foreground mb-6'>
              Try adjusting your filters to see more savings goals.
            </p>
            <Button
              variant='outline'
              onClick={clearFilters}
              className='flex items-center gap-2'
            >
              <X className='h-4 w-4' />
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Results Summary */}
            {hasActiveFilters && (
              <div className='text-sm text-muted-foreground'>
                Showing {filteredAndSortedGoals.length} of {goals.length} goals
              </div>
            )}

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h2 className='text-xl font-semibold text-foreground mb-4'>
                  Active Goals
                  {hasActiveFilters && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                      ({activeGoals.length})
                    </span>
                  )}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {activeGoals.map((goal) => (
                    <SavingsGoalCard
                      key={goal.goal_id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      users={users}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Goals */}
            {inactiveGoals.length > 0 && statusFilter !== 'active' && (
              <div>
                <h2 className='text-xl font-semibold text-foreground mb-4'>
                  Completed Goals
                  {hasActiveFilters && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                      ({inactiveGoals.length})
                    </span>
                  )}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {inactiveGoals.map((goal) => (
                    <SavingsGoalCard
                      key={goal.goal_id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      users={users}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <CreateEditGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onSave={handleCreateGoal}
        users={users}
        mode='create'
      />
    </div>
  );
}