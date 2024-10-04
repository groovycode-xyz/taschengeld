'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompletedTaskCard } from './completed-task-card';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types/user';
import { CompletedTask } from '@/types/task';

// CHANGELOG:
// - Removed unused imports: Card, CardContent, Input, IconComponent, Checkbox
// - Moved CompletedTaskCard import from outside the selection to inside
// - Removed import for Checkbox as it was causing a module not found error
// - Fixed duplicate import of CompletedTaskCard
// - Added import for Checkbox to resolve usage in the component

export function PaydayInterface() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'completedAt' | 'payoutValue'>('completedAt');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchCompletedTasks();
    fetchUsers();
  }, []);

  const fetchCompletedTasks = async () => {
    // Mock data
    const mockTasks: CompletedTask[] = [
      {
        id: '1',
        title: 'Clean Room',
        description: 'Clean your room thoroughly',
        iconName: 'broom', // {{ Use iconName instead of icon }}
        soundUrl: '/sounds/clean.mp3',
        payoutValue: 5.0,
        isActive: true,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
        userId: '1',
        userName: 'John Doe',
        userIcon: 'user',
        completedAt: new Date('2024-03-01'),
        status: 'pending',
        taskId: '2', // {{ Ensure taskId is a string }}
      },
      {
        id: '2',
        taskId: '2', // {{ Ensure taskId is a string }}
        userId: '2',
        userName: 'Jane Doe',
        userIcon: 'smile',
        title: 'Do Homework',
        iconName: 'book', // {{ Use iconName instead of icon }}
        payoutValue: 3.5,
        completedAt: new Date('2024-03-02'),
        status: 'pending',
      },
      {
        id: '3',
        taskId: '3', // {{ Ensure taskId is a string }}
        userId: '1',
        userName: 'John Doe',
        userIcon: 'user',
        title: 'Walk Dog',
        iconName: 'dog', // {{ Use iconName instead of icon }}
        payoutValue: 2.0,
        completedAt: new Date('2024-03-03'),
        status: 'pending',
      },
    ];
    setCompletedTasks(mockTasks);
  };

  const fetchUsers = async () => {
    // Mock data updated to match the new User data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'James',
        icon: 'user-icon',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        sound: null,
        birthday: '1971-11-03',
        role: 'parent',
      },
      {
        id: '2',
        name: 'Rebekka',
        icon: 'user-icon',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        sound: null,
        birthday: '1985-10-12',
        role: 'parent',
      },
      {
        id: '3',
        name: 'Eliana',
        icon: 'user-icon',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        sound: null,
        birthday: '2015-03-26',
        role: 'child',
      },
      {
        id: '4',
        name: 'Ariel',
        icon: 'user-icon',
        iconName: 'user-icon', // {{ Ensure iconName is present }}
        sound: null,
        birthday: '2016-12-01',
        role: 'child',
      },
    ];
    setUsers(mockUsers);
  };

  const handleApprove = (taskId: string, modifiedPayoutValue: number) => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'approved', payoutValue: modifiedPayoutValue }
          : task
      )
    );
  };

  const handleReject = (taskId: string) => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'rejected' } : task))
    );
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map((task) => task.id));
    }
  };

  const handleBulkApprove = () => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, status: 'approved' } : task
      )
    );
    setSelectedTasks([]);
  };

  const handleBulkReject = () => {
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, status: 'rejected' } : task
      )
    );
    setSelectedTasks([]);
  };

  const filteredAndSortedTasks = completedTasks
    .filter((task) => selectedUser === 'all' || task.userId === selectedUser)
    .sort((a, b) => {
      if (sortBy === 'completedAt') {
        return b.completedAt.getTime() - a.completedAt.getTime();
      } else {
        return b.payoutValue - a.payoutValue;
      }
    });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Payday Review</h1>
      <p className="text-gray-600 mb-4">Review and approve completed tasks</p>

      <div className="flex space-x-4 mb-4">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value: 'completedAt' | 'payoutValue') => setSortBy(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completedAt">Date Completed</SelectItem>
            <SelectItem value="payoutValue">Payout Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          checked={selectedTasks.length === filteredAndSortedTasks.length}
          onCheckedChange={handleSelectAll}
        />
        <span>Select All</span>
      </div>

      {selectedTasks.length > 0 && (
        <div className="mb-4 space-x-2">
          <Button
            onClick={handleBulkApprove}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Approve Selected
          </Button>
          <Button onClick={handleBulkReject} className="bg-red-500 hover:bg-red-600 text-white">
            Reject Selected
          </Button>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {filteredAndSortedTasks.map((task) => (
            <CompletedTaskCard
              key={task.id}
              task={task}
              onSelect={handleSelectTask}
              onApprove={handleApprove}
              onReject={handleReject}
              isSelected={selectedTasks.includes(task.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
